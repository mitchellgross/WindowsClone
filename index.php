<!DOCTYPE html>
<html>
  <head>
    <title>Cube OS</title>
    <meta charset="UTF-8">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="//code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <link rel="stylesheet" type="text/css" href="stylesheets/css/indexCSS.css" />
    <link rel="stylesheet" type="text/css" href="stylesheets/css/appsCSS.css" />
    <link rel="stylesheet" type="text/css" href="stylesheets/css/appsContentCSS.css" />
    <script src="js/appLibrary.js"></script>
    <script src="js/jquery_functions.js"></script>
    <script src="js/appController.js"></script>
  </head>
  <body>
    <div id="desktop">
    </div>
    <div id="taskBar">
      <button id="startButton"><img src="images/CubeLogo.png"></img></button>
      <div id="startMenu">
        <div id="settingsList">
          <div class="settingsButtons" id="powerBtn"><img src="images/CubePower.png"></img></div>
          <div class="settingsButtons" id="settingsBtn"><img src="images/CubeSettings.png"></img></div>
        </div>
        <div id="powerMenu">
          <ul>
            <li>Exit</li>
            <li>Refresh</li>
          </ul>
        </div>
        <ul id="linkList">
          Links
        </ul>
      </div>
    </div>
  </body>
</html>
