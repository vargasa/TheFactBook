
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

function sendRequest(fact,source,tfbSettings) {
    if (tfbSettings.edit) {
        chrome.tabs.create({
            url: chrome.extension.getURL('TFBEditFact.html'),
            active: false,
        }, function(tab) {
            chrome.windows.create({
                tabId: tab.id,
                width: 450,
                height: 460,
                type: "popup"
            }, function(w){
                chrome.runtime.sendMessage({
                    msg: "editFact",
                    fact: fact,
                    source: source
                });
            });
            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse){
                    if (request.msg == "sendFact" && sender.tab.id == tab.id){
                        sendFact(request.fact,
                                 request.source,
                                 request.tags,
                                 tfbSettings);
                        if ( request.dontEdit ){
                            chrome.storage.sync.set({ "tfbEditBeforeSend": false });
                        }
                        chrome.tabs.remove(tab.id);
                    }
                }
            );
        });
    } else {
        sendFact(fact, source, "", tfbSettings);
    }
};

var clickHandler = function(e) {

    fact = e.selectionText;

    //--------------------------------------------------------------------------//

    var tfbDefaultOptions = {
        url: 'https://thefactbook.ml/',
        timeout: 5,
        username: 'guest',
        password: 'guest',
        edit: true
    };

    chrome.storage.sync.get(tfbDefaultOptions, getAsyncSettings);

    //--------------------------------------------------------------------------//

    function getAsyncSettings(tfbSettings) {

        //--------------------------------------------------------------------------//
        function getAsyncTabUrl(tabs) {
            source = tabs[0].url;
            sendRequest(fact,source,tfbSettings);
        }
        chrome.tabs.query({currentWindow: true, active: true}, getAsyncTabUrl);
        //--------------------------------------------------------------------------//
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
