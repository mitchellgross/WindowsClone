$(document).ready(function() {
  //Data Vars
  $.runningApps = [];
  $.focusElem = null;

  //Element Vars
  var body = $("body");
  var desktop = $("#desktop");
  var taskBar = $("#taskBar");
  var startButton = $("#startButton");
  var startMenu = $("#startMenu");
  var linkList = $("#linkList");

  $.fn.slideFadeToggle  = function(speed, easing, callback) {
    if(this.attr("id") == "startMenu"){
      $("#powerMenu").css("display", "none");
    }
    return this.animate({opacity: 'toggle', height: 'toggle'}, speed, easing, callback);
  };

  $.audioPlay = function(currentAudio){
    currentAudio.play();
    currentAudio.volume = $("#musicPlayerControls-volume").slider("value");
    $("#musicPlayerControls-toggle").text("❚❚");
  }

  $.audioSeek = function(ui){
    if ($.currentAudio != null){
      $.currentAudio.currentTime = ui.value;
      $.audioTimeUpdate($.currentAudio);
    }
  }

  $.audioVolume = function(ui){
      if ($.currentAudio != null){
        console.log("sliding");
        $.currentAudio.volume = ui.value;
      }
      if (ui.value >= 0.66){
        $("#musicPlayerControls-volume").find("span").text("🔊");
      } else if (ui.value < 0.66 && ui.value >= 0.33){
        $("#musicPlayerControls-volume").find("span").text("🔉");
      } else if (ui.value < 0.33 && ui.value >= 0.05){
        $("#musicPlayerControls-volume").find("span").text("🔈");
      } else if (ui.value <= 0){
        $("#musicPlayerControls-volume").find("span").text("❌");
      }
  }

  $.audioTimeUpdate = function(currentAudio){
    var m = parseInt((currentAudio.currentTime / 60) % 60).toString();
    var s = parseInt(currentAudio.currentTime % 60).toString();
    $("#musicPlayerControls-time").text((s.length > 1) ? m + ":" + s : m + ":" + "0" + s);
  }

  $.canvasDraw = function(ctx, posX, posY, call, color = "black", size){
    if (call == "mousedown"){
      ctx.beginPath();
      ctx.lineWidth = size;
      ctx.lineJoin = ctx.lineCap = 'round';
    }
      ctx.lineTo(posX, posY);
      ctx.strokeStyle = color;
      ctx.stroke();
  }

  $.canvasErase = function(ctx, posX, posY, call, size){
    ctx.clearRect(posX, posY, size, size);
  }

  $.canvasCreate = function(width, height){
    if (width <= 0 || height <= 0){
      width = 400;
      height = 400;
    }
    $("#paintCanvas").remove();
    $("#canvasDataWrapper").before("<canvas id='paintCanvas' width='"+width+"' height='"+height+"'></canvas>");
    $("#paintOptions-NewInput").css("display", "none");
    $("#canvasSizeDisplay").text($("#paintCanvas").height() + "px x " + $("#paintCanvas").width() + "px");
  }

  $.appendShortcut = function(title, img, exe, data = "", fontData = ""){
    desktop.append(
      "<div class='shortcut' exe='"+exe+"' data='"+data+"' dataFontFamily='"+fontData[0]+"' dataFontSize='"+fontData[1]+"'>\
        <img src='"+img+"'></img>\
        <span>"+title+"</span>\
      </div>"
    );
  }

  $.convertShortcuts = function(type){
    if (type == "absolute"){
      $.shortcutOffsets = [];
      $(".shortcut").each(function(i) {
        $.shortcutOffsets.push({
          name: $(this).text().trim(),
          left: $(this).offset().left,
          top: $(this).offset().top
        });
      });
      // //loops are separated because, if joined, the array would have incorrect position values pushed to it.
      $(".shortcut").each(function(i) {
        $(this).css("position", "absolute").css("top", $.shortcutOffsets[i]['top']).css("left", $.shortcutOffsets[i]['left']); //-10 to compensate for the 10px margin
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
            }
            if ($(this).offset().left >= $(document).width() - 80 || $(this).offset().top >= $(document).height() - 80){
              $(this).offset({ top: topPrev, left: leftPrev });
            }
          }
        }
      });
    } else if (type == "relative"){
      //Set shortcuts back to initial positions
      $.shortcutOffsets = [];
      $(".shortcut").each(function(i) {
        $(this).css("position", "relative").css("top", "initial").css("left", "initial"); //-10 to compensate for the 10px margin
        $.shortcutOffsets.push({
          name: $(this).text().trim(),
          left: $(this).offset().left,
          top: $(this).offset().top
        });
      });
    }
  }

  $.appendLink = function(title, img, exe){
    linkList.append(
      "<li class='linkListItem' exe='"+exe+"'>\
        <img src='"+img+"'></img>\
        <span>"+title+"</span>\
      </li>"
    );
  }

  $.launchApp = function(app){
    if ($.runningApps.includes(app) == false){
      body.append(
        "<div id='"+app+"' class='windowGeneric draggable'>\
          <div id='title'><img src='"+$.appInfo[app][1]+"'></img>"+$.appInfo[app][0]+"</div>\
          <div class='windowControls'>\
            <span id='btnMin'>–</span>\
            <span id='btnMax'>◻</span>\
            <span id='btnExt'>✕</span>\
          </div>\
          <div id='"+app+"Content' class='windowContent'>\
          </div>\
        </div>"
      );
      $.appLib[app](app);
      taskBar.append(
        "<div id='"+app+"Button' class='taskBarButton'>\
          <img src='"+$.appInfo[app][1]+"'></img>\
          <span>"+$.appInfo[app][0]+"</span>\
        </div>"
      );
      //control DRAG and RESIZE options
      $(".draggable").draggable({
        handle: "#title",
        containment: "document"
      });
      $(".windowGeneric").resizable({
        handles: "all",
        containment: "document",
        minHeight: 200,
        minWidth: 180
      });
      $.runningApps.push(app);
      $("#"+app).fadeIn(100);
      if ($.focusElem != "") { $.windowFocus($.focusElem, "remove"); }
      $.windowFocus(app, "add");
      $.appOpen(app);
    } else {
      console.log("app already running: " + $.runningApps);
    }
  }

  $.windowControl = function(app, action){
    if (action == "min"){
      //another check to determine if it just needs to be moved in the z-index
      if($("#" + $(app).attr("id") + "Button").hasClass("taskBarButtonFocus") == false){
        $.windowFocus($(app).attr("id"), "add");
        $.focusElem = $(app).attr("id");
      }
      $(app).fadeToggle(100);
    }
    else if (action == "max"){
      $.windowFocus($(app).attr("id"), "add");
      if ($(app).hasClass("maximizeWindow")){
        $(app).removeClass("maximizeWindow");
        $(app).find("#btnMax").html("◻");
        setTimeout(function(){
          $(app).addClass("draggable ui-draggable");
        }, 100); //delay allows the transition to apply when de-maximizing window
        $(app).resizable('enable');
      } else {
        $(app).addClass("maximizeWindow");
        $(app).find("#btnMax").html("❐");
        $(app).removeClass("draggable ui-draggable");
        $(app).resizable('disable');
      }
    }
    else if (action == "ext"){
      $(app).fadeToggle(150, function() { $(this).remove(); });
      $.runningApps.splice($.runningApps.indexOf($(app).attr("id")), 1); //removes app from running list
      $("#"+$(app).attr("id")+"Button").fadeToggle(150, function() { $(this).remove(); }).hide( "slide", { direction: "left"  }, 150 ).dequeue();
      $(".ui-effects-placeholder").remove();
      $.appClose($(app).attr("id"));
    }
    else {
      console.log("WARNING: Invalid window control action received. Action received: "+action+".");
    }
  }

  $.windowFocus = function(app, action){
    if (action == "add"){
      console.log("Focusing...");
      $.focusElem = app;
      $("#" + app + "Button").addClass("taskBarButtonFocus");
      $("#" + app + "> #title").css("color", "black");
      if ($.windowZIndex.includes(app)){
        $.windowZIndex.splice($.inArray(app, $.windowZIndex), 1);
      }
      $.windowZIndex.push(app);
      for (i = 0; i < $.windowZIndex.length; i++){
        $("#" + $.windowZIndex[i]).css("z-index", i+5);
      }
    } else if (action == "remove"){
      $("#" + app + "Button").removeClass("taskBarButtonFocus");
      $("" + app + "> #title").css("color", "darkgrey");
    }
  }

  $.appOpen = function(app){
    if (app == "appPaint"){
      $("#canvasSizeDisplay").text($("#paintCanvas").height() + "px x " + $("#paintCanvas").width() + "px");
    }
  }

  $.appClose = function(app){
    if (app == "appMusicPlayer"){
      var allAudio = $("#" + app).find("audio");
      for (i = 0; i < allAudio.length; i++){
        $.currentAudio = null;
        allAudio[i].pause();
        allAudio[i].currentTime = 0;
      }
    }
  }

  $.hexToRgb = function(hex, alpha) {
     hex   = hex.replace('#', '');
     var r = parseInt(hex.length == 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
     var g = parseInt(hex.length == 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
     var b = parseInt(hex.length == 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
     if ( alpha ) {
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
     }
     else {
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
     }
  }

  $.taskMngrUpdate = function(){
    var content = $("#appTaskManagerContent > ol");
    var runningSorted = $.runningApps.sort();
    if ($("#appTaskManagerContent > ol > li").hasClass("ui-selected") == false){
      if ($("#appTaskManager").length){
        content.empty();
        for (i = 0; i < runningSorted.length; i++){
          content.append("<li app='"+runningSorted[i]+"'>"+$.appInfo[runningSorted[i]][0]+"</li>");
        }
      } else {
        clearInterval($.interval);
      }
    }
  }

  //Generates LINKS and SHORTCUTS
  for(var i = 0; i < Object.keys($.appInfo).length; i++){
    if ($.appInfo[Object.keys($.appInfo)[i]][2] == true){
      $.appendLink($.appInfo[Object.keys($.appInfo)[i]][0], $.appInfo[Object.keys($.appInfo)[i]][1], Object.keys($.appInfo)[i]);
    }
    if ($.appInfo[Object.keys($.appInfo)[i]][3] == true){
      $.appendShortcut($.appInfo[Object.keys($.appInfo)[i]][0], $.appInfo[Object.keys($.appInfo)[i]][1], Object.keys($.appInfo)[i]);
    }
  }
  console.log("Functions loaded");
})
