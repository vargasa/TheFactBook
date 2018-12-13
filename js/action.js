var searchTerm;
var pPage;

//-----------------------------------------------------
function load(){
    searchTerm = null;
    pPage = null;
    document.getElementById("SearchForm").reset();
    getFacts();
}
//-----------------------------------------------------
function searching(sTerm){
    searchTerm = sTerm;
    document.getElementById("SearchTerm").value = sTerm;
    getFacts(1,pPage);
}
//-----------------------------------------------------
function parseTags(tags) {
    
    max = Object.keys(tags).length;
    var tagsCode = "";
    
    for (var key = 0; key < max; key++) {
        tagsCode += "<a href='#' class='TagButton' onclick='Javascript:searching(`tag=" + tags[key] + "`)'>#" + tags[key] + " </a>";
    }
    
    return tagsCode;
    
}

//-----------------------------------------------------
function domAddFact(id, fact, source, tags, time, prepend) {
    prepend = typeof prepend !== 'undefined' ? prepend : false;

    var fbt = document.getElementById("FactTableBody");
    var nftr = document.createElement('tr');
    var parser = document.createElement('a');
    parser.href = source;

    var reg = new RegExp(searchTerm,"ig");
                    
    nftr.setAttribute('class','TFBItem');
    nftr.setAttribute('id','TFBItemID'+id);
    nftr.innerHTML = '<td class="Facts">'
        + '<p id="TFBFactID' + id + '">' + fact.replace(reg,"<span class='Highlight'>" + searchTerm + "</span>") + '<p/>' + '<div class="TagsDiv" id="TFBTagsID' + id +'">' + parseTags(tags) + '</div>'
        + '<a id="TFBSourceID' + id + '" href="' + source + '" target="_blank">' + parser.hostname + '</a> '
        + '| <a href="#AddFactForm" class="EditButton" onClick="editFact(' + id + ')">Edit</a> | '
        + '<a href="#" class="DeleteButton" onClick="deleteFact(' + id + ')">Delete</a> | '
        + '</td>'
        + '<td class="Time">' 
        +  time
        + '</td>';
    if (prepend) {
        fbt.insertBefore(nftr,fbt.firstChild);
    } else {
        fbt.appendChild(nftr);
    }
}
//-----------------------------------------------------
function setPages( total, perPage ){
    
    var maxPages = Math.ceil( total / perPage );

    var pagesDiv = document.getElementById("PagesDiv");
    pagesDiv.innerHTML = "";
    
    var page = 0;

    while ( page < maxPages ) {
        var nPageLink = document.createElement('a');
        nPageLink.setAttribute('class','PageLink');
        nPageLink.setAttribute('id', 'PageLink' + (page + 1) );
        nPageLink.href = "#"
        nPageLink.setAttribute('onclick', "Javascript:getFacts(" 
                               + (page*perPage + 1)  + "," 
                               + perPage * (page + 1) + ")"
                              );
        nPageLink.innerHTML = ( page + 1 );
        pagesDiv.appendChild(nPageLink);
        page++;
    }

}
//-----------------------------------------------------
function getFacts( fromLimit, toLimit ) {

    var http = new XMLHttpRequest();
    var url = "api.php";

    if (! searchTerm) {
        var params = "action=getFacts";
    } else {
        var params = "action=getFacts&searchTerm=" + encodeURIComponent(searchTerm);
    }

    if (! fromLimit) { fromLimit = 1; }
    if (! toLimit) { toLimit = 0; }

    params += "&fromLimit=" + fromLimit + "&toLimit=" + toLimit;
    
    http.open("GET", url + "?" + params, true);
    http.onreadystatechange = processResponse;
    http.send(null);

    function processResponse() {

        if(http.readyState == 4 && http.status == 200) {

            var r = http.responseText;

            r = JSON.parse(r);

            if (! r[0].Error) {

                if ( r[0].Total != 0) {
                    document.getElementById("FactTable").setAttribute('class','');
                    ok = ( toLimit - fromLimit + 1 == r[0].PerPage );
                    pPage = r[0].PerPage;

                    if ( ok ) { 

                        setPages(r[0].Total, r[0].PerPage);

                        activePage = Math.round(fromLimit / r[0].PerPage) + 1;
                        page = document.getElementById("PageLink" + activePage);
                        page.setAttribute('id',"ActivePage");

                        var showing = r[0].Range.From + "-" + r[0].Range.To;
                        if ( r[0].PerPage >  r[0].Total ) { showing = r[0].Total }
                        document.getElementById("ResultStats").innerHTML =
                            "Showing " + showing + " of " + r[0].Total + " results!";
                        
                        var max = Object.keys(r).length;
                        
                        var fbt = document.getElementById("FactTableBody");
                        fbt.innerHTML = "";
                        
                        for (var key = 1; key < max ; key++){
                            domAddFact(r[key].Id, r[key].Fact, r[key].Source, r[key].Tags, r[key].Time);
                        }
                                            
                    } else {
                        getFacts(fromLimit, fromLimit + r[0].PerPage - 1);
                        return;
                    }

                } else {
                    fbt = document.getElementById("FactTableBody");
                    //TODO: WHEN NOTHING RESULTS
                    document.getElementById("ResultStats").innerHTML =
                        "No results!";
                    document.getElementById("FactTable").setAttribute('class','Hidden');
                    pagesDiv = document.getElementById("PagesDiv");
                    pagesDiv.innerHTML="";
                }

            } else {
                alert(r[0].Description);
            }
        }
    }
}

