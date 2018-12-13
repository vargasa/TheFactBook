
function showPassword(){
    var showPassword = document.getElementById('ShowPassword').checked;

    if (showPassword){
        document.getElementById('NewUserPasswordInput').type = "text";
    } else {
        document.getElementById('NewUserPasswordInput').type = "password";
    }

    showPassword = document.getElementById('ShowPasswordPreferences').checked;

    if (showPassword) {
        document.getElementById('PasswordInput').type = "text";
    } else {
        document.getElementById('PasswordInput').type = "password";
    }
}

function notifyUser(message){
    chrome.notifications.create("basic", {
        "type":"basic",
        "iconUrl":"Data/TFBIcon.png",
        "title":"TheFactBook:",
        "message": message.toString()
    });
}

function createUser() {
    var http = new XMLHttpRequest();

    var tfbUrl = document.getElementById('NewUserUrlInput').value;
    var tfbUsername = document.getElementById('NewUserUsernameInput').value;
    var tfbPassword = document.getElementById('NewUserPasswordInput').value;
    http.open("POST", tfbUrl + "/api.php?action=addUser", true);
    http.setRequestHeader("Content-type",
                          "application/x-www-form-urlencoded");
    http.ontimeout = function() {
        notifyUser("TheFactBook server has Timed out");
    };
    http.onreadystatechange = function () {
        if (  this.readyState == 4 && this.status == 200) {
            var r = http.responseText;
            r = JSON.parse(r);
            if (! r.Error){
                notifyUser("User " + tfbUsername
                           + " succesfully created!");
                tfbSettings = {
                    url: tfbUrl,
                    username: tfbUsername,
                    password: tfbPassword,
                    timeout: 5, /*default*/
                    edit: true /*default*/
                };
                saveSettings(tfbSettings);
            } else {
                notifyUser(r.Description);
            }
        }
    };
    tfbUsername = encodeURIComponent(tfbUsername);
    tfbPassword = encodeURIComponent(tfbPassword);
    var params = "username=" + tfbUsername
        + "&password=" + tfbPassword;
    http.send(params);
}

function saveSettings(tfbSettings) {

    if (! tfbSettings.url
        || ! tfbSettings.timeout
        || ! tfbSettings.username
        || ! tfbSettings.password) {
        notifyUser("All settings are required");
    } else {
        chrome.storage.sync.set(tfbSettings, notifyUser("Settings Saved!"));
    }

}

function restoreSettings() {

    var tfbDefaultSettings = {
        url: 'https://thefactbook.ml/',
        timeout: 5,
        username: 'guest',
        password: 'guest',
        edit: true
    }

    function fillValues(tfbSettings) {
        document.getElementById('UrlInput').value = tfbSettings.url;
        document.getElementById('NewUserUrlInput').value = tfbSettings.url;
        document.getElementById('TimeoutInput').value = tfbSettings.timeout;
        document.getElementById('UsernameInput').value = tfbSettings.username;
        document.getElementById('PasswordInput').value = tfbSettings.password;
        document.getElementById('EditBeforeSendCheckbox')
            .checked = tfbSettings.edit;
        M.updateTextFields();
    }

    chrome.storage.sync.get(tfbDefaultSettings, fillValues);

}


function openDashboard(tfbSettings){
    function stringCode(){
        return "document.getElementById('UsernameLoginInput').value = '"
            + tfbSettings.username
            +"'; document.getElementById('PasswordLoginInput').value = '"
            + tfbSettings.password
            + "'; document.getElementById('LoginButton').click();"
    }
    chrome.tabs.create({
        url: tfbSettings.url,
        active: true,
    });
    chrome.tabs.executeScript(null,{
        code : stringCode(),
    });
}

function readSettings(){
    tfbSettings = {
        url : document.getElementById('UrlInput').value,
        timeout : document.getElementById('TimeoutInput').value,
        username : document.getElementById('UsernameInput').value,
        password : document.getElementById('PasswordInput').value,
        edit: document.getElementById('EditBeforeSendCheckbox').checked
    }
    return tfbSettings;
}

document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    restoreSettings();
});

document.getElementById('SubmitPreferences')
    .addEventListener('click', function() {
        tfbSettings = readSettings();
        saveSettings(tfbSettings);
    });

document.getElementById('SubmitNewUser').addEventListener('click', createUser);
document.getElementById('ShowPassword').addEventListener('click',showPassword);
document.getElementById('ShowPasswordPreferences')
    .addEventListener('click',showPassword);
document.getElementById('MyFactsBtn')
    .addEventListener('click', function (){
        tfbSettings = readSettings();
        openDashboard(tfbSettings);
    });
