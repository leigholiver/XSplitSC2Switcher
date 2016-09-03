/* globals require, Polymer */

(function()
{
  "use strict";
  var xjs = require('xjs');
  var Scene = xjs.Scene;
  var Extension = xjs.Extension.getInstance();
  
  var App = new xjs.App();
  xjs.ready().then(function() {
    function SceneSwitcher() {}

    SceneSwitcher.prototype = {
      publish: {
        isRunning   : { value: false, reflect: true },
        isInGame    : { value: false, reflect: true }
      },

      ready: function() {
        this.lastIndex = 0;
        this.sceneChangeTimeout = null;
        this.saveConfigTimeout=setTimeout(this.saveConfig.bind(this), 10*1000);
        this.populateScenes();
        xjs.ExtensionWindow.getInstance().resize(410, 260);
      },

      changeScene: function() {
        var _this = this;
        var sceneNumber;
        Scene.getActiveScene().then(function(scene) {
          scene.getSceneNumber().then(function(num) {
            sceneNumber = num;
            var xmlhttp = new XMLHttpRequest();
            if(_this.$.ip.value=='') {
                var url = "http://localhost:6119/ui";
            }
            else {
                var url = "http://"+_this.$.ip.value+":6119/ui";
            }
            xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                    var myArr = JSON.parse(this.responseText);                 
                    if(myArr.activeScreens.length>1 && _this.isInGame) { //state has changed from in game to out of game 
                        Scene.setActiveScene(Number(_this.$.outGame.selected.value)); // switch scene
                        _this.isInGame=!_this.isInGame; // update state
                    }
                    else if(myArr.activeScreens.length<=1 && !_this.isInGame) { //state has changed from out of game to in game
                       Scene.setActiveScene(Number(_this.$.inGame.selected.value));
                       _this.isInGame=!_this.isInGame;
                    }
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
            _this.sceneChangeTimeout = setTimeout(_this.changeScene.bind(_this), 1000);
          });
        });
      },

      toggleSwitcher: function(event) {
        var _this = this,
        btn = event.target;
        if (this.isRunning) {
          clearTimeout(_this.sceneChangeTimeout);
          btn.classList.remove("active");
          this.$.indicator.classList.remove("active");
          this.$.indicator.innerHTML = "INACTIVE";
        } else {
          _this.sceneChangeTimeout = setTimeout(_this.changeScene.bind(_this), 1000);
          btn.classList.add("active");
          this.$.indicator.classList.add("active");
          this.$.indicator.innerHTML = "ACTIVE";
        }

        btn.classList.add("selected");
        btn.textContent = (this.isRunning ? "Start" : "Stop");
        this.isRunning = !this.isRunning;
      },

      populateScenes: function() {
        var _this=this;
        var inGame = _this.$.inGame;
        inGame.innerHTML = '';
        var outGame = _this.$.outGame;
        outGame.innerHTML = '';
        var config = Extension.loadConfig();
        
        Scene.initializeScenes().then(function(){
          return Scene.getSceneCount();
        }).then(function(count){
          var sceneNumbers = [];
          for (var i = 0; i < count; i++) {
            sceneNumbers.push(i + 1);
          };

          // fill the in game box 
          var promises = sceneNumbers.map(function(number) {
            return new Promise(function(resolve) {
              Scene.getById(number).getName().then(function(name) {
                var option = document.createElement('xui-option');
                option.value = number;
                option.textContent = name;
                resolve(option);
              });
            });
          });

          Promise.all(promises).then(function(options) {
            for (var option in options) {
              var tmp = options[option];
              inGame.appendChild(tmp);
              
            }
          });
          
          // fill the out of game box
          var promises = sceneNumbers.map(function(number) {
            return new Promise(function(resolve) {
              Scene.getById(number).getName().then(function(name) {
                var option = document.createElement('xui-option');
                option.value = number;
                option.textContent = name;
                resolve(option);
              });
            });
          });

          Promise.all(promises).then(function(options) {
            for (var option in options) {
              var tmp = options[option];
              outGame.appendChild(tmp);
              
            }
          });
          
          // load settings from config
          Extension.loadConfig().then(function(config) {
            outGame.value = config.outGame;
            inGame.value = config.inGame;
            _this.$.ip.value = config.ip;
          });
        });
      },
      
      saveConfig: function() {
       var _this=this;
       var config= {
          'inGame': _this.$.inGame.selected.value,
          'outGame': _this.$.outGame.selected.value,
          'ip': _this.$.ip.value
        };
        Extension.saveConfig(config);
        _this.saveConfigTimeout=setTimeout(_this.saveConfig.bind(_this), 10*1000);
      }
      
    };

    Polymer.call(this, SceneSwitcher.prototype);
  });
})();
