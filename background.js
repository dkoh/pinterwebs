// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
permTabs = ["https://mail.google.com"];
chrome.storage.sync.get(["permTabs"], function(items){
  permTabs = items['permTabs'];
  if (permTabs==undefined || !permTabs.length){
    permTabs =[];
  }
});
console.log("starting Up");



chrome.commands.onCommand.addListener(function(command) {
  if (command=='toggle-feature-tabsmove') {
    tabsmove();
  }
});

function tabsmove(){
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    console.log("test tabsmove");
    //get active tab,
    var activetab=-9;
    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].active) {
        activetab =i;
        break;
      }
    }
    var patharray = tabs[i].url.split('/');
    var pathString = patharray[0] + "//" + patharray[2];
    for (var i = 0; i < tabs.length; i++) {
      var j = (activetab + 1 + i) % tabs.length;
      if(tabs[j].url.indexOf(pathString)>=0) {
        chrome.tabs.update(tabs[j].id, {active: true});
        break;
      }
    }

  });
}


chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  checkTabs();
});

// find tab
function checkTabs(){
  if (permTabs.length <=0) {
    console.log("no pinned tabs");
    return;
  }
  chrome.tabs.query({currentWindow: true}, function(tabs) {
      var firsttabs = permTabs;
      for (var i = 0; i < firsttabs.length; i++) {
        //find first instance of weburl
        for (var j = 0; j < tabs.length; j++) {
          if(tabs[j].url.indexOf(firsttabs[i])>=0){
            // Move tab to right place if it is in the wrong place
            if (j>i){
              chrome.tabs.move(tabs[j].id, {index: i});
              chrome.tabs.update(tabs[j].id, {pinned: true});
            }
            break;
          }
          if (j + 1 == tabs.length){
             chrome.tabs.create({ url: firsttabs[i], active:false,pinned:true, index: i });
          }
        }
      }
  });
}



// chrome.commands.onCommand.addListener(function(command) {
//   if (command == "toggle-pin") {
//     // Get the currently selected tab
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       // Toggle the pinned status
//       var current = tabs[0]
//       chrome.tabs.update(current.id, {'pinned': !current.pinned});
//     });
//   }
// });

var tabToUrl = {};
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // Note: this event is fired twice:
    // Once with `changeInfo.status` = "loading" and another time with "complete"
    tabToUrl[tabId] = tab.url;
});





// Test Stuff
