$(document).ready(function(){
  //key (ID): properName, image, isLink, isShortcut
  $.appInfo =
  {
    appSettings: ["Settings", "images/CubeSettings.png", false, false],
    appNotepad: ["Notepad", "images/CubeNotepad.png", true, true],
    appMusicPlayer: ["Music Player", "images/CubeMusicPlayer.png", true, true],
    appPaint: ["Paint", "images/CubePaint.png", true, true],
    appImageViewer: ["Image Viewer", "images/CubeImageViewer.png", true, true],
    appTaskManager: ["Task Manager", "images/CubeTaskManager.png", true, false]
  };

  $.appLib = {
    appSettings: function (app) {
      $("#" + app + "Content").append(
        "<ul class='windowSideNav'>\
          <li dest='background'>• Background</li>\
          <li dest='taskbar'>Taskbar</li>\
          <li dest='privacy'>Privacy</li>\
        </ul>\
        <div id='backgroundSub' class='sub'>\
          <b>Background</b>\
          <br>Choose Picture:\
          <div id='imageList'>\
            <img src='images/wallpaper1.jpg'></img>\
            <img src='images/wallpaper2.jpg'></img>\
            <img src='images/wallpaper3.jpg'></img>\
          </div>\
          <br>Custom Picture:<br>\
          <input id='imageInput' type='text' placeholder='URL'></input><button id='imageBtn'>Add</button>\
          <br>Choose Fit:\
          <br>\
          <select id='fitList'>\
            <option value='fit'>Fit</option>\
            <option value='stretch'>Stretch</option>\
            <option value='tile'>Tile</option>\
          </select>\
        </div>\
        <div id='taskbarSub' class='sub'>\
          <b>Taskbar</b>\
          <br>Choose Color:\
          <div id='colorList'>\
            <div class='red'></div>\
            <div class='orange'></div>\
            <div class='yellow'></div>\
            <div class='green'></div>\
            <div class='blue'></div>\
            <div class='purple'></div>\
            <div class='pink'></div>\
            <div class='black'></div>\
          </div>\
          <br>Custom Color:\
          <br><input type='color' id='colorCustom' value='#e66465' />\
          <br>0%<input type='range' id='opacitySlider' value='0.8' min='0' max='1' step='0.1'/>100%\
        </div>\
        <div id='privacySub' class='sub'>\
          <b>Privacy</b>\
          <br>YOU HAVE NONE!\
          <br><img src='images/skull.gif'></img>\
          <br><sup>Try downloading some more privacy?</sup>\
        </div>"
       );
    },
    appNotepad: function (app) {
      $("#" + app + "Content").append(
        "<div id='notepadOptions'>\
          <button id='notepadOptions-New'>New</button>\
          <button id='notepadOptions-Save'>Save</button>\
          <div id='notepadOptions-SaveInput'>\
            <span>Save Document:</span>\
            <input id='notepadOptions-SaveName' type='text' placeholder='Name' value='untitled'></input>\
            <button id='notepadOptions-btnSave' style='float: left; margin-left: 15px;'>Save</button><button id='notepadOptions-btnCancel' style='float: right; margin-right: 15px;'>Cancel</button>\
          </div>\
          <div id='notepadOptions-Divider'></div>\
          <span>Font Family: </span>\
          <select id='notepadOptions-FontFamily'>\
            <option value='arial'>Arial</option>\
            <option value='times new roman'>Times New Roman</option>\
            <option value='courier new'>Courier New</option>\
            <option value='verdana'>Verdana</option>\
            <option value='comic sans ms'>Comic Sans MS</option>\
            <option value='impact'>Impact</option>\
          </select>\
          <span>Font Size: </span>\
          <input id='notepadOptions-FontSize' type='number' min='1' value='15' placeholder='15'></input>\
        </div>\
        <textarea></textarea>"
      );
    },
    appMusicPlayer: function (app) {
      $("#" + app + "Content").append(
        "<div id='tableWrapper'>\
          <table>\
          </table>\
        </div>\
        <div id='musicPlayerControls'>\
          <div id='musicPlayerControls-slider'><div id='custom-handle' class='ui-slider-handle'></div></div>\
          <span id='musicPlayerControls-time'>0:00</span>\
          <button id='musicPlayerControls-back'>|◄</button>\
          <button id='musicPlayerControls-toggle'>►</button>\
          <button id='musicPlayerControls-forward'>►|</button>\
          <div id='musicPlayerControls-volume'><span>🔉</span><div id='custom-handle2' class='ui-slider-handle'></div></div>\
        </div>"
      );
      $("#musicPlayerControls-slider").slider({
        min: 0,
        max: 100,
        range: "min",
        slide: function(event, ui){
          $.audioSeek(ui);
        }
      });
      $("#musicPlayerControls-volume").slider({
        min: 0,
        max: 1,
        step: 0.05,
        value: 0.5,
        range: "min",
        slide: function(event, ui){
          $.audioVolume(ui);
        }
      });
      for (i = 0; i < Object.keys($.musicPlayerAudio).length; i++){
        $("#appMusicPlayerContent > #tableWrapper > table").append(
          "<tr>\
            <td id='musicPlayerPlay'>►<audio src='"+$.musicPlayerAudio[Object.keys($.musicPlayerAudio)[i]][1]+"'/></td>\
            <td>"+$.musicPlayerAudio[Object.keys($.musicPlayerAudio)[i]][0]+"</td>\
            <td><a href='https://www.bensound.com' target='_blank'>https://www.bensound.com</a></td>\
            <td>"+$.musicPlayerAudio[Object.keys($.musicPlayerAudio)[i]][2]+"</td>\
          </tr>"
        );
      }
    },
    appPaint: function (app) {
      $("#" + app + "Content").append(
        "<div class='windowOptions'>\
          <button id='paintOptions-New'>New</button>\
          <div id='paintOptions-NewInput'>\
            <span>Canvas Dimensions:</span>\
            <input id='paintOptions-InputHeight' type='number' placeholder='Height'></input>\
            <input id='paintOptions-InputWidth' type='number' placeholder='Width'></input>\
            <button id='paintOptions-btnCreate' style='float: left; margin-left: 15px;'>Create</button><button id='paintOptions-btnCancel' style='float: right; margin-right: 15px;'>Cancel</button>\
          </div>\
          <button id='paintOptions-Save'>Save</button>\
          <div id='paintOptions-SaveInput'>\
            <span>Save Image:</span>\
            <input id='paintOptions-SaveName' type='text' placeholder='Name' value='untitled'></input>\
            <button id='paintOptions-btnSave' style='float: left; margin-left: 15px;'>Save</button><button id='paintOptions-btnCancel' style='float: right; margin-right: 15px;'>Cancel</button>\
          </div>\
          <div id='paintOptions-Divider'></div>\
          <span>Brush Size: </span>\
          <input type='number' id='paintOptions-Size' value='5' placeholder='10' min='1'></input>\
          <span>Color: </span>\
          <input type='color' id='paintOptions-Color'></input>\
        </div>\
        <div id='paintTools'>\
          <button id='paintTools-Draw'><img src='images/CubePencil.png'></img></button>\
          <button id='paintTools-Erase'><img src='images/CubeEraser.png'></img></button>\
        </div>\
        <canvas id='paintCanvas' width='500' height='400'></canvas>\
        <div id='canvasDataWrapper'>\
          <span id='canvasCursorPos'>x: 0, y: 0 </span>\
          <span id='canvasSizeDisplay'>Canvas Size: </span>\
        </div>"
      );
    },
    appImageViewer: function (app) {
      $("#" + app + "Content").append(
        "<button id='imageViewer-Next' class='imageViewer-Controls'>></button>\
        <button id='imageViewer-Previous' class='imageViewer-Controls'><</button>\
        <img src=''></img>"
      );
      $.images = [];
      $(".shortcut").each(function(i){
        if ($(this).attr("exe") == "appImageViewer" && $(this).children("span").text() != "Image Viewer"){
          $.images.push($(this));
        }
      });
      $("#appImageViewer").css("height", "550px").css("width", "600px");
    },
    appTaskManager: function (app) {
      $("#" + app + "Content").append(
        "<ol>\
        </ol>\
        <button id='taskEndBtn'>End Task</button>"
      );
      $("#" + app).css("width", "300px").css("height", "300px");
      $("#appTaskManagerContent > ol").selectable();
      $.interval = setInterval($.taskMngrUpdate, 2500);
    }
  };
  console.log("Library loaded");
});
