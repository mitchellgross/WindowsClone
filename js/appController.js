$(document).ready(function(){

  $.shortcutOffsets = [];
  $.windowZIndex = [];
  $.interval = null;
  $.currentAudio = null;
  $.images = [];
  $.curImage = 0;
  $.musicPlayerAudio = {
    creativeminds: ["Creative Minds", "./audio/bensound-creativeminds.mp3", "2:27"],
    dubstep: ["Dubstep", "./audio/bensound-dubstep.mp3", "2:04"],
    summer: ["Summer", "./audio/bensound-summer.mp3", "3:37"],
    ukulele: ["Ukulele", "./audio/bensound-ukulele.mp3", "2:26"]
  };
  $.defaultImages = {
    cats: ["My Favorite Cats", "./images/imageCats.jpg"],
    people: ["My Favorite People", "./images/imagePeople.jpg"],
    tree: ["My Favorite Tree", "./images/imageTree.jpg"]
  };
  var leftPrev = null;
  var topPrev = null;
  var isMouseDown = false;
  var paintToolCur = "draw";
  //Element Vars
  var body = $("body");
  var desktop = $("#desktop");
  var taskBar = $("#taskBar");
  var startButton = $("#startButton");
  var startMenu = $("#startMenu");
  var linkList = $("#linkList");
  var title = $("#title");

  //Buttons
  var powerBtn = $("#powerBtn");
  var settingsBtn = $("#settingsBtn");

  body.on("mousedown", function(click){
    var targ = click.target;

    //Handles focusing on a window
    if ($(targ).hasClass("windowGeneric")) {
      if ($.focusElem){ $.windowFocus($.focusElem, "remove"); }
      $.windowFocus($(targ).attr("id"), "add");
      //console.log("Focus is: " + $.focusElem);
    } else if ($(targ).parents().hasClass("windowGeneric")){
      var targParent = $(targ).closest(".windowGeneric").attr("id");
      if ($.focusElem) { $.windowFocus($.focusElem, "remove"); }
      $.windowFocus(targParent, "add");
      //console.log("Parented focus is: " + $.focusElem);
    } else if ($(targ).attr("id") == "desktop" || $(targ).parents().hasClass("shortcut")){
      if ($.focusElem) { $.windowFocus($.focusElem, "remove"); }
      $.focusElem = "";
    }

    //if the number of these ids/classes that exist is 0
    if($(click.target).closest('#startButton').length === 0 && $(click.target).closest('#startMenu').length === 0 && startMenu.css('display') != 'none') {
      startMenu.slideFadeToggle("fast");
    }
    if ($(click.target).closest("#taskBarButtonMenu").length === 0 && $("#taskBarButtonMenu").css("display") != "none"){
      $("#taskBarButtonMenu").slideFadeToggle(150);
    }

    $(".shortcut").each(function(){
      $(this).removeClass("shortcutSelected");
    });
  });

  body.on("click", "#imageBtn", function(){
    var imgSrc = $("#imageInput").val();
    if (imgSrc != ""){
      $("#imageList").append("<img id='img1' src='"+imgSrc+"'></img>");
      $(body).css("background-image", "url('"+imgSrc+"')");
      $("#imgInvalid").remove();
    } else {
      console.log("Invalid image URL at Custom Background Image");
      if ($("#imgInvalid").length < 1){
        $("#imageBtn").after("<div id='imgInvalid'>Please supply a valid image.</div>");
      }
    }
  });

  body.on("click", "#taskEndBtn", function(){
    var selectedApps = $("#appTaskManagerContent > ol > .ui-selected");
    for (i = 0; i < selectedApps.length; i++){
      selectedApps[i].remove();
      $.windowControl("#" + $(selectedApps[i]).attr("app"), "ext");
    }
  });

  //Music Player

  body.on("click", "#musicPlayerPlay", function(){
    audioElement = $(this).find("audio")[0];
    allAudioElems = $("td").find("audio");
    duration = audioElement.duration;
    durationFormat = parseInt(duration / 60, 10) + ":" + parseInt(duration % 60);
    for (i = 0; i < allAudioElems.length; i++){
      if (allAudioElems[i] != audioElement){
        allAudioElems[i].pause();
        allAudioElems[i].currentTime = 0;
      }
    }
    if (audioElement.paused){
      $.audioPlay(audioElement);
    } else {
      audioElement.currentTime = 0;
    }
    $.currentAudio = audioElement;
    $("#musicPlayerControls-slider").slider("option", "max", audioElement.duration);
  });

  setInterval(function(){
    allAudioElems = $("td").find("audio");
    if ($.currentAudio != null && !$.currentAudio.paused){
      $("#musicPlayerControls-slider").slider("value", $.currentAudio.currentTime);
      $.audioTimeUpdate($.currentAudio);
      $.currentAudio.onended = function(){ $("#musicPlayerControls-toggle").text("▶"); }
      for (i = 0; i < allAudioElems.length; i++){
        if (allAudioElems[i] == $.currentAudio){
          $("#appMusicPlayerContent > #tableWrapper > table > tr > td").find(allAudioElems[i]).closest("tr").css("background-color", "skyblue");
        } else {
          $("#appMusicPlayerContent > #tableWrapper > table > tr > td").find(allAudioElems[i]).closest("tr").css("background-color", "");
        }
      }
    }
  }, 200);

  body.on("click", "#musicPlayerControls-toggle", function(){
    allAudioElems = $("td").find("audio");
    if ($.currentAudio != null){
      if ($.currentAudio.paused){
        $.audioPlay($.currentAudio);
      } else {
        $.currentAudio.pause();
        $(this).text("▶");
      }
    } else {
      $.currentAudio = allAudioElems[Math.floor(Math.random()*allAudioElems.length)];
      $("#musicPlayerControls-slider").slider("option", "max", $.currentAudio.duration);
      $.audioPlay($.currentAudio);
    }
  });

  body.on("click", "#musicPlayerControls-back", function(){
    allAudioElems = $("td").find("audio");
    for (i = 0; i < allAudioElems.length; i++){
      if (allAudioElems[i] == $.currentAudio){
        $.currentAudio.pause();
        $.currentAudio.currentTime = 0;
        if (i <= 0){
          $.currentAudio = allAudioElems[allAudioElems.length - 1];
        } else {
          $.currentAudio = allAudioElems[i - 1];
        }
        $.audioPlay($.currentAudio);
        break;
      }
    }
  });

  body.on("click", "#musicPlayerControls-forward", function(){
    allAudioElems = $("td").find("audio");
    for (i = 0; i < allAudioElems.length; i++){
      if (allAudioElems[i] == $.currentAudio){
        $.currentAudio.pause();
        $.currentAudio.currentTime = 0;
        if (i >= allAudioElems.length - 1){
          $.currentAudio = allAudioElems[0];
        } else {
          $.currentAudio = allAudioElems[i + 1];
        }
        $.audioPlay($.currentAudio);
        break;
      }
    }
  });

  //Paint

  body.on("mousedown", "#paintCanvas", function(e){
    var context = document.getElementById('paintCanvas').getContext("2d");
    //var parentOffset = $("#paintCanvas").parent().offset();
    var canvasOffset = $("#paintCanvas").offset();
    var mousePos = {
      x: e.pageX - canvasOffset.left,
      y: e.pageY - canvasOffset.top
    };
    isMouseDown = true;
    if (paintToolCur == "draw"){
      $.canvasDraw(context, mousePos.x, mousePos.y, "mousedown", ""+$("#paintOptions-Color").val()+"", $("#paintOptions-Size").val());
    } else if (paintToolCur == "eraser"){
      $.canvasDraw(context, mousePos.x, mousePos.y, "mousedown", "white", $("#paintOptions-Size").val());
    }
    context.moveTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
  });

  body.on("mousemove", "#paintCanvas", function(e){
    var canvas = document.getElementById("paintCanvas");
    var context = canvas.getContext("2d");
    //var parentOffset = $("#paintCanvas").parent().offset();
    var canvasOffset = $("#paintCanvas").offset();
    var mousePos = {
      x: e.pageX - canvasOffset.left,
      y: e.pageY - canvasOffset.top
    };
    $("#canvasCursorPos").text("x: " + mousePos.x + ", y: " + mousePos.y);
    if (isMouseDown == true){
      if (paintToolCur == "draw"){
        $.canvasDraw(context, mousePos.x, mousePos.y, "", ""+$("#paintOptions-Color").val()+"", $("#paintOptions-Size").val());
      } else if (paintToolCur == "eraser"){
        $.canvasDraw(context, mousePos.x, mousePos.y, "", "white", $("#paintOptions-Size").val());
      }
    }
  });

  body.on("mouseup", function(){
    isMouseDown = false;
  });

  body.on("click", "#appPaintContent > .windowOptions > button", function(){
    var id = $(this).attr("id");
    $("#paintOptions-NewInput").css("display", "none");
    $("#paintOptions-SaveInput").css("display", "none");
    if (id == "paintOptions-New"){
      $("#paintOptions-NewInput").css("display", "block");
      body.on("click", "#paintOptions-btnCreate", function(){
        $.canvasCreate($("#paintOptions-InputWidth").val(), $("#paintOptions-InputHeight").val());
      });
      body.on("click", "#paintOptions-btnCancel", function(){
        $("#paintOptions-NewInput").css("display", "none");
      });
    } else if (id = "paintOptions-Save"){
      $("#paintOptions-SaveInput").css("display", "block");
      body.on("click", "#paintOptions-btnSave", function(){
        if ($("#paintOptions-SaveName").val() != "" && $("#paintOptions-SaveName").val() != null && $("#paintOptions-SaveName").val() != undefined){
          var dataURL = document.getElementById("paintCanvas").toDataURL("image/png");
          $(".shortcut").each(function(i){
            if ($(this).find("span").text() == $("#paintOptions-SaveName").val()){
              console.log("CREATE!");
              if ($(this).attr("exe") == "appImageViewer" && $(this).find("span").text() != "Image Viewer"){
                $(this).remove();
              } else {
                console.log("Name already exists for app");
              }
            }
          });
          var appPropNames = [];
          for (i = 0; i < Object.keys($.appInfo).length; i++){
            appPropNames.push($.appInfo[Object.keys($.appInfo)[i]][0]);
          }
          if (appPropNames.includes($("#paintOptions-SaveName").val()) == false){
            $.convertShortcuts("relative");
            $.appendShortcut($("#paintOptions-SaveName").val(), dataURL, "appImageViewer");
            $.convertShortcuts("absolute");
            $("#paintOptions-SaveInput").css("display", "none");
          } else {
            $("#paintOptions-SaveName").css("background-color", "red").animate({
              backgroundColor: "white"
            }, 1000);
          }
        } else {
          $("#paintOptions-SaveName").css("background-color", "red").animate({
            backgroundColor: "white"
          }, 1000);
        }
      });
      body.on("click", "#paintOptions-btnCancel", function(){
        $("#paintOptions-SaveInput").css("display", "none");
      });
    }
  });

  body.on("click", "#paintTools > button", function(){
    var tool = $(this).attr("id");
    $("#paintTools > button").each(function(){
      $(this).find("img").css("background", "none");
    });
    if (tool == "paintTools-Draw"){
      paintToolCur = "draw";
      $(this).find("img").css("background-color", "skyblue");
    } else if (tool == "paintTools-Erase"){
      paintToolCur = "eraser";
      $(this).find("img").css("background-color", "skyblue");
    }
  });

  //Notepad

  body.on("click", "#notepadOptions > button", function(){
    var id = $(this).attr("id");
    $("#notepadOptions-SaveInput").css("display", "none");
    if (id == "notepadOptions-New"){
      $("#appNotepadContent").find("textarea").remove();
      $("#appNotepadContent").append("<textarea></textarea>");
    } else if (id = "notepadOptions-Save"){
      $("#notepadOptions-SaveInput").css("display", "block");
      body.on("click", "#notepadOptions-btnSave", function(){
        if ($("#notepadOptions-SaveName").val() != "" && $("#notepadOptions-SaveName").val() != null && $("#notepadOptions-SaveName").val() != undefined){
          console.log($(".shortcut:contains('"+$("#notepadOptions-SaveName").val()+"')"));
          $(".shortcut").each(function(i){
            if ($(this).find("span").text() == $("#notepadOptions-SaveName").val() && $(this).attr("exe") == "appNotepad"){
              $(this).remove();
            }
          });
          $.convertShortcuts("relative");
          $.appendShortcut($("#notepadOptions-SaveName").val(), "images/CubeNotepad.png", "appNotepad", $("#appNotepadContent > textarea").val(), [$("#notepadOptions-FontFamily").val(), $("#notepadOptions-FontSize").val()]);
          $.convertShortcuts("absolute");
          $("#notepadOptions-SaveInput").css("display", "none");
        } else {
          $("#notepadOptions-SaveName").css("background-color", "red").animate({
            backgroundColor: "white"
          }, 1000);
        }
      });
      body.on("click", "#notepadOptions-btnCancel", function(){
        $("#notepadOptions-SaveInput").css("display", "none");
      });
    }
  });

  body.on("change", "#notepadOptions-FontFamily", function(){
    var value = $(this).val();
    $("#appNotepadContent").find("textarea").css("font-family", value);
  });

  body.on("change", "#notepadOptions-FontSize", function(){
    var value = $(this).val();
    $("#appNotepadContent").find("textarea").css("font-size", value + "px");
  });

//Image Viewer
  body.on("click", "#imageViewer-Next", function(){
    $.curImage += 1;
    if ($.curImage >= $.images.length){
      $.curImage = 0;
    }
    if ($.images.length > 0){
      $("#appImageViewerContent").find("img").attr("src", $.images[$.curImage].find("img").attr("src"));
    }
    console.log($.curImage);
  });

  body.on("click", "#imageViewer-Previous", function(){
    $.curImage -= 1;
    if ($.curImage < 0){
      $.curImage = $.images.length - 1;
    }
    if ($.images.length > 0){
      $("#appImageViewerContent").find("img").attr("src", $.images[$.curImage].find("img").attr("src"));
    }
    console.log($.curImage);
  });

//End

  body.on("change", "#fitList", function(){
    var value = $(this).val();
    if (value == "fit"){
      $(body).css("background-repeat", "no-repeat");
      $(body).css("background-size", "initial");
    }
    if (value == "stretch"){
      $(body).css("background-repeat", "no-repeat");
      $(body).css("background-size", "100% 100%");
    }
    if (value == "tile"){
      $(body).css("background-repeat", "repeat");
      $(body).css("background-size", "initial");
    }
  });

  body.on("change", "#colorCustom", function(){
    var value = $(this).val();
    $("#taskBar").css("background-color", $.hexToRgb(value, $('#opacitySlider').val()));
    $("#startMenu").css("background-color", $.hexToRgb(value, $('#opacitySlider').val()));
  });

  body.on("change", "#opacitySlider", function(){
    var value = $(this).val();
    var colorToRGB = $("#taskBar").css("background-color").replace(/^rgba?\(|\s+|\)$/g,'').split(',');
    var rgbCompile = colorToRGB[0] + ", " + colorToRGB[1] + ", " + colorToRGB[2];
    $("#taskBar").css("background-color", "rgba(" + rgbCompile + ", " + value + ")");
    $("#startMenu").css("background-color", "rgba(" + rgbCompile + ", " + value + ")");
    console.log($("#taskBar").css("background-color"));
  });

  body.on("click", ".taskBarButton", function(){
    var btnToApp = $(this).attr("id").substring(0, $(this).attr("id").length - 6);
    var btaDisplay = $("#" + btnToApp).css("display");
    if ($(this).hasClass("ui-sortable-helper") == false){
      if (btaDisplay == "none" || $.focusElem == btnToApp){
        $.windowFocus($.focusElem, "remove");
        $.windowControl("#" + btnToApp, "min");
      } else {
      if ($.focusElem != "") {
        $.windowFocus($.focusElem, "remove");
      }
        $.windowFocus(btnToApp, "add");
      }
    }
  });

  body.bind("contextmenu",function(e){
    if ($(e.target).is(".taskBarButton") || $(e.target).parent().is(".taskBarButton")){
      return false;
    }
  });

  body.on("contextmenu", ".taskBarButton", function(){
    $("#taskBarButtonMenu").remove();
    $(this).append(
      "<div id='taskBarButtonMenu'>\
        <ul>\
          <li exe='close'>✕ Close Window</li>\
        </ul>\
      </div>"
    );
    $(this).find("#taskBarButtonMenu").slideFadeToggle(150);
  });

  body.on("click", "#taskBarButtonMenu > ul > li", function(){
    var exe = $(this).attr("exe");
    if (exe == "pin"){
      console.log("Pin to Taskbar!");
    } else if (exe == "close"){
      $.windowControl("#" + $(this).closest(".taskBarButton").attr("id").slice(0, -6), "ext");
    }
  });

  body.on("click", function(click){ //Different function setup for dynamically created elements
    var targ = click.target;
    var app = $(targ).parent().parent(); //used for the window min/max/exit buttons

    //app functions
    $('.windowSideNav > li').each(function (i) { //binds click function to windowSideNav
      $(this).on("click", function(){
        $('.windowSideNav > li').each(function () {
          $("#" + $(this).attr("dest") + "Sub").css("display", "none");
          if ($(this).text().includes("•")){
            $(this).text($(this).text().substring(1));
          }
        });
        $("#" + $(this).attr("dest") + "Sub").css("display", "block");
        $(this).text("• " + $(this).text());
      });
    });

    $('#imageList > img').each(function () { //binds click function to windowSideNav
      $(this).on("click", function(){
        $(body).css("background-image", "url('"+$(this).attr("src")+"')");
      });
    });

    $('#colorList > div').each(function () { //binds click function to windowSideNav
      var value = $(this).attr("value");
      var colorToRGB = window.getComputedStyle(this, null).getPropertyValue("background-color").replace(/^rgba?\(|\s+|\)$/g,'').split(',');
      var rgbCompile = colorToRGB[0] + ", " + colorToRGB[1] + ", " + colorToRGB[2];
      $(this).on("click", function(){
        $("#taskBar").css("background-color", "rgba(" + rgbCompile + ", " + $("#opacitySlider").val() + ")");
        $("#startMenu").css("background-color", "rgba(" + rgbCompile + ", " + $("#opacitySlider").val() + ")");
      });
    });

    //Minimize
    if (targ.id == "btnMin"){
      $.windowControl(app, "min");
    }

    //Maximize
    if (targ.id == "btnMax"){
      $.windowControl(app, "max");
    }

    //Exit
    if (targ.id == "btnExt"){
      $.windowControl(app, "ext");
      $.focusElem = "";
    }
  });

  startButton.click(function(){
    startMenu.slideFadeToggle("fast");
  });

  $("#powerBtn").click(function(){
    $("#powerMenu").slideFadeToggle(150);
  });

  $("#settingsBtn").click(function(){
    $.launchApp("appSettings");
    $("#startMenu").slideFadeToggle("fast");
  });
  $("#powerMenu > ul > li").click(function(i){
    var text = $(this).text();
    if (text == "Sleep"){
      console.log("Not set yet!");
    } else if (text == "Exit"){
      window.top.close();
    } else if (text == "Refresh"){
      location.reload();
    }
  });

  $(".shortcut").each(function(i) {
    $.shortcutOffsets.push({
      name: $(this).text().trim(),
      left: $(this).offset().left,
      top: $(this).offset().top
    });
  });
  $(".shortcut").each(function(i) {
    $(this).css("position", "absolute").css("top", $.shortcutOffsets[i]['top']).css("left", $.shortcutOffsets[i]['left']); //-10 to compensate for the 10px margin
  });

  $(".linkListItem").click(function() {
    $.launchApp($(this).attr("exe"));
    $("#startMenu").slideFadeToggle("fast");
    if ($(this).find("span").text() == "Image Viewer"){
      $("#appImageViewerContent").find("img").attr("src", $.images[0].find("img").attr("src"));
    }
  });

  body.on("click", ".shortcut", function(){
    $(this).addClass("shortcutSelected");
  });

  body.on("dblclick", ".shortcut", function(){
    $.launchApp($(this).attr("exe"));
    if ($(this).attr("exe") == "appImageViewer"){
      if ($(this).find("span").text() != "Image Viewer"){
        $("#appImageViewerContent").find("img").attr("src", $(this).find("img").attr("src"));
        //sets clicked image's index number to the curImage variable
        for (i = 0; i < $.images.length; i++){
          if ($.images[i].find("img").attr("src") == $(this).find("img").attr("src")){
            $.curImage = i;
          }
        }
      } else {
        if ($.images.length > 0){
         $("#appImageViewerContent").find("img").attr("src", $.images[0].find("img").attr("src"));
       } else if ($.images.length <= 0){
         console.log("No images to display");
       }
      }
    } else
    if($(this).attr("exe") == "appNotepad"){
      $("#appNotepadContent").find("textarea").val($(this).attr("data"));
      if ($(this).attr("dataFontFamily") != "undefined" && $(this).attr("dataFontSize") != "undefined"){
        var dataFamily = $(this).attr("dataFontFamily");
        var dataSize = $(this).attr("dataFontSize");
        $("#notepadOptions-FontFamily").val(dataFamily);
        $("#notepadOptions-FontSize").val(dataSize);
        $("#appNotepadContent").find("textarea").css("font-family", dataFamily);
        $("#appNotepadContent").find("textarea").css("font-size", dataSize + "px");
      }
    }
  });

  $(".shortcut").draggable({
    containment: "#desktop",
    scroll: false,
    start: function(){
      leftPrev = $(this).offset().left;
      topPrev = $(this).offset().top;
    },
    stop: function(){
      $(this).css("left", Math.round($(this).css("left").slice(0, -2)/100)*100);
      $(this).css("top", Math.round($(this).css("top").slice(0, -2)/100)*100);
      $.shortcutOffsets = [];
      $(".shortcut").each(function(i) {
        $.shortcutOffsets.push({
          name: $(this).text().trim(),
          left: $(this).offset().left,
          top: $(this).offset().top
        });
      });
      for (i = 0; i < $.shortcutOffsets.length; i++){
        if ($.shortcutOffsets[i]["left"] == $(this).offset().left && $.shortcutOffsets[i]["top"] == $(this).offset().top && $.shortcutOffsets[i]["name"] != $(this).text().trim()){
          $(this).offset({ top: topPrev, left: leftPrev });
          console.log("Confliction");
        }
        if ($(this).offset().left >= $(document).width() - 80 || $(this).offset().top >= $(document).height() - 80){
          $(this).offset({ top: topPrev, left: leftPrev });
        }
      }
    }
  });

  taskBar.sortable({
    items: ".taskBarButton",
    containment: "#taskBar",
    axis: "x",
    tolerance: "pointer",
    revert: 100
  });
  console.log("Controller loaded");

  for (i = 0; i < Object.keys($.defaultImages).length; i++){
    $.convertShortcuts("relative");
    $.appendShortcut($.defaultImages[Object.keys($.defaultImages)[i]][0], $.defaultImages[Object.keys($.defaultImages)[i]][1], "appImageViewer");
    $.convertShortcuts("absolute");
  }
});
