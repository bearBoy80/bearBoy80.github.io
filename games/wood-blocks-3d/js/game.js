var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BoardShadow = /** @class */ (function () {
    function BoardShadow(boardX, boardY, parent) {
        this.enabled = true;
        this.boardX = boardX;
        this.boardY = boardY;
        this.parent = parent;
        this.mySpr = SimpleGame.myGame.add.sprite(0, 0, 'underlight_wood_block01', '', this.parent);
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            this.mySpr.x = Consts.BOARD_INIT_X_LANDSCAPE + this.boardX * Consts.BOARD_DELTA_X_LANDSCAPE;
            this.mySpr.y = Consts.BOARD_INIT_Y_LANDSCAPE + this.boardY * Consts.BOARD_DELTA_Y_LANDSCAPE;
            this.mySpr.scale.set(0.8, 0.8);
        }
        else {
            this.mySpr.x = Consts.BOARD_INIT_X_PORTRAIT + this.boardX * Consts.BOARD_DELTA_X_PORTRAIT;
            this.mySpr.y = Consts.BOARD_INIT_Y_PORTRAIT + this.boardY * Consts.BOARD_DELTA_Y_PORTRAIT;
            this.mySpr.scale.set(1, 1);
        }
        this.mySpr.visible = false;
        // this.mySpr.visible = true;
    }
    BoardShadow.initialize = function (myGroup) {
        this.boardShadow = new Array();
        var i = 8;
        while (i-- > 0) {
            var j = 8;
            while (j-- > 0) {
                var bs = new BoardShadow(i, j, myGroup);
                this.boardShadow.push(bs);
            }
        }
    };
    BoardShadow.disableAllBoardShadows = function () {
        var i = BoardShadow.boardShadow.length;
        while (i-- > 0) {
            BoardShadow.boardShadow[i].enabled = false;
        }
    };
    BoardShadow.enableAllBoardShadows = function () {
        var i = BoardShadow.boardShadow.length;
        while (i-- > 0) {
            BoardShadow.boardShadow[i].enabled = true;
        }
    };
    BoardShadow.disableBoardShadow = function (x, y) {
        var i = BoardShadow.boardShadow.length;
        while (i-- > 0) {
            var bs = BoardShadow.boardShadow[i];
            if (bs.boardX == x && bs.boardY == y) {
                bs.enabled = false;
            }
        }
    };
    BoardShadow.enableBoardShadow = function (x, y) {
        var i = BoardShadow.boardShadow.length;
        while (i-- > 0) {
            var bs = BoardShadow.boardShadow[i];
            if (bs.boardX == x && bs.boardY == y) {
                bs.enabled = true;
            }
        }
    };
    BoardShadow.clearBoardShadows = function () {
        var i = BoardShadow.boardShadow.length;
        while (i-- > 0) {
            BoardShadow.boardShadow[i].mySpr.visible = false;
        }
    };
    BoardShadow.cubeToBoardShadowCollision = function (c) {
        var cubeX = c.toGlobalCoords().x;
        var cubeY = c.toGlobalCoords().y;
        // console.log("cubeToBoardShadowCollision: " + cubeX, cubeY)
        var board_delta_x = Consts.BOARD_DELTA_X_PORTRAIT;
        var board_delta_y = Consts.BOARD_DELTA_Y_PORTRAIT;
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            board_delta_x = Consts.BOARD_DELTA_X_LANDSCAPE;
            board_delta_y = Consts.BOARD_DELTA_Y_LANDSCAPE;
        }
        // console.log(board_delta_x, board_delta_y)
        var i = this.boardShadow.length;
        while (i-- > 0) {
            var bs = BoardShadow.boardShadow[i];
            if (bs.enabled) {
                if (bs.mySpr.x - 0.0 * board_delta_x < cubeX && bs.mySpr.x + 1 * board_delta_x > cubeX) {
                    if (bs.mySpr.y - 0.0 * board_delta_y < cubeY && bs.mySpr.y + 1 * board_delta_y > cubeY) {
                        bs.mySpr.visible = true;
                        c.lastCollisionX = bs.boardX;
                        c.lastCollisionY = bs.boardY;
                        // console.log(c.lastCollisionX)
                        // console.log(c.lastCollisionY)
                        return true;
                    }
                }
            }
        }
        return false;
    };
    return BoardShadow;
}());
var BoardUtil = /** @class */ (function () {
    function BoardUtil() {
    }
    BoardUtil.revive = function () {
        do {
            var i = 12;
            while (i-- > 0) {
                this.removeOneCube();
            }
        } while (GameScreen.myref.checkIfUnlockedGroupsAvailable() == false);
    };
    BoardUtil.removeOneCube = function () {
        var i = Cube.placedCubesArray.length;
        while (i-- > 0) {
            var c = Cube.placedCubesArray[i];
            if (c != null) {
                c.remove();
                break;
            }
        }
        var i = CubeGroup.cubeGroupArr.length;
        while (i-- > 0) {
            CubeGroup.cubeGroupArr[i].checkLockedStatus();
        }
    };
    BoardUtil.shakeCubesThatCanBeRemoved = function (cubeGroup) {
        this.cubeGroup = cubeGroup;
        var i = cubeGroup.myCubeArray.length;
        while (i-- > 0) {
            var c = cubeGroup.myCubeArray[i];
            if (c.shakeActive)
                return;
            this.checkHorizontal(c.lastCollisionY, cubeGroup);
        }
        var i = cubeGroup.myCubeArray.length;
        while (i-- > 0) {
            var c = cubeGroup.myCubeArray[i];
            if (c.shakeActive)
                return;
            this.checkVertical(c.lastCollisionX, cubeGroup);
        }
        if (Cube.placedCubesArray == null)
            return;
        // SoundManager.Block_Shake.play()
        var shakeFlag = false;
        var i = Cube.placedCubesArray.length;
        while (i-- > 0) {
            var c = Cube.placedCubesArray[i];
            if (c.partOfHorizontalMatch || c.partOfVerticalMatch) {
                shakeFlag = true;
                c.shake();
            }
        }
        i = cubeGroup.myCubeArray.length;
        while (i-- > 0) {
            var c = cubeGroup.myCubeArray[i];
            if (c.partOfHorizontalMatch || c.partOfVerticalMatch) {
                shakeFlag = true;
                c.shake();
            }
        }
        if (shakeFlag) {
            SoundManager.Block_Shake.play();
        }
    };
    BoardUtil.checkVertical = function (fixedX, cubeGroup) {
        if (Cube.placedCubesArray == null)
            return;
        var j = Cube.placedCubesArray.length;
        var totalFixedY = 0;
        while (j-- > 0) {
            var c0 = Cube.placedCubesArray[j];
            if (fixedX == c0.boardX) {
                totalFixedY++;
            }
        }
        var j = cubeGroup.myCubeArray.length;
        while (j-- > 0) {
            var c0 = cubeGroup.myCubeArray[j];
            if (fixedX == c0.lastCollisionX) {
                totalFixedY++;
            }
        }
        // console.log(totalFixedY, Consts.BOARD_SIZE)
        if (totalFixedY == Consts.BOARD_SIZE) {
            //match made
            var j = Cube.placedCubesArray.length;
            var totalFixedY = 0;
            while (j-- > 0) {
                var c0 = Cube.placedCubesArray[j];
                if (fixedX == c0.boardX) {
                    c0.partOfVerticalMatch = true;
                }
            }
            var j = cubeGroup.myCubeArray.length;
            while (j-- > 0) {
                var c0 = cubeGroup.myCubeArray[j];
                if (fixedX == c0.lastCollisionX) {
                    c0.partOfVerticalMatch = true;
                    ;
                }
            }
        }
    };
    BoardUtil.checkHorizontal = function (fixedY, cubeGroup) {
        if (Cube.placedCubesArray == null)
            return;
        var j = Cube.placedCubesArray.length;
        var totalFixedY = 0;
        while (j-- > 0) {
            var c0 = Cube.placedCubesArray[j];
            if (fixedY == c0.boardY) {
                totalFixedY++;
            }
        }
        var j = cubeGroup.myCubeArray.length;
        while (j-- > 0) {
            var c0 = cubeGroup.myCubeArray[j];
            if (fixedY == c0.lastCollisionY) {
                totalFixedY++;
            }
        }
        // console.log(totalFixedY, Consts.BOARD_SIZE)
        if (totalFixedY == Consts.BOARD_SIZE) {
            //match made
            var j = Cube.placedCubesArray.length;
            var totalFixedY = 0;
            while (j-- > 0) {
                var c0 = Cube.placedCubesArray[j];
                if (fixedY == c0.boardY) {
                    c0.partOfHorizontalMatch = true;
                }
            }
            var j = cubeGroup.myCubeArray.length;
            while (j-- > 0) {
                var c0 = cubeGroup.myCubeArray[j];
                if (fixedY == c0.lastCollisionY) {
                    c0.partOfHorizontalMatch = true;
                    ;
                }
            }
        }
    };
    BoardUtil.isCollidingWithPlacedCubes = function (c) {
        if (Cube.placedCubesArray == null)
            return false;
        var i = Cube.placedCubesArray.length;
        while (i-- > 0) {
            var placedCube = Cube.placedCubesArray[i];
            if (placedCube.boardX == c.lastCollisionX && placedCube.boardY == c.lastCollisionY) {
                return true;
            }
        }
        return false;
    };
    BoardUtil.isBoardCoordFree = function (x, y) {
        if (x >= Consts.BOARD_SIZE || y >= Consts.BOARD_SIZE)
            return false;
        if (x < 0 || y < 0)
            return false;
        if (Cube.placedCubesArray == null)
            return true;
        var i = Cube.placedCubesArray.length;
        while (i-- > 0) {
            var c = Cube.placedCubesArray[i];
            if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
                if (c.boardX == x && c.boardY == y) {
                    return false;
                }
            }
            else {
                if (c.boardX == y && c.boardY == x) {
                    return false;
                }
            }
        }
        return true;
    };
    BoardUtil.getCubeGroupByPlacementIdx = function (placementIdx) {
        var i = CubeGroup.cubeGroupArr.length;
        while (i-- > 0) {
            var cg = CubeGroup.cubeGroupArr[i];
            if (cg.initialLocationIdx == placementIdx) {
                return cg;
            }
        }
        return null;
    };
    BoardUtil.canCubeGroupBePlacedOnBoard = function (cubeGroup) {
        /*if(cubeGroup.locked == true){
            return false
        }*/
        var i = Consts.BOARD_SIZE;
        while (i-- > 0) {
            var j = Consts.BOARD_SIZE;
            while (j-- > 0) {
                if (this.canCubeGroupBePlacedOnCoord(cubeGroup, i, j)){
                    return true;
                }
                    
            }
        }
        return false;
    };
    BoardUtil.canCubeGroupBePlacedOnCoord = function (cubeGroup, x, y) {
        var cType = cubeGroup.myGroupType;
        if (cType == Consts.GROUP_TYPE_SINGLE_CUBE) {
            return this.isBoardCoordFree(x, y);
        }
        else if (cType == Consts.GROUP_TYPE_DUO_CUBE_HORIZONTAL) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y));
        }
        else if (cType == Consts.GROUP_TYPE_DUO_CUBE_VERTICAL) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x, y + 1));
        }
        else if (cType == Consts.GROUP_TYPE_TRIO_CUBE_HORIZONTAL) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 2, y));
        }
        else if (cType == Consts.GROUP_TYPE_TRIO_CUBE_VERTICAL) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x, y + 1) && this.isBoardCoordFree(x, y + 2));
        }
        else if (cType == Consts.GROUP_TYPE_QUATRO_CUBE_HORIZONTAL) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 2, y) && this.isBoardCoordFree(x + 3, y));
        }
        else if (cType == Consts.GROUP_TYPE_QUATRO_CUBE_VERTICAL) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x, y + 1) && this.isBoardCoordFree(x, y + 2) && this.isBoardCoordFree(x, y + 3));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_CUBE_1) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 2, y) && this.isBoardCoordFree(x + 2, y - 1));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_CUBE_2) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 2, y) && this.isBoardCoordFree(x, y - 1));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_CUBE_3) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 1, y - 1) && this.isBoardCoordFree(x + 1, y - 2));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_CUBE_4) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x, y - 1) && this.isBoardCoordFree(x, y - 2));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_CUBE_CUBIC) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 1, y + 1) && this.isBoardCoordFree(x, y + 1));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_1) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 1, y + 1) && this.isBoardCoordFree(x + 2, y));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_2) {
            return (this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 1, y + 1) && this.isBoardCoordFree(x + 1, y + 2) && this.isBoardCoordFree(x, y + 1));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_3) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 2, y) && this.isBoardCoordFree(x + 1, y - 1));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_4) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x, y + 1) && this.isBoardCoordFree(x, y + 2) && this.isBoardCoordFree(x + 1, y + 1));
        }
        else if (cType == Consts.GROUP_TYPE_TETRIS_CUBE_BIG_CUBE) {
            return (this.isBoardCoordFree(x, y) && this.isBoardCoordFree(x, y + 1) && this.isBoardCoordFree(x, y + 2) && this.isBoardCoordFree(x + 1, y) && this.isBoardCoordFree(x + 1, y + 1) && this.isBoardCoordFree(x + 1, y + 2) && this.isBoardCoordFree(x + 2, y) && this.isBoardCoordFree(x + 2, y + 1) && this.isBoardCoordFree(x + 2, y + 2));
        }
    };
    return BoardUtil;
}());
var ComboText = /** @class */ (function () {
    function ComboText(actualCombo) {
        if (actualCombo === void 0) { actualCombo = false; }
        var myIdx = Math.floor(Math.random() * ComboText.nameArr.length);
        var sound = SoundManager.LineBreaks;
        SimpleGame.myGame.time.events.add(100, function () {
            sound.play();
        }.bind(this), this);
        ComboText.soundArr = [SoundManager.Amazing, SoundManager.Awesome, SoundManager.Boss, SoundManager.Easy, SoundManager.Fantastic, SoundManager.Insane, SoundManager.Genius, SoundManager.Great];
        var sound1 = ComboText.soundArr[myIdx];
        if (actualCombo == false) {
            return;
        }
        SimpleGame.myGame.time.events.add(100, function () {
            sound1.play();
        }.bind(this), this);
        this.mySpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, ResizeManager.INTERNAL_GAME_HEIGHT / 2, ComboText.nameArr[myIdx], '', GameScreen.myref.layerMovingGroups);
        this.mySpr.anchor.set(0.5, 0.5);
        this.mySpr.scale.set(1, 1);
        this.mySpr.alpha = 0;
        this.tweenArr = [];
        var tween1 = SimpleGame.myGame.add.tween(this.mySpr).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
        var tween2 = SimpleGame.myGame.add.tween(this.mySpr.scale).to({ x: 1.3, y: 1.3 }, 500, Phaser.Easing.Linear.None, true);
        this.tweenArr.push(tween1);
        this.tweenArr.push(tween2);
        SimpleGame.myGame.time.events.add(1300, function () {
            SimpleGame.myGame.add.tween(this.mySpr).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
        }, this);
        this.starIconArr = [];
        var i = 6;
        while (i-- > 0) {
            this.addStar();
        }
        SimpleGame.myGame.time.events.add(2500, this.remove, this);
    }
    ComboText.prototype.remove = function () {
        this.mySpr.destroy();
        var i = this.tweenArr.length;
        while (i-- > 0) {
            SimpleGame.myGame.tweens.remove(this.tweenArr[i]);
        }
        i = this.starIconArr.length;
        while (i-- > 0) {
            this.starIconArr[i].destroy();
        }
    };
    ComboText.prototype.addStar = function () {
        var x = ResizeManager.INTERNAL_GAME_WIDTH / 2 - 500 + 1000 * Math.random();
        var y = ResizeManager.INTERNAL_GAME_HEIGHT / 2 - 500 + 1000 * Math.random();
        var starIcon = SimpleGame.myGame.add.sprite(x, y, 'star_icon01', '', GameScreen.myref.layerMovingGroups);
        starIcon.angle = Math.random() * 360;
        starIcon.alpha = 0;
        starIcon.scale.set(Math.random() * 0.5 + 0.5);
        var tween3 = SimpleGame.myGame.add.tween(starIcon).to({ y: '-30' }, 1500, Phaser.Easing.Linear.None, true, 300);
        var tween4 = SimpleGame.myGame.add.tween(starIcon).to({ alpha: 1 }, 600, Phaser.Easing.Linear.None, true, 0, 0, true);
        this.tweenArr.push(tween3);
        this.tweenArr.push(tween4);
        this.starIconArr.push(starIcon);
    };
    ComboText.createCombo = function (piecesTotal) {
        if (piecesTotal > 0) {
            if (piecesTotal > 8) {
                var c = new ComboText(true);
            }
            else {
                var c = new ComboText();
                if (GameContext.allPiecesRemovedThisSession > 20) {
                    SimpleGame.myGame.time.events.add(500, function () {
                        GameContext.commercialBreak();
                    }, this);
                }
            }
            GameUITop.myref.scoreAnimation();
        }
    };
    ComboText.nameArr = ["combotext_1", "combotext_2", "combotext_3", "combotext_9", "combotext_10", "combotext_12", "combotext_4", "combotext_5"];
    return ComboText;
}());
var Consts = /** @class */ (function () {
    function Consts() {
    }
    Consts.COOKIE_NAME_THEME_INDEX = "woodblocks3dcnamethemeidx";
    Consts.COOKIE_NAME_BEST_SCORE = "woodblocks3dnamebestscore";
    Consts.COOKIE_NAME_TUTORIAL_PLAYED = "cookie name tut played";
    Consts.GROUP_TYPE_SINGLE_CUBE = 0;
    Consts.GROUP_TYPE_DUO_CUBE_HORIZONTAL = 1;
    Consts.GROUP_TYPE_DUO_CUBE_VERTICAL = 2;
    Consts.GROUP_TYPE_TRIO_CUBE_HORIZONTAL = 3;
    Consts.GROUP_TYPE_TRIO_CUBE_VERTICAL = 4;
    Consts.GROUP_TYPE_QUATRO_CUBE_HORIZONTAL = 5;
    Consts.GROUP_TYPE_QUATRO_CUBE_VERTICAL = 6;
    Consts.GROUP_TYPE_TETRIS_CUBE_1 = 7;
    Consts.GROUP_TYPE_TETRIS_CUBE_2 = 8;
    Consts.GROUP_TYPE_TETRIS_CUBE_3 = 9;
    Consts.GROUP_TYPE_TETRIS_CUBE_4 = 10;
    Consts.GROUP_TYPE_TETRIS_CUBE_CUBIC = 11;
    Consts.GROUP_TYPE_TETRIS_T_SHAPED_1 = 12;
    Consts.GROUP_TYPE_TETRIS_T_SHAPED_2 = 13;
    Consts.GROUP_TYPE_TETRIS_T_SHAPED_3 = 14;
    Consts.GROUP_TYPE_TETRIS_T_SHAPED_4 = 15;
    Consts.GROUP_TYPE_TETRIS_CUBE_BIG_CUBE = 16;
    Consts.INITIAL_LOCATION_1_X_PORTRAIT = 280;
    Consts.INITIAL_LOCATION_1_Y_PORTRAIT = 1480;
    Consts.INITIAL_LOCATION_2_X_PORTRAIT = 600;
    Consts.INITIAL_LOCATION_2_Y_PORTRAIT = 1480;
    Consts.INITIAL_LOCATION_3_X_PORTRAIT = 920;
    Consts.INITIAL_LOCATION_3_Y_PORTRAIT = 1480;
    Consts.INITIAL_LOCATION_1_X_LANDSCAPE = 1590;
    Consts.INITIAL_LOCATION_1_Y_LANDSCAPE = 300;
    Consts.INITIAL_LOCATION_2_X_LANDSCAPE = 1590;
    Consts.INITIAL_LOCATION_2_Y_LANDSCAPE = 550;
    Consts.INITIAL_LOCATION_3_X_LANDSCAPE = 1590;
    Consts.INITIAL_LOCATION_3_Y_LANDSCAPE = 800;
    Consts.BOARD_INIT_X_PORTRAIT = 104;
    Consts.BOARD_INIT_Y_PORTRAIT = 505 - 130;
    Consts.BOARD_DELTA_X_PORTRAIT = 124;
    Consts.BOARD_DELTA_Y_PORTRAIT = 124;
    Consts.BOARD_INIT_X_LANDSCAPE = 585;
    Consts.BOARD_INIT_Y_LANDSCAPE = 133;
    Consts.BOARD_DELTA_X_LANDSCAPE = 96;
    Consts.BOARD_DELTA_Y_LANDSCAPE = 96;
    Consts.BOARD_SIZE = 8;
    Consts.SCORE_PER_GROUP = 20;
    Consts.THEME_NAME_ARRAY = ["wood_black01", "wood_carved01", "wood_dark01", "wood_exotic01", "wood_light01", "wood_mix01", "wood_blue01"];
    Consts.THEME_BLOCK_NAME_ARRAY = ["greydark_wood_block01b", "cravedbrown_wood_block01b", "A_light_wood_block02", "A_light_wood_block02", "A_light_wood_block02", "A_light_wood_block02", "blue_wood_block01"];
    Consts.ORIENTATION_LANDSCAPE = 0;
    Consts.ORIENTATION_PORTRAIT = 1;
    Consts.POWERUP_ROTATE = 0;
    Consts.POWERUP_EXPLODE = 1;
    Consts.LEVEL_SCORE_FIXED = 3000;
    Consts.LEVEL_SCORE_DELTA = 300;
    Consts.COOKIE_SOUND_FLAG = "cookiesoundflaggame1123";
    Consts.COOKIE_VOICE_FLAG = "cookievoiceflaggame232";
    Consts.COOKIE_NAME_CURRENT_SCORE = "cookienamecurrentscore";
    Consts.COOKIE_NAME_CURRENT_LEVEL = "COOKIE_NAME_CURRENT_LEVEL";
    Consts.COOKIE_NAME_EXPLODE_PWR_COUNT = "COOKIE_NAME_EXPLODE_PWR_COUNT";
    Consts.COOKIE_NAME_ROTATE_PWR_COUNT = "COOKIE_NAME_ROTATE_PWR_COUNT";
    return Consts;
}());
var Cube = /** @class */ (function () {
    function Cube(myGroupX, myGroupY, myContainer, myCubeGroup) {
        this.shakeActive = false;
        this.fixedFlag = false;
        this.partOfHorizontalMatch = false;
        this.partOfVerticalMatch = false;
        this.myGroupX = myGroupX;
        this.myGroupY = myGroupY;
        this.myCubeGroup = myCubeGroup;
        this.myContainer = myContainer;
        this.changeCubeSpr();
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            this.cubeSpr.width = Consts.BOARD_DELTA_X_PORTRAIT;
            this.cubeSpr.height = Consts.BOARD_DELTA_X_PORTRAIT;
        }
        else {
            this.cubeSpr.width = Consts.BOARD_DELTA_X_LANDSCAPE;
            this.cubeSpr.height = Consts.BOARD_DELTA_X_LANDSCAPE;
        }
        this.cubeSpr.x = myGroupX * this.cubeSpr.width;
        this.cubeSpr.y = myGroupY * this.cubeSpr.height;
        this.cubeSprClickable.x = myGroupX * this.cubeSpr.width;
        this.cubeSprClickable.y = myGroupY * this.cubeSpr.height;
        this.cubeSprClickable.inputEnabled = true;
        this.cubeSprClickable.events.onInputDown.add(this.cubeGrupSelected, this);
        this.cubeSprClickable.events.onInputUp.add(this.cubeGrupDeselected, this);
        this.cubeSprClickable.anchor.set(0.5, 0.5);
        this.cubeSpr.anchor.set(0.5, 0.5);
        this.blockedSprite = SimpleGame.myGame.add.sprite(0, 0, 'Locked', '', this.myContainer);
        this.blockedSprite.x = this.cubeSpr.x;
        this.blockedSprite.y = this.cubeSpr.y;
        this.blockedSprite.anchor.set(0.5, 0.5);
        this.blockedSprite.inputEnabled = true;
        this.blockedSprite.events.onInputDown.add(this.cubeGrupSelected, this);
        this.blockedSprite.events.onInputUp.add(this.cubeGrupDeselected, this);
        this.blockedSprite.scale.set(0.8);
    }
    Cube.createCubeAt = function (x, y) {
        // console.log("create cube at called: " + x, y)
        var c = new Cube(0, 0, GameScreen.myref.layerBoard, null);
        c.lastCollisionX = x;
        c.lastCollisionY = y;
        if (Cube.placedCubesArray == null) {
            Cube.placedCubesArray = [];
        }
        c.setToLastCollisionCoords();
        c.blockedSprite.destroy();
        // console.log("cube arr:" + Cube.placedCubesArray.length)
    };
    Cube.prototype.switchXandY = function () {
        var temp = this.myGroupX;
        this.myGroupX = this.myGroupY;
        this.myGroupY = temp;
        this.cubeSpr.x = this.myGroupX * this.cubeSpr.width;
        this.cubeSpr.y = this.myGroupY * this.cubeSpr.height;
        this.blockedSprite.x = this.cubeSpr.x;
        this.blockedSprite.y = this.cubeSpr.y;
    };
    Cube.removeAll = function () {
        console.log("remove all placed cubes started");
        if (Cube.placedCubesArray == null)
            return;
        var i = Cube.placedCubesArray.length;
        while (i-- > 0) {
            Cube.placedCubesArray[i].remove();
        }
        Cube.placedCubesArray = new Array();
        console.log("remove all placed cubes completed");
    };
    Cube.themeChanged = function () {
        // console.log("theme changed")
        if (Cube.placedCubesArray == null) {
        }
        else {
            var i = Cube.placedCubesArray.length;
            while (i-- > 0) {
                Cube.placedCubesArray[i].changeCubeSpr(true);
            }
        }
        var i = CubeGroup.cubeGroupArr.length;
        while (i-- > 0) {
            var cg = CubeGroup.cubeGroupArr[i];
            var j = cg.myCubeArray.length;
            while (j-- > 0) {
                cg.myCubeArray[j].changeCubeSpr(false);
            }
        }
    };
    Cube.prototype.shake = function () {
        this.partOfHorizontalMatch = false;
        this.partOfVerticalMatch = false;
        this.shakeActive = true;
        // console.log("start shake: " + this.boardY)
        if (this.fixedFlag) {
            if (this.boardY % 2 == 1) {
                SimpleGame.myGame.add.tween(this.cubeSpr).to({ angle: 10 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 2, true);
            }
            else {
                SimpleGame.myGame.add.tween(this.cubeSpr).to({ angle: -10 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 2, true);
            }
        }
        else {
            if (this.lastCollisionY % 2 == 1) {
                SimpleGame.myGame.add.tween(this.cubeSpr).to({ angle: 10 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 2, true);
            }
            else {
                SimpleGame.myGame.add.tween(this.cubeSpr).to({ angle: -10 }, 100, Phaser.Easing.Sinusoidal.InOut, true, 0, 2, true);
            }
        }
        SimpleGame.myGame.time.events.add(300, function () {
            // console.log("stop shake active")
            this.shakeActive = false;
            this.cubeSpr.angle = 0;
        }.bind(this), this);
    };
    Cube.prototype.changeCubeSpr = function (fixedCubes) {
        if (fixedCubes === void 0) { fixedCubes = false; }
        // console.log("change cube spr")
        if (this.cubeSpr != null) {
            // console.log("cube spr changed")
            var oldX = this.cubeSpr.x;
            var oldY = this.cubeSpr.y;
            var oldscale = this.cubeSpr.scale.x;
            var container = this.cubeSpr.parent;
            this.cubeSpr.destroy();
            if (fixedCubes) {
                this.cubeSpr = SimpleGame.myGame.add.sprite(oldX, oldY, Consts.THEME_BLOCK_NAME_ARRAY[GameContext.selectedTheme], '', GameScreen.myref.layerFixedCubes);
                this.cubeSprClickable = SimpleGame.myGame.add.sprite(oldX, oldY, Consts.THEME_BLOCK_NAME_ARRAY[GameContext.selectedTheme], '', GameScreen.myref.layerFixedCubes);
            }
            else {
                this.cubeSpr = SimpleGame.myGame.add.sprite(oldX, oldY, Consts.THEME_BLOCK_NAME_ARRAY[GameContext.selectedTheme], '', this.myContainer);
                this.cubeSprClickable = SimpleGame.myGame.add.sprite(oldX, oldY, Consts.THEME_BLOCK_NAME_ARRAY[GameContext.selectedTheme], '', this.myContainer);
            }
            this.cubeSpr.scale.set(oldscale);
        }
        else {
            this.cubeSpr = SimpleGame.myGame.add.sprite(0, 0, Consts.THEME_BLOCK_NAME_ARRAY[GameContext.selectedTheme], '', this.myContainer);
            this.cubeSprClickable = SimpleGame.myGame.add.sprite(0, 0, Consts.THEME_BLOCK_NAME_ARRAY[GameContext.selectedTheme], '', this.myContainer);
        }
        this.cubeSprClickable.inputEnabled = true;
        this.cubeSprClickable.events.onInputDown.add(this.cubeGrupSelected, this);
        this.cubeSprClickable.events.onInputUp.add(this.cubeGrupDeselected, this);
        this.cubeSprClickable.anchor.set(0.5, 0.5);
        this.cubeSprClickable.scale.set(3, 3);
        this.cubeSprClickable.alpha = 0.00000000004;
        // this.cubeSpr.visible = false
    };
    Cube.prototype.lockCube = function () {
        this.cubeSpr.visible = false;
        this.blockedSprite.visible = true;
        this.cubeSprClickable.visible = false;
    };
    Cube.prototype.unlockCube = function () {
        this.cubeSpr.visible = true;
        this.cubeSprClickable.visible = true;
        this.blockedSprite.visible = false;
    };
    Cube.prototype.matchMade = function () {
        // console.log("added cube anim: " + this.cubeSpr.x, this.cubeSpr.y)
        var canim = new CubeAnimation(GameScreen.myref.layerUITop, this.cubeSpr.x, this.cubeSpr.y);
        this.remove();
        if (GameContext.tutorialActive == false) {
            GameContext.score += Consts.SCORE_PER_GROUP;
        }
    };
    Cube.prototype.remove = function () {
        if (Cube.placedCubesArray != null) {
            if (Cube.placedCubesArray.indexOf(this) > -1) {
                Cube.placedCubesArray.splice(Cube.placedCubesArray.indexOf(this), 1);
            }
        }
        this.cubeSprClickable.destroy();
        this.cubeSpr.destroy();
        this.blockedSprite.destroy();
    };
    Cube.prototype.cubeGrupDeselected = function () {
        BoardShadow.clearBoardShadows();
        if (this.myCubeGroup != null) {
            this.myCubeGroup.dragEnded();
        }
    };
    Cube.prototype.cubeGrupSelected = function () {
        if (this.fixedFlag)
            return;
        this.myCubeGroup.dragStarted(this.blockedSprite.visible, Util.pointerCoordsToGameCoords().x, Util.pointerCoordsToGameCoords().y);
        GameContext.gameplayStarted();
    };
    Cube.prototype.toGlobalCoords = function () {
        var retP = new Phaser.Point(this.cubeSpr.x + this.myContainer.x, this.cubeSpr.y + this.myContainer.y);
        return retP;
    };
    Cube.prototype.setToLastCollisionCoords = function () {
        if (Cube.placedCubesArray == null) {
            Cube.placedCubesArray = new Array();
        }
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            this.cubeSpr.x = Consts.BOARD_INIT_X_LANDSCAPE + (0.5 + this.lastCollisionX) * Consts.BOARD_DELTA_X_LANDSCAPE;
            this.cubeSpr.y = Consts.BOARD_INIT_Y_LANDSCAPE + (0.5 + this.lastCollisionY) * Consts.BOARD_DELTA_Y_LANDSCAPE;
        }
        else {
            this.cubeSpr.x = Consts.BOARD_INIT_X_PORTRAIT + (0.5 + this.lastCollisionX) * Consts.BOARD_DELTA_X_PORTRAIT;
            this.cubeSpr.y = Consts.BOARD_INIT_Y_PORTRAIT + (0.5 + this.lastCollisionY) * Consts.BOARD_DELTA_Y_PORTRAIT;
            console.log("cubespry: " + this.cubeSpr.y);
        }
        this.cubeSpr.x = Math.ceil(this.cubeSpr.x);
        this.cubeSpr.y = Math.ceil(this.cubeSpr.y);
        GameScreen.myref.layerFixedCubes.add(this.cubeSpr);
        this.boardX = this.lastCollisionX;
        this.boardY = this.lastCollisionY;
        this.cubeSprClickable.visible = false;
        this.fixedFlag = true;
        Cube.placedCubesArray.push(this);
        // console.log("placed to: " + this.boardX, this.boardY )
    };
    return Cube;
}());
var CubeAnimation = /** @class */ (function () {
    function CubeAnimation(parent, x, y) {
        this.vy = -5;
        this.ay = 0.75;
        // return
        this.ay = (0.75 + 0.25 * Math.random()) / 3;
        this.frameSequence = new FrameSequence(CubeAnimation.fsNameArray, x, y, 50, null, parent);
        this.frameSequence.start();
        this.vx = Math.random() * 5;
        if (Math.random() < 0.5) {
            this.vx *= -1;
        }
        this.loopTimer = SimpleGame.myGame.time.events.loop(5, this.update, this);
    }
    CubeAnimation.prototype.update = function () {
        var mult = SimpleGame.myGame.time.desiredFps / SimpleGame.myGame.time.fps;
        this.frameSequence.y += (this.vy * (mult));
        this.vy += (this.ay * (mult));
        if (this.vy > 60 || this.frameSequence.y > ResizeManager.INTERNAL_GAME_HEIGHT) {
            this.remove();
        }
        else {
            this.vx *= 0.99;
            this.frameSequence.x += this.vx;
        }
    };
    CubeAnimation.prototype.remove = function () {
        this.frameSequence.remove();
        SimpleGame.myGame.time.events.remove(this.loopTimer);
    };
    return CubeAnimation;
}());
var CubeGroup = /** @class */ (function () {
    function CubeGroup(myGroupType, parent, initialLocationIdx, skipTween) {
        if (skipTween === void 0) { skipTween = false; }
        this.dragActiveFlag = false;
        this.successfullPlacementFlag = false;
        this.locked = false;
        if (CubeGroup.cubeGroupArr == null) {
            CubeGroup.cubeGroupArr = [];
        }
        CubeGroup.cubeGroupArr.push(this);
        this.parent = parent;
        this.myGroupType = myGroupType;
        this.myContainer = SimpleGame.myGame.add.group(parent);
        this.myCubeArray = new Array();
        this.initialLocationIdx = initialLocationIdx;
        if (this.myGroupType == Consts.GROUP_TYPE_SINGLE_CUBE) {
            var c0 = new Cube(0, 0, this.myContainer, this);
            this.myCubeArray.push(c0);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_DUO_CUBE_HORIZONTAL) {
            var c0 = new Cube(-0.5, 0, this.myContainer, this);
            var c1 = new Cube(0.5, 0, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_DUO_CUBE_VERTICAL) {
            var c0 = new Cube(0, 0.5, this.myContainer, this);
            var c1 = new Cube(0, -0.5, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TRIO_CUBE_HORIZONTAL) {
            var c0 = new Cube(-1, 0, this.myContainer, this);
            var c1 = new Cube(0, 0, this.myContainer, this);
            var c2 = new Cube(1, 0, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TRIO_CUBE_VERTICAL) {
            var c0 = new Cube(0, -1, this.myContainer, this);
            var c1 = new Cube(0, 0, this.myContainer, this);
            var c2 = new Cube(0, 1, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_QUATRO_CUBE_HORIZONTAL) {
            var c0 = new Cube(-1.5, 0, this.myContainer, this);
            var c1 = new Cube(-0.5, 0, this.myContainer, this);
            var c2 = new Cube(0.5, 0, this.myContainer, this);
            var c3 = new Cube(1.5, 0, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_QUATRO_CUBE_VERTICAL) {
            var c0 = new Cube(0, -1.5, this.myContainer, this);
            var c1 = new Cube(0, -0.5, this.myContainer, this);
            var c2 = new Cube(0, 0.5, this.myContainer, this);
            var c3 = new Cube(0, 1.5, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_1) {
            var c0 = new Cube(-1, 0.5, this.myContainer, this);
            var c1 = new Cube(0, 0.5, this.myContainer, this);
            var c2 = new Cube(1, 0.5, this.myContainer, this);
            var c3 = new Cube(1, -0.5, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_2) {
            var c0 = new Cube(-1, -0.5, this.myContainer, this);
            var c1 = new Cube(0, 0.5, this.myContainer, this);
            var c2 = new Cube(1, 0.5, this.myContainer, this);
            var c3 = new Cube(-1, 0.5, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_3) {
            var c0 = new Cube(-0.5, -1, this.myContainer, this);
            var c1 = new Cube(0.5, -1, this.myContainer, this);
            var c2 = new Cube(0.5, 0, this.myContainer, this);
            var c3 = new Cube(0.5, 1, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_4) {
            var c0 = new Cube(-0.5, 1, this.myContainer, this);
            var c1 = new Cube(0.5, 1, this.myContainer, this);
            var c2 = new Cube(-0.5, 0, this.myContainer, this);
            var c3 = new Cube(-0.5, -1, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_CUBIC) {
            var c0 = new Cube(-0.5, -0.5, this.myContainer, this);
            var c1 = new Cube(0.5, -0.5, this.myContainer, this);
            var c2 = new Cube(-0.5, 0.5, this.myContainer, this);
            var c3 = new Cube(0.5, 0.5, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_1) {
            var c0 = new Cube(-1, -0.5, this.myContainer, this);
            var c1 = new Cube(0, -0.5, this.myContainer, this);
            var c2 = new Cube(0, 0.5, this.myContainer, this);
            var c3 = new Cube(1, -0.5, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_2) {
            var c0 = new Cube(0.5, -1, this.myContainer, this);
            var c1 = new Cube(0.5, 0, this.myContainer, this);
            var c3 = new Cube(0.5, 1, this.myContainer, this);
            var c2 = new Cube(-0.5, 0, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_3) {
            var c0 = new Cube(-1, 0.5, this.myContainer, this);
            var c1 = new Cube(0, 0.5, this.myContainer, this);
            var c3 = new Cube(1, 0.5, this.myContainer, this);
            var c2 = new Cube(0, -0.5, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_4) {
            var c0 = new Cube(-0.5, -1, this.myContainer, this);
            var c1 = new Cube(-0.5, 0, this.myContainer, this);
            var c3 = new Cube(-0.5, 1, this.myContainer, this);
            var c2 = new Cube(0.5, 0, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
        }
        else if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_BIG_CUBE) {
            var c0 = new Cube(-1, -1, this.myContainer, this);
            var c1 = new Cube(-1, -0, this.myContainer, this);
            var c2 = new Cube(-1, 1, this.myContainer, this);
            var c3 = new Cube(0, -1, this.myContainer, this);
            var c4 = new Cube(0, -0, this.myContainer, this);
            var c5 = new Cube(0, 1, this.myContainer, this);
            var c6 = new Cube(1, -1, this.myContainer, this);
            var c7 = new Cube(1, -0, this.myContainer, this);
            var c8 = new Cube(1, 1, this.myContainer, this);
            this.myCubeArray.push(c0);
            this.myCubeArray.push(c1);
            this.myCubeArray.push(c2);
            this.myCubeArray.push(c3);
            this.myCubeArray.push(c4);
            this.myCubeArray.push(c5);
            this.myCubeArray.push(c6);
            this.myCubeArray.push(c7);
            this.myCubeArray.push(c8);
        }
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            if (this.initialLocationIdx == 0) {
                this.myContainer.x = Consts.INITIAL_LOCATION_1_X_LANDSCAPE;
                this.myContainer.y = Consts.INITIAL_LOCATION_1_Y_LANDSCAPE;
            }
            else if (this.initialLocationIdx == 1) {
                this.myContainer.x = Consts.INITIAL_LOCATION_2_X_LANDSCAPE;
                this.myContainer.y = Consts.INITIAL_LOCATION_2_Y_LANDSCAPE;
            }
            else if (this.initialLocationIdx == 2) {
                this.myContainer.x = Consts.INITIAL_LOCATION_3_X_LANDSCAPE;
                this.myContainer.y = Consts.INITIAL_LOCATION_3_Y_LANDSCAPE;
            }
        }
        else {
            if (this.initialLocationIdx == 0) {
                this.myContainer.x = Consts.INITIAL_LOCATION_1_X_PORTRAIT;
                this.myContainer.y = Consts.INITIAL_LOCATION_1_Y_PORTRAIT;
            }
            else if (this.initialLocationIdx == 1) {
                this.myContainer.x = Consts.INITIAL_LOCATION_2_X_PORTRAIT;
                this.myContainer.y = Consts.INITIAL_LOCATION_2_Y_PORTRAIT;
            }
            else if (this.initialLocationIdx == 2) {
                this.myContainer.x = Consts.INITIAL_LOCATION_3_X_PORTRAIT;
                this.myContainer.y = Consts.INITIAL_LOCATION_3_Y_PORTRAIT;
            }
        }
        this.initTweenDelta = 1500;
        this.initialLocationX = this.myContainer.x;
        this.initialLocationY = this.myContainer.y;
        if (skipTween == false) {
            this.myContainer.x += this.initTweenDelta;
            SimpleGame.myGame.add.tween(this.myContainer).to({ x: this.initialLocationX }, 400, Phaser.Easing.Linear.None, true);
        }
        this.updateTimer = SimpleGame.myGame.time.events.loop(15, this.update, this);
        this.updateTimerPreview = SimpleGame.myGame.time.events.loop(800, this.updateSecond, this);
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            this.rotateBy90();
            if (GameScreen.myref.checkIfUnlockedGroupsAvailable() == false) {
                if (Tutorial.myState == Tutorial.STATE_STEP_3)
                    return;
                if (GameContext.tutorialActive)
                    return;
                if(GameContext.explodePowerupsCount == 0 && GameContext.rotatePowerupsCount == 0) {
                    var outofmoves = new OutOfMovesPrompt(GameScreen.myref.layerUITop);
                }
            }
        };
        this.setScale(0.4);
    }
    CubeGroup.prototype.rotateBy90 = function () {
        var i = this.myCubeArray.length;
        while (i-- > 0) {
            this.myCubeArray[i].switchXandY();
        }
    };
    CubeGroup.removeAll = function () {
        // console.log("remove all cube groups")
        if (CubeGroup.cubeGroupArr == null)
            return;
        var i = CubeGroup.cubeGroupArr.length;
        while (i-- > 0) {
            CubeGroup.cubeGroupArr[i].remove(true);
        }
        CubeGroup.cubeGroupArr = [];
        //    console.log("remove all cube groups completed")
    };
    CubeGroup.prototype.remove = function (skipGroupCheck) {
        if (skipGroupCheck === void 0) { skipGroupCheck = false; }
        this.successfullPlacementFlag = true;
        SimpleGame.myGame.time.events.remove(this.updateTimer);
        SimpleGame.myGame.time.events.remove(this.updateTimerPreview);
        var i = this.myCubeArray.length;
        while (i-- > 0) {
            this.myCubeArray[i].remove();
        }
        CubeGroup.cubeGroupArr.splice(CubeGroup.cubeGroupArr.indexOf(this), 1);
        // console.log("cube arr len: " + CubeGroup.cubeGroupArr.length)
        if (!skipGroupCheck) {
            GameScreen.myref.checkIfAllGroupsPlaced();
        }
    };
    CubeGroup.prototype.lock = function () {
        var i = this.myCubeArray.length;
        while (i-- > 0) {
            this.myCubeArray[i].lockCube();
        }
        this.locked = true;
    };
    CubeGroup.prototype.unlock = function () {
        var i = this.myCubeArray.length;
        while (i-- > 0) {
            this.myCubeArray[i].unlockCube();
        }
        this.locked = false;
    };
    CubeGroup.prototype.updateSecond = function () {
        if (this.dragActiveFlag) {
            this.previewDragEnded();
        }
    };
    CubeGroup.prototype.update = function () {
        var pointerX = Util.pointerCoordsToGameCoords().x;
        var pointerY = Util.pointerCoordsToGameCoords().y;
        if (this.dragActiveFlag) {
            var deltaX = this.dragActiveInitPoint.x - pointerX;
            var deltaY = this.dragActiveInitPoint.y - pointerY;
            if (SimpleGame.myGame.device.touch) {
                deltaY += 200;
                var i = this.myCubeArray.length;
                while (i-- > 0) {
                    var c = this.myCubeArray[i];
                    // console.log("c.mygroupy: " + c.myGroupY)
                    if (c.myGroupY < -0.5) {
                        deltaY += 100;
                    }
                }
                // console.log(deltaY)
            }
            this.myContainer.x = this.initialCubeGroupPoint.x - deltaX;
            this.myContainer.y = this.initialCubeGroupPoint.y - deltaY;
            BoardShadow.clearBoardShadows();
            var i = this.myCubeArray.length;
            while (i-- > 0) {
                var c = this.myCubeArray[i];
                BoardShadow.cubeToBoardShadowCollision(c);
                if (c.shakeActive == false) {
                    c.cubeSpr.angle = 0;
                }
            }
            // this.previewDragEnded()
        }
        this.checkLockedStatus();
    };
    CubeGroup.prototype.checkLockedStatus = function () {
        if (Tutorial.myState == Tutorial.STATE_STEP_3)
            return;
        if (this.successfullPlacementFlag == false) {
            if (BoardUtil.canCubeGroupBePlacedOnBoard(this)) {
                this.unlock();
            }
            else {
                this.lock();
            }
        }
        
    };
    CubeGroup.prototype.setXY = function (x, y) {
        this.myContainer.x = x;
        this.myContainer.y = y;
    };
    CubeGroup.prototype.setScale = function (scale) {
        this.myContainer.scale.set(scale, scale);
    };
    CubeGroup.prototype.dragStarted = function (isLocked, x, y) {
        // console.log("drag started")
        if (GameUITop.myref.powerupButExplode.myState == PowerUpButton.STATE_SELECTED) {
            if (this.myGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_BIG_CUBE || this.myGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_CUBIC || this.myGroupType == Consts.GROUP_TYPE_SINGLE_CUBE) {
                return;
            }
            this.replaceByRotatedCubeGroup();
            GameContext.rotatePowerupsCount--;
            //console.log("yessss", BoardUtil.canCubeGroupBePlacedOnBoard(this))
            this.checkLockedStatus();
            if (BoardUtil.canCubeGroupBePlacedOnBoard(this) == false) {
                if (Tutorial.myState == Tutorial.STATE_STEP_3)
                    return;
                if (GameContext.tutorialActive)
                    return;
                if(GameContext.explodePowerupsCount == 0 && GameContext.rotatePowerupsCount == 0) {
                    var outofmoves = new OutOfMovesPrompt(GameScreen.myref.layerUITop);
                }
            }
        }
        else if (GameUITop.myref.powerupButRotate.myState == PowerUpButton.STATE_SELECTED) {
            if (this.successfullPlacementFlag == false) {
                var currentCubeGroupPos = this.initialLocationIdx;
                var currentCubeGroupType = this.myGroupType;
                this.remove(true);
                PowerUpButton.explodeButton.deselect();
                SpawnUtil.spawnExplodeCubeGroup(currentCubeGroupType, currentCubeGroupPos, GameScreen.myref.cubeGroupNotPlacedArray, GameScreen.myref.layerMovingGroups);
                GameContext.explodePowerupsCount--;
            }
        }
        else {
            if (isLocked)
                return;
            SoundManager.Pickup.play();
            this.dragActiveFlag = true;
            this.dragActiveInitPoint = new Phaser.Point(x, y);
            this.initialCubeGroupPoint = new Phaser.Point(this.myContainer.x, this.myContainer.y);
            this.myContainer.parent.addChild(this.myContainer);
            if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
                this.setScale(1);
            }
            else {
                this.setScale(1);
            }
        }
    };
    CubeGroup.prototype.replaceByRotatedCubeGroup = function () {
        var newGroupType = this.myGroupType;
        if (newGroupType == Consts.GROUP_TYPE_DUO_CUBE_HORIZONTAL) {
            newGroupType = Consts.GROUP_TYPE_DUO_CUBE_VERTICAL;
        }
        else if (newGroupType == Consts.GROUP_TYPE_DUO_CUBE_VERTICAL) {
            newGroupType = Consts.GROUP_TYPE_DUO_CUBE_HORIZONTAL;
        }
        else if (newGroupType == Consts.GROUP_TYPE_TRIO_CUBE_HORIZONTAL) {
            newGroupType = Consts.GROUP_TYPE_TRIO_CUBE_VERTICAL;
        }
        else if (newGroupType == Consts.GROUP_TYPE_TRIO_CUBE_VERTICAL) {
            newGroupType = Consts.GROUP_TYPE_TRIO_CUBE_HORIZONTAL;
        }
        else if (newGroupType == Consts.GROUP_TYPE_QUATRO_CUBE_HORIZONTAL) {
            newGroupType = Consts.GROUP_TYPE_QUATRO_CUBE_VERTICAL;
        }
        else if (newGroupType == Consts.GROUP_TYPE_QUATRO_CUBE_VERTICAL) {
            newGroupType = Consts.GROUP_TYPE_QUATRO_CUBE_HORIZONTAL;
        }
        else if (newGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_1 || newGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_2 || newGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_3) {
            newGroupType++;
        }
        else if (newGroupType == Consts.GROUP_TYPE_TETRIS_CUBE_4) {
            newGroupType = Consts.GROUP_TYPE_TETRIS_CUBE_1;
        }
        else if (newGroupType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_1 || newGroupType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_2 || newGroupType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_3) {
            newGroupType++;
        }
        else if (newGroupType == Consts.GROUP_TYPE_TETRIS_T_SHAPED_4) {
            newGroupType = Consts.GROUP_TYPE_TETRIS_T_SHAPED_1;
        }
        //console.log("new group type after rotation: " + this.myGroupType + ", " + newGroupType)
        var cubegroup = new CubeGroup(newGroupType, this.parent, this.initialLocationIdx, true);
        this.remove(true);
        PowerUpButton.rotateButton.deselect();
        console.log("heeyyyyyy", GameScreen.myref.checkIfUnlockedGroupsAvailable(),cubegroup)
    };
    CubeGroup.prototype.dragEnded = function () {
        this.dragActiveFlag = false;
        var boardPlacementSuccess = true;
        var i = this.myCubeArray.length;
        while (i-- > 0) {
            var c = this.myCubeArray[i];
            if (BoardShadow.cubeToBoardShadowCollision(c) == false) {
                boardPlacementSuccess = false;
            }
        }
        i = this.myCubeArray.length;
        while (i-- > 0) {
            var c = this.myCubeArray[i];
            if (BoardUtil.isCollidingWithPlacedCubes(c)) {
                boardPlacementSuccess = false;
            }
        }
        if (boardPlacementSuccess == false) {
            SoundManager.WrongPosition.play();
            this.setScale(0.4);
            this.setXY(this.initialLocationX, this.initialLocationY);
        }
        else {
            this.placeToBoard();
        }
        BoardShadow.clearBoardShadows();
    };
    CubeGroup.prototype.previewDragEnded = function () {
        var boardPlacementSuccess = true;
        var i = this.myCubeArray.length;
        while (i-- > 0) {
            var c = this.myCubeArray[i];
            if (BoardShadow.cubeToBoardShadowCollision(c) == false) {
                boardPlacementSuccess = false;
            }
        }
        i = this.myCubeArray.length;
        while (i-- > 0) {
            var c = this.myCubeArray[i];
            if (BoardUtil.isCollidingWithPlacedCubes(c)) {
                boardPlacementSuccess = false;
            }
        }
        if (boardPlacementSuccess == false) {
            return;
        }
        else {
            BoardUtil.shakeCubesThatCanBeRemoved(this);
        }
    };
    CubeGroup.prototype.placeToBoard = function () {
        GameScreen.myref.orientationJustChangedFlag = false;
        var i = this.myCubeArray.length;
        while (i-- > 0) {
            this.myCubeArray[i].setToLastCollisionCoords();
        }
        this.successfullPlacementFlag = true;
        CubeGroup.cubeGroupArr.splice(CubeGroup.cubeGroupArr.indexOf(this), 1);
        GameScreen.myref.checkIfMatchMade();
        GameScreen.myref.checkIfAllGroupsPlaced();
        SimpleGame.myGame.time.events.add(100, function () {
            GameContext.saveBoardPositions();
            if (GameScreen.myref.checkIfUnlockedGroupsAvailable() == false) {
                if (Tutorial.myState == Tutorial.STATE_STEP_3)
                    return;
                if (GameContext.tutorialActive)
                    return;
                if(GameContext.explodePowerupsCount == 0 && GameContext.rotatePowerupsCount == 0) {  
                    var outofmoves = new OutOfMovesPrompt(GameScreen.myref.layerUITop);
                }
            }
        }.bind(this), this);
    };
    return CubeGroup;
}());
var fontsloadedflag = false;
var WebFontConfig = {
    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function () {
        console.log("loadgoooglefonts");
        fontsloadedflag = true;
    },
    loading: function () {
        console.log("font being loaded");
    },
    google: {
        families: ["Paytone One"]
    },
    timeout: 20000
};
var mouseIsWithinGame;
function resumeSoundContext() {
    SimpleGame.myGame.sound.context.resume();
    console.log("resume sound context");
    document.body.removeEventListener('pointerup', resumeSoundContext);
}
var SimpleGame = /** @class */ (function () {
    function SimpleGame() {
        var _this = this;
        this.mouseMovedWithinGameTicks = 0;
        this.ticks = 0;
        PokiSDK.init().then(function () {
            console.log("Poki SDK successfully initialized");
            // your code to continue to game
            _this.continueToGame();
        })["catch"](function () {
            console.log("Initialized, but the user likely has adblock");
            // your code to continue to game
            _this.continueToGame();
        });
        // PokiSDK.setDebug(true);
        window.addEventListener('keydown', function (ev) {
            if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
                ev.preventDefault();
            }
        });
        window.addEventListener('wheel', function (ev) { return ev.preventDefault(); }, { passive: false });
        var touch = matchMedia('(hover: none)').matches;
        if (touch) {
            var config = {
                width: 1593,
                height: 2100,
                renderer: Phaser.CANVAS,
                parent: 'content',
                disableVisibilityChange: true
            };
        }
        else {
            var config = {
                width: 1593,
                height: 2100,
                renderer: Phaser.CANVAS,
                parent: 'content',
                disableVisibilityChange: true
            };
        }
        this.game = new Phaser.Game(config);
        SimpleGame.myGame = this.game;
        document.body.addEventListener('click', function () {
            var context = new AudioContext();
            // Setup all nodes
            SimpleGame.myGame.sound.context.resume();
        });
        if (SimpleGame.isReleaseVersion) {
            console.log = function () { };
        }
        this.boot = new Phaser.State();
        this.game.state.add("Boot", this.boot, true);
        this.gamestate = new Phaser.State();
        this.gamestate.preload = this.preload;
        this.gamestate.create = this.create;
        this.gamestate.update = this.update;
        this.gamestate.render = this.render;
        this.game.state.add("Gamestate", this.gamestate, false);
        var resizeF = function () {
            return;
            console.log("resize game");
            var deviceWidth = window.outerWidth;
            var deviceHeight = window.outerHeight;
            if (SimpleGame.myGame.device.desktop == false) {
                var scaleX = deviceWidth / 800;
                var scaleY = deviceHeight / 600;
                var scale = Math.min(scaleX, scaleY);
                SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
                SimpleGame.myGame.scale.setUserScale(scale, scale);
                console.log("set to user scale: " + scale, scaleX, scaleY);
                SimpleGame.myGame.scale.pageAlignHorizontally = true;
            }
            else {
                SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                SimpleGame.myGame.scale.pageAlignVertically = true;
                SimpleGame.myGame.scale.pageAlignHorizontally = true;
            }
            if (SimpleGame.myGame.device.ie) {
                SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            }
            SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            SimpleGame.myGame.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            SimpleGame.myGame.scale.pageAlignVertically = true;
            SimpleGame.myGame.scale.pageAlignHorizontally = true;
            SimpleGame.myGame.scale.refresh();
        };
        this.boot.preload = function () {
            GameContext.initialize();
            this.game.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurX.js');
            this.game.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/BlurY.js');
            this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
            this.game.stage.backgroundColor = 0x000000;
            SimpleGame.myGame.stage.disableVisibilityChange = true;
            window.addEventListener("resize", resizeF);
            SimpleGame.myGame.stage.disableVisibilityChange = true;
            resizeF();
            this.game.time.advancedTiming = true;
            // this.game.scale.refresh();
        };
        this.boot.create = function () {
            this.game.state.start("Gamestate");
        };
        console.log(Phaser.VERSION);
    }
    SimpleGame.prototype.continueToGame = function () {
        SimpleGame.pokiSdkLoadedFlag = true;
    };
    SimpleGame.loadStart = function () {
        console.log("load started");
    };
    SimpleGame.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
        console.log("file completed");
        SimpleGame.loadingText.text = "" + progress + "%";
    };
    SimpleGame.loadComplete = function () {
        console.log("load completed");
        SimpleGame.loadingText.destroy();
    };
    SimpleGame.prototype.preload = function () {
        // ResizeManager.update()
        SimpleGame.myGame.load.onLoadStart.add(SimpleGame.loadStart, this);
        SimpleGame.myGame.load.onFileComplete.add(SimpleGame.fileComplete, this);
        SimpleGame.myGame.load.onLoadComplete.add(SimpleGame.loadComplete, this);
        SimpleGame.loadingText = SimpleGame.myGame.add.text(window.innerWidth / 2, window.innerHeight / 2, "1%", { font: "72px Paytone One", fill: "#ffe4b5", align: "Right" });
        SimpleGame.loadingText.anchor.set(0.5, 0.5);
        PokiSDK.gameLoadingStart();
        SimpleGame.myGame.stage.backgroundColor = 0x000000;
        SimpleGame.myGame.time.advancedTiming = true;
        this.game.load.image('WB_logo01', "assets/WB_logo01.png");
        this.game.load.image('A_light_wood_block02', "assets/A_light_wood_block02.png");
        // this.game.load.image('blue_wood_block01', "assets/blue_wood_block01.png")
        // this.game.load.image('cravedbrown_wood_block01b', "assets/cravedbrown_wood_block01b.png")
        // this.game.load.image('greydark_wood_block01b', "assets/greydark_wood_block01b.png")
        this.game.load.image('underlight_wood_block01', "assets/underlight_wood_block01.png");
        this.game.load.image('Locked', "assets/Locked.png");
        this.game.load.image('bgleft', "assets/background/bgleft.jpg");
        this.game.load.image('bgright', "assets/background/bgright.jpg");
        this.game.load.image('WB_lightwood_BG_01HD_Poki02', "assets/background/WB_lightwood_BG_01HD_Poki02.png");
        this.game.load.image('WB3D_html5_BGmain01', "assets/background/WB3D_html5_BGmain01.jpg");
        this.game.load.image('wb3d_logo01', "assets/wb3d_logo01.png");
        this.game.load.image('bg_landscape', "assets/background/bg_landscape.jpg");
        if (GameContext.selectedTheme == 0) {
            console.log("load selected theme 0");
            this.game.load.image('theme_01_bg', 'assets/THEMES/Blackwood/WB_blackwood_BG_01-min.png');
            this.game.load.image('theme_01_board', 'assets/THEMES/Blackwood/WB_blackwood_Board_01.jpg');
            this.game.load.image('theme_01_door', 'assets/THEMES/Blackwood/WB_blackwood_door_01.jpg');
        }
        else if (GameContext.selectedTheme == 1) {
            console.log("load selected theme 1");
            this.game.load.image('theme_02_bg', 'assets/THEMES/Carvedwood/WB_Carved_wood_BG_01-min.png');
            this.game.load.image('theme_02_board', 'assets/THEMES/Carvedwood/WB_carved_wood_Board_01.jpg');
            this.game.load.image('theme_02_door', 'assets/THEMES/Carvedwood/WB_Carved_wood_door_01.jpg');
        }
        else if (GameContext.selectedTheme == 2) {
            console.log("load selected theme 2");
            this.game.load.image('theme_03_bg', 'assets/THEMES/Darkwood/WB_darkwood_BG_01-min.png');
            this.game.load.image('theme_03_board', 'assets/THEMES/Darkwood/WB_darkwood_Board_01.jpg');
            this.game.load.image('theme_03_door', 'assets/THEMES/Darkwood/WB_darkwood_door_01.jpg');
        }
        else if (GameContext.selectedTheme == 3) {
            this.game.load.image('theme_04_bg', 'assets/THEMES/Exoticwood/WB_Exotic_wood_BG_01-min.png');
            this.game.load.image('theme_04_board', 'assets/THEMES/Exoticwood/WB_exotic_wood_Board_01.jpg');
            this.game.load.image('theme_04_door', 'assets/THEMES/Exoticwood/WB_exotic_wood_door_01.jpg');
        }
        else if (GameContext.selectedTheme == 4) {
            this.game.load.image('theme_05_bg', 'assets/THEMES/Lightwood/WB_lightwood_BG_01-min.png');
            this.game.load.image('theme_05_board', 'assets/THEMES/Lightwood/WB_lightwood_Board_01.png');
            this.game.load.image('theme_05_door', 'assets/THEMES/Lightwood/WB_lightwood_door_01.jpg');
        }
        else if (GameContext.selectedTheme == 5) {
            this.game.load.image('theme_06_bg', 'assets/THEMES/Mixwood/WB_Mix_wood_BG_01-min.png');
            this.game.load.image('theme_06_board', 'assets/THEMES/Mixwood/WB_mix_wood_Board_01.jpg');
            this.game.load.image('theme_06_door', 'assets/THEMES/Mixwood/WB_Mix_wood_door_01.jpg');
        }
        else if (GameContext.selectedTheme == 6) {
            this.game.load.image('theme_07_bg', 'assets/THEMES/White_wood/WB_greywood_BG_01-min.png');
            this.game.load.image('theme_07_board', 'assets/THEMES/White_wood/WB_whitewood_Board_01.jpg');
            this.game.load.image('theme_07_door', 'assets/THEMES/White_wood/WB_whitewood_door_01.jpg');
        }
        // this.game.load.image('square_prize_button_BTN01', 'assets/MENUS/powerup_highlightBTN_blue01.png')
        this.game.load.image('powerup_highlightBTN_blue01', 'assets/MENUS/powerup_highlightBTN_blue01.png');
        this.game.load.image('powerup_highlightBTN_red01', 'assets/MENUS/powerup_highlightBTN_red01.png');
        this.game.load.image('prize_round_BTN01', 'assets/MENUS/square_prize_button_BTN01.png');
        this.game.load.image('GetAds_green_BTN01', 'assets/MENUS/GetAds_green_BTN01.png');
        this.game.load.image('VideoAds_icon_01', 'assets/MENUS/VideoAds_icon_01.png');
        this.game.load.image('base_btn_BTN01', 'assets/MENUS/base_btn_BTN01.png');
        this.game.load.image('small_board_wood01', 'assets/MENUS/small_board_wood01.png');
        this.game.load.image('Big_down_BTN', 'assets/MENUS/Big_down_BTN.png');
        this.game.load.image('Big_up_BTN', 'assets/MENUS/Big_up_BTN.png');
        this.game.load.image('icon-Home2', 'assets/MENUS/icon-Home2.png');
        this.game.load.image('icon-settings2', 'assets/MENUS/icon-settings2.png');
        this.game.load.image('icon-palette01', 'assets/MENUS/icon-palette01.png');
        this.game.load.image('topscore_crown_icon', 'assets/MENUS/topscore_crown_icon.png');
        this.game.load.image('unlock_down_BTN', 'assets/MENUS/unlock_down_BTN.png');
        this.game.load.image('unlock_up_BTN', 'assets/MENUS/unlock_up_BTN.png');
        this.game.load.image('yes-no_down_BTN', 'assets/MENUS/yes-no_down_BTN.png');
        this.game.load.image('yes-no_up_BTN', 'assets/MENUS/yes-no_up_BTN.png');
        this.game.load.image('top_score_board02', 'assets/MENUS/top_score_board02.png');
        this.game.load.image('icon-crown', 'assets/MENUS/icon-crown.png');
        this.game.load.image('icon-leaderboards', 'assets/MENUS/icon-leaderboards.png');
        this.game.load.image('icon-swap', 'assets/MENUS/icon-swap.png');
        this.game.load.image('hand_tutorial_bw_01', 'assets/MENUS/hand_tutorial_bw_01.png');
        this.game.load.image('star_icon01', 'assets/MENUS/star_icon01.png');
        this.game.load.image('OFF_BTN', 'assets/MENUS/OFF_BTN.png');
        this.game.load.image('ON_BTN', 'assets/MENUS/ON_BTN.png');
        this.game.load.image('OnOff_toggleBTN', 'assets/MENUS/OnOff_toggleBTN.png');
        this.game.load.image('dinamit_lit_icon_BTN01', 'assets/MENUS/powerups/dinamit_lit_icon_BTN01.png');
        this.game.load.image('dinamit_unlit_icon_BTN01', 'assets/MENUS/powerups/dinamit_unlit_icon_BTN01.png');
        this.game.load.image('gift_lit_icon01', 'assets/MENUS/powerups/gift_lit_icon01.png');
        this.game.load.image('gift_unlit_icon01', 'assets/MENUS/powerups/gift_unlit_icon01.png');
        this.game.load.image('load_bar_base_crop01', 'assets/MENUS/powerups/load_bar_base_crop01.png');
        this.game.load.image('load_bar_base01', 'assets/MENUS/powerups/load_bar_base01.png');
        this.game.load.image('load_bar01', 'assets/MENUS/powerups/load_bar01.png');
        this.game.load.image('rotate_lit_icon_BTN01', 'assets/MENUS/powerups/rotate_lit_icon_BTN01.png');
        this.game.load.image('rotate_unlit_icon_BTN01', 'assets/MENUS/powerups/rotate_unlit_icon_BTN01.png');
        this.game.load.image('powerup_BTN02', 'assets/MENUS/powerups/powerup_BTN02.png');
        this.game.load.image('powerup_highlightBTN01', 'assets/MENUS/powerups/powerup_highlightBTN01.png');
        this.game.load.image('powerup_indicator_blue01', 'assets/MENUS/powerups/powerup_indicator_blue01.png');
        this.game.load.image('powerup_indicator_red01', 'assets/MENUS/powerups/powerup_indicator_red01.png');
        // this.game.load.image('WB3D_html5_BG01', 'assets/WB3D_html5_BG01.png')
        CubeAnimation.fsNameArray = [];
        var i = 28;
        while (i-- > 1) {
            if (i < 10) {
                console.log(i, 'cube_rotatte3D_0000' + i, 'assets/cube_rotate3D/cube_rotatte3D_0000' + i + '.png');
                this.game.load.image('cube_rotatte3D_0000' + i, 'assets/cube_rotate3D/cube_rotatte3D_0000' + i + '.png');
                CubeAnimation.fsNameArray[i - 1] = 'cube_rotatte3D_0000' + i;
            }
            else {
                console.log(i, 'cube_rotatte3D_000' + i, 'assets/cube_rotate3D/cube_rotatte3D_000' + i + '.png');
                this.game.load.image('cube_rotatte3D_000' + i, 'assets/cube_rotate3D/cube_rotatte3D_000' + i + '.png');
                CubeAnimation.fsNameArray[i - 1] = 'cube_rotatte3D_000' + i;
            }
        }
        this.game.load.audio('Amazing', ['assets/Sound/Sound/combotext/Amazing_-_Female_.mp3']);
        this.game.load.audio('Awesome', ['assets/Sound/Sound/combotext/Awesome_-_Female_.mp3']);
        this.game.load.audio('Boss', ['assets/Sound/Sound/combotext/Boss_-_Female_.mp3']);
        this.game.load.audio('Bingo', ['assets/Sound/Sound/combotext/Bingo(Short).mp3']);
        this.game.load.audio('Easy', ['assets/Sound/Sound/combotext/Easy(Short).mp3']);
        this.game.load.audio('Fantastic', ['assets/Sound/Sound/combotext/Fantastic(Short).mp3']);
        this.game.load.audio('GoodJob', ['assets/Sound/Sound/combotext/GoodJob(Short).mp3']);
        this.game.load.audio('Insane', ['assets/Sound/Sound/combotext/Insane(Short).mp3']);
        this.game.load.audio('Oh Yeah', ['assets/Sound/Sound/combotext/OhYeah(Short).mp3']);
        this.game.load.audio('Super', ['assets/Sound/Sound/combotext/Super(Short).mp3']);
        this.game.load.audio('Wonderful', ['assets/Sound/Sound/combotext/Wonderful(Short).mp3']);
        this.game.load.audio('LineBreaks', ['assets/Sound/Sound/combotext/LineBreaks.mp3']);
        this.game.load.audio('NewPiece', ['assets/Sound/Sound/NewPiece.mp3']);
        this.game.load.audio('Door', ['assets/Sound/Sound/DoorSFXV2.mp3']);
        this.game.load.audio('Block_Shake', ['assets/Sound/Sound/Block_Shake.mp3']);
        this.game.load.audio('Button_Click', ['assets/Sound/Sound/Button_Click.mp3']);
        this.game.load.audio('WrongPosition', ['assets/Sound/Sound/WrongPosition.mp3']);
        this.game.load.audio('Genius', ['assets/Sound/Sound/combotext/Genius_-_Female_.mp3']);
        this.game.load.audio('Great', ['assets/Sound/Sound/combotext/Great_-_Female_.mp3']);
        this.game.load.audio('Perfect', ['assets/Sound/Sound/combotext/Perfect_-_Female_.mp3']);
        this.game.load.audio('Pickup', ['assets/Sound/Sound/PickUpPiece.mp3']);
        this.game.load.audio('Wow', ['assets/Sound/Sound/combotext/Wow(Female).mp3']);
        this.game.load.start();
        // this.game.renderer.renderSession.roundPixels = true;
    };
    SimpleGame.onBlur = function () {
        SimpleGame.myGame.input.reset();
        SimpleGame.myGame.input.pointer1.reset();
    };
    SimpleGame.onFocus = function () {
        SimpleGame.myGame.input.reset();
        SimpleGame.myGame.input.pointer1.reset();
    };
    SimpleGame.prototype.create = function () {
        console.log("start preloading");
        SoundManager.Amazing = this.game.add.audio('Amazing');
        SoundManager.Awesome = this.game.add.audio('Awesome');
        SoundManager.Boss = this.game.add.audio('Boss');
        SoundManager.Door = this.game.add.audio('Door');
        SoundManager.Easy = this.game.add.audio('Easy');
        SoundManager.Fantastic = this.game.add.audio('Fantastic');
        SoundManager.GoodJob = this.game.add.audio('GoodJob');
        SoundManager.LineBreaks = this.game.add.audio('LineBreaks');
        SoundManager.Block_Shake = this.game.add.audio('Block_Shake');
        SoundManager.click = this.game.add.audio('Button_Click');
        SoundManager.Insane = this.game.add.audio('Insane');
        SoundManager.OhYeah = this.game.add.audio('Oh Yeah');
        SoundManager.Super = this.game.add.audio('Super');
        SoundManager.Genius = this.game.add.audio('Genius');
        SoundManager.Great = this.game.add.audio('Great');
        SoundManager.Perfect = this.game.add.audio('Perfect');
        SoundManager.Pickup = this.game.add.audio('Pickup');
        SoundManager.Wow = this.game.add.audio('Wow');
        SoundManager.NewPiece = this.game.add.audio('NewPiece');
        SoundManager.WrongPosition = this.game.add.audio('WrongPosition');
        SoundManager.init();
        this.game.load.onLoadStart.add(function name() {
            console.log("preload full started");
        });
        this.game.load.onLoadComplete.add(function name() {
            console.log("game fullyl oaded");
            GameContext.gameAssetsFullyLoaded = true;
        }, this);
        this.game.load.image('big_board_wood01', 'assets/MENUS/big_board_wood01.png');
        this.game.load.image('theme_smallboard01', 'assets/MENUS/theme_smallboard01.png');
        this.game.load.image('board_deselected_BTN01', 'assets/MENUS/board_deselected_BTN01.png');
        this.game.load.image('board_selected_BTN01', 'assets/MENUS/board_selected_BTN01.png');
        this.game.load.image('combotext_1', 'assets/COMBOTEXT/text_Amazing01.png');
        this.game.load.image('combotext_2', 'assets/COMBOTEXT/text_Awesome01.png');
        this.game.load.image('combotext_3', 'assets/COMBOTEXT/text_Boss01.png');
        this.game.load.image('combotext_8', 'assets/COMBOTEXT/text_Bingo01.png');
        this.game.load.image('combotext_9', 'assets/COMBOTEXT/text_Easy01.png');
        this.game.load.image('combotext_10', 'assets/COMBOTEXT/text_Fantastic01.png');
        this.game.load.image('combotext_4', 'assets/COMBOTEXT/text_Genius01.png');
        this.game.load.image('combotext_11', 'assets/COMBOTEXT/text_HolyMoly01.png');
        this.game.load.image('combotext_12', 'assets/COMBOTEXT/text_Insane01.png');
        this.game.load.image('combotext_5', 'assets/COMBOTEXT/text_Great01.png');
        this.game.load.image('combotext_6', 'assets/COMBOTEXT/text_perfect01.png');
        this.game.load.image('combotext_7', 'assets/COMBOTEXT/text_wow01.png');
        this.game.load.image('combotext_13', 'assets/COMBOTEXT/text_Wonderful01.png');
        // this.game.load.image('wood_black01', 'assets/ThemeIcons/wood_black01.png')
        // this.game.load.image('wood_blue01', 'assets/ThemeIcons/wood_blue01.png')
        // this.game.load.image('wood_carved01', 'assets/ThemeIcons/wood_carved01.png')
        // this.game.load.image('wood_dark01', 'assets/ThemeIcons/wood_dark01.png')
        // this.game.load.image('wood_exotic01', 'assets/ThemeIcons/wood_exotic01.png')
        // this.game.load.image('wood_light01', 'assets/ThemeIcons/wood_light01.png')
        // this.game.load.image('wood_mix01', 'assets/ThemeIcons/wood_mix01.png')
        this.game.load.start();
        // SoundManager.silence.loopFull()
        // return
        SimpleGame.addLayers();
        SimpleGame.handleOrientation();
        SimpleGame.myGame.onBlur.add(SimpleGame.onBlur, this);
        SimpleGame.myGame.onFocus.add(SimpleGame.onFocus, this);
        SimpleGame.myGame.onResume.add(SimpleGame.onFocus, this);
        SimpleGame.checkAssetsLoaded();
        SimpleGame.myGame.input.mspointer.capture = false;
        document.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
    };
    SimpleGame.prototype.preloadFullComplete = function () {
        GameContext.gameAssetsFullyLoaded = true;
    };
    SimpleGame.addLayers = function () {
        this.layerBackground = SimpleGame.myGame.add.group();
        this.layerGame = SimpleGame.myGame.add.group();
        // this.layerUI = SimpleGame.myGame.add.group();	
        this.appbackgroundleft = SimpleGame.myGame.add.sprite(0, 0, 'bgleft', '', this.layerBackground);
        this.appbackgroundright = SimpleGame.myGame.add.sprite(0, 0, 'bgright', '', this.layerBackground);
    };
    SimpleGame.handleOrientation = function () {
        // SimpleGame.myGame.scale.forceOrientation(false, true)
    };
    SimpleGame.checkAssetsLoaded = function () {
        // if (fontsloadedflag == false)
        // {
        // 	console.log("call checkAssetsLoaded in 0.05s")
        // 	SimpleGame.myGame.time.events.add(50, function () {
        // 		SimpleGame.checkAssetsLoaded()
        // 	}, this )
        // }
        // else
        // {
        // 	console.log("add init screen in 1 second")
        // 	SimpleGame.myGame.time.events.add(2000, SimpleGame.addInitScreen, this);
        // }
        if (SimpleGame.pokiSdkLoadedFlag) {
            SimpleGame.addInitScreen();
        }
        else {
            SimpleGame.myGame.time.events.add(50, SimpleGame.checkAssetsLoaded, this);
        }
    };
    SimpleGame.addInitScreen = function () {
        PokiSDK.gameLoadingFinished();
        GameContext.setMuteFlags();
        ResizeManager.update();
        var initscreen = new InitMenuPrompt(true);
    };
    SimpleGame.startGame = function (firstGame) {
        if (firstGame === void 0) { firstGame = true; }
        if (firstGame) {
            SimpleGame.myGame.add.sprite(0, 0, 'game_background');
            SimpleGame.gameEngineStarted = true;
            SimpleGame.game_bg.visible = true;
            SimpleGame.logo.visible = false;
            if (SimpleGame.myGame.device.safari == false && SimpleGame.myGame.device.firefox == false && SimpleGame.myGame.input.touch && (SimpleGame.myGame.device.android || SimpleGame.myGame.device.iOS)) {
                SimpleGame.myGame.input.mouse.stop();
            }
            else if (SimpleGame.myGame.device.safari == false && SimpleGame.myGame.device.firefox == false && SimpleGame.myGame.device.ie == false && SimpleGame.myGame.input.touch) {
                SimpleGame.myGame.input.mouse.stop();
            }
        }
        else {
        }
    };
    SimpleGame.prototype.update = function () {
        this.game.time.desiredFps = 144;
        // // this.game.time.slowMotion = 144/60;
        if (this.game.time.suggestedFps > 100) {
        }
        else {
            // this.game.time.desiredFps = 60
        }
        //    ResizeManager.update();
    };
    SimpleGame.prototype.render = function () {
        if (Cube.placedCubesArray == null)
            return;
        var i = Cube.placedCubesArray.length;
        var s = "";
        while (i-- > 0) {
            s += "," + Cube.placedCubesArray[i].cubeSpr.y + "\n";
        }
        // SimpleGame.myGame.debug.text('FPS: ' + SimpleGame.myGame.time.fps  + "w: " + window.innerWidth || 'FPS: --', 40, 40, "#00ff00");
        // SimpleGame.myGame.debug.text('..'+ s, 10, 10, "#00ff00");
    };
    SimpleGame.fontsLoadedFlag = false;
    SimpleGame.gameEngineStarted = false;
    SimpleGame.unselectAllCards = false;
    SimpleGame.isReleaseVersion = false;
    SimpleGame.pointerDown = false;
    SimpleGame.pokiSdkLoadedFlag = false;
    return SimpleGame;
}());
// when the page has finished loading, create our game
window.onload = function () {
    var game = new SimpleGame();
};
var GameContext = /** @class */ (function () {
    function GameContext() {
    }
    GameContext.clearSavedData = function () {
        this.clearBoardPositions();
        Util.clearStorage(Consts.COOKIE_NAME_CURRENT_SCORE);
        Util.clearStorage(Consts.COOKIE_NAME_CURRENT_LEVEL);
    };
    GameContext.setMuteFlags = function () {
        SoundManager.setMuteFlags(!this.soundFlag);
        SoundManager.setVoiceMuteFlags(!this.voiceFlag);
    };
    GameContext.clearBoardPositions = function () {
        var i = 64;
        while (i-- > 0) {
            Util.setStorage("wb3dBoardX_" + i, -1);
            Util.setStorage("wb3dBoardY_" + i, -1);
        }
        Util.setStorage("wb3dcubegroup_0", -1);
        Util.setStorage("wb3dcubegroup_1", -1);
        Util.setStorage("wb3dcubegroup_2", -1);
    };
    GameContext.saveBoardPositions = function () {
        GameContext.clearBoardPositions();
        var arr = Cube.placedCubesArray;
        var i = arr.length;
        while (i-- > 0) {
            var c = arr[i];
            this.savedPositonsBoardX[i] = c.boardX;
            this.savedPositonsBoardY[i] = c.boardY;
            Util.setStorage("wb3dBoardX_" + i, c.boardX);
            Util.setStorage("wb3dBoardY_" + i, c.boardY);
        }
        var i = CubeGroup.cubeGroupArr.length;
        while (i-- > 0) {
            var cg = CubeGroup.cubeGroupArr[i];
            Util.setStorage("wb3dcubegroup_" + i, cg.myGroupType);
        }
        Util.setStorage(Consts.COOKIE_NAME_CURRENT_SCORE, GameContext.score);
        Util.setStorage(Consts.COOKIE_NAME_CURRENT_LEVEL, GameContext.currentLevel);
        Util.setStorage(Consts.COOKIE_NAME_EXPLODE_PWR_COUNT, GameContext.explodePowerupsCount);
        Util.setStorage(Consts.COOKIE_NAME_ROTATE_PWR_COUNT, GameContext.rotatePowerupsCount);
    };
    GameContext.loadFromSavedBoard = function () {
        var loadedFlag = false;
        var i = 64;
        while (i-- > 0) {
            var myX = Util.getStorage("wb3dBoardX_" + i, -1);
            var myY = Util.getStorage("wb3dBoardY_" + i, -1);
            if (myX >= 0 && myY >= 0) {
                loadedFlag = true;
                Cube.createCubeAt(myX, myY);
            }
        }
        if (loadedFlag) {
            var i = 3;
            while (i-- > 0) {
                var idx = Util.getStorage("wb3dcubegroup_" + i, -1);
                if (idx >= 0) {
                    var cubegroup1 = new CubeGroup(idx, GameScreen.myref.layerMovingGroups, i);
                    GameScreen.myref.cubeGroupNotPlacedArray.push(cubegroup1);
                }
            }
            GameContext.score = Util.getStorage(Consts.COOKIE_NAME_CURRENT_SCORE, 0);
            GameContext.currentLevel = Util.getStorage(Consts.COOKIE_NAME_CURRENT_LEVEL, 0);
            GameContext.explodePowerupsCount = Util.getStorage(Consts.COOKIE_NAME_EXPLODE_PWR_COUNT, 1);
            GameContext.rotatePowerupsCount = Util.getStorage(Consts.COOKIE_NAME_ROTATE_PWR_COUNT, 1);
        }
        return loadedFlag;
    };
    GameContext.addFromSavedBoard = function () {
        var i = this.savedPositonsBoardX.length;
        console.log("total saved: " + i);
        while (i-- > 0) {
            Cube.createCubeAt(this.savedPositonsBoardX[i], this.savedPositonsBoardY[i]);
        }
        this.savedPositonsBoardX = [];
        this.savedPositonsBoardY = [];
    };
    /*GameContext.rewardedBreakRotate = function () {
        this.gameplayStopped();
        PokiSDK.rewardedBreak().then(function (success) {
            if (success) {
                //  GameContext.explodePowerupsCount++;
                GameContext.rotatePowerupsCount++;
                GameContext.gameplayStarted();
            }
            else {
                // video not displayed, should probably not give reward
                GameContext.gameplayStarted();
            }
        });
    };
    GameContext.rewardedBreakExplode = function () {
        this.gameplayStopped();
        PokiSDK.rewardedBreak().then(function (success) {
            if (success) {
                GameContext.explodePowerupsCount++;
                // GameContext.rotatePowerupsCount++;
                GameContext.gameplayStarted();
            }
            else {
                // video not displayed, should probably not give reward
                GameContext.gameplayStarted();
            }
        });
    };*/
    GameContext.rewardedBreakBoth = function () {
        this.gameplayStopped();
        PokiSDK.rewardedBreak().then(function (success) {
            if (success) {
                GameContext.explodePowerupsCount++;
                GameContext.rotatePowerupsCount++;
                GameContext.gameplayStarted();
            }
            else {
                // video not displayed, should probably not give reward
                GameContext.gameplayStarted();
            }
        });
    };
    GameContext.rewardedBreak = function () {
        this.gameplayStopped();
        this.availableAds--;
        PokiSDK.rewardedBreak().then(function (success) {
            if (success) {
                var selectYourReward = new SelectYourReward(GameScreen.myref.layerUITop);
            }
            else {
                // video not displayed, should probably not give reward
            }
            GameContext.gameplayStarted();
            // your code to continue to game
        });
    };
    GameContext.commercialBreak = function () {
        this.gameplayStopped();
        PokiSDK.commercialBreak().then(function () {
            console.log("Commercial break finished, proceeding to game");
            GameContext.gameplayStarted();
            // your code to continue to game
        });
    };
    GameContext.gameplayStarted = function () {
        if (GameContext.gameplayActive == false) {
            GameContext.gameplayActive = true;
            PokiSDK.gameplayStart();
        }
    };
    GameContext.gameplayStopped = function () {
        if (GameContext.gameplayActive) {
            GameContext.gameplayActive = false;
            PokiSDK.gameplayStop();
        }
    };
    GameContext.initialize = function (orientationChanged) {
        if (orientationChanged === void 0) { orientationChanged = false; }
        //window.localStorage.clear()
        this.selectedTheme = 4;
        this.bestScore = Util.getStorage(Consts.COOKIE_NAME_BEST_SCORE, 0);
        if (!orientationChanged) {
            this.score = 0;
        }
        this.tutorialPlayedAlready = Util.getStorage(Consts.COOKIE_NAME_TUTORIAL_PLAYED, 0);
        try{
            if(Util.getStorage(Consts.COOKIE_NAME_TUTORIAL_PLAYED, 0) == 0){
                window.localStorage.clear()
            }
        }
        catch {
        }
        if (this.tutorialPlayedAlready > 0) {
            GameContext.tutorialActive = false;
        }
        if (Util.getStorage(Consts.COOKIE_SOUND_FLAG, 1) == 0) {
            this.soundFlag = false;
        }
        else {
            this.soundFlag = true;
        }
        if (Util.getStorage(Consts.COOKIE_VOICE_FLAG, 1) == 0) {
            this.voiceFlag = false;
        }
        else {
            this.voiceFlag = true;
        }
    };
    GameContext.newGame = function () {
        this.score = 0;
        this.rotatePowerupsCount = 0;
        this.explodePowerupsCount = 0;
    };
    GameContext.onThemeUpdated = function () {
        console.log("theme update called");
        // GameScreen.myref.updateTheme(this.selectedTheme)
        // Util.setStorage(Consts.COOKIE_NAME_THEME_INDEX, this.selectedTheme)
        // Cube.themeChanged()
    };
    GameContext.getNextLevelScore = function (level) {
        return Consts.LEVEL_SCORE_FIXED + level * Consts.LEVEL_SCORE_DELTA;
    };
    GameContext.getScoreUpUntilThisLevel = function (currentLevel) {
        var retval = 0;
        var i = currentLevel;
        while (i-- > 0) {
            retval += this.getNextLevelScore(i);
        }
        return retval;
    };
    GameContext.allPiecesRemovedThisSession = 0;
    GameContext.savedPositonsBoardX = [];
    GameContext.savedPositonsBoardY = [];
    GameContext.selectedTheme = 4;
    GameContext.gameAssetsFullyLoaded = false;
    GameContext.explodePowerupsCount = 1;
    GameContext.rotatePowerupsCount = 1;
    GameContext.currentLevel = 0;
    GameContext.currentLevelScore = 0;
    GameContext.gameplayActive = false;
    GameContext.availableAds = 1;
    GameContext.addSelectRewardScreen = false;
    GameContext.tutorialActive = true;
    return GameContext;
}());
var GameUITop = /** @class */ (function () {
    function GameUITop(parent) {
        // return
        console.log("add game ui top");
        this.parent = parent;
        GameUITop.myref = this;
        this.regularGameplayGroup = SimpleGame.myGame.add.group(this.parent);
        this.tutorialGroup = SimpleGame.myGame.add.group(this.parent);
        this.topscoreboard = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, -180, 'top_score_board02', '', this.regularGameplayGroup);
        this.topscoreboard.anchor.set(0.5, 0);
        this.scoreTxt = SimpleGame.myGame.make.text(ResizeManager.INTERNAL_GAME_WIDTH / 2, 180 - 100, "100", { font: "72px Paytone One", fill: "#ffe4b5", align: "Right" });
        this.tutorialText = SimpleGame.myGame.make.text(ResizeManager.INTERNAL_GAME_WIDTH / 2, 60, "Make vertical lines...", { font: "60px Paytone One", fill: "#ffe4b5", align: "Right" });
        this.bestScoreTxt = SimpleGame.myGame.make.text(300, 260 - 100, "100", { font: "64px Paytone One", fill: "#ffe4b5", align: "Right" });
        this.scoreTxt.anchor.set(0.5, 0.5);
        this.bestScoreTxt.anchor.set(0.5, 0.5);
        this.tutorialText.anchor.set(0.5, 0.5);
        this.regularGameplayGroup.add(this.scoreTxt);
        this.regularGameplayGroup.add(this.bestScoreTxt);
        this.tutorialGroup.add(this.tutorialText);
        this.buttonHome = new ButtonWithOverState(this.regularGameplayGroup, 'icon-Home2', 'icon-Home2', 50, 200 - 100, this.homeClicked.bind(this));
        this.buttonSettings = new ButtonWithOverState(this.regularGameplayGroup, 'icon-settings2', 'icon-settings2', 1050, 200 - 100, this.settingsClicked.bind(this));
        this.topscorecrown = SimpleGame.myGame.add.sprite(270, 170 - 100, 'topscore_crown_icon', '', this.regularGameplayGroup);
        this.topscorecrown.scale.set(0.8, 0.8);
        var baseBarY = 400 - 100;
        var loadBarInitX = ResizeManager.INTERNAL_GAME_WIDTH / 4 - 63;
        var loadBarDeltaX = 5;
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            baseBarY = 60;
            loadBarInitX = ResizeManager.INTERNAL_GAME_WIDTH / 3 - 40;
        }
        this.baseBarY = baseBarY;
        this.baseBar = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, baseBarY, 'load_bar_base01', '', this.regularGameplayGroup);
        this.baseBar.anchor.set(0.5, 0.5);
        var i = Math.floor(this.baseBar.width / 5 - 2);
        this.loadBarArray = [];
        while (i-- > 0) {
            this.loadBarArray[i] = SimpleGame.myGame.add.sprite(loadBarInitX + i * loadBarDeltaX, baseBarY, 'load_bar01', '', this.regularGameplayGroup);
            this.loadBarArray[i].anchor.set(0.5, 0.5);
        }
        this.prizeButtonGroup = SimpleGame.myGame.add.group(this.regularGameplayGroup);
        this.prizeButtonGroup.x = 250;
        this.prizeButtonGroup.y = 450;
        this.prizeButtonGroup.scale.set(0.7);
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            this.prizeButtonGroup.x = 820;
            this.prizeButtonGroup.y = 120 - 100;
            this.tutorialText.y = 160;
        }
        this.prizeButton = new ButtonWithOverState(this.prizeButtonGroup, 'prize_round_BTN01', 'prize_round_BTN01', 0, 0, this.giftClicked.bind(this));
        this.prizeButtonTextAd = SimpleGame.myGame.add.text(this.prizeButton.x + 130, this.prizeButton.y + 100, "Ad", { font: "72px Paytone One", fill: "#ffe4b5", align: "Right" }, this.prizeButtonGroup);
        this.prizeButtonTextNum = SimpleGame.myGame.add.text(this.prizeButton.x + 130, this.prizeButton.y + 170, "x1", { font: "48px Paytone One", fill: "#ffe4b5", align: "Right" }, this.prizeButtonGroup);
        this.prizeButtonGiftIcon = SimpleGame.myGame.add.sprite(this.prizeButton.x + 170, this.prizeButton.y + 130, 'gift_lit_icon01', '', this.prizeButtonGroup);
        this.prizeButtonTextAd.anchor.set(0.5, 0.5);
        this.prizeButtonTextNum.anchor.set(0.5, 0.5);
        this.prizeButton.imgNormal.smoothed = true;
        this.addGiftToPercentage(70);
        SimpleGame.myGame.time.events.loop(10, this.update, this);
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            this.topscoreboard.x = 350;
            this.buttonHome.x = 40;
            this.buttonHome.y = 40;
            this.topscorecrown.x = 200;
            this.topscorecrown.y = 50;
            this.bestScoreTxt.x = 360;
            this.bestScoreTxt.y = 50;
            this.scoreTxt.align = "Left";
            this.bestScoreTxt.align = "Left";
            this.scoreTxt.x = 360;
            this.scoreTxt.y = 240;
            this.bestScoreTxt.y = 70;
            this.scoreTxt.fontSize = 80;
            this.bestScoreTxt.fontSize = 56;
            this.buttonSettings.x = 1800;
            this.buttonSettings.y = 40;
        }
        this.setBarToFillPercent(0);
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            this.powerupButExplode = new PowerUpButton(Consts.POWERUP_ROTATE, 250, 820, this.regularGameplayGroup);
            this.powerupButRotate = new PowerUpButton(Consts.POWERUP_EXPLODE, 250, 700, this.regularGameplayGroup);
        }
        else {
            this.powerupButExplode = new PowerUpButton(Consts.POWERUP_ROTATE, 300, 1600, this.regularGameplayGroup);
            this.powerupButRotate = new PowerUpButton(Consts.POWERUP_EXPLODE, 720, 1600, this.regularGameplayGroup);
        }
        var indicatorInitX = 1820;
        var indicatorDeltaX = 0;
        var indicatorInitY = 285;
        var indicatorDeltaY = 235;
        this.redIndicatorArr = [];
        this.blueIndicatorArr = [];
        var i = 3;
        while (i-- > 0) {
            this.redIndicatorArr[i] = SimpleGame.myGame.add.sprite(indicatorInitX + i * indicatorDeltaX, indicatorInitY + i * indicatorDeltaY, 'powerup_indicator_red01', '', this.tutorialGroup);
            this.blueIndicatorArr[i] = SimpleGame.myGame.add.sprite(indicatorInitX + i * indicatorDeltaX, indicatorInitY + i * indicatorDeltaY, 'powerup_indicator_blue01', '', this.tutorialGroup);
            this.redIndicatorArr[i].angle = 90;
            this.blueIndicatorArr[i].angle = 90;
            SimpleGame.myGame.add.tween(this.redIndicatorArr[i]).to({ x: '20' }, 500, Phaser.Easing.Linear.None, true, 0, 100000000000000, true);
            SimpleGame.myGame.add.tween(this.blueIndicatorArr[i]).to({ x: '20' }, 500, Phaser.Easing.Linear.None, true, 0, 100000000000000, true);
            this.redIndicatorArr[i].visible = this.blueIndicatorArr[i].visible = false;
        }
        var alreadyExists = document.getElementById("adContainer");
        if (alreadyExists) {
            PokiSDK.destroyAd(adContainer);
            document.body.removeChild(alreadyExists);
        }
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT && GameContext.tutorialActive == false) {
            var adContainer = document.createElement("div");
            adContainer.setAttribute("id", "adContainer");
            var perc = (window.innerWidth / 320 - 1) / 2 * 100;
            adContainer.style.position = "absolute";
            adContainer.style.left = "" + Math.floor(perc) + "%";
            adContainer.style.bottom = "0%";
            document.body.appendChild(adContainer);
            PokiSDK.displayAd(adContainer, "320x50");
        }
        else if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE && GameContext.tutorialActive == false) {
            var adContainer = document.createElement("div");
            adContainer.setAttribute("id", "adContainer");
            var perc = (window.innerWidth / 320) / 2 * 100;
            perc = 50 - 320 / window.innerWidth / 2 * 100;
            console.log(window.innerWidth);
            adContainer.style.position = "absolute";
            adContainer.style.left = "" + Math.floor(perc) + "%";
            adContainer.style.bottom = "0%";
            document.body.appendChild(adContainer);
            PokiSDK.displayAd(adContainer, "320x50");
        }
    }
    GameUITop.prototype.scoreAnimation = function () {
        SimpleGame.myGame.add.tween(this.scoreTxt.scale).to({ x: 1.4, y: 1.4 }, 500, Phaser.Easing.Linear.None, true, 0, 0, true);
    };
    GameUITop.deselectedPowerup = function () {
        var i = this.myref.redIndicatorArr.length;
        while (i-- > 0) {
            this.myref.redIndicatorArr[i].visible = false;
            this.myref.blueIndicatorArr[i].visible = false;
        }
    };
    GameUITop.turnedOnExplodePowerup = function () {
        Tutorial.hideHand();
        console.log("tutorial active? " + GameContext.tutorialActive);
        if (GameContext.tutorialActive) {
            Tutorial.showHand();
        }
        console.log("deselect explode powerp");
        this.myref.powerupButExplode.deselect();
        var i = this.myref.redIndicatorArr.length;
        while (i-- > 0) {
            if (BoardUtil.getCubeGroupByPlacementIdx(i)) {
                this.myref.redIndicatorArr[i].visible = true;
            }
        }
        var i = this.myref.redIndicatorArr.length;
        while (i-- > 0) {
            this.myref.blueIndicatorArr[i].visible = false;
        }
    };
    GameUITop.turnedOnRotatePowerup = function () {
        Tutorial.hideHand();
        console.log("tutorial active? " + GameContext.tutorialActive);
        if (GameContext.tutorialActive) {
            Tutorial.showHand();
        }
        console.log("deselect rotate powerp");
        this.myref.powerupButRotate.deselect();
        var i = this.myref.redIndicatorArr.length;
        while (i-- > 0) {
            if (BoardUtil.getCubeGroupByPlacementIdx(i)) {
                this.myref.blueIndicatorArr[i].visible = true;
            }
        }
        var i = this.myref.redIndicatorArr.length;
        while (i-- > 0) {
            this.myref.redIndicatorArr[i].visible = false;
        }
    };
    GameUITop.prototype.getBarByPercentage = function (perc) {
        var totalSegments = this.loadBarArray.length;
        var filledSegments = Math.round(totalSegments * perc / 100);
        var spr = this.loadBarArray[filledSegments - 1];
        return spr;
    };
    GameUITop.prototype.addGiftToPercentage = function (percentage) {
        var spr = this.getBarByPercentage(percentage);
        console.log("add gift: " + SimpleGame.myGame.state, SimpleGame.myGame.state);
        this.giftUnlit = SimpleGame.myGame.add.sprite(spr.x, this.baseBarY, 'gift_unlit_icon01', '', this.regularGameplayGroup);
        this.giftUnlit.anchor.set(0.5, 0.5);
        this.giftlit = SimpleGame.myGame.add.sprite(spr.x, this.baseBarY, 'gift_lit_icon01', '', this.regularGameplayGroup);
        this.giftlit.anchor.set(0.5, 0.5);
        this.giftlit.inputEnabled = true;
        this.giftlit.events.onInputDown.add(this.giftTopClicked.bind(this), this);
        SimpleGame.myGame.add.tween(this.giftlit.scale).to({ x: 1.1, y: 1.1 }, 300, Phaser.Easing.Linear.None, true, 0, 10000000000, true);
        this.giftPercentage = percentage;
    };
    GameUITop.prototype.giftTopClicked = function () {
        this.giftlit.visible = false;
        this.giftlit.inputEnabled = false;
        var collectYourReward = new SelectYourReward(this.regularGameplayGroup);
    };
    GameUITop.prototype.giftClicked = function () {
        var collectYourReward = new CollectYourReward(this.regularGameplayGroup);
    };
    GameUITop.prototype.setBarToFillPercent = function (percentage, setImmediately) {
        if (setImmediately === void 0) { setImmediately = false; }
        if (percentage > 100) {
            percentage = 100;
            this.startNextLevel();
            return;
        }
        this.currentBarPercentage = percentage;
        var mult = percentage / 100;
        var totalSegments = this.loadBarArray.length;
        var filledSegments = Math.round(totalSegments * mult);
        // console.log("segments: "+  totalSegments, filledSegments)
        var i = totalSegments;
        while (i-- > 0) {
            this.loadBarArray[i].visible = false;
        }
        var i = filledSegments;
        while (i-- > 0) {
            this.loadBarArray[i].visible = true;
        }
    };
    GameUITop.prototype.startNextLevel = function () {
        // GameContext.availableAds++
        if (this.giftlit.inputEnabled) {
            GameContext.availableAds++;
        }
        this.replaceCurrentGift();
        GameContext.currentLevel++;
        this.setBarToFillPercent(0, true);
    };
    GameUITop.prototype.replaceCurrentGift = function () {
        this.giftlit.destroy();
        this.giftUnlit.destroy();
        this.addGiftToPercentage(30 + Math.floor(Math.random() * 40));
    };
    GameUITop.prototype.homeClicked = function () {
        console.log("home clicked");
        var backtomenup = new BackToMenuPrompt(this.regularGameplayGroup);
    };
    GameUITop.prototype.settingsClicked = function () {
        console.log("settings clicked");
        var settingsScreen = new SettingsScreen(this.regularGameplayGroup);
    };
    GameUITop.prototype.themeClicked = function () {
        var themeprompt = new ThemeSelectorPrompt(this.regularGameplayGroup);
    };
    GameUITop.prototype.update = function () {
        this.checkGiftVisibility();
        this.scoreTxt.text = "" + GameContext.score;
        this.bestScoreTxt.text = "" + GameContext.bestScore;
        if (GameContext.score > GameContext.bestScore) {
            GameContext.bestScore = GameContext.score;
            Util.setStorage(Consts.COOKIE_NAME_BEST_SCORE, GameContext.bestScore);
        }
        this.powerupButExplode.update();
        this.powerupButRotate.update();
        var nextScore = GameContext.getNextLevelScore(GameContext.currentLevel);
        var scoreUpUntilThisLevel = GameContext.getScoreUpUntilThisLevel(GameContext.currentLevel);
        var currentLevelScore = GameContext.score - scoreUpUntilThisLevel;
        var perc = currentLevelScore / nextScore * 100;
        // console.log(perc)
        var deltaBar = (perc - this.currentBarPercentage) * 0.1;
        var percToFeedToBar = this.currentBarPercentage + deltaBar;
        this.setBarToFillPercent(percToFeedToBar);
        this.prizeButtonTextNum.text = "x" + GameContext.availableAds;
        if (GameContext.availableAds > 0) {
            this.prizeButtonGroup.visible = true;
        }
        else {
            this.prizeButtonGroup.visible = false;
        }
        if (GameContext.tutorialActive) {
            this.regularGameplayGroup.visible = false;
            this.tutorialGroup.visible = true;
        }
        else {
            this.regularGameplayGroup.visible = true;
            this.tutorialGroup.visible = false;
        }
    };
    GameUITop.prototype.checkGiftVisibility = function () {
        if (this.currentBarPercentage > this.giftPercentage && this.giftlit.inputEnabled) {
            this.giftlit.visible = true;
        }
        else {
            this.giftlit.visible = false;
        }
    };
    return GameUITop;
}());
var ResizeManager = /** @class */ (function () {
    function ResizeManager() {
    }
    ResizeManager.update = function () {
        // return;
        console.log("resizeman update start");
        // if (Math.random() < 0.99) return
        var deviceWidth = window.innerWidth;
        var deviceHeight = window.innerHeight;
        //SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        SimpleGame.myGame.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        if (deviceWidth > deviceHeight) {
            // console.log("Gamecontext.orientation is initialized to landscape")
            GameContext.orientation = Consts.ORIENTATION_LANDSCAPE;
            ResizeManager.INTERNAL_GAME_WIDTH = 1920;
            ResizeManager.INTERNAL_GAME_WIDTH_ORIGINAL = 1920;
            ResizeManager.INTERNAL_GAME_HEIGHT = 1080;
            SimpleGame.myGame.scale.setGameSize(deviceWidth * devicePixelRatio, deviceHeight * devicePixelRatio);
        }
        else {
            // console.log("Gamecontext.orientation is initialized to portrait")
            GameContext.orientation = Consts.ORIENTATION_PORTRAIT;
            ResizeManager.INTERNAL_GAME_WIDTH = 1593 * 0.75;
            ResizeManager.INTERNAL_GAME_WIDTH_ORIGINAL = 1593;
            ResizeManager.INTERNAL_GAME_HEIGHT = 2180;
            SimpleGame.myGame.scale.setGameSize(deviceWidth * devicePixelRatio, deviceHeight * devicePixelRatio);
        }
        // console.log(SimpleGame.myGame.width, SimpleGame.myGame.height)
        var gameScaleX = SimpleGame.myGame.width / this.INTERNAL_GAME_WIDTH;
        var gameScaleY = SimpleGame.myGame.height / this.INTERNAL_GAME_HEIGHT;
        SimpleGame.appbackgroundleft.visible = SimpleGame.appbackgroundright.visible = true;
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            SimpleGame.appbackgroundleft.visible = SimpleGame.appbackgroundright.visible = false;
            if (gameScaleX > gameScaleY) {
                var scale = gameScaleY;
                SimpleGame.layerGame.scale.set(scale, scale);
                SimpleGame.layerGame.x = (SimpleGame.myGame.width - this.INTERNAL_GAME_WIDTH * scale) / 2;
                SimpleGame.layerGame.y = 0;
            }
            else {
                var scale = (gameScaleX + gameScaleY) / 2;
                SimpleGame.layerGame.scale.set(scale, scale);
                SimpleGame.layerGame.x = (SimpleGame.myGame.width - this.INTERNAL_GAME_WIDTH * scale) / 2;
                SimpleGame.layerGame.y = 0;
            }
        }
        else {
            if (gameScaleX > gameScaleY) {
                var scale = gameScaleY;
                SimpleGame.layerGame.scale.set(scale, scale);
                SimpleGame.layerGame.x = (SimpleGame.myGame.width - this.INTERNAL_GAME_WIDTH * scale) / 2;
                SimpleGame.layerGame.y = 0;
            }
            else {
                var scale = gameScaleX;
                SimpleGame.layerGame.scale.set(scale, scale);
                SimpleGame.layerGame.y = (SimpleGame.myGame.height - this.INTERNAL_GAME_HEIGHT * scale) / 2;
                SimpleGame.layerGame.x = 0;
            }
        }
        ResizeManager.gameScale = scale;
        SimpleGame.appbackgroundleft.width = SimpleGame.layerGame.x;
        SimpleGame.appbackgroundleft.height = deviceHeight;
        SimpleGame.appbackgroundright.anchor.set(1, 0);
        SimpleGame.appbackgroundright.width = SimpleGame.appbackgroundleft.width + 1;
        SimpleGame.appbackgroundright.height = deviceHeight;
        SimpleGame.appbackgroundright.x = deviceWidth;
        // SimpleGame.appbackground.x += 1
        // console.log(SimpleGame.appbackground.x)
        // SimpleGame.appbackground.x = deviceWidth/2
        // SimpleGame.appbackground.y = deviceWidth/2
    };
    ResizeManager.INTERNAL_GAME_WIDTH = 1593 * 0.75 * 0.5;
    ResizeManager.INTERNAL_GAME_WIDTH_ORIGINAL = 1593 * 0.5;
    ResizeManager.INTERNAL_GAME_HEIGHT = 2180 * 0.5;
    ResizeManager.gameScale = 1;
    return ResizeManager;
}());
var SoundManager = /** @class */ (function () {
    function SoundManager() {
    }
    SoundManager.playClick = function () {
        if (SoundManager.canPlayClick) {
            // SoundManager.click.startTime = 0.1;
            // SoundManager.click.position = SoundManager.click.duration-100;
            // SoundManager.click.update()
            console.log("play CLICK");
            SoundManager.click.play();
            SoundManager.canPlayClick = false;
            // console.log("cannot play click")
            SimpleGame.myGame.time.events.add(100, function () {
                // console.log("can play click")
                SoundManager.canPlayClick = true;
            }, this);
        }
    };
    SoundManager.init = function () {
        SoundManager.sManager = new Phaser.SoundManager(SimpleGame.myGame);
        // SoundManager.deal1card.allowMultiple = true;
        // SoundManager.hint.volume = 0.7;
    };
    SoundManager.playGrabCard = function () {
        if (SoundManager.canPlayGrab && SoundManager.grabcard.mute == false) {
            //  console.log("play CLICK")
            SoundManager.grabcard.play();
            SoundManager.canPlayGrab = false;
            // console.log("cannot play click")
            SimpleGame.myGame.time.events.add(100, function () {
                // console.log("can play click")
                SoundManager.canPlayGrab = true;
            }, this);
        }
    };
    SoundManager.setMuteFlags = function (muteFlag) {
        SoundManager.Door.mute = muteFlag;
        SoundManager.LineBreaks.mute = muteFlag;
        SoundManager.Block_Shake.mute = muteFlag;
        SoundManager.click.mute = muteFlag;
        SoundManager.Pickup.mute = muteFlag;
        SoundManager.NewPiece.mute = muteFlag;
        SoundManager.WrongPosition.mute = muteFlag;
    };
    SoundManager.setVoiceMuteFlags = function (muteFlag) {
        SoundManager.Amazing.mute = muteFlag;
        SoundManager.Awesome.mute = muteFlag;
        SoundManager.Boss.mute = muteFlag;
        SoundManager.Easy.mute = muteFlag;
        SoundManager.Fantastic.mute = muteFlag;
        SoundManager.GoodJob.mute = muteFlag;
        SoundManager.Insane.mute = muteFlag;
        SoundManager.OhYeah.mute = muteFlag;
        SoundManager.Super.mute = muteFlag;
        SoundManager.Genius.mute = muteFlag;
        SoundManager.Great.mute = muteFlag;
        SoundManager.Perfect.mute = muteFlag;
        SoundManager.Wow.mute = muteFlag;
    };
    SoundManager.playDealRow = function () {
        SoundManager.timesToPlayDealSound = 10;
        SoundManager.playDealRowSound();
    };
    SoundManager.playDealRowSound = function () {
        return;
        SoundManager.dealcards.position = 200;
        SoundManager.dealcards.update();
        SoundManager.dealcards.play();
        // console.log("play dealcards")
        SoundManager.timesToPlayDealSound--;
        if (SoundManager.timesToPlayDealSound > 0) {
            SimpleGame.myGame.time.events.add(80, function () {
                SoundManager.playDealRowSound();
            });
        }
    };
    SoundManager.timesToPlayDealSound = 10;
    SoundManager.canPlayClick = true;
    SoundManager.canPlayGrab = true;
    return SoundManager;
}());
var SpawnUtil = /** @class */ (function () {
    function SpawnUtil() {
    }
    SpawnUtil.spawnExplodeCubeGroup = function (currentCubeGroupType, currentCubeGroupPos, cubeGroupNotPlacedArray, layerMovingGroups) {
        var myPool;
        if (GameContext.currentLevel == 0 || GameContext.currentLevel == 1) {
            myPool = this.level1Pool;
        }
        else if (GameContext.currentLevel == 2 || GameContext.currentLevel == 3) {
            myPool = this.level2Pool;
        }
        else if (GameContext.currentLevel == 4 || GameContext.currentLevel == 5) {
            myPool = this.level3Pool;
        }
        else if (GameContext.currentLevel == 5 || GameContext.currentLevel == 6) {
            myPool = this.level4Pool;
        }
        else {
            myPool = this.level5Pool;
        }
        var idx;
        do {
            idx = this.getRandom(myPool);
            // console.log(currentCubeGroupType, idx)
        } while (idx == currentCubeGroupType);
        if (Tutorial.myState == Tutorial.STATE_STEP_3) {
            Tutorial.gotoStep4();
            idx = Consts.GROUP_TYPE_DUO_CUBE_VERTICAL;
            if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
                idx = Consts.GROUP_TYPE_DUO_CUBE_HORIZONTAL;
            }
        }
        var cubegroup1 = new CubeGroup(idx, layerMovingGroups, currentCubeGroupPos);
        cubeGroupNotPlacedArray.push(cubegroup1);
    };
    SpawnUtil.addNewCubeGroups = function (cubeGroupNotPlacedArray, layerMovingGroups) {
        SoundManager.NewPiece.play();
        var myPool;
        if (GameContext.currentLevel == 0 || GameContext.currentLevel == 1) {
            myPool = this.level1Pool;
        }
        else if (GameContext.currentLevel == 2 || GameContext.currentLevel == 3) {
            myPool = this.level2Pool;
        }
        else if (GameContext.currentLevel == 4 || GameContext.currentLevel == 5) {
            myPool = this.level3Pool;
        }
        else if (GameContext.currentLevel == 5 || GameContext.currentLevel == 6) {
            myPool = this.level4Pool;
        }
        else {
            myPool = this.level5Pool;
        }
        var cubegroup1 = new CubeGroup(this.getRandom(myPool), layerMovingGroups, 0);
        var cubegroup2 = new CubeGroup(this.getRandom(myPool), layerMovingGroups, 1);
        var cubegroup3 = new CubeGroup(this.getRandom(myPool), layerMovingGroups, 2);
        cubeGroupNotPlacedArray.push(cubegroup1);
        cubeGroupNotPlacedArray.push(cubegroup2);
        cubeGroupNotPlacedArray.push(cubegroup3);
    };
    SpawnUtil.getRandom = function (pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    };
    SpawnUtil.level1Pool = [0, 0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 11, 11];
    SpawnUtil.level2Pool = [0, 0, 1, 2, 3, 4, 5, 6, 11, 11, 7, 8, 9, 10, 11];
    SpawnUtil.level3Pool = [0, 0, 1, 2, 3, 4, 5, 6, 5, 6, 11, 11, 7, 8, 9, 10, 11, 12, 13, 14, 15, 11];
    SpawnUtil.level4Pool = [0, 0, 1, 2, 3, 4, 5, 6, 5, 6, 11, 11, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 11];
    SpawnUtil.level5Pool = [0, 0, 1, 2, 3, 4, 5, 6, 4, 5, 6, 7, 11, 11, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16, 11];
    return SpawnUtil;
}());
var Trace = /** @class */ (function () {
    function Trace() {
    }
    Trace.TraceCardByIdxAndPos = function (tableIdx, tablePos) {
        var i = Card.cardArray.length;
        while (i-- > 0) {
            var c = Card.cardArray[i];
            if (c.myTabIdx == tableIdx && c.tableuPosition == tablePos) {
                var name = CardUtil.cardNameArray[c.suitIdx * CardUtil.NUM_CARDS_PER_SUIT + c.cardIdx];
                console.log(name);
            }
        }
    };
    return Trace;
}());
var Tutorial = /** @class */ (function () {
    function Tutorial() {
    }
    Tutorial.showHand = function () {
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            this.hand.x = Consts.INITIAL_LOCATION_2_X_PORTRAIT + 50;
            this.hand.y = Consts.INITIAL_LOCATION_2_Y_PORTRAIT;
        }
        else {
            this.hand.x = Consts.INITIAL_LOCATION_2_X_LANDSCAPE;
            this.hand.y = Consts.INITIAL_LOCATION_2_Y_LANDSCAPE + 50;
        }
        console.log("SHOW HADN");
        if (this.hand != null) {
            this.hand.visible = true;
        }
    };
    Tutorial.hideHand = function () {
        if (this.hand != null) {
            this.hand.visible = false;
        }
    };
    Tutorial.tutorialCompleted = function () {
        Tutorial.myState = -1;
        GameContext.tutorialActive = false;
        BoardShadow.enableAllBoardShadows();
        GameScreen.myref.removeGameScreen();
        this.hand.visible = false;
        var gamescreen = new GameScreen();
        Util.setStorage(Consts.COOKIE_NAME_TUTORIAL_PLAYED, 1);
    };
    Tutorial.start = function () {
        console.log("tutorial start called");
        this.tutorialIconArr = [];
        Cube.createCubeAt(4, 0);
        Cube.createCubeAt(4, 1);
        Cube.createCubeAt(4, 2);
        Tutorial.createIconAt(4, 3);
        Tutorial.createIconAt(4, 4);
        Tutorial.createIconAt(4, 5);
        Cube.createCubeAt(4, 6);
        Cube.createCubeAt(4, 7);
        var cubeToSpawn = Consts.GROUP_TYPE_TRIO_CUBE_HORIZONTAL;
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            var cubeToSpawn = Consts.GROUP_TYPE_TRIO_CUBE_VERTICAL;
        }
        var cubegroup1 = new CubeGroup(cubeToSpawn, GameScreen.myref.layerMovingGroups, 1);
        GameScreen.myref.cubeGroupNotPlacedArray.push(cubegroup1);
        this.hand = SimpleGame.myGame.add.sprite(-500, -500, 'hand_tutorial_bw_01', '', GameUITop.myref.tutorialGroup);
        this.hand.scale.set(0.5, 0.5);
        SimpleGame.myGame.add.tween(this.hand.scale).to({ x: 0.55, y: 0.55 }, 400, Phaser.Easing.Linear.None, true, 0, 1000000, true);
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            this.hand.x = Consts.INITIAL_LOCATION_2_X_PORTRAIT + 50;
            this.hand.y = Consts.INITIAL_LOCATION_2_Y_PORTRAIT;
        }
        else {
            this.hand.x = Consts.INITIAL_LOCATION_2_X_LANDSCAPE;
            this.hand.y = Consts.INITIAL_LOCATION_2_Y_LANDSCAPE + 50;
        }
        this.hand.visible = false;
        SimpleGame.myGame.time.events.add(1000, function () {
            this.hand.visible = true;
        }.bind(this), this);
        BoardShadow.disableAllBoardShadows();
        BoardShadow.enableBoardShadow(4, 3);
        BoardShadow.enableBoardShadow(4, 4);
        BoardShadow.enableBoardShadow(4, 5);
        GameContext.rotatePowerupsCount = 1;
        GameContext.explodePowerupsCount = 1;
        Tutorial.myState = Tutorial.STATE_STEP_1;
    };
    Tutorial.gotoStep2 = function () {
        this.hand.visible = false;
        console.log("goto step 2 called");
        this.removeIcons();
        Cube.removeAll();
        console.log("gotostep 2");
        Cube.createCubeAt(0, 3);
        Cube.createCubeAt(1, 3);
        Cube.createCubeAt(2, 3);
        Tutorial.createIconAt(3, 3);
        Tutorial.createIconAt(4, 3);
        Tutorial.createIconAt(5, 3);
        Cube.createCubeAt(6, 3);
        Cube.createCubeAt(7, 3);
        BoardShadow.disableAllBoardShadows();
        BoardShadow.enableBoardShadow(3, 3);
        BoardShadow.enableBoardShadow(4, 3);
        BoardShadow.enableBoardShadow(5, 3);
        var cubeToSpawn = Consts.GROUP_TYPE_TRIO_CUBE_HORIZONTAL;
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            var cubeToSpawn = Consts.GROUP_TYPE_TRIO_CUBE_VERTICAL;
        }
        SimpleGame.myGame.time.events.add(1000, function () {
            this.hand.visible = true;
        }.bind(this), this);
        var cubegroup1 = new CubeGroup(cubeToSpawn, GameScreen.myref.layerMovingGroups, 1);
        GameScreen.myref.cubeGroupNotPlacedArray.push(cubegroup1);
        GameUITop.myref.tutorialText.text = "Make horizontal lines...";
        Tutorial.myState = Tutorial.STATE_STEP_2;
    };
    Tutorial.gotoStep3 = function () {
        this.removeIcons();
        Cube.removeAll();
        console.log("goto step 3");
        Cube.createCubeAt(0, 4);
        Cube.createCubeAt(1, 4);
        Cube.createCubeAt(2, 4);
        Tutorial.createIconAt(3, 4);
        Tutorial.createIconAt(4, 4);
        Cube.createCubeAt(5, 4);
        Cube.createCubeAt(6, 4);
        Cube.createCubeAt(7, 4);
        BoardShadow.disableAllBoardShadows();
        BoardShadow.enableBoardShadow(3, 4);
        BoardShadow.enableBoardShadow(4, 4);
        GameUITop.myref.tutorialText.text = "Use a powerup to swap the piece";
        // this.hand = SimpleGame.myGame.add.sprite(GameUITop.myref.powerupButRotate.myBackgroundSprite.x+100,GameUITop.myref.powerupButRotate.myBackgroundSprite.y+100,'hand_tutorial_bw_01', '', GameUITop.myref.tutorialGroup)
        // this.hand.scale.set(0.5, 0.5)
        // SimpleGame.myGame.add.tween(this.hand.scale).to({x:0.55, y:0.55}, 400, Phaser.Easing.Linear.None, true, 0, 1000000, true)
        this.hand.x = GameUITop.myref.powerupButRotate.myBackgroundSprite.x + 100;
        this.hand.y = GameUITop.myref.powerupButRotate.myBackgroundSprite.y + 200;
        var cubegroup1 = new CubeGroup(Consts.GROUP_TYPE_TETRIS_CUBE_BIG_CUBE, GameScreen.myref.layerMovingGroups, 1);
        GameScreen.myref.cubeGroupNotPlacedArray.push(cubegroup1);
        cubegroup1.lock();
        Tutorial.myState = Tutorial.STATE_STEP_3;
        GameUITop.myref.powerupButRotate.addTo(GameUITop.myref.tutorialGroup);
    };
    Tutorial.gotoStep4 = function () {
        Tutorial.myState = Tutorial.STATE_STEP_4;
        console.log("TUTORIAL STEP 4");
        this.hand.visible = true;
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            this.hand.x = Consts.INITIAL_LOCATION_2_X_PORTRAIT + 50;
            this.hand.y = Consts.INITIAL_LOCATION_2_Y_PORTRAIT;
        }
        else {
            this.hand.x = Consts.INITIAL_LOCATION_2_X_LANDSCAPE;
            this.hand.y = Consts.INITIAL_LOCATION_2_Y_LANDSCAPE + 50;
        }
    };
    Tutorial.gotoStep5 = function () {
        Tutorial.myState = Tutorial.STATE_STEP_5;
        this.removeIcons();
        Cube.removeAll();
        Cube.createCubeAt(0, 2);
        Cube.createCubeAt(1, 2);
        Tutorial.createIconAt(2, 2);
        Tutorial.createIconAt(3, 2);
        Tutorial.createIconAt(4, 2);
        Cube.createCubeAt(5, 2);
        Cube.createCubeAt(6, 2);
        Cube.createCubeAt(7, 2);
        BoardShadow.disableAllBoardShadows();
        BoardShadow.enableBoardShadow(2, 2);
        BoardShadow.enableBoardShadow(3, 2);
        BoardShadow.enableBoardShadow(4, 2);
        GameUITop.myref.tutorialText.text = "Use a powerup to rotate the piece";
        this.hand.visible = true;
        this.hand.x = GameUITop.myref.powerupButExplode.myBackgroundSprite.x + 100;
        this.hand.y = GameUITop.myref.powerupButExplode.myBackgroundSprite.y + 200;
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            this.hand.y = GameUITop.myref.powerupButExplode.myBackgroundSprite.y + 100;
        }
        var cubeToSpawn = Consts.GROUP_TYPE_TRIO_CUBE_HORIZONTAL;
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            var cubeToSpawn = Consts.GROUP_TYPE_TRIO_CUBE_VERTICAL;
        }
        GameUITop.myref.powerupButRotate.addTo(GameUITop.myref.regularGameplayGroup);
        var cubegroup1 = new CubeGroup(cubeToSpawn, GameScreen.myref.layerMovingGroups, 1);
        GameScreen.myref.cubeGroupNotPlacedArray.push(cubegroup1);
        cubegroup1.lock();
        GameUITop.myref.powerupButExplode.addTo(GameUITop.myref.tutorialGroup);
    };
    Tutorial.removeIcons = function () {
        var i = this.tutorialIconArr.length;
        while (i-- > 0) {
            this.tutorialIconArr[i].destroy();
        }
        this.tutorialIconArr = [];
    };
    Tutorial.createIconAt = function (x, y) {
        var cubeSpr = SimpleGame.myGame.add.sprite(0, 0, 'icon-swap', '', GameScreen.myref.layerBoard);
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            cubeSpr.x = Consts.BOARD_INIT_X_LANDSCAPE + (0.5 + x) * Consts.BOARD_DELTA_X_LANDSCAPE;
            cubeSpr.y = Consts.BOARD_INIT_Y_LANDSCAPE + (0.5 + y) * Consts.BOARD_DELTA_Y_LANDSCAPE;
        }
        else {
            cubeSpr.x = Consts.BOARD_INIT_X_PORTRAIT + (0.5 + x) * Consts.BOARD_DELTA_X_PORTRAIT;
            cubeSpr.y = Consts.BOARD_INIT_Y_PORTRAIT + (0.5 + y) * Consts.BOARD_DELTA_Y_PORTRAIT;
        }
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            cubeSpr.width = Consts.BOARD_DELTA_X_PORTRAIT;
            cubeSpr.height = Consts.BOARD_DELTA_X_PORTRAIT;
        }
        else {
            cubeSpr.width = Consts.BOARD_DELTA_X_LANDSCAPE;
            cubeSpr.height = Consts.BOARD_DELTA_X_LANDSCAPE;
        }
        cubeSpr.anchor.set(0.5, 0.5);
        this.tutorialIconArr.push(cubeSpr);
    };
    Tutorial.STATE_STEP_1 = 0;
    Tutorial.STATE_STEP_2 = 1;
    Tutorial.STATE_STEP_3 = 2;
    Tutorial.STATE_STEP_4 = 3;
    Tutorial.STATE_STEP_5 = 4;
    return Tutorial;
}());
var OnOffButton = /** @class */ (function () {
    function OnOffButton(parent, x, y, onFlag, myIdx) {
        if (myIdx === void 0) { myIdx = 0; }
        this.toggleOnX = 120;
        this.toggleOffX = 10;
        this.onFlag = false;
        if (myIdx == 0) {
            onFlag = GameContext.soundFlag;
            console.log("onoffbutflags: " + myIdx, onFlag);
        }
        else {
            onFlag = GameContext.voiceFlag;
            console.log("onoffbutflags: " + myIdx, onFlag);
        }
        this.myIdx = myIdx;
        this.onFlag = onFlag;
        this.mygroup = SimpleGame.myGame.add.group(parent);
        this.mygroup.x = x;
        this.mygroup.y = y;
        this.offbtn = SimpleGame.myGame.add.sprite(0, 0, 'OFF_BTN', '', this.mygroup);
        this.onbtn = SimpleGame.myGame.add.sprite(0, 0, 'ON_BTN', '', this.mygroup);
        this.toggle = SimpleGame.myGame.add.sprite(10, 9, 'OnOff_toggleBTN', '', this.mygroup);
        // this.offbtn.inputEnabled = true;
        this.offbtn.events.onInputDown.add(this.setToOnPositionWithTween, this, 0, [false]);
        // this.onbtn.inputEnabled = true;
        this.onbtn.events.onInputDown.add(this.setToOffPositionWithTween, this, 0, [false]);
        if (this.onFlag) {
            this.setToOnPosition(true);
        }
        else {
            this.setToOffPosition(true);
        }
    }
    OnOffButton.prototype.setToOffPositionWithTween = function (setToOffPositionWithTween, arg1, arg2, arg3) {
        this.setToOffPosition(false);
    };
    OnOffButton.prototype.setToOnPositionWithTween = function (setToOnPositionWithTween, arg1, arg2, arg3) {
        this.setToOnPosition(false);
    };
    OnOffButton.prototype.setToOnPosition = function (immediately) {
        if (immediately === void 0) { immediately = true; }
        this.onFlag = true;
        if (this.myIdx == 0) {
            GameContext.soundFlag = true;
        }
        else if (this.myIdx == 1) {
            GameContext.voiceFlag = true;
        }
        this.saveFlags();
        // console.log("imm falg: " + immediately)
        SimpleGame.myGame.time.events.add(150, function () {
            this.onbtn.inputEnabled = true;
            this.offbtn.inputEnabled = false;
        }, this);
        if (immediately) {
            this.toggle.x = this.toggleOnX;
        }
        else {
            this.toggle.x = this.toggleOnX;
            // SimpleGame.myGame.add.tween(this.toggle).to({x:this.toggleOnX}, 800, Phaser.Easing.Linear.None, true)
        }
        this.offbtn.visible = false;
        this.onbtn.visible = true;
    };
    OnOffButton.prototype.setToOffPosition = function (immediately) {
        if (immediately === void 0) { immediately = true; }
        this.onFlag = false;
        if (this.myIdx == 0) {
            GameContext.soundFlag = false;
        }
        else if (this.myIdx == 1) {
            GameContext.voiceFlag = false;
        }
        this.saveFlags();
        SimpleGame.myGame.time.events.add(150, function () {
            this.onbtn.inputEnabled = false;
            this.offbtn.inputEnabled = true;
        }, this);
        if (immediately) {
            this.toggle.x = this.toggleOffX;
        }
        else {
            this.toggle.x = this.toggleOffX;
            // SimpleGame.myGame.add.tween(this.toggle).to({x:this.toggleOnX}, 800, Phaser.Easing.Linear.None, true)
        }
        this.offbtn.visible = true;
        this.onbtn.visible = false;
    };
    OnOffButton.prototype.saveFlags = function () {
        if (GameContext.voiceFlag) {
            Util.setStorage(Consts.COOKIE_VOICE_FLAG, 1);
        }
        else {
            Util.setStorage(Consts.COOKIE_VOICE_FLAG, 0);
        }
        if (GameContext.soundFlag) {
            Util.setStorage(Consts.COOKIE_SOUND_FLAG, 1);
        }
        else {
            Util.setStorage(Consts.COOKIE_SOUND_FLAG, 0);
        }
        SoundManager.setMuteFlags(!GameContext.soundFlag);
        SoundManager.setVoiceMuteFlags(!GameContext.voiceFlag);
    };
    return OnOffButton;
}());
var PowerUpButton = /** @class */ (function () {
    function PowerUpButton(myType, x, y, parent) {
        this.myState = 0;
        this.inputBanned = false;
        this.myGroup = SimpleGame.myGame.add.group(parent);
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            this.myGroup.scale.set(1.1, 1.1);
            this.myGroup.y -= 80;
            this.myGroup.x -= 60;
        }
        this.myBackgroundSprite = SimpleGame.myGame.add.sprite(x - 40, y - 3, 'powerup_BTN02', '', this.myGroup);
        this.myType = myType;
        if (myType == Consts.POWERUP_ROTATE) {
            PowerUpButton.rotateButton = this;
            this.mysprUnlit = SimpleGame.myGame.add.sprite(x , y, 'rotate_unlit_icon_BTN01', '', this.myGroup);
            this.mysprLit = SimpleGame.myGame.add.sprite(x , y, 'rotate_lit_icon_BTN01', '', this.myGroup);
        }
        else {
            PowerUpButton.explodeButton = this;
            this.mysprUnlit = SimpleGame.myGame.add.sprite(x + 20, y, 'dinamit_unlit_icon_BTN01', '', this.myGroup);
            this.mysprLit = SimpleGame.myGame.add.sprite(x + 20, y, 'dinamit_lit_icon_BTN01', '', this.myGroup);
        }
        this.mysprLit.scale.set(0.85, 0.85);
        this.mysprUnlit.scale.set(0.85, 0.85);
        this.myTxt = SimpleGame.myGame.make.text(x + 130, y + 10, "x1", { font: "42px Paytone One", fill: "#ffe4b5", align: "Right" });
        this.myGroup.add(this.myTxt);
        this.myTxtAd = SimpleGame.myGame.make.text(x - 20, y + 25, "", { font: "24px Paytone One", fill: "#ffe4b5", align: "Right" });
        this.myGroup.add(this.myTxtAd);
        this.myBackgroundSprite.inputEnabled = true;
        this.myBackgroundSprite.input.useHandCursor = true;
        this.myBackgroundSprite.events.onInputDown.add(this.clicked, this);
        this.myBackgroundSprite.hitArea = new Phaser.Rectangle(-50, -50, this.myBackgroundSprite.width + 50, this.myBackgroundSprite.height + 50);
        if (myType == Consts.POWERUP_ROTATE) {
            this.buttonSelected = SimpleGame.myGame.add.sprite(x - 40, y - 9, 'powerup_highlightBTN_blue01', '', this.myGroup);
        }
        else {
            this.buttonSelected = SimpleGame.myGame.add.sprite(x - 40, y - 9, 'powerup_highlightBTN_red01', '', this.myGroup);
        }
        this.buttonSelected.visible = false;
        this.buttonSelected.scale.set(0.95);
    }
    PowerUpButton.prototype.addTo = function (parent) {
        // parent.add(this.myBackgroundSprite)
        // parent.add(this.mysprUnlit)
        // parent.add(this.mysprLit)
        // parent.add(this.myTxt)
        // parent.add(this.myTxtAd)
        // parent.add(this.buttonSelected)
        parent.add(this.myGroup);
    };
    PowerUpButton.prototype.deselect = function () {
        console.log("deselect powerup");
        this.myState = PowerUpButton.STATE_DESELECTED;
        GameUITop.deselectedPowerup();
        this.buttonSelected.visible = false;
        // this.buttonSelected.destroy()
    };
    PowerUpButton.prototype.update = function () {
        if (this.myType == Consts.POWERUP_ROTATE) {
            this.numberAvailable = GameContext.rotatePowerupsCount;
        }
        else {
            this.numberAvailable = GameContext.explodePowerupsCount;
        }
        // console.log("update called: " + this.numberAvailable)
        this.myTxt.text = "x" + this.numberAvailable;
        if (this.numberAvailable > 0) {
            this.mysprLit.visible = true;
            this.mysprUnlit.visible = false;
            this.myTxtAd.visible = false;
        }
        else {
            this.mysprLit.visible = false;
            this.mysprUnlit.visible = true;
            this.myTxtAd.visible = true;
        }
        if (this.myState == PowerUpButton.STATE_SELECTED) {
            this.buttonSelected.visible = true;
        }
        else {
            this.buttonSelected.visible = false;
        }
    };
    PowerUpButton.prototype.clicked = function () {
        if (this.inputBanned == true)
            return;
        this.inputBanned = true;
        SimpleGame.myGame.time.events.add(200, function () {
            this.inputBanned = false;
        }, this);
        console.log("clicked powerup button");
        if (this.myState == PowerUpButton.STATE_DESELECTED) {
            if (this.numberAvailable > 0) {
                this.myState = PowerUpButton.STATE_SELECTED;
                if (this.myType == Consts.POWERUP_ROTATE) {
                    GameUITop.turnedOnRotatePowerup();
                }
                else {
                    GameUITop.turnedOnExplodePowerup();
                }
            }
            else {
                if (GameContext.tutorialActive)
                    return;
                if (this.myType == Consts.POWERUP_ROTATE) {
                    //GameContext.rewardedBreakRotate();
                }
                else {
                    //GameContext.rewardedBreakExplode();
                }
            }
        }
        else {
            this.myState = PowerUpButton.STATE_DESELECTED;
            GameUITop.deselectedPowerup();
        }
    };
    PowerUpButton.STATE_DESELECTED = 0;
    PowerUpButton.STATE_SELECTED = 1;
    return PowerUpButton;
}());
var SoundButton = /** @class */ (function () {
    function SoundButton(parent, imgNormalName, imgOverName, x, y) {
        var soundontxt = SimpleGame.myGame.make.text(0, 0, "" + Language.sound_on[Language.langIdx], {
            font: "26px Open Sans", fill: "#ffffff", fontWeight: "600"
        });
        this.soundOnBut = new ButtonWithOverAndText(soundontxt, parent, imgNormalName, imgOverName, x, y, this.toggleSoundButton.bind(this));
        this.soundOnBut.setXY(x, y);
        var soundofftxt = SimpleGame.myGame.make.text(0, 0, "" + Language.sound_off[Language.langIdx], {
            font: "26px Open Sans", fill: "#ffffff", fontWeight: "600"
        });
        this.soundOffBut = new ButtonWithOverAndText(soundofftxt, parent, imgNormalName, imgOverName, x, y, this.toggleSoundButton.bind(this));
        this.soundOffBut.setXY(x, y);
        this.setCorrectButtonVisible(true);
    }
    SoundButton.prototype.toggleSoundButton = function () {
        SoundButton.soundFlag = !SoundButton.soundFlag;
        // console.log("sound flag: " + SoundButton.soundFlag)
        this.setCorrectButtonVisible();
        SoundManager.setMuteFlags(!SoundButton.soundFlag);
        // console.log("mute flag: " + SoundManager.sManager.mute)
    };
    SoundButton.prototype.setCorrectButtonVisible = function (skipButtonOver) {
        if (skipButtonOver === void 0) { skipButtonOver = false; }
        // console.log("set correct but visible")
        if (SoundButton.soundFlag) {
            this.soundOnBut.setVisible();
            this.soundOffBut.setInvisible();
            if (!skipButtonOver)
                this.soundOnBut.onButtonOver();
        }
        else {
            this.soundOnBut.setInvisible();
            this.soundOffBut.setVisible();
            if (!skipButtonOver)
                this.soundOffBut.onButtonOver();
        }
    };
    SoundButton.manageTextualSoundButtons = function (sOnBut, sOffBut) {
        if (this.soundFlag) {
            console.log("sound is on!!!");
            sOffBut.goInvisible();
            sOnBut.goVisible();
        }
        else {
            sOnBut.goInvisible();
            sOffBut.goVisible();
        }
    };
    SoundButton.soundFlag = true;
    return SoundButton;
}());
var UndoButton = /** @class */ (function () {
    function UndoButton(parent, imgNormalName, imgOverName, x, y, onClickFunction) {
        if (onClickFunction === void 0) { onClickFunction = function () {
        }; }
        this.onClickExecuted = false;
        this.skipClickSound = false;
        this.skipMouseOver = false;
        this.imgnormalnamestr = imgNormalName;
        this.parent = parent;
        this.imgNormalName = imgNormalName;
        this.imgOverName = imgOverName;
        this.x = x;
        this.y = y;
        this.imgNormal = SimpleGame.myGame.make.sprite(this.x, this.y, imgNormalName);
        this.imgOver = SimpleGame.myGame.make.sprite(this.x, this.y, imgOverName);
        parent.add(this.imgNormal);
        parent.add(this.imgOver);
        this.imgNormal.inputEnabled = this.imgOver.inputEnabled = true;
        this.imgOver.inputEnabled = false;
        this.imgNormal.input.useHandCursor = true;
        UndoButton.myref = this;
        this.imgNormal.events.onInputDown.add(function () {
            this.onClickFunction();
            if (BoardManager.undoIsAvailable == false)
                this.imgOver.visible = false;
            if (SimpleGame.myGame.device.touch) {
                console.log("RESET");
                SimpleGame.myGame.input.reset();
                this.imgOver.visible = false;
            }
        }, this);
        this.imgNormal.events.onInputOver.add(function () {
            if (BoardManager.undoIsAvailable)
                this.imgOver.visible = true;
        }, this);
        this.imgNormal.events.onInputOut.add(function () {
            this.imgOver.visible = false;
        }, this);
        this.imgOver.visible = false;
        this.onClickFunction = onClickFunction;
        console.log("button created");
        SimpleGame.myGame.time.events.loop(10, this.update, this);
    }
    UndoButton.prototype.update = function () {
        // if (BoardManager.undoDisabled) this.imgOver.visible = false;
        if (BoardManager.undoIsAvailable == false)
            this.imgOver.visible = false;
    };
    return UndoButton;
}());
var BackToMenuPrompt = /** @class */ (function () {
    function BackToMenuPrompt(parent) {
        GameContext.gameplayStopped();
        console.log("added back to menu screen");
        this.myGroup = SimpleGame.myGame.add.group(parent);
        this.bgblack = SimpleGame.myGame.make.graphics(-2000, -2000);
        this.bgblack.beginFill(0x000000);
        this.bgblack.drawRect(0, 0, 4000, 4000);
        this.bgblack.endFill();
        this.bgblack.alpha = 0.67;
        this.bgblack.inputEnabled = true;
        this.myGroup.add(this.bgblack);
        this.mybg = SimpleGame.myGame.add.sprite(0, 0, 'small_board_wood01', '', this.myGroup);
        this.mybg.anchor.set(0.5, 0.5);
        this.myGroup.x = ResizeManager.INTERNAL_GAME_WIDTH / 2;
        this.myGroup.y = ResizeManager.INTERNAL_GAME_HEIGHT / 2;
        this.backtomenuTxt = SimpleGame.myGame.add.text(0, -200, "Back to menu?", { font: "72px Paytone One", fill: "#ffffff", align: "Right" });
        this.backtomenuTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.backtomenuTxt);
        this.backtomenuTxt2 = SimpleGame.myGame.add.text(0, -50, "you're going to lose the current progress", { font: "40px Paytone One", fill: "#ffffff", align: "Center" });
        this.backtomenuTxt2.anchor.set(0.5, 0.5);
        this.myGroup.add(this.backtomenuTxt2);
        this.backtomenuTxt2.wordWrap = true;
        this.backtomenuTxt2.wordWrapWidth = 600;
        this.yesTxt = SimpleGame.myGame.add.text(0, -200, "Yes", { font: "72px Paytone One", fill: "#7b3f00", align: "Center" });
        this.noTxt = SimpleGame.myGame.add.text(0, -200, "No", { font: "72px Paytone One", fill: "#7b3f00", align: "Center" });
        this.yesBut = new PlayButton(this.yesTxt, this.myGroup, 'yes-no_up_BTN', 'yes-no_down_BTN', -400, 100, this.yesButClicked.bind(this));
        this.noBut = new PlayButton(this.noTxt, this.myGroup, 'yes-no_up_BTN', 'yes-no_down_BTN', 50, 100, this.noButClicked.bind(this));
        this.yesBut.textYDelta = -20;
        this.noBut.textYDelta = -20;
    }
    BackToMenuPrompt.prototype.noButClicked = function () {
        this.myGroup.destroy();
        GameContext.commercialBreak();
    };
    BackToMenuPrompt.prototype.yesButClicked = function () {
        GameContext.clearSavedData();
        this.myGroup.destroy();
        GameScreen.myref.removeGameScreen();
        var initmenuprompt = new InitMenuPrompt(false);
    };
    return BackToMenuPrompt;
}());
var CollectYourReward = /** @class */ (function () {
    function CollectYourReward(parent) {
        GameContext.gameplayStopped();
        this.parent = parent;
        this.myGroup = SimpleGame.myGame.add.group(parent);
        this.bgblack = SimpleGame.myGame.make.graphics(-2000, -2000);
        this.bgblack.beginFill(0x000000);
        this.bgblack.drawRect(0, 0, 4000, 4000);
        this.bgblack.endFill();
        this.bgblack.alpha = 0.67;
        this.bgblack.inputEnabled = true;
        this.myGroup.add(this.bgblack);
        // this.collectReward
        this.collectRewardTxt = SimpleGame.myGame.add.text(ResizeManager.INTERNAL_GAME_WIDTH / 2, 300, "Collect your reward!", { font: "72px Paytone One", fill: "#ffffff", align: "Right" });
        this.collectRewardTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.collectRewardTxt);
        this.giftSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, ResizeManager.INTERNAL_GAME_HEIGHT / 2, 'gift_lit_icon01', '', this.myGroup);
        this.giftSpr.anchor.set(0.5, 0.5);
        this.giftSpr.scale.set(3, 3);
        SimpleGame.myGame.add.tween(this.giftSpr.scale).to({ x: 3.3, y: 3.3 }, 300, Phaser.Easing.Linear.None, true, 0, 10000000000000, true);
        // SimpleGame.myGame.add.tween(this.giftSpr).to({}, 300, Phaser.Easing.Linear.None, true, 0, 10000000000000, true)
        this.openTxt = SimpleGame.myGame.add.text(0, -200, "Open", { font: "72px Paytone One", fill: "#7b3f00", align: "Center" });
        this.openBut = new PlayButton(this.openTxt, this.myGroup, 'yes-no_up_BTN', 'yes-no_down_BTN', ResizeManager.INTERNAL_GAME_WIDTH / 2 - 200, ResizeManager.INTERNAL_GAME_HEIGHT / 2 + 250, this.openButClicked.bind(this));
        this.openBut.textYDelta = -16;
    }
    CollectYourReward.prototype.openButClicked = function () {
        this.myGroup.destroy();
        GameContext.rewardedBreak();
    };
    return CollectYourReward;
}());
var GameOverPrompt = /** @class */ (function () {
    function GameOverPrompt(parent) {
        GameContext.clearSavedData();
        GameContext.gameplayStopped();
        this.myGroup = SimpleGame.myGame.add.group(parent);
        this.bgblack = SimpleGame.myGame.make.graphics(-2000, -2000);
        this.bgblack.beginFill(0x000000);
        this.bgblack.drawRect(0, 0, 4000, 4000);
        this.bgblack.endFill();
        this.bgblack.alpha = 0.67;
        this.bgblack.inputEnabled = true;
        this.myGroup.add(this.bgblack);
        this.myGroup.x = ResizeManager.INTERNAL_GAME_WIDTH / 2;
        this.myGroup.y = ResizeManager.INTERNAL_GAME_HEIGHT / 2;
        this.iconCrown = SimpleGame.myGame.add.sprite(0, -600, 'icon-crown', '', this.myGroup);
        this.iconLeaderboards = SimpleGame.myGame.add.sprite(0, -150, 'icon-leaderboards', '', this.myGroup);
        this.iconCrown.scale.set(0.2);
        this.iconLeaderboards.scale.set(0.2);
        this.iconCrown.anchor.set(0.5, 0.5);
        this.iconLeaderboards.anchor.set(0.5, 0.5);
        this.yourscoreTxt = SimpleGame.myGame.add.text(0, -500, "Your Score", { font: "36px Paytone One", fill: "#ffffff", align: "Center" });
        this.yourscoreTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.yourscoreTxt);
        this.yourscoreValueTxt = SimpleGame.myGame.add.text(0, -400, GameContext.score, { font: "76px Paytone One", fill: "#ffffff", align: "Center" });
        this.yourscoreValueTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.yourscoreValueTxt);
        this.yourbestscoreTxt = SimpleGame.myGame.add.text(0, -50, "Best Score", { font: "36px Paytone One", fill: "#ffffff", align: "Center" });
        this.yourbestscoreTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.yourbestscoreTxt);
        this.yourscorebestValueTxt = SimpleGame.myGame.add.text(0, 50, GameContext.bestScore, { font: "76px Paytone One", fill: "#ffffff", align: "Center" });
        this.yourscorebestValueTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.yourscorebestValueTxt);
        var playTxt = SimpleGame.myGame.make.text(440, 26, "New Game", { font: "72px Paytone One", fill: "#7b3f00", align: "Right" });
        var playBut = new PlayButton(playTxt, this.myGroup, 'Big_up_BTN', 'Big_down_BTN', 0, 300, this.playClicked.bind(this));
        playBut.textYDelta = -16;
        playBut.setXY(-420, 300);
    }
    GameOverPrompt.prototype.playClicked = function () {
        GameContext.clearSavedData();
        this.myGroup.destroy();
        //this.setBarToFillPercent(0, true);
        GameScreen.myref.removeGameScreen();
        var gamescreen = new GameScreen();
        GameContext.explodePowerupsCount = 1;
        GameContext.rotatePowerupsCount = 1;
    };
    return GameOverPrompt;
}());
var GameScreen = /** @class */ (function () {
    function GameScreen(orientationChanged) {
        if (orientationChanged === void 0) { orientationChanged = false; }
        this.orientationJustChangedFlag = orientationChanged;
        if (!orientationChanged) {
            PokiSDK.gameplayStop();
            PokiSDK.commercialBreak().then(function () {
                console.log("Commercial break finished, proceeding to game");
                // your code to continue to game
            });
        }
        GameScreen.myref = this;
        GameContext.initialize(orientationChanged);
        SimpleGame.myGame.scale.onOrientationChange.add(this.orientationChanged, this);
        // SimpleGame.myGame.scale.onSizeChange.add(this.orientationChanged, this)
        window.addEventListener("resize", this.orientationChanged);
        ResizeManager.update();
        // console.log(window.innerWidth, window.innerHeight)
        this.layerBackground = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.layerBoard = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.layerFixedCubes = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.layerDoors = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.layerMovingGroups = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.layerUITop = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.initializeBackground(GameContext.selectedTheme);
        this.cubeGroupNotPlacedArray = [];
        this.initializeUI();
        // GameContext.tutorialActive = true;
        // Tutorial.start()
        // return
        if (GameContext.loadFromSavedBoard() == false) {
            // GameContext.tutorialActive = true;
            if (GameContext.tutorialActive) {
                Tutorial.start();
            }
            else {
                this.addNewCubeGroups();
            }
        }
    }
    GameScreen.prototype.orientationChanged = function () {
        console.log("orientation/size changed");
        ResizeManager.update();
        // console.log("orientation changed")
        // this.orientationJustChangedFlag = true;
        // GameContext.saveBoardPositions()
        Cube.removeAll();
        GameScreen.myref.removeGameScreen();
        //    return
        console.log("all removed");
        SimpleGame.myGame.time.events.add(50, function () {
            Cube.removeAll();
            // console.log("cube placed arr len:" + Cube.placedCubesArray.length)
            Cube.placedCubesArray = [];
            var gamescreen = new GameScreen(true);
            // console.log("cube placed arr len:" + Cube.placedCubesArray.length)
            // if (GameContext.tutorialActive == false)
            // {
            //     GameContext.loadFromSavedBoard()
            // }
            // console.log("cube placed arr len:" + Cube.placedCubesArray.length)
        }.bind(this), this);
    };
    GameScreen.prototype.checkIfUnlockedGroupsAvailable = function () {
        var i = CubeGroup.cubeGroupArr.length;
        while (--i >= 0) {
            if (CubeGroup.cubeGroupArr[i].locked == false) {
                return true;
            }
        }
        return false;
    };
    GameScreen.prototype.removeGameScreen = function () {
        console.log("remove game screen started");
        this.layerBackground.destroy();
        this.layerBoard.destroy();
        this.layerFixedCubes.destroy();
        this.layerMovingGroups.destroy();
        this.layerUITop.destroy();
        CubeGroup.removeAll();
        Cube.removeAll();
        console.log("remove tweens and timers");
        SimpleGame.myGame.tweens.removeAll();
        SimpleGame.myGame.time.events.removeAll();
        SimpleGame.myGame.time.removeAll();
        console.log("remove game screen completed");
    };
    GameScreen.prototype.initializeUI = function () {
        this.gameUiTop = new GameUITop(this.layerUITop);
    };
    GameScreen.prototype.checkIfMatchMade = function () {
        console.log("check if match made");
        var i = Cube.placedCubesArray.length;
        while (i-- > 0) {
            var cFixed = Cube.placedCubesArray[i];
            console.log("" + i + ": " + cFixed.boardX + ", " + cFixed.boardY);
            this.checkHorizontal(cFixed.boardY);
        }
        var i = Cube.placedCubesArray.length;
        while (i-- > 0) {
            var cFixed = Cube.placedCubesArray[i];
            this.checkVertical(cFixed.boardX);
        }
        var piecesInMatch = 0;
        var i = Cube.placedCubesArray.length;
        while (i-- > 0) {
            var c = Cube.placedCubesArray[i];
            if (c.partOfHorizontalMatch || c.partOfVerticalMatch) {
                console.log("match is made");
                c.matchMade();
                piecesInMatch++;
                GameContext.allPiecesRemovedThisSession++;
            }
        }
        ComboText.createCombo(piecesInMatch);
    };
    GameScreen.prototype.checkVertical = function (fixedX) {
        var j = Cube.placedCubesArray.length;
        var totalFixedX = 0;
        while (j-- > 0) {
            var c0 = Cube.placedCubesArray[j];
            if (fixedX == c0.boardX) {
                totalFixedX++;
            }
        }
        // console.log(totalFixedX, Consts.BOARD_SIZE)
        if (totalFixedX == Consts.BOARD_SIZE) {
            //match made
            var j = Cube.placedCubesArray.length;
            var totalFixedX = 0;
            while (j-- > 0) {
                var c0 = Cube.placedCubesArray[j];
                if (fixedX == c0.boardX) {
                    c0.partOfVerticalMatch = true;
                }
            }
        }
    };
    GameScreen.prototype.checkHorizontal = function (fixedY) {
        var j = Cube.placedCubesArray.length;
        var totalFixedY = 0;
        while (j-- > 0) {
            var c0 = Cube.placedCubesArray[j];
            if (fixedY == c0.boardY) {
                totalFixedY++;
            }
        }
        // console.log(totalFixedY, Consts.BOARD_SIZE)
        if (totalFixedY == Consts.BOARD_SIZE) {
            //match made
            var j = Cube.placedCubesArray.length;
            var totalFixedY = 0;
            while (j-- > 0) {
                var c0 = Cube.placedCubesArray[j];
                if (fixedY == c0.boardY) {
                    c0.partOfHorizontalMatch = true;
                }
            }
        }
    };
    GameScreen.prototype.initializeBackground = function (selectedTheme) {
        console.log("initialize background called");
        ResizeManager.update();
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            console.log("orientation landscape: " + GameContext.orientation);
            selectedTheme++;
            var bgName = "bg_landscape";
            var boardName = "theme_0" + selectedTheme + "_board";
            var doorName = "theme_0" + selectedTheme + "_door";
            console.log(bgName, boardName, doorName);
            this.boardSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2 + 5, 140 + 10, boardName, '', this.layerBackground);
            this.boardSpr.anchor.set(0.5, 0);
            this.boardSpr.scale.set(0.785, 0.785);
            this.backgroundSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, 0, bgName, '', this.layerBackground);
            this.backgroundSpr.anchor.set(0.5, 0);
            this.doorSprLeft = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.36, 65, doorName, '', this.layerDoors);
            this.doorSprLeft.anchor.set(0.5, 0);
            this.doorSprLeft.scale.set(-1, 1);
            this.doorSprRight = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.64, 65, doorName, '', this.layerDoors);
            this.doorSprRight.anchor.set(0.5, 0);
            BoardShadow.initialize(this.layerBoard);
            this.mask = SimpleGame.myGame.make.graphics(ResizeManager.INTERNAL_GAME_WIDTH * 0.300, ResizeManager.INTERNAL_GAME_HEIGHT * 0.12);
            this.mask.beginFill(0x000000);
            this.mask.drawRect(0, 0, this.boardSpr.width, this.boardSpr.height - 30);
            this.mask.endFill();
            this.mask.alpha = 0.67;
            this.mask.inputEnabled = true;
            this.layerDoors.add(this.mask);
            this.doorSprLeft.mask = this.mask;
            this.doorSprRight.mask = this.mask;
            SimpleGame.myGame.time.events.add(500, function () {
                SoundManager.Door.play();
            }, this);
            SimpleGame.myGame.add.tween(this.doorSprLeft).to({ x: '-1000' }, 1000, Phaser.Easing.Linear.None, true, 500);
            SimpleGame.myGame.add.tween(this.doorSprRight).to({ x: '+1000' }, 1000, Phaser.Easing.Linear.None, true, 500);
        }
        else {
            console.log("orientation portait: " + GameContext.orientation);
            selectedTheme++;
            var bgName = "theme_0" + selectedTheme + "_bg";
            var boardName = "theme_0" + selectedTheme + "_board";
            var doorName = "theme_0" + selectedTheme + "_door";
            bgName = "WB_lightwood_BG_01HD_Poki02";
            this.boardSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2 + 3, 360 - 3, boardName, '', this.layerBackground);
            this.boardSpr.anchor.set(0.5, 0);
            this.doorSprLeft = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.27, 360, doorName, '', this.layerDoors);
            this.doorSprLeft.anchor.set(0.5, 0);
            this.doorSprLeft.scale.set(-1, 1);
            this.doorSprRight = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.73, 360, doorName, '', this.layerDoors);
            this.doorSprRight.anchor.set(0.5, 0);
            this.backgroundSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, 0, bgName, '', this.layerBackground);
            this.backgroundSpr.anchor.set(0.5, 0);
            BoardShadow.initialize(this.layerBoard);
            this.mask = SimpleGame.myGame.make.graphics(ResizeManager.INTERNAL_GAME_WIDTH * 0.075, ResizeManager.INTERNAL_GAME_HEIGHT * 0.16);
            this.mask.beginFill(0x000000);
            this.mask.drawRect(0, 0, 1020, 1020);
            this.mask.endFill();
            this.mask.alpha = 0.67;
            this.mask.inputEnabled = true;
            this.layerDoors.add(this.mask);
            this.doorSprLeft.mask = this.mask;
            this.doorSprRight.mask = this.mask;
            SimpleGame.myGame.add.tween(this.doorSprLeft).to({ x: '-1000' }, 1000, Phaser.Easing.Linear.None, true, 500);
            SimpleGame.myGame.add.tween(this.doorSprRight).to({ x: '+1000' }, 1000, Phaser.Easing.Linear.None, true, 500);
        }
        // return
        // this.addRandomCubesToBoard()
    };
    GameScreen.prototype.addRandomCubesToBoard = function () {
        var i = 8;
        while (i-- > 0) {
            var j = 8;
            while (j-- > 0) {
                if (Math.random() < 0.6)
                    continue;
                var c = new Cube(0, 0, this.layerFixedCubes, null);
                c.lastCollisionX = i;
                c.lastCollisionY = j;
                c.setToLastCollisionCoords();
            }
        }
    };
    // updateTheme(selectedTheme)
    // {
    //     console.log("update theme called: " + selectedTheme)
    //     selectedTheme++
    //     var bgName:string = "theme_0" + selectedTheme + "_bg";
    //     var boardName:string = "theme_0" + selectedTheme + "_board";
    //     var doorName:string = "theme_0" + selectedTheme + "_door";
    //     this.boardSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2+3, 490-3, boardName, '', this.layerBackground);
    //     this.boardSpr.anchor.set(0.5, 0)
    //     this.backgroundSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, 0, bgName, '', this.layerBackground);
    //     this.backgroundSpr.anchor.set(0.5, 0)
    // }
    GameScreen.prototype.addNewCubeGroups = function () {
        console.log("add new cube groups: " + this.orientationJustChangedFlag, GameContext.tutorialActive);
        if (this.orientationJustChangedFlag && GameContext.tutorialActive) {
            this.orientationJustChangedFlag = false;
            return;
        }
        else if (Tutorial.myState == Tutorial.STATE_STEP_1) {
            Tutorial.gotoStep2();
        }
        else if (Tutorial.myState == Tutorial.STATE_STEP_2) {
            Tutorial.gotoStep3();
        }
        else if (Tutorial.myState == Tutorial.STATE_STEP_4) {
            Tutorial.gotoStep5();
        }
        else if (Tutorial.myState == Tutorial.STATE_STEP_5) {
            Tutorial.removeIcons();
            var endTutorial = new TutorialCompletePrompt();
        }
        else {
            SpawnUtil.addNewCubeGroups(this.cubeGroupNotPlacedArray, this.layerMovingGroups);
        }
    };
    GameScreen.prototype.checkIfAllGroupsPlaced = function () {
        var allGroupsPlaced = true;
        var i = this.cubeGroupNotPlacedArray.length;
        while (i-- > 0) {
            var cg = this.cubeGroupNotPlacedArray[i];
            if (cg.successfullPlacementFlag == false) {
                allGroupsPlaced = false;
            }
        }
        if (allGroupsPlaced) {
            this.addNewCubeGroups();
        }
    };
    return GameScreen;
}());
var InitMenuPrompt = /** @class */ (function () {
    function InitMenuPrompt(firstGame) {
        if (firstGame === void 0) { firstGame = true; }
        InitMenuPrompt.onscreen = true;
        // return;
        // var gamescreen:GameScreen = new GameScreen()
        // return;
        GameContext.gameplayStopped();
        this.initmenubackgroundGroup = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.initmenugroup = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.playbutgroup = SimpleGame.myGame.add.group(SimpleGame.layerGame);
        this.logo = SimpleGame.myGame.add.image(ResizeManager.INTERNAL_GAME_WIDTH / 2, 100, 'WB_logo01', '', this.initmenugroup);
        this.logo.anchor.set(0.5, 0);
        this.initializeBlurredBackground(GameContext.selectedTheme);
        this.createPlayButton();
        SimpleGame.myGame.scale.onOrientationChange.add(this.orientationChanged, this);
        // SimpleGame.myGame.scale.onSizeChange.add(this.orientationChanged, this)
        window.addEventListener("resize", this.orientationChanged.bind(this));
    }
    InitMenuPrompt.prototype.orientationChanged = function () {
        // if (GameContext.tutorialActive) return
        this.removeAndRestartScreen();
    };
    InitMenuPrompt.prototype.createPlayButton = function () {
        var playTxt = SimpleGame.myGame.make.text(440, 26, "New Game", { font: "72px Paytone One", fill: "#7b3f00", align: "Right" });
        var playBut = new PlayButton(playTxt, this.playbutgroup, 'Big_up_BTN', 'Big_down_BTN', ResizeManager.INTERNAL_GAME_WIDTH / 2 - 420, 1200, this.playClicked.bind(this));
        playBut.textYDelta = -16;
        this.playbutgroup.x = ResizeManager.INTERNAL_GAME_WIDTH / 2;
        this.playbutgroup.y = ResizeManager.INTERNAL_GAME_HEIGHT / 2 + 300;
        playBut.x = -playBut.imgOver.width / 2;
        playBut.y = -playBut.imgOver.height / 2;
        SimpleGame.myGame.add.tween(this.playbutgroup.scale).to({ x: 1.2, y: 1.2 }, 600, Phaser.Easing.Linear.None, true, 0, 10000000000000000, true);
    };
    InitMenuPrompt.prototype.playClicked = function () {
        GameContext.clearSavedData();
        var gamescreen = new GameScreen();
        GameContext.explodePowerupsCount = 1;
        GameContext.rotatePowerupsCount = 1;

    };
    InitMenuPrompt.prototype.initializeBlurredBackground = function (selectedTheme) {
        selectedTheme++;
        if (GameContext.orientation == Consts.ORIENTATION_LANDSCAPE) {
            var bgName = "WB3D_html5_BGmain01";
            var boardName = "theme_0" + selectedTheme + "_board";
            var doorName = "theme_0" + selectedTheme + "_door";
            this.backgroundSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, 0, bgName, '', this.initmenubackgroundGroup);
            this.backgroundSpr.anchor.set(0.5, 0);
            this.boardSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2 + 5, 140 - 5, boardName, '', this.initmenubackgroundGroup);
            this.boardSpr.anchor.set(0.5, 0);
            this.boardSpr.scale.set(0.785, 0.785);
            this.boardSpr.visible = false;
        }
        else {
            var bgName = "theme_0" + selectedTheme + "_bg";
            var boardName = "theme_0" + selectedTheme + "_board";
            var doorName = "theme_0" + selectedTheme + "_door";
            this.backgroundSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, 0, bgName, '', this.initmenubackgroundGroup);
            this.backgroundSpr.anchor.set(0.5, 0);
            this.boardSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, 500, boardName, '', this.initmenubackgroundGroup);
            this.boardSpr.anchor.set(0.5, 0);
        }
    };
    InitMenuPrompt.prototype.removeAndRestartScreen = function () {
        if (InitMenuPrompt.onscreen == false)
            return;
        console.log("remove and restart screen");
        this.initmenubackgroundGroup.destroy();
        this.initmenugroup.destroy();
        this.playbutgroup.destroy();
        ResizeManager.update();
        SimpleGame.myGame.time.events.add(250, function () {
            var gameScr = new InitMenuPrompt();
        }.bind(this), this);
    };
    InitMenuPrompt.prototype.removeAndStartGame = function () {
        InitMenuPrompt.onscreen = false;
        SimpleGame.myGame.tweens.removeAll();
        this.initmenubackgroundGroup.destroy();
        this.initmenugroup.destroy();
        this.playbutgroup.destroy();
        var gameScr = new GameScreen();
    };
    InitMenuPrompt.onscreen = false;
    return InitMenuPrompt;
}());
var OutOfMovesPrompt = /** @class */ (function () {
    function OutOfMovesPrompt(parent) {
        this.myGroup = SimpleGame.myGame.add.group(parent);
        GameContext.gameplayStopped();
        this.parent = parent;
        this.bgblack = SimpleGame.myGame.make.graphics(-2000, -2000);
        this.bgblack.beginFill(0x000000);
        this.bgblack.drawRect(0, 0, 4000, 4000);
        this.bgblack.endFill();
        this.bgblack.alpha = 0.67;
        this.bgblack.inputEnabled = true;
        this.myGroup.add(this.bgblack);
        this.mybg = SimpleGame.myGame.add.sprite(0, 0, 'small_board_wood01', '', this.myGroup);
        this.mybg.anchor.set(0.5, 0.5);
        this.myGroup.x = ResizeManager.INTERNAL_GAME_WIDTH / 2;
        this.myGroup.y = ResizeManager.INTERNAL_GAME_HEIGHT / 2;
        this.oopsTxt = SimpleGame.myGame.add.text(0, -220, "Oops!", { font: "72px Paytone One", fill: "#ffffff", align: "Right" });
        this.oopsTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.oopsTxt);
        this.noMoreMovesTxt2 = SimpleGame.myGame.add.text(0, -100, "No more moves!", { font: "40px Paytone One", fill: "#ffffff", align: "Center" });
        this.noMoreMovesTxt2.anchor.set(0.5, 0.5);
        this.myGroup.add(this.noMoreMovesTxt2);
        this.noMoreMovesTxt2.wordWrap = true;
        this.noMoreMovesTxt2.wordWrapWidth = 600;
        this.reviveTxt = SimpleGame.myGame.add.text(0, -200, "Revive", { font: "72px Paytone One", fill: "#7b3f00", align: "Center" });
        this.gameOverTxt = SimpleGame.myGame.add.text(0, -200, "Game Over", { font: "60px Paytone One", fill: "#7b3f00", align: "Center" });
        this.gameOverTxt.wordWrap = true;
        this.gameOverTxt.wordWrapWidth = 200;
        this.gameOverTxt.lineSpacing -= 20;
        this.reviveBut = new PlayButton(this.reviveTxt, this.myGroup, 'yes-no_up_BTN', 'yes-no_down_BTN', -400, 100, this.reviveClicked.bind(this));
        this.gameOverBut = new PlayButton(this.gameOverTxt, this.myGroup, 'yes-no_up_BTN', 'yes-no_down_BTN', 50, 100, this.gameoverClicked.bind(this));
        this.reviveBut.textYDelta = -20;
        this.gameOverBut.textYDelta = -20;
    }
    let reviveAds = 3;
    OutOfMovesPrompt.prototype.reviveClicked = function () {
        if(reviveAds == 0){
            this.myGroup.destroy();
            var initmenuprompt = new GameOverPrompt(GameScreen.myref.layerUITop);
        }else{
            reviveAds--;
            BoardUtil.revive();
            GameContext.rewardedBreak();
            this.myGroup.destroy();
        }   
    }
    OutOfMovesPrompt.prototype.gameoverClicked = function () {
        console.log("game over prompt");
        this.myGroup.destroy();
        var initmenuprompt = new GameOverPrompt(GameScreen.myref.layerUITop);
    };
    return OutOfMovesPrompt;
}());
var SelectYourReward = /** @class */ (function () {
    function SelectYourReward(parent) {
        this.explodeSelectedFlag = true;
        GameContext.gameplayStopped();
        console.log("select your reward added");
        this.myGroup = SimpleGame.myGame.add.group(parent);
        this.bgblack = SimpleGame.myGame.make.graphics(-2000, -2000);
        this.bgblack.beginFill(0x000000);
        this.bgblack.drawRect(0, 0, 4000, 4000);
        this.bgblack.endFill();
        this.bgblack.alpha = 0.67;
        this.bgblack.inputEnabled = true;
        this.myGroup.add(this.bgblack);
        this.boardSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, ResizeManager.INTERNAL_GAME_HEIGHT / 2, 'big_board_wood01', '', this.myGroup);
        this.boardSpr.anchor.set(0.5, 0.5);
        this.selectRewardTxt = SimpleGame.myGame.add.text(ResizeManager.INTERNAL_GAME_WIDTH / 2, 160, "Select your reward!", { font: "84px Paytone One", fill: "#ffffff", align: "Right" });
        this.selectRewardTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.selectRewardTxt);
        this.boardExplosiveDeselected = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.38, 500, 'board_deselected_BTN01', '', this.myGroup);
        this.boardExplosiveSelected = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.38, 500, 'board_selected_BTN01', '', this.myGroup);
        this.boardExplosiveIcon = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.38, 500, 'dinamit_lit_icon_BTN01', '', this.myGroup);
        this.boardRotateDeselected = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.62, 500, 'board_deselected_BTN01', '', this.myGroup);
        this.boardRotateSelected = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.62, 500, 'board_selected_BTN01', '', this.myGroup);
        this.boardRotateIcon = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH * 0.62, 500, 'rotate_lit_icon_BTN01', '', this.myGroup);
        if (GameContext.orientation == Consts.ORIENTATION_PORTRAIT) {
            this.boardExplosiveDeselected.x = this.boardExplosiveSelected.x = this.boardExplosiveIcon.x = ResizeManager.INTERNAL_GAME_WIDTH * 0.32;
            this.boardExplosiveDeselected.y = this.boardExplosiveSelected.y = this.boardExplosiveIcon.y = 1000;
            this.boardRotateDeselected.x = this.boardRotateSelected.x = this.boardRotateIcon.x = ResizeManager.INTERNAL_GAME_WIDTH * 0.68;
            this.boardRotateDeselected.y = this.boardRotateSelected.y = this.boardRotateIcon.y = 1000;
        }
        this.boardExplosiveIcon.anchor.set(0.5, 0.5);
        this.boardExplosiveDeselected.anchor.set(0.5, 0.5);
        this.boardExplosiveSelected.anchor.set(0.5, 0.5);
        this.boardRotateIcon.anchor.set(0.5, 0.5);
        this.boardRotateDeselected.anchor.set(0.5, 0.5);
        this.boardRotateSelected.anchor.set(0.5, 0.5);
        this.boardExplosiveIcon.scale.set(2, 2);
        this.boardRotateIcon.scale.set(2, 2);
        this.boardExplosiveDeselected.inputEnabled = true;
        this.boardRotateDeselected.inputEnabled = true;
        this.boardExplosiveDeselected.events.onInputDown.add(this.explosiveSel, this);
        this.boardRotateDeselected.events.onInputDown.add(this.rotateSel, this);
        this.boardRotateDeselected.input.useHandCursor = true;
        this.boardExplosiveDeselected.input.useHandCursor = true;
        this.manageSelectedFlag();
        this.getTxt = SimpleGame.myGame.add.text(0, -200, "Get", { font: "72px Paytone One", fill: "#7b3f00", align: "Center" });
        this.getBut = new PlayButton(this.getTxt, this.myGroup, 'yes-no_up_BTN', 'yes-no_down_BTN', ResizeManager.INTERNAL_GAME_WIDTH / 2 - 400, ResizeManager.INTERNAL_GAME_HEIGHT / 2 + 250, this.getButClicked.bind(this));
        this.getBut.textYDelta = -16;
        this.getBothTxt = SimpleGame.myGame.add.text(0, -200, "Get Both", { font: "64px Paytone One", fill: "#7b3f00", align: "Center" });
        this.getBothBut = new PlayButton(this.getBothTxt, this.myGroup, 'GetAds_green_BTN01', 'GetAds_green_BTN01', ResizeManager.INTERNAL_GAME_WIDTH / 2 + 50, ResizeManager.INTERNAL_GAME_HEIGHT / 2 + 250, this.getBothButClicked.bind(this));
        this.getBothBut.textYDelta = -16;
        this.getBothIcon = SimpleGame.myGame.add.sprite(this.getBothBut.x + 300, this.getBothBut.y, 'VideoAds_icon_01', '', this.myGroup);
        this.getBothIcon.anchor.set(0, 0);
        this.getBothIcon.scale.set(0.75, 0.75);
    }
    SelectYourReward.prototype.getBothButClicked = function () {
        // GameContext.explodePowerupsCount++;
        // GameContext.rotatePowerupsCount++;
        this.myGroup.destroy();
        GameContext.rewardedBreakBoth();
    };
    SelectYourReward.prototype.getButClicked = function () {
        if (this.explodeSelectedFlag) {
            GameContext.explodePowerupsCount++;
        }
        else {
            GameContext.rotatePowerupsCount++;
        }
        this.myGroup.destroy();
        // GameContext.commercialBreak()
    };
    SelectYourReward.prototype.rotateSel = function () {
        this.explodeSelectedFlag = false;
        this.manageSelectedFlag();
    };
    SelectYourReward.prototype.explosiveSel = function () {
        this.explodeSelectedFlag = true;
        this.manageSelectedFlag();
    };
    SelectYourReward.prototype.manageSelectedFlag = function () {
        if (this.explodeSelectedFlag) {
            this.boardExplosiveSelected.visible = true;
            this.boardRotateSelected.visible = false;
        }
        else {
            this.boardExplosiveSelected.visible = false;
            this.boardRotateSelected.visible = true;
        }
    };
    return SelectYourReward;
}());
var SettingsScreen = /** @class */ (function () {
    function SettingsScreen(parent) {
        GameContext.gameplayStopped();
        console.log("select your reward added");
        this.myGroup = SimpleGame.myGame.add.group(parent);
        this.bgblack = SimpleGame.myGame.make.graphics(-2000, -2000);
        this.bgblack.beginFill(0x000000);
        this.bgblack.drawRect(0, 0, 4000, 4000);
        this.bgblack.endFill();
        this.bgblack.alpha = 0.67;
        this.bgblack.inputEnabled = true;
        this.myGroup.add(this.bgblack);
        this.boardSpr = SimpleGame.myGame.add.sprite(ResizeManager.INTERNAL_GAME_WIDTH / 2, ResizeManager.INTERNAL_GAME_HEIGHT / 2, 'small_board_wood01', '', this.myGroup);
        this.boardSpr.anchor.set(0.5, 0.5);
        this.settingsTxt = SimpleGame.myGame.add.text(ResizeManager.INTERNAL_GAME_WIDTH / 2, ResizeManager.INTERNAL_GAME_HEIGHT / 2 - 250, "Settings", { font: "72px Paytone One", fill: "#ffffff", align: "Right" });
        this.settingsTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.settingsTxt);
        this.soundTxt = SimpleGame.myGame.add.text(ResizeManager.INTERNAL_GAME_WIDTH / 2 - 300, ResizeManager.INTERNAL_GAME_HEIGHT / 2 - 150 + 30, "Sound", { font: "64px Paytone One", fill: "#ffffff", align: "Right" });
        this.soundTxt.anchor.set(0, 0.5);
        this.myGroup.add(this.soundTxt);
        this.voiceTxt = SimpleGame.myGame.add.text(ResizeManager.INTERNAL_GAME_WIDTH / 2 - 300, ResizeManager.INTERNAL_GAME_HEIGHT / 2 + 30 - 30, "Voice", { font: "64px Paytone One", fill: "#ffffff", align: "Right" });
        this.voiceTxt.anchor.set(0, 0.5);
        this.myGroup.add(this.voiceTxt);
        this.soundBtn = new OnOffButton(this.myGroup, ResizeManager.INTERNAL_GAME_WIDTH / 2 + 110, ResizeManager.INTERNAL_GAME_HEIGHT / 2 - 150, true, 0);
        this.voiceBtn = new OnOffButton(this.myGroup, ResizeManager.INTERNAL_GAME_WIDTH / 2 + 110, ResizeManager.INTERNAL_GAME_HEIGHT / 2 - 30, false, 1);
        this.yesTxt = SimpleGame.myGame.add.text(0, -200, "Continue", { font: "72px Paytone One", fill: "#7b3f00", align: "Center" });
        var gonextbut = new PlayButton(this.yesTxt, this.myGroup, 'Big_up_BTN', 'Big_down_BTN', ResizeManager.INTERNAL_GAME_WIDTH / 2 - 420, ResizeManager.INTERNAL_GAME_HEIGHT / 2 + 120, this.removeAndContinue.bind(this));
    }
    SettingsScreen.prototype.removeAndContinue = function () {
        this.myGroup.destroy();
    };
    return SettingsScreen;
}());
var ThemeSelectorPrompt = /** @class */ (function () {
    function ThemeSelectorPrompt(parent) {
        GameContext.gameplayStopped();
        this.myGroup = SimpleGame.myGame.add.group(parent);
        this.bgblack = SimpleGame.myGame.make.graphics(-4000, -4000);
        this.bgblack.beginFill(0x000000);
        this.bgblack.drawRect(0, 0, 8000, 8000);
        this.bgblack.endFill();
        this.bgblack.alpha = 0.67;
        this.bgblack.inputEnabled = true;
        this.myGroup.add(this.bgblack);
        this.bgblack.inputEnabled = true;
        this.bgblack.events.onInputDown.add(this.remove, this);
        this.mybg = SimpleGame.myGame.add.sprite(900, 600, 'theme_smallboard01', '', this.myGroup);
        this.mybg.anchor.set(0.5, 0.5);
        this.buttonTheme = new ButtonWithOverState(this.myGroup, 'icon-palette01', 'icon-palette01', 860, 200, this.remove.bind(this));
        this.iconArray = [];
        var i = 7;
        while (i-- > 0) {
            var row = Math.floor(i / 3);
            var column = i % 3;
            var deltaX = 150;
            var deltaY = 150;
            var initX = 690;
            var initY = 390;
            var icon1 = SimpleGame.myGame.add.sprite(initX + column * deltaX, initY + row * deltaY, Consts.THEME_NAME_ARRAY[i], '', this.myGroup);
            this.iconArray[i] = icon1;
            icon1.scale.set(0.5, 0.5);
            icon1.inputEnabled = true;
        }
        this.iconArray[0].events.onInputDown.add(function () {
            GameContext.selectedTheme = 0;
            GameContext.onThemeUpdated();
        }, this);
        this.iconArray[1].events.onInputDown.add(function () {
            GameContext.selectedTheme = 1;
            GameContext.onThemeUpdated();
        }, this);
        this.iconArray[2].events.onInputDown.add(function () {
            GameContext.selectedTheme = 2;
            GameContext.onThemeUpdated();
        }, this);
        this.iconArray[3].events.onInputDown.add(function () {
            GameContext.selectedTheme = 3;
            GameContext.onThemeUpdated();
        }, this);
        this.iconArray[4].events.onInputDown.add(function () {
            GameContext.selectedTheme = 4;
            GameContext.onThemeUpdated();
        }, this);
        this.iconArray[5].events.onInputDown.add(function () {
            GameContext.selectedTheme = 5;
            GameContext.onThemeUpdated();
        }, this);
        this.iconArray[6].events.onInputDown.add(function () {
            GameContext.selectedTheme = 6;
            GameContext.onThemeUpdated();
        }, this);
    }
    ThemeSelectorPrompt.prototype.remove = function () {
        this.myGroup.destroy();
    };
    return ThemeSelectorPrompt;
}());
var TutorialCompletePrompt = /** @class */ (function () {
    function TutorialCompletePrompt() {
        this.myGroup = SimpleGame.myGame.add.group(GameScreen.myref.layerUITop);
        GameContext.gameplayStopped();
        this.bgblack = SimpleGame.myGame.make.graphics(-2000, -2000);
        this.bgblack.beginFill(0x000000);
        this.bgblack.drawRect(0, 0, 4000, 4000);
        this.bgblack.endFill();
        this.bgblack.alpha = 0.67;
        this.bgblack.inputEnabled = true;
        this.myGroup.add(this.bgblack);
        this.myGroup.x = ResizeManager.INTERNAL_GAME_WIDTH / 2;
        this.myGroup.y = ResizeManager.INTERNAL_GAME_HEIGHT / 2;
        this.greatTxt = SimpleGame.myGame.add.text(0, -220, "Great!", { font: "96px Paytone One", fill: "#ffffff", align: "Right" });
        this.greatTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.greatTxt);
        this.mainTxt = SimpleGame.myGame.add.text(0, -20, "You completed the basic tutorial", { font: "64px Paytone One", fill: "#ffffff", align: "Right" });
        this.mainTxt.anchor.set(0.5, 0.5);
        this.myGroup.add(this.mainTxt);
        this.playTxt = SimpleGame.myGame.add.text(0, 200, "Let's Play", { font: "72px Paytone One", fill: "#7b3f00", align: "Center" });
        this.playBut = new PlayButton(this.playTxt, this.myGroup, 'Big_up_BTN', 'Big_down_BTN', -400, 100, this.playClicked.bind(this));
        this.playBut.textYDelta -= 10;
    }
    TutorialCompletePrompt.prototype.playClicked = function () {
        this.myGroup.destroy();
        Tutorial.tutorialCompleted();
    };
    return TutorialCompletePrompt;
}());
var ButtonTextOnly = /** @class */ (function () {
    function ButtonTextOnly(parent, x, y, width, height, text, onClickFunction) {
        if (onClickFunction === void 0) { onClickFunction = function () {
        }; }
        this.disabled = false;
        this.isVisible = true;
        this.parent = parent;
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onClickFunction = onClickFunction;
        this.buttonText = SimpleGame.myGame.make.text(x, y, this.text, {
            font: "14px Arial", fill: "#000000", fontWeight: "400", align: "Right"
        });
        this.buttonText.inputEnabled = true;
        this.buttonText.anchor.set(0, 0.5);
        this.underline = SimpleGame.myGame.make.graphics(this.buttonText.left, this.buttonText.bottom - 5);
        // Specify the line (size, color)
        this.underline.lineStyle(2, 0x000000);
        // Location to start drawing the line (x, y)
        this.underline.moveTo(0, 0);
        // Draw a line the width of objectText's string
        this.underline.lineTo(this.buttonText.width, 0);
        this.buttonText.events.onInputDown.add(this.executeOnClickFunction, this);
        this.buttonText.events.onInputOver.add(this.addUnderline, this);
        this.buttonText.events.onInputOut.add(this.removeUnderline, this);
        this.buttonText.input.useHandCursor = true;
        this.underline.visible = false;
        parent.add(this.underline);
        parent.add(this.buttonText);
        console.log(this.underline);
    }
    ButtonTextOnly.prototype.executeOnClickFunction = function () {
        if (this.disabled)
            return;
        if (this.isVisible == false)
            return;
        console.log("execute on click function");
        this.onClickFunction();
        SimpleGame.myGame.input.reset();
        // this.buttonText.inputEnabled = true;
        //     SimpleGame.myGame.time.events.add(10, function()
        // {
        //     if (this.buttonText==null) return ;
        //     this.buttonText.events.onInputDown.add(this.executeOnClickFunction, this)
        //     this.buttonText.events.onInputOver.add(this.addUnderline,this)
        //     this.buttonText.events.onInputOut.add(this.removeUnderline,this)
        //     this.buttonText.input.useHandCursor  = true; 
        // })
    };
    ButtonTextOnly.prototype.addUnderline = function () {
        if (this.disabled)
            return;
        if (SimpleGame.myGame.device.touch)
            return;
        this.underline.visible = true;
    };
    ButtonTextOnly.prototype.removeUnderline = function () {
        this.underline.visible = false;
    };
    ButtonTextOnly.prototype.disable = function () {
        this.disabled = true;
        this.removeUnderline();
        this.buttonText.addColor("#87888b", 0);
    };
    ButtonTextOnly.prototype.enable = function () {
        this.disabled = false;
        this.buttonText.addColor("#000000", 0);
    };
    ButtonTextOnly.prototype.goInvisible = function () {
        console.log("go invisible called: " + this.buttonText.text);
        this.parent.remove(this.underline);
        this.parent.remove(this.buttonText);
        this.isVisible = false;
        // this.underline.y = -1000;
        // this.buttonText.y = -1000;
        // this.parent.removeAll()
        // this.underline.visible = false;
        // this.buttonText.visible = false;
    };
    ButtonTextOnly.prototype.goVisible = function () {
        console.log("go visible called: " + this.buttonText.text);
        this.parent.add(this.underline);
        this.parent.add(this.buttonText);
        // this.underline.y = this.y;
        SimpleGame.myGame.time.events.add(50, function () {
            this.isVisible = true;
        }, this);
        // this.buttonText.y = this.buttonText.bottom - 5
        // this.underline.visible = true;
        // this.buttonText.visible = true;
    };
    return ButtonTextOnly;
}());
var ButtonWithOverState = /** @class */ (function () {
    function ButtonWithOverState(parent, imgNormalName, imgOverName, x, y, onClickFunction) {
        if (onClickFunction === void 0) { onClickFunction = function () {
        }; }
        this.onClickExecuted = false;
        this.skipClickSound = false;
        this.skipMouseOver = false;
        this.skipAlphaChanges = false;
        this.imgnormalnamestr = imgNormalName;
        this.parent = parent;
        this.imgNormalName = imgNormalName;
        this.imgOverName = imgOverName;
        this.x = x;
        this.y = y;
        this.onButtonOutExtra = function () { };
        this.onButtonOverExtra = function () { };
        this.imgNormal = SimpleGame.myGame.make.sprite(this.x, this.y, imgNormalName);
        this.imgOver = SimpleGame.myGame.make.sprite(this.x, this.y, imgOverName);
        parent.add(this.imgNormal);
        parent.add(this.imgOver);
        this.imgNormal.inputEnabled = this.imgOver.inputEnabled = false;
        this.imgOver.inputEnabled = false;
        this.imgNormal.events.onInputOver.add(this.onButtonOver, this, 0);
        this.imgNormal.events.onInputUp.add(this.banInput, this, 100);
        this.imgNormal.events.onInputDown.add(this.onButtonClicked, this, 2);
        this.imgNormal.events.onInputOut.add(this.onButtonOut, this, 1);
        this.imgOver.events.onInputOut.add(this.onButtonOut, this, 1);
        this.imgOver.events.onInputUp.add(this.onButtonOut, this, 4);
        this.onClickFunction = onClickFunction;
        this.imgOver.visible = false;
        this.loopEvent = SimpleGame.myGame.time.events.loop(100, this.update, this);
        this.loopEvent1 = SimpleGame.myGame.time.events.loop(10, this.update1, this);
        console.log("button created");
        SimpleGame.myGame.time.events.add(0, function () {
            if (this.imgNormal == null)
                return;
            // if (this.imgNormal.input == null) return
            this.imgNormal.inputEnabled = true;
            this.imgNormal.input.useHandCursor = true;
            console.log("input enabled");
        }.bind(this), this);
        SimpleGame.myGame.input.onTap.add(function () {
            // console.log("mouse tapped")
        });
        this.imgNormal.events.onInputUp.add(function () {
            // console.log("input up")
        });
    }
    ButtonWithOverState.prototype.update = function () {
        //   console.log("update button: " + this.onClickExecuted)
        if (this.imgNormal.input != null) {
            if (this.skipMouseOver) {
                console.log("remove hand cursor");
                this.imgNormal.input.useHandCursor = false;
                // this.imgOver.visible = false;
            }
            else {
                this.imgNormal.input.useHandCursor = true;
                // this.imgOver.visible = true;
            }
        }
        if (this.imgOver.parent) {
            if (!this.imgOver.getBounds().contains(SimpleGame.myGame.input.x, SimpleGame.myGame.input.y)) {
                this.onButtonOut();
                // this.imgNormal.input.useHandCursor = false;
            }
            else {
                //very dirty hack
                // if (this.imgnormalnamestr == "open_menu2")
                // {
                //     this.imgNormal.input.useHandCursor = true;
                //     this.onButtonOver();
                // }
            }
        }
        else {
            SimpleGame.myGame.time.events.remove(this.loopEvent);
        }
        this.setXY(this.x, this.y);
    };
    ButtonWithOverState.prototype.update1 = function () {
        //   console.log("update button: " + this.onClickExecuted)
        this.setXY(this.x, this.y);
    };
    ButtonWithOverState.prototype.banInput = function () {
        this.onClickExecuted = true;
        // console.log("button click success")
        SimpleGame.myGame.time.events.add(50, function () {
            // console.log("can click button")
            this.onClickExecuted = false;
        }, this);
    };
    ButtonWithOverState.prototype.onButtonOver = function () {
        console.log("button over");
        this.imgNormal.input.useHandCursor = true;
        if (this.skipMouseOver) {
            // this.imgNormal.input.useHandCursor = false;
            console.log("skip mouse over is true!!");
            return;
        }
        this.imgOver.visible = true;
        // this.imgOver.alpha = 1;
        if (this.skipAlphaChanges == false)
            this.imgNormal.alpha = 0.00001;
        SimpleGame.myGame.canvas.style.cursor = "pointer";
        // console.log("mouse set to pointer")
        if (SimpleGame.myGame.device.touch) {
            // this.imgOver.visible = false;
        }
        this.onButtonOverExtra();
    };
    ButtonWithOverState.prototype.onButtonOut = function () {
        if (this.imgnormalnamestr == "open_menu2") {
            // console.log("button out")
        }
        this.imgOver.visible = false;
        if (this.skipAlphaChanges == false)
            this.imgNormal.alpha = 1;
        // this.imgNormal.input.useHandCursor = false;
        this.onButtonOutExtra();
    };
    ButtonWithOverState.prototype.onButtonClicked = function (evt) {
        console.log("button click attempt registered");
        //  var delay = Consts.DELAY_BETWEEN_EVENTS_DESKTOP;
        //  if (SimpleGame.myGame.device.touch)
        //  {
        //     delay = Consts.DELAY_BETWEEN_EVENTS_TOUCH;
        //  }
        // this.imgNormal.input.useHandCursor = false;
        if (this.onClickExecuted == false) {
            this.onClickExecuted = true;
            // console.log("button click success")
            SimpleGame.myGame.time.events.add(60, function () {
                // console.log("can click button")
                this.onClickExecuted = false;
            }, this);
            this.onClickFunction();
            //  if (this.skipClickSound == false)
            SoundManager.playClick();
        }
        else {
            //  console.log("cannot click button")
        }
        SimpleGame.myGame.input.enabled = false;
        SimpleGame.myGame.time.events.add(60, function () {
            SimpleGame.myGame.input.enabled = true;
            SimpleGame.myGame.input.reset();
        });
    };
    ButtonWithOverState.prototype.setXY = function (x, y) {
        this.imgNormal.x = x;
        this.imgOver.x = x;
        this.x = x;
        this.imgNormal.y = y;
        this.imgOver.y = y;
        this.y = y;
    };
    return ButtonWithOverState;
}());
var ButtonWithOverAndText = /** @class */ (function (_super) {
    __extends(ButtonWithOverAndText, _super);
    function ButtonWithOverAndText(text, parent, imgNormalName, imgOverName, x, y, onClickFunction) {
        if (onClickFunction === void 0) { onClickFunction = function () {
        }; }
        var _this = _super.call(this, parent, imgNormalName, imgOverName, x, y, onClickFunction) || this;
        _this.fixedTxtCoords = false;
        _this.fixedTxtX = 0;
        _this.fixedTxtY = 0;
        _this.textY = 0;
        _this.textX = 0;
        _this.textYDelta = 0;
        _this.text = text;
        // this.text.inputEnabled = false;
        // this.text.interactive = false;
        // this.text.input.useHandCursor = true;
        parent.add(text);
        return _this;
    }
    ButtonWithOverAndText.prototype.setXY = function (x, y) {
        _super.prototype.setXY.call(this, x, y);
        if (this.fixedTxtCoords) {
            this.text.x = this.imgNormal.x + this.fixedTxtX;
            this.text.y = this.imgNormal.y + this.fixedTxtY;
        }
        else {
            // this.text.x = this.imgNormal.x + 0.5*(this.imgNormal.width - this.text.width)
            this.text.x = this.imgNormal.x + 0.5 * (this.imgNormal.width - this.text.width);
            this.text.y = this.imgNormal.y + 0.5 * (this.imgNormal.height - this.text.height);
        }
        this.textX = this.text.x;
        this.textY = this.text.y + this.textYDelta;
        if (this.imgOver.visible) {
            this.text.y = this.textY;
        }
        else {
            this.text.y = this.textY;
        }
    };
    ButtonWithOverAndText.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.imgOver.visible) {
            this.text.y = this.textY;
        }
        else {
            this.text.y = this.textY;
        }
    };
    ButtonWithOverAndText.prototype.setVisible = function () {
        console.log("set visible");
        this.parent.add(this.imgNormal);
        this.parent.add(this.imgOver);
        this.parent.add(this.text);
    };
    ButtonWithOverAndText.prototype.setInvisible = function () {
        this.parent.remove(this.imgNormal);
        this.parent.remove(this.imgOver);
        this.parent.remove(this.text);
    };
    return ButtonWithOverAndText;
}(ButtonWithOverState));
var PlayButton = /** @class */ (function (_super) {
    __extends(PlayButton, _super);
    function PlayButton(text, parent, imgNormalName, imgOverName, x, y, onClickFunction) {
        if (onClickFunction === void 0) { onClickFunction = function () {
        }; }
        var _this = _super.call(this, text, parent, imgNormalName, imgOverName, x, y, onClickFunction) || this;
        _this.overTxtDeltaY = 8;
        return _this;
    }
    PlayButton.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.imgOver.visible) {
            this.text.y = this.textY + this.overTxtDeltaY;
        }
        else {
            this.text.y = this.textY;
        }
    };
    PlayButton.prototype.setXY = function (x, y) {
        _super.prototype.setXY.call(this, x, y);
        if (this.fixedTxtCoords) {
            this.text.x = this.imgNormal.x + this.fixedTxtX;
            this.text.y = this.imgNormal.y + this.fixedTxtY;
        }
        else {
            // this.text.x = this.imgNormal.x + 0.5*(this.imgNormal.width - this.text.width)
            this.text.x = this.imgNormal.x + 0.5 * (this.imgNormal.width - this.text.width);
            this.text.y = this.imgNormal.y + 0.5 * (this.imgNormal.height - this.text.height);
        }
        this.textX = this.text.x;
        this.textY = this.text.y + this.textYDelta;
        if (this.imgOver.visible) {
            this.text.y = this.textY + this.overTxtDeltaY;
        }
        else {
            this.text.y = this.textY;
        }
    };
    return PlayButton;
}(ButtonWithOverAndText));
var CheckboxControl = /** @class */ (function () {
    function CheckboxControl(parent, uncheckedImageName, checkedImageName, x, y) {
        this.isChecked = false;
        this.x = x;
        this.y = y;
        var uncheckedImage = SimpleGame.myGame.make.sprite(x, y, uncheckedImageName);
        parent.add(uncheckedImage);
        uncheckedImage.inputEnabled = true;
        uncheckedImage.events.onInputDown.add(this.switchState, this);
        var checkedImage = SimpleGame.myGame.make.sprite(x, y, checkedImageName);
        parent.add(checkedImage);
        checkedImage.inputEnabled = true;
        checkedImage.events.onInputDown.add(this.switchState, this);
        this.uncheckedImage = uncheckedImage;
        this.checkedImage = checkedImage;
        this.update();
    }
    CheckboxControl.prototype.update = function () {
        if (this.isChecked) {
            this.uncheckedImage.visible = false;
            this.checkedImage.visible = true;
        }
        else {
            this.uncheckedImage.visible = true;
            this.checkedImage.visible = false;
        }
    };
    CheckboxControl.prototype.switchState = function () {
        this.isChecked = !this.isChecked;
        this.update();
    };
    return CheckboxControl;
}());
var FrameSequence = /** @class */ (function () {
    function FrameSequence(frameNameArr, x, y, frameRate, atlasName, parent) {
        if (atlasName === void 0) { atlasName = null; }
        if (parent === void 0) { parent = null; }
        this.playonceflag = false;
        this.paused = false;
        this.curIdx = 0;
        this.angle = 0;
        this.frameArr = new Array();
        this.x = x;
        this.y = y;
        this.scale = new Phaser.Point(1, 1);
        var i = frameNameArr.length;
        while (i-- > 0) {
            if (atlasName == null) {
                this.frameArr[i] = SimpleGame.myGame.add.sprite(x, y, frameNameArr[i]);
            }
            else {
                this.frameArr[i] = SimpleGame.myGame.add.sprite(x, y, atlasName, frameNameArr[i]);
            }
            this.frameArr[i].anchor.set(0.5, 0.5);
            // SimpleGame.myGame.physics.enable(this.frameArr[i]);
            if (parent != null) {
                parent.add(this.frameArr[i]);
            }
        }
        this.frameArr[0].visible = true;
        this.curSpr = this.frameArr[0];
        this.myloop1 = SimpleGame.myGame.time.events.loop(Math.ceil(1000 / frameRate), this.update, this);
        this.myloop2 = SimpleGame.myGame.time.events.loop(5, this.updateFast, this);
    }
    FrameSequence.prototype.playonceonly = function () {
        this.playonceflag = true;
    };
    FrameSequence.prototype.updateFast = function () {
        if (this.curSpr != null) {
            this.curSpr.x = this.x;
            this.curSpr.y = this.y;
            // this.curSpr.angle = this.angle;
            this.curSpr.angle = this.angle;
            this.curSpr.scale.x = this.scale.x;
            this.curSpr.scale.y = this.scale.y;
        }
    };
    FrameSequence.prototype.putOnTop = function () {
        var i = this.frameArr.length;
        while (i-- > 0) {
            this.frameArr[i].bringToTop();
        }
    };
    FrameSequence.prototype.update = function () {
        var i = this.frameArr.length;
        while (i-- > 0) {
            this.frameArr[i].x = this.x;
            this.frameArr[i].y = this.y;
        }
        if (this.paused)
            return;
        var i = this.frameArr.length;
        while (i-- > 0) {
            this.frameArr[i].visible = false;
        }
        var realidx = this.curIdx++ % this.frameArr.length;
        this.frameArr[realidx].visible = true;
        this.frameArr[realidx].x = this.x;
        this.frameArr[realidx].y = this.y;
        this.curSpr = this.frameArr[realidx];
        this.updateFast();
        if (this.playonceflag) {
            if (this.curIdx >= this.frameArr.length) {
                this.remove();
            }
        }
    };
    FrameSequence.prototype.pause = function () {
        this.paused = true;
    };
    FrameSequence.prototype.start = function () {
        this.paused = false;
    };
    FrameSequence.prototype.remove = function () {
        var i = this.frameArr.length;
        while (i-- > 0) {
            var spr = this.frameArr[i];
            spr.destroy();
        }
        SimpleGame.myGame.time.events.remove(this.myloop1);
        SimpleGame.myGame.time.events.remove(this.myloop2);
    };
    return FrameSequence;
}());
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.convertToHHMMSS = function (seconds) {
        var s = seconds % 60;
        var m = Math.floor((seconds % 3600) / 60);
        var h = Math.floor(seconds / (60 * 60));
        //var hourStr:String = (h == 0) ? "" : doubleDigitFormat(h) + ":";
        var hourStr = (false) ? "" : Util.doubleDigitFormat(h) + ":";
        var minuteStr = Util.doubleDigitFormat(m) + ":";
        var secondsStr = Util.doubleDigitFormat(s);
        return hourStr + minuteStr + secondsStr;
    };
    Util.convertToMMSS = function (seconds) {
        var s = seconds % 60;
        var m = Math.floor((seconds % 3600) / 60);
        var h = Math.floor(seconds / (60 * 60));
        //var hourStr:String = (h == 0) ? "" : doubleDigitFormat(h) + ":";
        var hourStr = (false) ? "" : Util.doubleDigitFormat(h) + ":";
        var minuteStr = Util.doubleDigitFormat(m) + ":";
        var secondsStr = Util.doubleDigitFormat(s);
        return minuteStr + secondsStr;
    };
    Util.doubleDigitFormat = function (num) {
        if (num < 10) {
            return ("0" + num);
        }
        return "" + num;
    };
    Util.getStorage = function (s, defaultRetValue) {
        if (defaultRetValue === void 0) { defaultRetValue = 0; }
        var storageData = 0;
        try {
            storageData = parseInt(window.localStorage.getItem(s));
        }
        catch (error) {
            return defaultRetValue;
        }
        if (isNaN(storageData)) {
            storageData = defaultRetValue;
            try {
                window.localStorage.setItem(s, defaultRetValue.toString());
            }
            catch (error) {
                return defaultRetValue;
            }
        }
        return storageData;
    };
    Util.setStorage = function (s, val) {
        try {
            window.localStorage.setItem(s, val.toString());
        }
        catch (error) {
        }
    };
    Util.clearStorage = function (s, defaultVal) {
        if (defaultVal === void 0) { defaultVal = 0; }
    };
    Util.overlapping = function (rect1, rect2) {
        if (rect1 == rect2)
            return false;
        if (rect1.x < rect2.x + rect2.width + 1 && rect1.x + rect1.width + 1 > rect2.x && rect1.y < rect2.y + rect2.height + 1 && rect1.height + 1 + rect1.y > rect2.y) {
            return true;
        }
        return false;
    };
    Util.fixedDigitCount = function (digits, number) {
        var digitCount = number.toString().length;
        var deltaCount = digits - digitCount;
        var retStr = "";
        while (deltaCount-- > 0) {
            retStr += "0";
        }
        retStr += number.toString();
        return retStr;
    };
    Util.pointerCoordsToGameCoords = function () {
        var apX = SimpleGame.myGame.input.activePointer.x;
        var apY = SimpleGame.myGame.input.activePointer.y;
        var screenPercX = apX / SimpleGame.myGame.width;
        var screenPercY = apY / SimpleGame.myGame.height;
        // var percZero = SimpleGame.layerGame.x / (SimpleGame.layerGame.width + SimpleGame.layerGame.x)
        var widthUpscale = (ResizeManager.INTERNAL_GAME_WIDTH * ResizeManager.gameScale + 2 * SimpleGame.layerGame.x) / (ResizeManager.INTERNAL_GAME_WIDTH * ResizeManager.gameScale);
        var heightUpscale = (ResizeManager.INTERNAL_GAME_HEIGHT * ResizeManager.gameScale + 2 * SimpleGame.layerGame.y) / (ResizeManager.INTERNAL_GAME_HEIGHT * ResizeManager.gameScale);
        var realX = screenPercX * ResizeManager.INTERNAL_GAME_WIDTH * widthUpscale;
        var realY = screenPercY * ResizeManager.INTERNAL_GAME_HEIGHT * heightUpscale;
        return new Phaser.Point(realX, realY);
    };
    //this is the backup one
    Util.pointerCoordsToGameCoords3 = function () {
        var apX = SimpleGame.myGame.input.activePointer.x;
        var apY = SimpleGame.myGame.input.activePointer.y;
        var screenPercX = apX / SimpleGame.myGame.width;
        var screenPercY = apY / SimpleGame.myGame.height;
        // var percZero = SimpleGame.layerGame.x / (SimpleGame.layerGame.width + SimpleGame.layerGame.x)
        var widthUpscale = (ResizeManager.INTERNAL_GAME_WIDTH * ResizeManager.gameScale + 2 * SimpleGame.layerGame.x) / (ResizeManager.INTERNAL_GAME_WIDTH * ResizeManager.gameScale);
        var realX = screenPercX * ResizeManager.INTERNAL_GAME_WIDTH * widthUpscale;
        var realY = screenPercY * ResizeManager.INTERNAL_GAME_HEIGHT;
        return new Phaser.Point(realX, realY);
    };
    Util.pointerCoordsToGameCoords2 = function () {
        var apX = SimpleGame.myGame.input.activePointer.x;
        var apY = SimpleGame.myGame.input.activePointer.y;
        var screenPercX = apX / SimpleGame.myGame.width;
        var screenPercY = apY / SimpleGame.myGame.height;
        var percZero = SimpleGame.layerGame.x / (SimpleGame.layerGame.width + SimpleGame.layerGame.x);
        var widthUpscale = 1 / (1 - 2 * percZero);
        // console.log(widthUpscale)
        var realX = screenPercX * ResizeManager.INTERNAL_GAME_WIDTH * widthUpscale;
        var realY = screenPercY * ResizeManager.INTERNAL_GAME_HEIGHT;
        return new Phaser.Point(realX, realY);
    };
    return Util;
}());
var Utils;
(function (Utils) {
    var ScreenMetrics = /** @class */ (function () {
        function ScreenMetrics() {
        }
        return ScreenMetrics;
    }());
    Utils.ScreenMetrics = ScreenMetrics;
    var Orientation;
    (function (Orientation) {
        Orientation[Orientation["PORTRAIT"] = 0] = "PORTRAIT";
        Orientation[Orientation["LANDSCAPE"] = 1] = "LANDSCAPE";
    })(Orientation = Utils.Orientation || (Utils.Orientation = {}));
    ;
    var ScreenUtils = /** @class */ (function () {
        function ScreenUtils() {
        }
        // -------------------------------------------------------------------------
        ScreenUtils.calculateScreenMetrics = function (aDefaultWidth, aDefaultHeight, aOrientation, aMaxGameWidth, aMaxGameHeight) {
            if (aOrientation === void 0) { aOrientation = Orientation.LANDSCAPE; }
            // get dimension of window
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            // swap if window dimensions do not match orientation
            if ((windowWidth < windowHeight && aOrientation === Orientation.LANDSCAPE) ||
                (windowHeight < windowWidth && aOrientation === Orientation.PORTRAIT)) {
                var tmp = windowWidth;
                windowWidth = windowHeight;
                windowHeight = tmp;
            }
            // calculate max game dimension. The bounds are iPad and iPhone 
            if (typeof aMaxGameWidth === "undefined" || typeof aMaxGameHeight === "undefined") {
                if (aOrientation === Orientation.LANDSCAPE) {
                    aMaxGameWidth = Math.round(aDefaultWidth * 1420 / 1280);
                    aMaxGameHeight = Math.round(aDefaultHeight * 960 / 800);
                }
                else {
                    aMaxGameWidth = Math.round(aDefaultWidth * 960 / 800);
                    aMaxGameHeight = Math.round(aDefaultHeight * 1420 / 1280);
                }
            }
            // default aspect and current window aspect
            var defaultAspect = (aOrientation === Orientation.LANDSCAPE) ? 1280 / 800 : 800 / 1280;
            var windowAspect = windowWidth / windowHeight;
            var offsetX = 0;
            var offsetY = 0;
            var gameWidth = 0;
            var gameHeight = 0;
            // if (aOrientation === Orientation.LANDSCAPE) {
            // "iPhone" landscape ... and "iPad" portrait
            if (windowAspect > defaultAspect) {
                gameHeight = aDefaultHeight;
                gameWidth = Math.ceil((gameHeight * windowAspect) / 2.0) * 2;
                gameWidth = Math.min(gameWidth, aMaxGameWidth);
                offsetX = (gameWidth - aDefaultWidth) / 2;
                offsetY = 0;
            }
            else { // "iPad" landscpae ... and "iPhone" portrait
                gameWidth = aDefaultWidth;
                gameHeight = Math.ceil((gameWidth / windowAspect) / 2.0) * 2;
                gameHeight = Math.min(gameHeight, aMaxGameHeight);
                offsetX = 0;
                offsetY = (gameHeight - aDefaultHeight) / 2;
            }
            /* } else {    // "iPhone" portrait
                if (windowAspect < defaultAspect) {
                    gameWidth = aDefaultWidth;
                    gameHeight = gameWidth / windowAspect;
                    gameHeight = Math.min(gameHeight, aMaxGameHeight);
                    offsetX = 0;
                    offsetY = (gameHeight - aDefaultHeight) / 2;
                } else {    // "iPad" portrait
                    gameHeight = aDefaultHeight;
                    gameWidth = gameHeight = windowAspect;
                    gameWidth = Math.min(gameWidth, aMaxGameWidth);
                    offsetX = (gameWidth - aDefaultWidth) / 2;
                    offsetY = 0;
                }
            }
            */
            // calculate scale
            var scaleX = windowWidth / gameWidth;
            var scaleY = windowHeight / gameHeight;
            // store values
            this.screenMetrics = new ScreenMetrics();
            this.screenMetrics.windowWidth = windowWidth;
            this.screenMetrics.windowHeight = windowHeight;
            this.screenMetrics.defaultGameWidth = aDefaultWidth;
            this.screenMetrics.defaultGameHeight = aDefaultHeight;
            this.screenMetrics.maxGameWidth = aMaxGameWidth;
            this.screenMetrics.maxGameHeight = aMaxGameHeight;
            this.screenMetrics.gameWidth = gameWidth;
            this.screenMetrics.gameHeight = gameHeight;
            this.screenMetrics.scaleX = scaleX;
            this.screenMetrics.scaleY = scaleY;
            this.screenMetrics.offsetX = offsetX;
            this.screenMetrics.offsetY = offsetY;
            return this.screenMetrics;
        };
        return ScreenUtils;
    }());
    Utils.ScreenUtils = ScreenUtils;
})(Utils || (Utils = {}));
