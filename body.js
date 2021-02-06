
      var connected = false;
      var bugHunterActive = false;
      var disconnectedWhileBugHunting = false;
      var sessionTimeout = false;
      var timer; // rename to "planTimer"
      var canvasEditor, canvasEditorMenu;
      var element = display.element
          .css('margin', 'auto')
          .attr('tabindex', 0) // so the div can receive focus

      if (platform_name == "android") {
        element
          .width(480)
          .height(800);
      }
      else {
        element
          .width(1024)
          .height(768);
      }
      display.canvas.oncontextmenu = function () { return false; } // do nothing on right click
      $('#display').append(element);

      function timesUp () {
        sessionTimeout = true;
        if (bugHunterActive) return; // display time's up message after closing bug hunter
        $('#times-up').fadeIn();
      }

      function disconnect () {
          if (socket) socket.disconnect();
          connected = false;
          if ($('#idle-timeout').is(':visible')) return;
          if ($('#times-up').is(':visible')) return;
          if ($('#limit-reached').is(':visible')) return;
          if (bugHunterActive) {
            // if we disconnect and bug hunter is active,
            // display the disconnected message only after bug hunter has been closed
            disconnectedWhileBugHunting = true;
          }
          else {
            $('#disconnected').fadeIn();
          }
          if (timer) clearInterval(timer);
      }

      var connectingTimer;
      function queueConnected (queueLength) {
        clearInterval(connectingTimer);
        if (session.plan === "free")
          $('#queue-status').text("Waiting in queue...");
        else
          $('#queue-status').text("Connecting to the browser...");
      }

      function queueDisconnected () {
          $('#queue-status').text("Disconnected");
      }

      function queueInvalidNew (reason) {
        $('#queue-error').show();
        $('#queue-error-text').text(reason);
      }

      function queueFreeLimit () {
        $('#queue').hide();
        $('#limit-reached').fadeIn();
      }

      function queueNext () {
          var currPos = $('#queue-length span.queue-position').text();
          currPos--;
          $('#queue-length span.queue-position').text(currPos);
          if (totalServers == 0) {
            // todo: queueLength undefined
            $('#queue-wait-time span.queue-wait-time').text(parseInt(queueLength * 3,10));
          }
          else {
            $('#queue-wait-time span.queue-wait-time').text(parseInt(currPos * 3/totalServers,10));
          }
      }

      function queueDecLength () {
          var currLen = $('#queue-length span.queue-length').text();
          currLen--;
          $('#queue-length span.queue-length').text(currLen);
      }

      function queueIncLength () {
          var currLen = $('#queue-length span.queue-length').text();
          currLen++;
          $('#queue-length span.queue-length').text(currLen);
      }

      var totalServers;
      function queueStart (queueLength, serverCount) {
          totalServers = serverCount;
          $('#queue-length span.queue-position').text(queueLength);
          $('#queue-length span.queue-length').text(queueLength);
          $('#queue-length').fadeIn();

          if (serverCount == 0) {
            $('#queue-wait-time span.queue-wait-time').text(parseInt(queueLength * 3,10));
          }
          else {
            $('#queue-wait-time span.queue-wait-time').text(parseInt(queueLength * 3/serverCount,10));
          }
          $('#queue-wait-time').fadeIn();
      }

      var socket;
      var availableBrowsers = {};
      function queueYourTurn (job) {
        if (session.plan == "free") {
          try {
            var audio = $('<audio id="sound-start" src="/media/start.mp3"></audio>');
            $('body').append(audio);
            $('#sound-start')[0].play();
          }
          catch (err) { }
        }
        
        queue.disconnect();

        if (session.plan == "free") {
          $('#queue-status').text("Your turn is coming up!")
        }
        else {
          $('#queue-status').text("Your browser is coming up!")
        }

        var encoderUrl;
        var encoder = job.encoder;
        if (encoder == "192.168.1.5") {
          encoderUrl = "http://192.168.1.5:3000";
        }
        else if (encoder == "127.0.0.1") {
          encoderUrl = "http://127.0.0.1:3000";
        }
        else if (encoder == "localhost") {
          encoderUrl = "http://localhost:3000";
        }
        else {
          var dashEncoder = encoder.replace(/\./g,'-')
          encoderUrl = "https://encoder-" + dashEncoder + ".myeye.com";
        }

        socket = io(
          encoderUrl,
          {
            reconnection : false
          }
        );

        socket.on('connect', function () {
          if (job.multiplexPort) {
            socket.emit('multiplexPort', job.multiplexPort);
          }
          else {
            socket.emit('confirmId', job.id, ua_browser, ua_version, browserCapabilities)
          }
        });

        socket.on('confirmedMultiplexPort', function () {
          socket.emit('confirmId', job.id, ua_browser, ua_version, browserCapabilities);
        });

        socket.on('confirmedId', function () {
          connected = true;

          if (bugHunterActive) {
            $('#bug-hunter-not-connected').fadeOut();
            canvasEditor.attach(display.canvas);
          }

          var platform_name = $('#run input[name="platform_name"]').val();
          var platform_version = $('#run input[name="platform_version"]').val();
          var browser = $('#run input[name="browser"]').val();
          var version = $('#run input[name="version"]').val();
          var url = $('#url input').val();

          socket.emit('navigate', browser, version, url);

          $('#queue').fadeOut(function () {
            $('#display').fadeIn();
          });

          var mouseMask = 0;
          var shiftMask = 0;

          var idleTimeoutTimer;
          function resetIdleTimeoutTimer () {
            clearTimeout(idleTimeoutTimer);
            idleTimeoutTimer = setTimeout(function () {
              if (connected) {
                $('#idle-timeout').show();
                socket.disconnect();
              }
            }, 2 * 3600 * 1000);
          }
          resetIdleTimeoutTimer();

          element
              .mousemove(function (ev) {
                  if (connected && !bugHunterActive) {
                    //display.element.focus();
                    var pos = calcMousePos(ev);
                    socket.emit('sendPointer', {
                      x : pos.x,
                      y : pos.y,
                      mouseMask : mouseMask
                    });
                  }
                  resetIdleTimeoutTimer();
              })
              .mousedown(function (ev) {
                  if (ev.which == 1) {
                    // left click
                    mouseMask = 1;
                  }
                  else if (ev.which == 2) {
                    // middle click
                    mouseMask = 2;
                  }
                  else if (ev.which == 3) {
                    // right click
                    mouseMask = 4;
                  }
                  else {
                    mouseMask = 1;
                  }
                  if (connected && !bugHunterActive) {
                    var pos = calcMousePos(ev);
                    socket.emit('sendPointer', {
                          x : pos.x, 
                          y : pos.y,
                          mouseMask : mouseMask
                    });
                    resetIdleTimeoutTimer();
                  }
                  ev.preventDefault();
              })
              .mouseup(function (ev) {
                  mouseMask = 0;
                  if (connected && !bugHunterActive) {
                    var pos = calcMousePos(ev);
                    socket.emit('sendPointer', {
                          x : pos.x,
                          y : pos.y,
                          mouseMask : mouseMask
                    });
                    resetIdleTimeoutTimer();
                  }
                  ev.preventDefault();
              })
              .mousewheel(function (ev, delta) {
                  var pos = calcMousePos(ev);
                  if (connected && !bugHunterActive) {
                    if (delta > 0) { // mouse up
                        socket.emit('sendPointer', {
                              x : pos.x,
                              y : pos.y,
                              mouseMask : 1 << 3
                        });
                        socket.emit('sendPointer', {
                              x : pos.x,
                              y : pos.y,
                              mouseMask : 0
                        });
                        resetIdleTimeoutTimer();
                    }
                    else {
                        socket.emit('sendPointer', {
                              x : pos.x,
                              y : pos.y,
                              mouseMask : 1 << 4
                        });
                        socket.emit('sendPointer', {
                              x : pos.x,
                              y : pos.y,
                              mouseMask : 0
                        });
                        resetIdleTimeoutTimer();
                    }
                  }
                  ev.preventDefault();
              })
          ;
          if (platform_name == "android") {
            display.resize({width:480,height:800});
          }
          else {
            display.resize({width:1024,height:768});
          }


          var lastDownTarget;
          $(document).mousemove(function (ev) {
            lastDownTarget = ev.target;
          });

          $(document)
              .keydown(function (ev) {
                  if (lastDownTarget === display.canvas) {
                    if (ev.keyCode == 16) { shiftMask = 1 }

                    if (connected && !bugHunterActive) {
                      socket.emit('sendKeyDown', {
                          keyCode : ev.keyCode,
                          shiftMask : shiftMask
                      });
                      resetIdleTimeoutTimer();
                    }
                    ev.preventDefault();
                  }
              })
              .keyup(function (ev) {
                  if (lastDownTarget === display.canvas) {
                    if (ev.keyCode == 16) { shiftMask = 0 }
                    
                    if (connected && !bugHunterActive) {
                      socket.emit('sendKeyUp', {
                          keyCode : ev.keyCode,
                          shiftMask : shiftMask
                      });
                      resetIdleTimeoutTimer();
                    }
                    ev.preventDefault();
                  }
              })
        });

        socket.on('disconnect', function () {
          disconnect();
        });

        socket.on('screenUpdate', function (update) {
          display.rawRect(update);
        });

        socket.on('copyRect', function (rect) {
          display.copyRect(rect);
        });

        socket.on('screenSize', function (size) {
          display.resize(size);
        });

        socket.on('browserList', function (browsers) {
          availableBrowsers = {};
          for (var i = 0; i < browsers.length; i++) {
            availableBrowsers[browsers[i]] = true;
          }
        });

        socket.on('timeout', function () {
          timesUp();
        });

        if (session.plan == "free") {
            var i = 1;
            var freePlanTime = job.timeout || 3*60*1000;
            timer = setInterval(function () {
                var min = parseInt(( freePlanTime/1000 - i ) / 60, 10);
                var sec = parseInt(( freePlanTime/1000 - i ) % 60, 10);
                if (min<10) min = "0" + min;
                if (sec<10) sec = "0" + sec;
                $('#timer').text(min + ":" + sec);
                i++;

                if (min == 0 && sec == 0) {
                    clearInterval(timer);
                    timesUp();
                    if (connected) {
                        socket.disconnect();
                    }
                }
            }, 1000);
        }
      }

      var platform_name = $('#run input[name="platform_name"]').val();
      var platform_version = $('#run input[name="platform_version"]').val();
      var browser = $('#run input[name="browser"]').val();
      var version = $('#run input[name="version"]').val();
      var url = $('#url input').val();

      var queueUrl = 'https://queue2.myeye.com';
      if (/192.168.1/.test(window.location.href)) {
        queueUrl = 'http://192.168.1.2:7500';
      }
      else if (/127.0.0.1/.test(window.location.href)) {
        queueUrl = 'http://127.0.0.1:7500';
      }
      else if (/localhost/.test(window.location.href)) {
        queueUrl = 'http://127.0.0.1:7500';
      }
      if (/127.0.0.1/.test(window.location.href)) {
        queueUrl = 'http://127.0.0.1:7500'
      }
      if (/localhost/.test(window.location.href)) {
        queueUrl = 'http://127.0.0.1:7500'
      }

      if (!login_or_paid_plan) {
        var queue = new Queue(
          queueUrl,
          {
            email : session.email,
            plan : session.plan,
            browser : browser,
            version : version,
            platform_name : platform_name,
            platform_version : platform_version,
            url : url
          },
          {
            connected : queueConnected,
            disconnected : queueDisconnected,
            next : queueNext,
            decQueueLength : queueDecLength,
            incQueueLength : queueIncLength,
            start : queueStart,
            invalidNew : queueInvalidNew,
            freeLimit : queueFreeLimit,
            yourTurn : queueYourTurn
          }
        );

        browseRequest(platform_name, platform_version, browser, version, url);
      }

      function calcMousePos (ev) {
        /*
          var scale = {
              x : self.size.width / self.element.width(),
              y : self.size.height / self.element.height()
          };
          var x = ev.pageX - self.element.offset().left;
          var y = ev.pageY - self.element.offset().top;
          return { x : x * scale.x, y : y * scale.y };
        */
        return {
          x : ev.pageX - element.offset().left - 2,
          y : ev.pageY - element.offset().top - 2
        };
      }
