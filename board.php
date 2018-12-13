<!DOCTYPE html>
<html>
  <head>
    <meta name="referrer" content="never">
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <link rel="stylesheet" href="css/style.css" type="text/css" />
    <script src="js/action.js"></script>
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
        <div id="MenuDiv">Wellcome <?php echo $username;  ?> | 
          <a href="#" onclick="Javascript:load()">Reload</a> | 
          <a href="api.php?action=logout">Logout</a> |
          <div id="SearchDiv">
            <form id="SearchForm" 
                    action="Javascript:searching(document.getElementById('SearchTerm').value)">
              <input id="SearchTerm" class="TextInput" type="text" name="searchTerm" placeholder="Search..."
                      oninput="Javascript:searching(document.getElementById('SearchTerm').value )" />
              <input id="SearchButton" class="Button" type="submit"  value="Search" />
            </form>
            <div id="ResultStats">
            </div>
          </div>
        </div>

      
      <table id="FactTable">
        <tbody id="FactTableBody">
        </tbody>
      </table>
      
      <div id="PagesDiv">
      </div>
      <h4>Add a fact manually</h4>
      <form id="AddFactForm" name="addForm">
        <table id="AddFactTable">
          <tbody>
            <tr>
              <td>Fact:</td>
              <td>
                <textarea id="FactText" name="fact" rows="4" cols="50" required></textarea>
              </td>
            </tr>
            <tr>
              <td>Source:</td>
              <td>
                <input id="SourceInput" type="text" name="source" required/>
              </td>
            </tr>
            <tr>
              <td>Tags: (Comma separated)</td>
              <td>
                <input id="TagsInput" type="text" name="tags"/>
              </td>
            </tr>
            <tr class="Hidden" >
              <td>id:</td>
              <td>
                <input id="IDInput" type="number" name="id" value="0"/>
              </td>
                </tr>
                <tr>
                  <td>
                    <input id="SendFactButton" type="submit" value="Send"/>
                    <input type="reset" value="Reset!" onclick="Javascript:resetAddFactForm()">
                  </td>
                </tr>
          </tbody>
        </table>
      </form>
<?php
 } else { 
     echo 'You are not logged in';
 } 
require_once("content/footer.php") ?>
    </div>
  </body>
</html>
  
