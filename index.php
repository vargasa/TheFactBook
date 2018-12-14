<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>TheFactBook</title>
    <script src="js/signUp.js"></script>
    <link rel="stylesheet" href="css/style.css" type="text/css" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
  </head>
  <body>
    <div id="MainDiv">
      <?php require_once('content/header.php') ?>
      <div class="row s12">
        <div class="row s12">
          <form id="LoginForm" action="api.php?action=login" method="post">
            <div class="col s6">
              <i class="material-icons prefix">account_circle</i>
              <label for="UsernameLoginInput">Username : </label>
              <input id="UsernameLoginInput" class="LoginInput TextInput"
                      placeholder="Username" type="text" name="username"
                      value="" maxlength="20" required/>
            </div>
            <div class="col s6">
              <i class='material-icons prefix'>https</i>
              <label for="PasswordLoginInput" class="LoginInput">Password : </label>
              <input id="PasswordLoginInput" class="TextInput" type="password"
                      Placeholder="Password" name="password" value=""
                      maxlength="20" required/>
            </div>
            <div class="col hide">
              <input id="LoginButton" class="btn" type="submit" value="&rarr; Login" />
            </div>
          </form>
        </div>
      </div>
      <div class="row s12">
        <div class="col s6">
          <h5>What is this?</h5>
          <p>Here you can save portions of text wherever you are reading keeping its source for later reference...</p> 
          <p>Just install our addon to your browser, put your username and password. When reading an article select the text you want to save, right click and "Add on TheFactBook".</p>
          <p>We care about your privacy, we don't store any personal information. We don't even require your email to sign up. However, you must remember and save your password because there is no way to recover it.</p>
        </div>
        <div class="col s6">
          <div class="row">
            <h5>Sign Up</h5>
          </div>
          <form id="AddUserForm" action="javascript:signUp()" method="post" accept-charset="utf-8">
            <div class="row">
              <label for="UsernameSignUpInput">Username (At least 4 letters):</label> 
              <input id="UsernameSignUpInput" class="SignUpInput TextInput"
                      placeholder="Username" type="text"  name="username" value="" maxlength="20" height="1" required/>
            </div>
            <div class="row">
              <label for="Password1SignUpInput">Password :</label>
              <input id="Password1SignUpInput" class="SignUpInput TextInput" placeholder="Password" type="password"  name="password" value="" maxlength="20" height="1" required/>
            </div>
            <div class="row">
              <label for="Password2SignUpInput">Repeat Password :</label>
              <input id="Password2SignUpInput" class="TextInput" type="password" placeholder="Repeat Password"  name="password_" value="" maxlength="20" required/>
            </div>
            <div class="row center-align">
              <input id="SignUpButton" class="btn" type="submit" value="Sign Up" />
            </div>
          </form>
        </div>
      </div>
      <?php require_once('content/footer.php') ?>
    </div>
  </body>
</html>
