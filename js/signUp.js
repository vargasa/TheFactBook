function signUp() {

    document.getElementById("SignUpButton").disabled = true;
    document.getElementById("SignUpButton").value = "Creating user...";

    var pb1 = document.getElementById("Password1SignUpInput");
    var pb2 = document.getElementById("Password2SignUpInput");
    var ub = document.getElementById("UsernameSignUpInput");
    
    var p1 = pb1.value;
    var p2 = pb2.value;
    var u = ub.value

    if (p1 == p2) {
        if (u.match("^[a-zA-Z0-9]*$")){
            sendRequest();
        }
        else{
            alert("Username only can contain numbers and letters.");
            document.getElementById("SignUpButton").disabled = false;
            document.getElementById("SignUpButton").value = "Sign Up";
        }
    } else {
        document.getElementById("SignUpButton").disabled = false;
        document.getElementById("SignUpButton").value = "Sign Up";
        alert("Passwords don't match.");
    }
    
    function sendRequest() {
        var http = new XMLHttpRequest();
        var form = document.getElementById("AddUserForm");
        var FD  = new FormData(form);
        
        http.ontimeout = function(){ alert("Timed out"); resetSignUpButton() };
        http.timeout = 5000;
        http.open("POST", "api.php?action=addUser", true);
        
        function resetSignUpButton(){
            document.getElementById("SignUpButton").disabled = false;
            document.getElementById("SignUpButton").value = "Sign Up";
        }

        function processResponse () {
            if (  http.readyState == 4 && http.status == 200) {
                var r = http.responseText ;
                r = JSON.parse(r);

                if (r.Error != 0) {
                    resetSignUpButton();
                    alert(r.Description);                   
                } else {
                    document.getElementById("UsernameLoginInput").value = 
                        document.getElementById("UsernameSignUpInput").value
                    document.getElementById("PasswordLoginInput").value = 
                        document.getElementById("Password1SignUpInput").value
                    document.getElementById("LoginButton").click();
                }
            }
        };

        http.onreadystatechange = processResponse;
        
        http.send(FD);
    }
}

