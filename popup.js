$("#getTabs").on("click",function(){populateTabList2()});
$(function() {
    populateTabList2();
});
// function populateTabList(){
//   chrome.tabs.query({currentWindow: true}, function(tabs) {
//     var tablist = "<ul class='allTabs'>"
//     for (var i = 0; i < tabs.length; i++) {
//       tablist+= "<li>"+ tabs[i].title + "</li>";
//     }
//     tablist+="</ul>";
//     document.getElementById("demo").innerHTML = tablist;
//
//     $("#allTabs li").click(function() {
//         console.log("clicked "+ $(this).html()+ " "+ $(this).text() );
//     });
//   });
// }

function UpdatePermTabs(action, tab, callback){
  var patharray = tab.url.split('/');
  var pathString = patharray[0] + "//" + patharray[2];
  var ispinned = action  == "add";
  if (ispinned && permTabs.indexOf("pathString") < 0) {
    permTabs.push(pathString);
  }
  else if(action=="remove"){
    permTabs.splice(permTabs.indexOf("pathString"),1);
  }
  chrome.storage.sync.set({ "permTabs": permTabs }, function(){
    backgroundPage.permTabs = permTabs;
  });
  chrome.tabs.update(tab.id,{"pinned": ispinned},function(){
    console.log(typeof callback === 'function');
    typeof callback === 'function' && callback() && console.log("callback success");
  });
}
function populateTabList2(){
  console.log("clicked");
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    var tablist = $('#allTabs');
    tablist.html("");
    $.each(tabs, function(i)
    {

        var listname = $('<td/>')
          .attr("class", "tabname")
          .html("<span class='spantabletext clickable'><img src="+tabs[i].favIconUrl+"  width=12 height=12>&nbsp;" +tabs[i].title + "</span>")
          .on("click",function(){
          chrome.tabs.update($(this).parent().data("tab").id, {active: true});
        })
          ;

        var ispinned = $('<i />').attr("class","material-icons md-inactive clickable")
          .text("vpn_key")
          .on("click",function(){
            console.log("tab is: ",$(this).closest( "tr" ).data("tab"));
            if ($(this).attr("class").indexOf("md-inactive")>=0){
              UpdatePermTabs("add",$(this).closest( "tr" ).data("tab"),populateTabList2);

            }
            else {
              UpdatePermTabs("remove",$(this).closest( "tr" ).data("tab"), populateTabList2);
            }
          });
        var closetab = $('<i />')
          .attr("class","material-icons  red600 clickable").text("cancel")
          .on("click",function(){
            chrome.tabs.remove($(this).closest( "tr" ).data("tab").id,function(){
                populateTabList2();
            });
          });
        // Hack to get pinned tabs
        if(tabs[i].pinned){
          ispinned.attr("class","material-icons orange600 clickable");
          closetab.attr("class","material-icons md-inactive clickable");
        }
        var toggle = $('<td/>')
          .attr("style","width:15%")
          .append(ispinned)
          .append(closetab);
        $('<tr/>')
          .data( "tab", tabs[i] )
          .attr("id","li-tab-"+i)
          .append(listname)
          .append(toggle)
          .appendTo(tablist);
    });

  });
}



backgroundPage = chrome.extension.getBackgroundPage();
permTabs = backgroundPage.permTabs;
checkTabs = backgroundPage.checkTabs;
