
//--------------------------------------------------------------------------//

chrome.browserAction.setBadgeText({
    text: "TFB"
});

function notifyUser(message){
    chrome.notifications.create("basic", {
        "type":"basic",
        "iconUrl":"Data/TFBIcon.png",
        "title":"TheFactBook:",
        "message": message.toString()
    });
}

//--------------------------------------------------------------------------//

function sendFact(fact, source, tags, tfbSettings) {
    var http = new XMLHttpRequest();
    http.open("POST", tfbSettings.url + "/api.php?action=addFact", true);
    http.setRequestHeader("Content-type",
                          "application/x-www-form-urlencoded");
    http.timeout = tfbSettings.timeout * 1000;
    http.ontimeout = function() {
        notifyUser("TheFactBook server has Timed out");
    };
    http.onreadystatechange = function () {
        if (  this.readyState == 4 && this.status == 200) {
            var r = http.responseText;
            r = JSON.parse(r);
            if (! r.Error){
                notifyUser("Your Fact has been saved!");
            } else {
                notifyUser(r.Description);
            }
        }
    };
    tfbUsername = encodeURIComponent(tfbSettings.username);
    tfbPassword = encodeURIComponent(tfbSettings.password);
    var params = "username=" + tfbUsername
        + "&password=" + tfbPassword
        + "&fact=" + fact
        + "&source=" + source
        + "&tags=" + tags;
    http.send(params);
}

var clickHandler = function(e) {


    //--------------------------------------------------------------------------//

    var tfbDefaultOptions = {
        tfbUrl: 'https://thefactbook.ml/',
        tfbTimeout: 5,
        tfbUsername: 'guest',
        tfbPassword: 'guest',
        tfbEditBeforeSend: true
    };

    chrome.storage.sync.get(tfbDefaultOptions, getAsyncOptions);

    //--------------------------------------------------------------------------//

    function getAsyncOptions(items) {

        var tfbSettings = {
            url : items.tfbUrl,
            timeout : items.tfbTimeout,
            username : items.tfbUsername,
            password : items.tfbPassword,
            editBeforeSend : items.tfbEditBeforeSend
        }
        //--------------------------------------------------------------------------//
        function getAsyncTabUrl(tabs) {
            tabUrl = tabs[0].url;
            sendRequest(tabUrl);
        }

        chrome.tabs.query({currentWindow: true, active: true}, getAsyncTabUrl);
        //--------------------------------------------------------------------------//

        function sendRequest(tabUrl) {

            if (tfbSettings.editBeforeSend) {
                chrome.tabs.create({
                    url: chrome.extension.getURL('TFBEditFact.html'),
                    active: true,
                }, function(tab) {

                    chrome.windows.create({
                        tabId: tab.id,
                        width: 450,
                        height: 260,
                        type: "popup"
                    });
                    chrome.runtime.sendMessage({
                        msg: "editFact",
                        fact: e.selectionText,
                        source: tabUrl
                    });
                    chrome.runtime.onMessage.addListener(
                        function(request, sender, sendResponse){
                            if (request.msg == "sendFact"){
                                sendFact(request.fact, request.source, request.tags, tfbSettings);
                                if ( request.dontEdit ){
                                    chrome.storage.sync.set({ "tfbEditBeforeSend": false });
                                }
                                chrome.tabs.remove(tab.id);
                            }
                        }
                    );
                });
            } else {
                sendFact(e.selectionText, tabUrl, "", tfbSettings);
            }
        }
    }
}


//--------------------------------------------------------------------------//

chrome.contextMenus.create({
    "title": "Add to TheFactBook",
    "id": "tfb-menu",
    "contexts": ["selection"],
    "onclick" : clickHandler
});

//--------------------------------------------------------------------------//
