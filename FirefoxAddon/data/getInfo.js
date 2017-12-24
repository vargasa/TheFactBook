var editFactForm = document.getElementById("EditFactForm");
var factInput = document.getElementById("FactInput");
var sourceInput = document.getElementById("SourceInput");
var tagsInput = document.getElementById("TagsInput");
var editOption = document.getElementById("EditOption");


self.port.on("editFact", function onEditFact(fact, source){
    factInput.value = fact;
    sourceInput.value = source;
});

editFactForm.addEventListener('submit', function submit(event) {
    var fact = factInput.value;
    var source = sourceInput.value;
    var tags = tagsInput.value;
    var dontEdit = editOption.checked;
    self.port.emit("sendFact", fact, source, tags, dontEdit);
}, false);


