
// chrome.runtime.onInstalled.addListener( () => {
//   chrome.contextMenus.create({
//     id: 'id',
//     title: "title", 
//     contexts:[ "image" ],
//     documentUrlPatterns: ["*://*.com/*"]
//   });

//   chrome.contextMenus.create({
//     parentId: 'id',
//     id: "somethihng",
//     title: "do something", 
//     contexts:[ "image" ]
//   });

// });

// chrome.contextMenus.onClicked.addListener( ( info, tab ) => {
//   if (info.parentMenuItemId == "id") {
//         if(info.menuItemId == "somethihng"){
//             chrome.tabs.sendMessage(tab.id, {type:"somethihng"}, {frameId: info.frameId});
//         }
//   }
// });
