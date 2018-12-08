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
document.getElementById('SaveButton').addEventListener('click', saveOptions);
