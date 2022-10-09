"use strict";
(() => {
  window.highlight = function (location, selectionText, container) {
    var selector = $(container);
    var domElementSelector = selector.get(0)
    var domElementSelectorIndex = selector.index()
    selector.highlight(selectionText);
    selector.find(".highlight").css("background-color", "yellow");
    storeData(location, selectionText, domElementSelector, domElementSelectorIndex)
    // $( "div:contains('John')" ).css( "text-decoration", "underline" );
  };

  window.storeData = function (location, selectionText, domElement, elementIndex) {
    var hostName = location.hostname
    var textColor = 'yellow'
    chrome.storage.sync.get(["_ez_highlight_db"], function (result) {
      var currentStorageDB = result['_ez_highlight_db'];
      console.log('currentStorageDB', currentStorageDB)
      if (currentStorageDB === undefined) {
        currentStorageDB = {}
      }
      var currentStorageHost = currentStorageDB[hostName]
      console.log(currentStorageHost)
      if (currentStorageHost === undefined) {
        currentStorageHost = {}
      }
      var storageDataByPageKey = btoa(location.pathname)
      var storageDataByPage = currentStorageHost[storageDataByPageKey]
      if (storageDataByPage === undefined) {
        storageDataByPage = []
      }
      var newHighlightValue = {
        pageUrl: location.href,
        text: selectionText,
        color: textColor,
        datetime: new Date(),
        domElementNodeName: domElement.nodeName,
        domElementClassName: domElement.className,
        domElementId: domElement.id,
        elementIndex: elementIndex
      }
      storageDataByPage.push(newHighlightValue)
      currentStorageHost[storageDataByPageKey] = storageDataByPage
      currentStorageDB[hostName] = currentStorageHost
      var storageAppData = {
        "_ez_highlight_db": currentStorageDB
      }
      // Save to Browser Storage
      chrome.storage.sync.set(storageAppData, function () {
        console.log("Save!");
      });
    })
  };

  window.loadDataFromStorage =  function(location) {
    var hostName = location.hostname
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(["_ez_highlight_db"], function (result) {
        var currentStorageDB = result['_ez_highlight_db'];
        if (currentStorageDB === undefined) {
          currentStorageDB = {}
        }
        var currentStorageHost = currentStorageDB[hostName]
        if (currentStorageHost === undefined) {
          currentStorageHost = {}
        }
        var storageDataByPageKey = btoa(location.pathname)
        var storageDataByPage = currentStorageHost[storageDataByPageKey]
        if (storageDataByPage === undefined) {
          storageDataByPage = []
        }
        resolve(storageDataByPage)
      })
    })
  };

  window.sendResponse = function(params) {
    return params.response
  }

})();
