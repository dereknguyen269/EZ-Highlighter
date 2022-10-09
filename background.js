import { executeInCurrentTab, wrapResponse } from './background/utils.js';

const DEFAULT_COLOR_TITLE = "yellow";

// Add option when right-clicking
chrome.runtime.onInstalled.addListener(async () => {
	console.log("onInstalled...")
	// remove existing menu items
	chrome.contextMenus.removeAll()

	chrome.contextMenus.create({
		id: 'highlight-selected-text',
		title: "Highlight this text: %s",
		contexts:[ "all" ]
	});
	handleLoadCompleted()
})

chrome.contextMenus.onClicked.addListener(({ menuItemId, parentMenuItemId, selectionText }) => {
	console.log('menuItemId', menuItemId)
	console.log('parentMenuItemId', parentMenuItemId)
	// if (parentMenuItemId === 'highlight-color') {
	// 		changeColorFromContext(menuItemId);
	// 		return;
	// }

	switch (menuItemId) {
			case 'highlight-selected-text':
					highlightTextFromContext();
					break;
	}
});

function highlightTextFromContext() {
	highlightText();
}

function highlightText() {
	executeInCurrentTab({ file: 'content-scripts/highlight.js' });
}


// Listen to messages from content scripts
/* eslint-disable consistent-return */
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (!request.action) return;
	switch (request.action) {
			case 'get-current-color':
					wrapResponse(getCurrentColor(), sendResponse);
					return true; // return asynchronously
	}
});

async function getCurrentColor() {
    const { color } = await chrome.storage.sync.get("color");
    const colorTitle = color || DEFAULT_COLOR_TITLE;
    return colorOptions.find((colorOption) => colorOption.title === colorTitle) || colorOptions[0];
}

// chrome.webNavigation.onCompleted.addListener(handleLoadCompleted, { url: [] });

function handleLoadCompleted() {
	executeInCurrentTab({ file: 'content-scripts/initHighlight.js' });
}
