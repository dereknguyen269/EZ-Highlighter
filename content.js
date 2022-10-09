// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log("========")
// 	if (request.message === "clicked_browser_action") {
// 		var firstHref = $("a[href^='http']").eq(0).attr("href");
// 		console.log(firstHref);
// 		// console.log(window.getSelection().toString());
// 		// This line is new!
// 		// chrome.runtime.sendMessage({ message: "open_new_tab", url: firstHref });
// 	} else if (request.message === "select_text_action") {
// 		var text = window.getSelection().toString().trim().toLowerCase();
// 		var url = window.location.href;
// 		var host = window.location.hostname;
// 		chrome.runtime.sendMessage({
// 			message: "save_text_in_storage",
// 			text: text,
// 			url: url,
// 			host: host,
// 		});
// 		//console.log(text);
// 	} else if (request.message === "highlight_action") {
// 		var texts = request.texts;
// 		var selector = $("body");
// 		$.each(texts, function (index, text) {
// 			// console.log(text.trim());
// 			selector.highlight(text.trim());
// 		});
// 		$(".highlight").css("background-color", "yellow");
// 	} else if (request.message === "add_highlight_action") {
// 		var text = request.text;
// 		// $("body").highlight(text.trim());
// 	}
// });
