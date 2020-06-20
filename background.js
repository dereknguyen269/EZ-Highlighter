// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function (tab) {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "clicked_browser_action",
    });
  });
});

// This block is new!
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "open_new_tab") {
    chrome.tabs.create({ url: request.url });
  } else if (request.message === "save_text_in_storage") {
    var text = request.text;
    var url = request.url;
    var host = request.host;
    var data = {};
    data[host] = [];
    var texts = [];
    var index = null;
    chrome.storage.sync.get(["" + host + ""], function (result) {
      var currentStorageHost = result[host];
      if (currentStorageHost !== undefined) {
        data[host] = currentStorageHost;
        var currentStoragePage = currentStorageHost.filter(
          (item) => item.url === url
        );
        currentStoragePage = currentStoragePage[0];
        if (currentStoragePage !== undefined) {
          index = currentStorageHost.indexOf(currentStoragePage);
          if (currentStoragePage.texts !== undefined) {
            texts = currentStoragePage.texts;
          }
        }
      }
      if (texts.indexOf(text) >= 0) {
        texts.remove(text);
        removeHighlight(text);
      } else {
        texts.push(text);
        addHighlight(text);
      }
      // console.log(texts);
      var pageData = {
        url: url,
        texts: texts,
      };
      if (index == null) {
        data[host].push(pageData);
      } else {
        data[host][index] = pageData;
      }
      chrome.storage.sync.set(data, function () {
        console.log(data);
      });
    });
  } else if (request.message === "display_highlight") {
    var url = request.url;
    var host = request.host;
    console.log(url, host);
  }
});

// chrome.contextMenus.removeAll();
// chrome.contextMenus.create({
// 	title: "first",
// 	contexts: ["browser_action"],
// 	onclick: function () {
// 		alert("first");
// 	},
// });

function selectedTrueOnClick(info, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "select_text_action",
    });
  });
}

function selectedFalseOnClick(info, tab) {
  //
}

var contextMenuID = chrome.contextMenus.create({
  title: "👉🏻EZ Highlighter",
  contexts: ["all"],
  onclick: selectedFalseOnClick,
});

function contextMenuUpdate(selected) {
  if (selected)
    chrome.contextMenus.update(contextMenuID, {
      title: 'You selected "%s"',
      contexts: ["all"],
      onclick: selectedTrueOnClick,
    });
  else
    chrome.contextMenus.update(contextMenuID, {
      title: "👉🏻EZ Highlighter",
      contexts: ["all"],
      onclick: selectedTrueOnClick,
    });
}

contextMenuUpdate(false);

function initHighlight(currentPageTabURL) {
  var parseURL = new URL(currentPageTabURL);
  var host = parseURL.hostname;
  var pageURL = currentPageTabURL;
  chrome.storage.sync.get(["" + host + ""], function (result) {
    var currentStorageHost = result[host];
    if (currentStorageHost !== undefined) {
      var currentStoragePage = currentStorageHost.filter(
        (item) => item.url === pageURL
      );
      currentStoragePage = currentStoragePage[0];
      if (currentStoragePage !== undefined) {
        texts = currentStoragePage.texts;
        // console.log(texts);
        chrome.tabs.query({ active: true, currentWindow: true }, function (
          tabs
        ) {
          var activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {
            message: "highlight_action",
            texts: texts,
          });
        });
      }
    }
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("onInstalled...");
});

function logOnCompleted(details) {
  var currentPageTabURL = details.url;
  // console.log("=====URL===", currentPageTabURL);
  initHighlight(currentPageTabURL);
}
// Call function when load done
chrome.webNavigation.onCompleted.addListener(logOnCompleted, { url: [] });
Array.prototype.remove = function () {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

function removeHighlight(text) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "remove_highlight_action",
      text: text,
    });
  });
}

function addHighlight(text) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "add_highlight_action",
      text: text,
    });
  });
}
