"use strict";

(() => {
  window.onload = (event) => {
    var hostName = location.hostname
    loadDataFromStorage(location).then((result) => {
      var storageDataByPage = result
      let len = storageDataByPage.length;
      console.log(storageDataByPage)   
      for (var i = 0; i < len; i++) {
        let data = storageDataByPage[i]
        let selector = $('body').find(`${data.domElementNodeName}.${data.domElementClassName}`).eq(data.elementIndex)
        selector.highlight(data.text)
        selector.find(".highlight").css("background-color", "yellow");
      }

   }).catch((error) => sendResponse({
        success: false,
        error: error.message,
    }));
  }
})()
