var contextMenu = require("sdk/context-menu");

var menuItem = contextMenu.Item({
    label: "Add to TheFactBook",
    context: contextMenu.SelectionContext(),
    contentScript: 'self.on("click", function () {' +
        '  var text = window.getSelection().toString();' +
        '  self.postMessage(text);' +
        '});',
    onMessage: clickHandler
});

function sendFact(tfbUrl, user, password, fact, source, tags){

    function notifyUser(message) {
	var notifications = require("sdk/notifications");
	notifications.notify({
	    title: "TheFactBook:",
	    text: message.toString()
	});
    }

    var Request = require("sdk/request").Request;
    
    Request({
	url: tfbUrl + "/api.php?action=addFact",
	anonymous: true,
	content: {
	    username: user, 
	    password: password, 
	    fact: fact, 
	    source: source,
	    tags: tags
	},
	onComplete: function (response) {	    
	    var r = response.json;
	    
	    if (response.status == 200) {
		if(! r.Error){
		    notifyUser("Your fact has been saved");
		} else {
		    notifyUser(r.Description);
		}
	    } else {
		notifyUser("Something went wrong!");
	    }
	}
    }).post();
}



function clickHandler (selectionText) {

    var tabs = require("sdk/tabs");
    var tfbUrl = require('sdk/simple-prefs').prefs['tfbUrl'];
    var tfbUser = require('sdk/simple-prefs').prefs['tfbUser'];
    var tfbPassword = require('sdk/simple-prefs').prefs['tfbPassword'];
    var tfbEditBeforeSend = require('sdk/simple-prefs').prefs['tfbEditBeforeSend'];
    
    var data = require("sdk/self").data;

    if (tfbEditBeforeSend) {
	var editFact = require("sdk/panel").Panel({
	    contentURL: data.url("editFact.html"),
	    contentScriptFile: data.url("getInfo.js"),
	    contentStyle: "body { background-color: white }",
	    focus: false
	});
	
	editFact.show({width: 450, height: 270});
	editFact.port.emit("editFact", selectionText, tabs.activeTab.url);
	editFact.on("show", function() {
	    editFact.port.emit("show");
	});
	
	var tfbFact;
	var tfbSource;
	var tfbTags;
	
	editFact.port.on("sendFact", function (fact, source, tags, dontEdit) {

	    if (dontEdit) {
		require('sdk/simple-prefs').prefs.tfbEditBeforeSend = false;
	    }
	    sendFact(tfbUrl, tfbUser, tfbPassword,
		     fact, source, tags);
	    editFact.hide();	
	});

	
	
    } else {
	var fact = selectionText;
	var source = tabs.activeTab.url;
	var tags = "";
	sendFact(tfbUrl, tfbUser, tfbPassword, 
		 fact, source, tags);
    }
   
}
