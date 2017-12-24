<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>TheFactBook</title>
    <script src="js/signUp.js"></script>
    <link rel="stylesheet" href="css/style.css" type="text/css" />
  </head>
  <body>
    <div id="MainDiv">
      <?php require_once('content/header.php') ?>
      <h3>Login</h3>
      <div id="LoginDiv">
	<form id="LoginForm" action="api.php?action=login" method="post">
	  <label for="UsernameLoginInput">Username : </label>
	  <input id="UsernameLoginInput" class="LoginInput TextInput" placeholder="Username" type="text" name="username" value="" maxlength="20" required/>
	  <label for="PasswordLoginInput" class="LoginInput">Password : </label>
	  <input id="PasswordLoginInput" class="TextInput" type="password" Placeholder="Password" name="password" value="" maxlength="20" required/>
	  <input id="LoginButton" class="Button" type="submit" value="&rarr; Login" />
	</form>
      </div>
      
      <table id="SignUpTable" width="100%">
	<tbody>
	  <tr>
	    <td class="SignUp" >
	      <h4>Here you can save portions of text wherever you are reading keeping its source for later reference...</h4> 
	      <h5>Just install our addon to your browser, put your username and password. When reading an article select the text you want to save, right click and "Add on TheFactBook".</h5>
	      <h6>We care about your privacy, we don't store any personal information. We don't even require your email to sign up. However, you must remember and save your password because there is no way to recover it.</h6>
	    </td>
	    <td>
	      <h3>Sign Up</h3>
	      <form id="AddUserForm" action="javascript:signUp()" method="post" accept-charset="utf-8">
		<table >
		  <tbody>
		    <tr>
		      <td class="SignUp">
			<label for="UsernameSignUpInput">Username (At least 4 letters):</label> 
		      </td>
		      <td>
			<input id="UsernameSignUpInput" class="SignUpInput TextInput" placeholder="Username" type="text"  name="username" value="" maxlength="20" height="1" required/>
		      </td>
		    </tr>
		    <tr>
		      <td>
			<label for="Password1SignUpInput">Password :</label>
		      </td>
		      <td>
			<input id="Password1SignUpInput" class="SignUpInput TextInput" placeholder="Password" type="password"  name="password" value="" maxlength="20" height="1" required/>
		      </td>
		    </tr>
		    <tr>
		      <td>
			<label for="Password2SignUpInput">Repeat Password :</label>
		      </td>
		      <td>
			<input id="Password2SignUpInput" class="TextInput" type="password" placeholder="Repeat Password"  name="password_" value="" maxlength="20" required/>
		      </td>
		      <tr>
			<td>
			  <input id="SignUpButton" class="Button" type="submit" value="Sign Up" />
			</td>
		      </tr>
		  </tbody>
		</table>
	      </form>
	    </td>
	</tbody>
      </table>
      <?php require_once('content/footer.php') ?>
    </div>
  </body>
</html>
