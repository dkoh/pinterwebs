$("#getTabs").on("click",function(){populateTabList2()});

function populateTabList(){
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    var tablist = "<ul class='allTabs'>"
    for (var i = 0; i < tabs.length; i++) {
      tablist+= "<li>"+ tabs[i].title + "</li>";
    }
    tablist+="</ul>";
    document.getElementById("demo").innerHTML = tablist;

    $("#allTabs li").click(function() {
        console.log("clicked "+ $(this).html()+ " "+ $(this).text() );
    });
  });
}

function populateTabList2(){
  console.log("clicked");
  chrome.tabs.query({currentWindow: true}, function(tabs) {
    var tablist = $('#allTabs');
    $.each(tabs, function(i)
    {
        // $('<li/>')
        //   .data( "tab", tabs[i] )
        //   .text(tabs[i].title)
        //   .attr("id","li-tab-"+i)
        //   .on("click", function(){
        //     chrome.tabs.update($(this).data("tab").id, {active: true});
        //   })
        //   .appendTo(tablist);
        var listname = $('<span/>').text(tabs[i].title).on("click",function(){
          chrome.tabs.update($(this).parent().data("tab").id, {active: true});
        })
        var toggle = '<label class="switch"><input type="checkbox"><div class="slider"></div></label>';

        $('<li/>')
          .data( "tab", tabs[i] )
          .attr("id","li-tab-"+i)
          .append(listname).
          append(toggle)
          .appendTo(tablist);
    });

  });
}


function checkTabs(){
  console.log("checking tabs");
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

chrome.storage.sync.get(["permTabs"], function(items){
  permTabs = items['permTabs'];
  checkTabs();
});
