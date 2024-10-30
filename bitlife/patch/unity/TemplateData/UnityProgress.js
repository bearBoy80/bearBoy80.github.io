const rootPath = "TemplateData56";

function UnityProgress(gameInstance, progress) {
  if (!gameInstance.Module) {
    return;
  }

  if (!gameInstance.logo) {
    gameInstance.logo = document.createElement("div");
    gameInstance.logo.className =
      "logo " + gameInstance.Module.splashScreenStyle;
    gameInstance.container.appendChild(gameInstance.logo);
  }

  if (!gameInstance.progress) {
    gameInstance.progress = document.createElement("div");
    gameInstance.progress.className =
      "progress " + gameInstance.Module.splashScreenStyle;
    gameInstance.progress.empty = document.createElement("div");
    gameInstance.progress.empty.className = "empty";
    gameInstance.progress.appendChild(gameInstance.progress.empty);
    gameInstance.progress.full = document.createElement("div");
    gameInstance.progress.full.className = "full";
    gameInstance.progress.appendChild(gameInstance.progress.full);
    gameInstance.container.appendChild(gameInstance.progress);
    gameInstance.textProgress = document.createElement("div");
    gameInstance.textProgress.className = "text";
    gameInstance.container.appendChild(gameInstance.textProgress);
  }

  gameInstance.progress.full.style.width = 100 * progress + "%";
  gameInstance.progress.empty.style.width = 100 * (1 - progress) + "%";
  gameInstance.textProgress.innerHTML = "" + Math.floor(progress * 100) + "%";

  if (progress == 1) {
    // gameInstance.textProgress.innerHTML = 'Running... <img src="' + rootPath + '/gears.gif" class="spinner" />';
    gameInstance.textProgress.innerHTML = "";
  }

  if (progress == "complete") {
    gameInstance.logo.style.display = "none";
    gameInstance.progress.style.display = "none";
    gameInstance.textProgress.style.display = "none";

    // see shared/EnableSound.js
    const event = new Event("removeSoundOverlay");
    document.dispatchEvent(event);
  }
}

window.Game = (function () {
  var Game = function () {
    this.registerEvents();
  };

  Game.prototype.registerEvents = function () {
    var _this = this;

    window.addEventListener(
      "keydown",
      function (e) {
        // space and arrow keys
        if ([8, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
          e.preventDefault();
        }
      },
      false
    );

    document.onmousedown = function () {
      window.focus();
    };

    document.addEventListener(
      "DOMContentLoaded",
      function () {
        _this.resize();
      },
      false
    );

    window.addEventListener(
      "resize",
      function () {
        setTimeout(function () {
          _this.resize();
        }, 1000);
      },
      false
    );
  };

  Game.prototype.getQueryVariable = function (variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  };

  Game.prototype.resize = function () {
    var ratioTolerant = this.getQueryVariable("ratio_tolerant");
    // 如果是全屏或不需要比例适应，直接返回
    if (ratioTolerant == false || this.fullscreen()) {
      return;
    }

    document.getElementsByTagName("body")[0].style.overflow = "hidden";
    var gameContainer =
      document.getElementById("gameContainer") ||
      document.getElementById("unityContainer");
    var canvas = document.getElementById("#canvas");

    // 获取窗口和游戏容器的尺寸
    var maxWidth = window.innerWidth;
    var maxHeight = this.maxHeight();
    var containerWidth = gameContainer.offsetWidth;
    var containerHeight = gameContainer.offsetHeight;

    // 计算比例
    var containerRatio = containerWidth / containerHeight;
    var windowRatio = maxWidth / maxHeight;

    var newStyle = {
      width: containerWidth,
      height: containerHeight,
    };

    // 根据不同的比例适应模式计算新尺寸
    if (ratioTolerant === "true") {
      // 完全填充模式
      newStyle = {
        width: maxWidth,
        height: maxHeight,
      };
    } else {
      // 保持比例模式
      if (containerRatio > windowRatio) {
        // 以宽度为基准
        newStyle.width = maxWidth;
        newStyle.height = maxWidth / containerRatio;
      } else {
        // 以高度为基准
        newStyle.height = maxHeight;
        newStyle.width = maxHeight * containerRatio;
      }
    }

    // 居中显示
    gameContainer.style.position = "absolute";
    gameContainer.style.left = "50%";
    gameContainer.style.top = "50%";
    gameContainer.style.transform = "translate(-50%, -50%)";

    // 更新尺寸
    this.updateStyle(gameContainer, newStyle);
    if (canvas) {
      this.updateStyle(canvas, newStyle);
    }
  };

  Game.prototype.maxHeight = function () {
    return window.innerHeight - 43;
  };

  Game.prototype.updateStyle = function (element, size) {
    element.setAttribute("width", size.width);
    element.setAttribute("height", size.height);
    element.style.width = size.width + "px";
    element.style.height = size.height + "px";
  };

  Game.prototype.fullscreen = function () {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  return Game;
})();

new Game();
