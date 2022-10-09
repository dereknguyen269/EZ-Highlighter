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
        let selector = $(`body ${data.domElementNodeName}:not([class])`)
        let classText = ""
        if(data.domElementClassName.length > 1) {
          classText = data.domElementClassName.split(' ').join('.')
          selector = $(`body ${data.domElementNodeName}.${classText}`)
        }
        selector.highlight(data.text.trim())
        selector.find(".highlight").css("background-color", "yellow");
      }

   }).catch((error) => sendResponse({
        success: false,
        error: error.message,
    }));
  }
})()
