
function cb(request, sender, sendResponse){
    var factInput = document.getElementById("FactInput");
    var sourceInput = document.getElementById("SourceInput");
    if (request.msg == "editFact") {
        factInput.value = request.fact;
        factInput.click();
        sourceInput.value = decodeURIComponent(request.source);
        sourceInput.click();
        var editFactForm = document.getElementById("EditFactForm");
        var tagsInput = document.getElementById("TagsInput");
        var editOption = document.getElementById("EditOption");
        editFactForm.addEventListener('submit', function submit(event) {
            var fact = factInput.value;
            var source = sourceInput.value;
            var tags = tagsInput.value;
            var dontEdit = editOption.checked;
            chrome.runtime.sendMessage({
                msg: "sendFact",
                fact: fact,
                source: source,
                tags: tags,
                dontEdit: dontEdit
            });
        }, false);
    }
    M.updateTextFields();
    M.textareaAutoResize(factInput);
}

chrome.runtime.onMessage.addListener(cb);
