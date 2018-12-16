<!DOCTYPE html>
<html>
  <head>
    <meta name="referrer" content="never">
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <link rel="stylesheet" href="css/style.css" type="text/css" />
    <script src="js/action.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
    <title>TheFactBook - Board</title>
  </head>
  <body onload="Javascript:load()">
    <div id="MainDiv">
      <?php
      require_once('content/header.php');
      session_start();
      if ( isset($_SESSION['username']) ) {
          $username = $_SESSION['username'];
      ?>
        <div class="row s12">
          Wellcome <?php echo $username;  ?>
          <form id="SearchForm"
                  action="Javascript:searching(document.getElementById('SearchTerm').value)">
            <input id="SearchTerm" class="TextInput" type="text" name="searchTerm" placeholder="Search..."
                    oninput="Javascript:searching(document.getElementById('SearchTerm').value )" />
            <input id="SearchButton" class="btn hide" type="submit"  value="Search" />
            <div class="col s2 rigth-align"><a href="#" onclick="Javascript:load()">Reload</a></div>
            <div class="col s2 rigth-align  offset-s8"><a href="api.php?action=logout">Logout</a></div>
          </div>
          <div id="ResultStats"></div>
          <div class="row s12">
          <div id="FactTable">
            <div id="FactTableBody"></div>
          </div>
          <div id="PagesDiv">
          </div>
          <div id="AddFactForm" class="row s12">
            <div class="col s8 offset-s2">
              <h4>Add a fact manually</h4>
              <form id="FactFormEdit">
                <div class="row">
                  <label for="FactText">Fact:</label>
                  <textarea class="materialize-textarea" id="FactText" name="fact" rows="4" cols="50" required></textarea>
                </div>
                <div class="row">
                  <label for="SourceInput">Source:</label>
                  <input id="SourceInput" type="text" name="source" required/>
                </div>
                <div class="row">
                  <label for="TagsInput">Tags: (Comma separated)</label>
                  <input id="TagsInput" type="text" name="tags"/>
                </div>
                <div class="row">
                  <input id="IDInput" class="hide" type="number" name="id" value="0"/>
                <div class="col s4">
                  <input class="btn" id="SendFactButton" type="submit" value="Send"/>
                </div>
                <div class="col s4">
                  <input class="btn" type="reset" value="Reset!" onclick="Javascript:resetAddFactForm()">
                </div>
                </div>
              </form>
            </div>
          </div>
      <?php } else {
          echo 'You are not logged in';
      }
      require_once("content/footer.php") ?>
          </div>
    </div>
  </body>
</html>
