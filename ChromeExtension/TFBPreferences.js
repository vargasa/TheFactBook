function createUser() {
    var http = new XMLHttpRequest();

    var tfbUrl = document.getElementById('NewUserUrlInput').value;
    var tfbUsername = document.getElementById('NewUserUsernameInput').value;
    var tfbPassword = document.getElementById('NewUserPasswordInput').value;
    http.open("POST", tfbSettings.url + "/api.php?action=addUser", true);
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

function saveOptions() {

    var tfbUrl = document.getElementById('UrlInput').value;
    var tfbTimeout = document.getElementById('TimeoutInput').value;
    var tfbUsername = document.getElementById('UsernameInput').value;
    var tfbPassword = document.getElementById('PasswordInput').value;
    var tfbEditBeforeSend = document.getElementById('EditBeforeSendCheckbox').checked;

    var tfbNewOptions = {
        tfbUrl: tfbUrl,
        tfbTimeout: tfbTimeout,
        tfbUsername: tfbUsername,
        tfbPassword: tfbPassword,
        tfbEditBeforeSend: tfbEditBeforeSend
    };

    function updateStatus(message) {
        var status = document.getElementById('StatusLabel');
        status.textContent = message.toString();
        
        setTimeout(function() {
            status.textContent = '';
        }, 1000);
    }

    if (! tfbUrl || ! tfbTimeout || ! tfbUsername || ! tfbPassword) {
        updateStatus("All options are required");
    } else {
        chrome.storage.sync.set(tfbNewOptions, updateStatus("Options Saved!"));
    }

}

function restoreOptions() {

    var tfbDefaultOptions = {
        tfbUrl: 'https://thefactbook.ml/',
        tfbTimeout: 5,
        tfbUsername: 'guest',
        tfbPassword: 'guest',
        tfbEditBeforeSend: true
    }

    function fillValues(items) {
        document.getElementById('UrlInput').value = items.tfbUrl;
        document.getElementById('TimeoutInput').value = items.tfbTimeout;
        document.getElementById('UsernameInput').value = items.tfbUsername;
        document.getElementById('PasswordInput').value = items.tfbPassword;
        document.getElementById('EditBeforeSendCheckbox').checked = items.tfbEditBeforeSend;
    }

    chrome.storage.sync.get(tfbDefaultOptions, fillValues);

}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.addEventListener('DOMContentLoaded', function() {
    var instances = M.AutoInit();
    document.getElementById('UrlInput').click();
    document.getElementById('TimeoutInput').click();
    document.getElementById('UsernameInput').click();
    document.getElementById('PasswordInput').click();
});
document.getElementById('SubmitPreferences').addEventListener('click', saveOptions);
document.getElementById('SubmitNewUser').addEventListener('click', createUser);