//-----------------------------------------------------
function editFact(id) {

    function editTags(text){
        text = text.replace(/#/g,",");
        text = text.replace(/ /g,"");
        text = text.replace(",","");
        return text;
    }

    document.getElementById("FactText").value = 
        document.getElementById("TFBFactID" + id).textContent;
    document.getElementById("SourceInput").value =
        document.getElementById("TFBSourceID" + id).href;
    document.getElementById("TagsInput").value =
        editTags(document.getElementById("TFBTagsID" + id).textContent);
    document.getElementById("IDInput").value = id;
    document.getElementById("SendFactButton").value = "Modify";
}
//-----------------------------------------------------
function resetAddFactForm() {
    document.getElementById("SendFactButton").value = "Send";
    document.getElementById("SendFactButton").disabled = false;
}
//-----------------------------------------------------
function deleteFact(id) {

    if (confirm('You are going to delete:\n' 
                + document.getElementById("TFBFactID"+id).textContent) ) {

        function processResponse() {
            if(http.readyState == 4 && http.status == 200) {
                var r = http.responseText;
                console.log(r);
                r = JSON.parse(r);
                if (! r.Error) {
                    var fbt = document.getElementById("FactTableBody");
                    var dfact = document.getElementById("TFBItemID"+id);
                    fbt.removeChild(dfact);
                } else {
                    alert(r.Description);
                }
            }
        }

        var http = new XMLHttpRequest();
        var url = "api.php";
        var params = "action=deleteFact&id=" + id;
        http.open("GET", url + "?" + params, true);
        http.onreadystatechange = processResponse;
        http.send(null);
        

    } 

}
//-----------------------------------------------------
window.addEventListener("load", submitFactHandler);

function submitFactHandler() {

    function sendData() {

        document.getElementById("SendFactButton").disabled = true;
        document.getElementById("SendFactButton").value = "Sending...";
        
        var http = new XMLHttpRequest();
        var FD  = new FormData(form);

        function resetSendFactButton() {
            document.getElementById("SendFactButton").disabled = false;
            document.getElementById("SendFactButton").value = "Send";
        }
        
        http.addEventListener("load", processResponse);
        http.open("POST","api.php?action=addFact");
        http.ontimeout = function(){ alert("Timed out"); resetSendFactButton() };
        http.timeout = 5000;
        http.send(FD);
        
        function processResponse() {
            
            var r = http.responseText;
            console.log(r);

            r = JSON.parse(r);

            if (r.Error == 0 && r.Edited == false) {

                resetSendFactButton();

                var fbt = document.getElementById("FactTableBody");
                var nftr = document.createElement('tr');

                domAddFact(r.Id, r.Fact, r.Source, r.Tags , r.Time, true);

                window.location.href="#MainDiv";

            } else if (r.Error == 0 && r.Edited == true) {

                var parser = document.createElement('a');
                parser.href = r.Source;

                document.getElementById("TFBFactID" + r.Id).innerHTML =
                    r.Fact;
                document.getElementById("TFBSourceID" + r.Id).href =
                    r.Source;
                document.getElementById("TFBSourceID" + r.Id).innerHTML =
                    parser.hostname;
                document.getElementById("TFBTagsID" + r.Id).innerHTML =
                    parseTags(r.Tags);
                window.location.href="#TFBItemID" + r.Id;
                resetAddFactForm();

            } else if (r.Error != 0) {

                alert(r.Description);
                
            } else {
                alert("Something went wrong on the server said");
            }

            document.getElementById("AddFactForm").reset();
        }
    }

    var form = document.getElementById("AddFactForm");
    
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        sendData();
    });
    
}
//-----------------------------------------------------
