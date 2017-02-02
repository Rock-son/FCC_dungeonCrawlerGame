
    /*React, Redux and ReactRedux libraries expose variables of the same name and case (React, Redux and ReactRedux)
    ALL USED MODULES:
    const { Component } = React;
    const { createStore } = Redux;
 -- const { Provider } = ReactRedux; --
    const { connect } = ReactRedux;
    const { combineReducers } = Redux;
*/
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var initialState = makeInitialDungeon();

/* REDUCERS (when state here is changed, props change in React -> i.e. immediate rendering)
********************************************************************************************************************************/
var dungeonReducer = function dungeonReducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];

    switch (action.type) {
        case 'MAKE_MOVE':
            return playerMove(action.data, state);
            break;
        default:
            return state;
            break;
    }
};

//ROOT REDUCER (combine reducer - Redux)
var rootReducer = Redux.combineReducers({
    dungeon: dungeonReducer
});

/* ACTIONS - when state and actions are combined with connect method, actions react on chosen state through reducer (used only to change / initialize state):
// mapStateToProps({state} or {object which is part of state})
------------------------------------------------------------------------------------------------------------------------------------*/
function captureKey(data) {
    return {
        type: 'MAKE_MOVE',
        data: data
    };
}

/*INITIAL DUNGEON ARRAY
********************************************************************************************************************************************/

function makeInitialDungeon() {
    var player = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var level = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

    var chestIndex = 150,
        firstAidIndex = 120,
        enemyIndex = 250;
    var enemyHP = 20,
        rows = 120,
        cols = 120;

    var dungeonSize = { rows: rows, cols: cols, level: level, nr_cells: rows * cols };

    var enemies = { locations: [],
        enemyHP: enemyHP * dungeonSize.level,
        HP: [],
        bossHP: 500
    };
    var keyes = { index: Math.floor(Math.random() * (125 - 120) + 120),
        haveKey: false
    };
    var weapons = { 0: 'Bare_fists',
        1: 'Hunting_knife',
        2: 'Fast_nunchak',
        3: 'Deadly_shuriken',
        4: 'Bloody_katana'
    };

    if (level === 1) {
        player = { level: 1,
            topHP: 100,
            HP: 100,
            XP: 0,
            attack: 4,
            weapon: 0,
            nrEnemy: -1,
            position: { row: 0, col: 0 }
        };
    }

    var healthTkns = { HP: dungeonSize.level * 15 };

    var dungeonArr = returnNewDungeonGrid(enemies, dungeonSize.level);

    (function (dungeonArr) {
        for (var i = 0; i < dungeonArr.length; i++) {
            var colIndex = dungeonArr[i].indexOf(9);
            if (colIndex > -1) {
                player.position.row = i;
                player.position.col = colIndex;
                var val = dungeonArr[player.position.row][player.position.col];
                dungeonArr[player.position.row][player.position.col] = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' ? val.concat(100) : [val, 100];
                break;
            }
        }
    })(dungeonArr);

    return { dungeonArr: dungeonArr, player: player, enemies: enemies, weapons: weapons, keyes: keyes, healthTkns: healthTkns, dungeonSize: dungeonSize };
}

/*HELPER FUNCTIONS

POPULATING ASSETS IN ROOMS ARRAY
------------------------------------------------------------------------------------------------------------------------------------*/
function returnNewDungeonGrid(enemies, level) {

    var cols = 120,
        rows = 120,
        nrRooms = 10 + level;
    var dungeonArr = Array.apply(null, Array(rows)).map(function () {
        return Array.apply(null, Array(cols)).map(function () {
            return 0;
        });
    }),
        width = undefined,
        height = undefined;

    return gridArr(nrRooms, dungeonArr, enemies, level);
}
//place rooms across the grid
function gridArr(nrRooms, dungeonArr, enemies, level) {

    var rooms = makeRoomsArr(nrRooms, enemies, level);
    var dngArr = dungnArrWithRooms(rooms, dungeonArr, level);
    return dngArr;
}
//make rooms
function makeRoomsArr(nrRooms, enemies, level) {
    var min = 15,
        max = 25,
        arr = [],
        randWidth = 0,
        randHeight = 0,
        roomArr = undefined,
        assetsObj = { enemies: enemies,
        tempArr: [],
        level: level
    };
    for (var i = 0; i < nrRooms; i++) {
        if (i === 0) {
            min = 20;
            max = 30;
        } else {
            min = 15;
            max = 25;
        }
        randWidth = Math.floor(Math.random() * (max - min) + min);
        randHeight = Math.floor(Math.random() * (max - min) + min);
        roomArr = Array.apply(null, Array(randWidth)).map(function () {
            return Array.apply(null, Array(randHeight)).map(function () {
                return 9;
            });
        });
        arr.push(makeRoomInterior(roomArr, assetsObj, i));
    }
    return arr;
}
// make room interior
function makeRoomInterior(roomArr, assetsObj, roomNr) {

    for (var row = 0; row < roomArr.length; row++) {
        for (var col = 0; col < roomArr[0].length; col++) {
            roomArr[row][col] = row === 0 ? 8 : roomArr[row][col]; // first row - TOP (pavT)
            roomArr[row][col] = row === roomArr.length - 1 ? 1 : roomArr[row][col]; // last row - BOTTOM (pavB)
            roomArr[row][col] = col === 0 && row !== roomArr.length - 1 ? 2 : roomArr[row][col]; // last row - LEFT   (pavL)
            roomArr[row][col] = col === roomArr[0].length - 1 && row !== roomArr.length - 1 ? 3 : roomArr[row][col]; // last row - RIGHT  (pavR)
            roomArr[row][col] = col === 0 && row === 0 ? 7 : roomArr[row][col]; // first row, first column (pavTL)
            roomArr[row][col] = col === roomArr[0].length - 1 && row === 0 ? 4 : roomArr[row][col]; // last row, first column (pavTR)

            //TORCHES!
            roomArr[row][col] = col === 1 && row === roomArr.length - 2 ? [roomArr[row][col], 54] : roomArr[row][col];
            roomArr[row][col] = col === 1 && row === 1 ? [roomArr[row][col], 54] : roomArr[row][col];
            roomArr[row][col] = col === roomArr[0].length - 2 && row === 1 ? [roomArr[row][col], 54] : roomArr[row][col];
            roomArr[row][col] = col === roomArr[0].length - 2 && row === roomArr.length - 2 ? [roomArr[row][col], 54] : roomArr[row][col];
        }
    }
    generateRandomRoomAsset(roomArr, assetsObj, roomNr);
    return roomArr;
}
// SHOULD MAKE IT WITH PROMISES, BUT MISTAKES HAPPEN VERY RARELY AND ALSO THE GAME GETS A HIGHER LEVEL OF UNCERTAINTY
function generateRandomRoomAsset(roomArr, assetsObj, roomNr) {

    var minEven = 1,
        maxEven = 3;
    // first room
    if (roomNr === 0) {
        generateFirstRoom(roomArr, assetsObj);
        generateEnemies(roomArr, assetsObj, minEven, maxEven);
        return;
    }
    // even rooms
    if (roomNr % 2 === 0) {
        generateCellPatches(roomArr, assetsObj, 3);
        generateEnemies(roomArr, assetsObj, minEven, maxEven);
        // odd rooms
    } else {
            generateCellPatches(roomArr, assetsObj, 2);
            generatePlateu(roomArr, assetsObj);
            generateEnemies(roomArr, assetsObj, minEven, maxEven - 1);
        }
}

function generateFirstRoom(roomArr, assetsObj) {

    var row = Math.floor(roomArr.length - 4),
        col = Math.floor(roomArr[0].length / 2);

    if (assetsObj.level === 4) {
        assetsObj.enemies.locations.push([row - 10, col]);
        assetsObj.enemies.HP.push(assetsObj.enemies.bossHP);
        roomArr[row - 10][col] = [roomArr[row - 10][col], 250]; // first enemy to be generated (i.e. boss)
    } else {
            roomArr[row - 10][col] = [roomArr[row - 10][col], 48];
        }
    //make room untrespassable
    for (var i = 3; i < 16; i++) {
        for (var j = -6; j < 7; j++) {
            if (i === 10 && j === 0) {
                continue;
            }
            roomArr[row - i][col + j] = i === 3 ? 8 : assetsObj.level === 4 ? [0, 1000] : 0;
        }
    }
    //generate plateu
    for (var i = 5; i < 10; i++) {
        roomArr[row - i][col] = 25;
    }
    for (var i = 4; i > 2; i--) {
        roomArr[row - i][col - 3] = i === 4 ? [7, 54] : 9;
        roomArr[row - i][col - 2] = i === 4 ? 39 : [0, 21];
        roomArr[row - i][col - 1] = i === 4 ? 42 : [0, 21];
        roomArr[row - i][col + 0] = i === 4 ? 42 : [0, 21];
        roomArr[row - i][col + 1] = i === 4 ? 42 : [0, 21];
        roomArr[row - i][col + 2] = i === 4 ? 40 : [0, 21];
        roomArr[row - i][col + 3] = i === 4 ? [4, 54] : 9;
    }
    // generate steel railing
    for (var i = -7; i < 8; i++) {
        roomArr[row][col + i] = [0, 9, 43];
        roomArr[row - 15][col + i] = [0, 9, 43];
    }
    for (var i = 0; i < 16; i++) {
        if (i === 0) {
            roomArr[row - i][col + 7] = [0, 9, 46];
            roomArr[row - i][col - 7] = [0, 9, 47];
        } else if (i === 15) {
            roomArr[row - i][col + 7] = [0, 9, 46];
            roomArr[row - i][col - 7] = [0, 9, 47];
        } else {

            roomArr[row - i][col + 7] = [0, 9, 45];
            roomArr[row - i][col - 7] = [0, 9, 44];
        }
    }
    roomArr[row][col] = [9, 33];
}

function generateCellPatches(roomArr, assetsObj, patchesNr) {

    var maxR = roomArr.length - 2,
        maxC = roomArr[0].length - 2,
        min = 1;
    var asset = 55;
    for (var i = 0; i < patchesNr; i++) {
        for (var j = 0; j < patchesNr; j++) {
            var randRow = parseInt(Math.floor(Math.random() * (maxR - min) + min)),
                randCol = parseInt(Math.floor(Math.random() * (maxC - min) + min));
            if (assetsObj.level === 4 && i === 2) {
                roomArr[randRow][randCol] = [].concat(0, 58);
            } else {
                roomArr[randRow][randCol] = asset + j;
            }
        }
    }
}

function generatePlateu(roomArr, assetsObj) {

    var rand = parseInt(Math.floor(Math.random() * 3)),
        min = 2,
        maxCol = roomArr[0].length - 6,
        maxRow = Math.floor(roomArr.length / 3),
        randomCol = parseInt(Math.floor(Math.random() * (maxCol - min) + min)),
        randomRow = parseInt(Math.floor(Math.random() * (maxRow - min) + min));

    roomArr[randomRow][randomCol] = 39;
    roomArr[randomRow][randomCol + 1] = 42;
    roomArr[randomRow][randomCol + 2] = [42, 149 + assetsObj.tempArr.push(1)]; // array.push returns generated index from pushed item
    roomArr[randomRow][randomCol + 3] = 40;
    // grates
    for (var i = 0; i < 4; i++) {
        roomArr[randomRow + 1][randomCol + i] = [0, 21];
    }
    roomArr[randomRow + 1][randomCol + rand] = [0, 20];
    // barrels
    roomArr[randomRow + 1][randomCol - 1] = [0, 9, 32];
    roomArr[randomRow + 1][randomCol + 4] = [0, 9, 32];

    roomArr[randomRow + 2][randomCol + 0] = [0, 9, 31];
    roomArr[randomRow + 2][randomCol + 3] = [0, 9, 31];
    roomArr[randomRow + 2][randomCol + rand] = [0, 20];

    // make water corridor
    var len = roomArr.length - 2;
    for (var i = randomRow; i < len; i++) {
        roomArr[i + 2][randomCol + rand] = i === len - 1 ? 18 : 17;
    }
}

function generateEnemies(roomArr, assetsObj, minEn, maxEn) {
    var nrEn = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

    var randomEnNr = nrEn > 0 ? nrEn : parseInt(Math.floor(Math.random() * (maxEn - minEn) + minEn)),
        maxR = roomArr.length - 2,
        maxC = roomArr[0].length - 2,
        min = 1;
    var testArr = undefined;
    for (var i = 0; i < randomEnNr; i++) {
        var randRow = parseInt(Math.floor(Math.random() * (maxR - min) + min)),
            randCol = parseInt(Math.floor(Math.random() * (maxC - min) + min));
        try {
            testArr = Array.prototype.concat(roomArr[randRow][randCol]);
        } catch (e) {
            console.log(randRow, randCol);
            console.log(roomArr);
        }
        var tilesArr = [0, 33, 35, 37, 48, 300];
        for (var _i = 0; _i < tilesArr.length; _i++) {
            if (testArr.indexOf(_i) > -1) {
                generateEnemies(roomArr, assetsObj, minEn, maxEn, randomEnNr - _i);
                return;
            }
        }
        assetsObj.enemies.locations.push([randRow, randCol]);
        assetsObj.enemies.HP.push(assetsObj.enemies.enemyHP);
        roomArr[randRow][randCol] = Array.prototype.concat(roomArr[randRow][randCol], assetsObj.enemies.locations.length + 249);
    }
}
/* POSITIONING ROOMS
------------------------------------------------------------------------------------------------------------------------------------*/
//write rooms into dungeonArr random points
function dungnArrWithRooms(roomArr, dungeonArr, level) {
    //store room sizes in an array (skip the first row)
    var min = 0;
    var max = dungeonArr.length;
    var dungeonRows = dungeonArr.length;
    var dungeonCols = dungeonArr[0].length;
    var roomNrForWeapon = parseInt(Math.floor(Math.random() * (roomArr.length - 2) + 1));

    var _getWeaponPoint = getWeaponPoint(roomArr[roomNrForWeapon], level);

    var row = _getWeaponPoint.row;
    var col = _getWeaponPoint.col;
    //make array of rooms (x = rows, y = cols)

    var randRow = 0,
        randCol = 0,
        i = 0,
        intersectObj = {};
    //place weapon
    roomArr[roomNrForWeapon][row][col] = [].concat(roomArr[roomNrForWeapon][row][col], 49 + level);
    //for each room: write it to the grid and connect it with others
    for (var roomNr = 0; roomNr < roomArr.length; roomNr++) {
        // random 2D point for new room
        randRow = parseInt(Math.floor(Math.random() * (max - min) + min));
        randCol = parseInt(Math.floor(Math.random() * (max - min) + min));
        //randomize the point until the room is 1-4 points away from other rooms!
        while (!isRoomAdequate(randRow, randCol, roomArr[roomNr], dungeonArr, intersectObj, roomNr)) {
            randRow = parseInt(Math.floor(Math.random() * (max - min) + min));
            randCol = parseInt(Math.floor(Math.random() * (max - min) + min));
        }
        //push new room in the dungeonArr
        for (var _row = 0; _row < roomArr[roomNr].length; _row++) {
            // row of room array
            for (var _col = 0; _col < roomArr[roomNr][_row].length; _col++) {
                // col of room array
                try {
                    //((arr, row, col) => {if ([].concat(arr[row][col]).indexOf(50) > -1) {console.log();}})(roomArr[roomNr], row, col);
                    dungeonArr[randRow + _row][randCol + _col] = roomArr[roomNr][_row][_col];
                } catch (e) {
                    // delete the old dungeonArr and fill it with rooms again - happens when room is out of bounds
                    dungeonArr.length = 0;
                    dungeonArr = Array.apply(null, Array(dungeonRows)).map(function () {
                        return Array.apply(null, Array(dungeonCols)).map(function () {
                            return 0;
                        });
                    });
                    return dungnArrWithRooms(roomArr, dungeonArr);
                }
            }
        }
        // needed because of first room - it has no intersect. points!
        if (intersectObj.intersectPts.length > 0 && intersectObj.intersectPts != null) {
            (function (intersectObj, dungeonArr) {
                return connectRoom(intersectObj, dungeonArr);
            })(intersectObj, dungeonArr);
        }
    }
    return dungeonArr;
}

function getWeaponPoint(roomArr, level) {
    var min = 2,
        maxR = roomArr.length,
        maxC = roomArr[0].length,
        row = parseInt(Math.floor(Math.random() * (maxR - min) + min)),
        col = parseInt(Math.floor(Math.random() * (maxC - min) + min));
    if (_typeof(roomArr[row][col]) === 'object') {
        return getWeaponPoint(roomArr);
    } else {
        return { row: row, col: col };
    }
}
function isRoomAdequate(randRow, randCol, room, dungeonArr, intersectObj, roomNr) {

    //move point 1 cell higher
    var rowResize = 0,
        colResize = 0,
        randRowCl = randRow,
        randColCl = randCol;
    var dungeonRows = dungeonArr.length,
        dungeonCols = dungeonArr[0].length;
    //TESTER
    //if (roomNr === 0) {randCol = 1;}
    randRowCl = randRow - 1 < 0 ? (rowResize = 0, 0) : (rowResize = 2, randRow - 1);
    randColCl = randCol - 1 < 0 ? (colResize = 0, 0) : (colResize = 2, randCol - 1);
    //resize room for 1 cell, to check that there's no room in the immediate vicinity 
    var resizedRoom = Array.apply(null, Array(room.length + rowResize)).map(function () {
        return Array.apply(null, Array(room[0].length + colResize)).map(function () {
            return 9;
        });
    });

    //check if cells for a room destination are empty or non existend (undefined)
    if (!areCellsInDungArrEmpty(randRowCl, randColCl, resizedRoom, dungeonArr, intersectObj)) {
        return false;
    }
    //check if there is a room in the vicinity of 4 cells in all directions (it must be, else return false)
    randRowCl = randRow - 5 <= 0 ? (rowResize = randRow * 2, 0) : (rowResize = 10, randRow - 5);
    randColCl = randCol - 5 <= 0 ? (colResize = randCol * 2, 0) : (colResize = 10, randCol - 5);
    intersectObj.offsetRow = randRow - randRowCl;
    intersectObj.offsetCol = randCol - randColCl;
    resizedRoom = Array.apply(null, Array(room.length + rowResize)).map(function () {
        return Array.apply(null, Array(room[0].length + colResize)).map(function () {
            return 9;
        });
    });
    if (areCellsInDungArrEmpty(randRowCl, randColCl, resizedRoom, dungeonArr, intersectObj, roomNr)) {
        return false;
    } else {
        return true;
    }
}

function areCellsInDungArrEmpty(startPtRow, startPtCol, resizedRoom, dungeonArr, intersectObj) {
    var roomNr = arguments.length <= 5 || arguments[5] === undefined ? -1 : arguments[5];

    // checking the value in the middle of the room to be (in the dungeonArr) - it should be empty (=== 0) and not undefined (!= null), else return null
    var middlePointRow = Math.floor(startPtRow + resizedRoom.length / 2);
    var middlePointCol = Math.floor(startPtCol + resizedRoom[0].length / 2);
    var offsetRow = intersectObj.offsetRow;
    var offsetCol = intersectObj.offsetCol;

    var wasRowCalc = false,
        wasColCalc = false,
        returnTrue = true,
        intersectionNr = 0;
    intersectObj.intersectPts = [];
    //in case middle pint of the room is not empty, return false
    if (roomNr === -1) {
        if (dungeonArr[middlePointRow] != null) {
            if (dungeonArr[middlePointRow][middlePointCol] == null || dungeonArr[middlePointRow][middlePointCol] > 0) {
                return false;
            }
        } else {
            return false;
        }
    }
    //calculate only the outermost layer - first and last row and if row was already calculated (wasRowCalc = true), skip
    for (var row = 0; row <= resizedRoom.length; row += resizedRoom.length - 1) {
        wasRowCalc = false;
        for (var col = 0; col < resizedRoom[row].length; col++) {
            if (dungeonArr[startPtRow + row] != null) {
                if (dungeonArr[startPtRow + row][startPtCol + col] != null) {
                    if (dungeonArr[startPtRow + row][startPtCol + col] > 0) {
                        if (roomNr > -1 && wasRowCalc === false) {
                            wasRowCalc = true;

                            var _returnRoomIntersecti = returnRoomIntersectionPts(resizedRoom, row, col, offsetRow, offsetCol);

                            var baseRow = _returnRoomIntersecti.baseRow;
                            var baseCol = _returnRoomIntersecti.baseCol;

                            intersectObj.intersectPts.push({ baseRow: startPtRow + baseRow,
                                baseCol: startPtCol + baseCol,
                                targetRow: startPtRow + row,
                                targetCol: startPtCol + col,
                                offsetRow: offsetRow, offsetCol: offsetCol, roomNr: roomNr
                            });
                        }
                        returnTrue = false;
                    } else {
                        wasRowCalc = false;
                    }
                } else {
                    if (roomNr === -1) {
                        return false;
                    }
                }
            } else {
                if (roomNr === -1) {
                    return false;
                }
            }
            if (wasRowCalc === true) {
                break;
            }
        }
    }

    if (roomNr === 0) {
        return false;
    }
    //calculate only the outermost layer - first and last column and if col was already calculated (wasColCalc = true), skip
    for (var col = 0; col <= resizedRoom[0].length; col += resizedRoom[0].length - 1) {
        wasColCalc = false;
        for (var row = 0; row < resizedRoom.length; row++) {
            if (dungeonArr[startPtRow + row] != null) {
                if (dungeonArr[startPtRow + row][startPtCol + col] != null) {
                    if (dungeonArr[startPtRow + row][startPtCol + col] > 0) {
                        if (roomNr > -1 && wasColCalc === false) {
                            wasColCalc = true;

                            var _returnRoomIntersecti2 = returnRoomIntersectionPts(resizedRoom, row, col, offsetRow, offsetCol);

                            var baseRow = _returnRoomIntersecti2.baseRow;
                            var baseCol = _returnRoomIntersecti2.baseCol;

                            intersectObj.intersectPts.push({ baseRow: startPtRow + baseRow,
                                baseCol: startPtCol + baseCol,
                                targetRow: startPtRow + row,
                                targetCol: startPtCol + col,
                                offsetRow: offsetRow, offsetCol: offsetCol, roomNr: roomNr
                            });
                        }
                        returnTrue = false;
                    }
                } else {
                    if (roomNr === -1) {
                        return false;
                    }
                }
            } else {
                if (roomNr === -1) {
                    return false;
                }
            }
            if (wasColCalc === true) {
                break;
            }
        }
    }
    if (returnTrue === true) {
        return true;
    } else {
        return false;
    }
}

function returnRoomIntersectionPts(resizedRoom, row, col, offsetRow, offsetCol) {

    var returnVal = {};
    //return core cells of the room
    returnVal.baseRow = row < offsetRow ? row + offsetRow : row;
    returnVal.baseRow = row > resizedRoom.length - offsetRow ? row - offsetRow : returnVal.baseRow;

    returnVal.baseCol = col < offsetCol ? col + offsetCol : col;
    returnVal.baseCol = col > resizedRoom[0].length - offsetCol ? col - offsetCol : returnVal.baseCol;

    return returnVal;
}
// connect room togehther wherever there is a gap of < 10
function connectRoom(intersectObj, dungeonArr) {

    intersectObj.intersectPts.forEach(function (intersectionNr, index) {
        //{roomNr, baseRow, baseCol, targetRow: (randRow + row), targetCol: (randCol + col)});
        var row = intersectionNr.baseRow - intersectionNr.targetRow,
            col = intersectionNr.baseCol - intersectionNr.targetCol;
        if (row > 0) {
            //when target room is lower than base room       
            for (var i = row; i > 0; i--) {
                if (dungeonArr[intersectionNr.baseRow - i][intersectionNr.baseCol] === 0) {
                    dungeonArr[intersectionNr.baseRow - i][intersectionNr.baseCol] = i === row && col < 0 ? 29 : 25;
                    dungeonArr[intersectionNr.baseRow - i][intersectionNr.baseCol] = i === row && col > 0 ? 30 : dungeonArr[intersectionNr.baseRow - i][intersectionNr.baseCol];
                }
            }
            //when target room is higher than base room
        } else if (row < 0) {
                for (var i = row; i < 0; i++) {
                    if (dungeonArr[intersectionNr.baseRow - i][intersectionNr.baseCol] === 0) {
                        dungeonArr[intersectionNr.baseRow - i][intersectionNr.baseCol] = i === row && col < 0 ? 27 : 25;
                        dungeonArr[intersectionNr.baseRow - i][intersectionNr.baseCol] = i === row && col > 0 ? 28 : dungeonArr[intersectionNr.baseRow - i][intersectionNr.baseCol];
                    }
                }
            }
        // columns
        if (col < 0) {
            //when target room is to the left of base room
            for (var j = col; j < 0; j++) {
                if (dungeonArr[intersectionNr.targetRow][intersectionNr.baseCol - j] === 0) {
                    dungeonArr[intersectionNr.targetRow][intersectionNr.baseCol - j] = 26;
                }
            }
            //when target room is to the right of base room
        } else if (col > 0) {
                var bool = false;
                for (var j = col; j > 0; j--) {
                    if (dungeonArr[intersectionNr.targetRow][intersectionNr.baseCol - j] === 0) {
                        dungeonArr[intersectionNr.targetRow][intersectionNr.baseCol - j] = 26;
                    }
                }
            }
    });
    intersectObj.intersectPts.length = 0;
}

/*PLAYER MOVEMENT, etc.
------------------------------------------------------------------------------------------------------------------------------------*/

function playerMove(keyCode, state) {
    var player = state.player;
    var dungeonSize = state.dungeonSize;

    var newPosition = [player.position.row, player.position.col];
    switch (keyCode) {
        // UP
        case 38:
            newPosition = returnNexteMove(state, [player.position.row - 1, player.position.col]);
            break;
        // LEFT
        case 37:
            newPosition = returnNexteMove(state, [player.position.row, player.position.col - 1]);
            break;
        // RIGHT
        case 39:
            newPosition = returnNexteMove(state, [player.position.row, player.position.col + 1]);
            break;
        // DOWN
        case 40:
            newPosition = returnNexteMove(state, [player.position.row + 1, player.position.col]);
            break;
        // UNCHANGED POSITION
        default:
            newPosition = [].concat(player.position);
            break;
    }
    newPosition = newPosition[0] > dungeonSize.rows || newPosition[1] > dungeonSize.cols || newPosition[0] < 0 || newPosition[1] < 0 ? [player.position.row, player.position.col] : newPosition;
    if (newPosition[0] === player.position.row && newPosition[1] === player.position.col) {
        return state;
    } else {
        return checkNextMoveForObstacles(newPosition, state);
    }
}
//CALCULATING MOVES ON GRID BORDERS (player shouldn't move over it)
function returnNexteMove(_ref, newPos) {
    var player = _ref.player;
    var dungeonArr = _ref.dungeonArr;
    var dungeonSize = _ref.dungeonSize;

    var result = 0;
    var targetRow = newPos[0];
    var targetCol = newPos[1];

    if (dungeonArr[targetRow] == null) {
        return [player.position.row, player.position.col];
    } else if (dungeonArr[targetRow][targetCol] == null) {
        return [player.position.row, player.position.col];
    }
    // check if player can move
    if (_typeof(dungeonArr[targetRow][targetCol]) === 'object') {
        result = dungeonArr[targetRow][targetCol].indexOf(0) > -1 ? [player.position.row, player.position.col] : newPos;
    } else {
        //result = newPos; /// for unobstructed movement!           // stand still              or            // move
        result = parseInt(dungeonArr[targetRow][targetCol]) === 0 ? [player.position.row, player.position.col] : newPos;
    }
    return result;
}
// CALCULATE ALL POSSIBILITIES THAT CAN HAPPEN WHEN A PLAYER MOVES (for :before meta elements, i.e. enemies, chests, HP, keys)
function checkNextMoveForObstacles(newPos, state) {
    // state variables
    var targetRow = newPos[0];
    var targetCol = newPos[1];
    var dungeonArr = state.dungeonArr;
    var player = state.player;
    var _state$player = state.player;
    var position = _state$player.position;
    var HP = _state$player.HP;
    var XP = _state$player.XP;
    var topHP = _state$player.topHP;
    var weapon = _state$player.weapon;
    var level = _state$player.level;
    var attack = _state$player.attack;
    var nrEnemy = _state$player.nrEnemy;
    var enemies = state.enemies;
    var weapons = state.weapons;
    var keyes = state.keyes;
    var healthTkns = state.healthTkns;
    var dungeonSize = state.dungeonSize;
    var _newPosValue = dungeonArr[targetRow][targetCol]; // tsrget vslue - can be a number or an array
    var chestIndex = 0,
        enemyIndex = 0,
        chestNr = 0,
        enemyNr = 0,
        // clone variables for the better understanding
    isArray = false;

    //get indexes and values of new tile and assets on it (number or array)
    if ((typeof _newPosValue === 'undefined' ? 'undefined' : _typeof(_newPosValue)) === 'object') {
        isArray = true;
        chestNr = enemyNr = parseInt(_newPosValue.slice(-1));
        enemyIndex = enemyNr - 250;
        chestIndex = chestNr - 150;
    } else {
        chestNr = enemyNr = _newPosValue;
        enemyIndex = enemyNr - 250;
        chestIndex = chestNr - 150;
    }

    //IF ATTACKING AN ENEMY (numbering from 250 - 300)
    if (enemyNr >= 250 && enemyNr <= 300) {
        var _ret = function () {
            var _fight = fight(player, dungeonSize.level);

            var playerAtt = _fight.playerAtt;
            var enemyAtt = _fight.enemyAtt;

            var enemyDamageArr = enemies.HP.map(function (HP, index) {
                return enemyIndex === index ? HP - enemyAtt : HP;
            }); // updating HP values for enemy[index]

            //PLAYER DIES, ENEMY LIVES - THE END
            if (HP - playerAtt < 1 && enemies.HP[enemyIndex] - enemyAtt > 0) {
                document.getElementById('ftl').style.opacity = '1';
                setTimeout(function () {
                    return document.getElementById('ftl').style.opacity = '0';
                }, 1500);
                return {
                    v: makeInitialDungeon()
                };
                //IF ENEMY STAYS ALIVE (HP - damage > 0)
            } else if (enemies.HP[enemyIndex] - enemyAtt > 0) {
                    var enemyId = targetRow * dungeonSize.rows + targetCol;
                    var playerId = player.position.row * dungeonSize.rows + player.position.col;
                    if (targetCol - player.position.col > 0) {
                        showDamage(playerId, enemyId, playerAtt, enemyAtt, 'fromLeft'); // show damage on screen (css animation)
                    } else {
                            showDamage(playerId, enemyId, playerAtt, enemyAtt, 'fromRight'); // show damage on screen (css animation)
                        }
                    return {
                        v: Object.assign({}, state, { player: { position: position, weapon: weapon, level: level, attack: attack, topHP: topHP, XP: XP,
                                nrEnemy: enemyNr,
                                HP: HP - playerAtt
                            }
                        }, { enemies: { locations: enemies.locations,
                                enemyHP: enemies.enemyHP,
                                HP: enemyDamageArr,
                                bossHP: enemies.bossHP
                            }
                        })
                    };
                    //IF ENEMY DIES, ERASE HIM AND CHECK XP (level upgrade)
                } else if (enemies.HP[enemyIndex] - enemyAtt <= 0) {
                        if (enemyNr === 250 && dungeonSize.level === 4) {
                            document.getElementById('ftw').style.opacity = '1';
                            setTimeout(function () {
                                return document.getElementById('ftw').style.opacity = '0';
                            }, 3000);
                            return {
                                v: makeInitialDungeon()
                            };
                        }
                        var dungeonArrNew = dungeonArr.slice(0);
                        dungeonArrNew[targetRow][targetCol] = [].concat(_newPosValue[0], 49);
                        var playerLvl = XP + dungeonSize.level * 10 >= player.level * 80 ? player.level + 1 : player.level,
                            upgradedXP = playerLvl !== player.level ? XP - player.level * 80 + dungeonSize.level * 10 : XP + player.level * 10,
                            upgradedHP = playerLvl !== player.level ? HP + 0.5 * topHP : HP,
                            upgradedAtt = playerLvl !== player.level ? player.attack + dungeonSize.level * 2 : player.attack;
                        return {
                            v: Object.assign({}, state, { player: { position: position, weapon: weapon,
                                    attack: upgradedAtt,
                                    level: playerLvl,
                                    XP: upgradedXP,
                                    HP: Math.round(upgradedHP),
                                    topHP: HP > topHP ? HP : topHP,
                                    nrEnemy: -1
                                } }, { dungeonArr: dungeonArrNew }, { enemies: { locations: enemies.locations.filter(function (val, index) {
                                        return index !== enemyIndex;
                                    }),
                                    enemyHP: enemies.enemyHP,
                                    HP: enemyDamageArr,
                                    bossHP: enemies.bossHP
                                } })
                        };
                    }
            // IF BUMPING INTO CHEST  (erase it and put assetNr in it's place! => substract 10)
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    } else if (chestNr >= 150 && chestNr < 180) {
            var dungeonArrNew = dungeonArr.slice(0);
            dungeonArrNew[targetRow][targetCol] = isArray ? _newPosValue.slice(0, -1).concat(chestNr - 30) : Array.prototype.concat([], _newPosValue, chestNr - 30);
            return Object.assign({}, state, { dungeonArr: dungeonArrNew });
            // IF LOCKED DOOR, CHANGE TO UNLOCKED IF PLAYER HAS A KEY!
        } else if (chestNr === 33) {
                if (keyes.haveKey) {
                    var dungeonArrNew = dungeonArr.slice(0);
                    dungeonArrNew[targetRow][targetCol] = isArray ? _newPosValue.slice(0, -1).concat(34) : Array.prototype.concat([], _newPosValue, 34);
                    return Object.assign({}, state, { dungeonArr: dungeonArrNew }, { keyes: { haveKey: false,
                            index: keyes.index
                        }
                    });
                } else {
                    // TODO: MAYBE DO A POPUP FROM REACT BOOTSTRAP
                    alert('You need a key to open this door!');
                    return state;
                }
                // IF NOTHING OF THE ABOVE, MAKE A MOVE
            } else {
                    var posId = targetRow * dungeonSize.rows + targetCol;
                    var dungeonArrNew = dungeonArr.slice(0),
                        oldPositionVal = dungeonArrNew[player.position.row][player.position.col];
                    oldPositionVal.splice(oldPositionVal.indexOf(100), 1);
                    dungeonArrNew[player.position.row][player.position.col] = oldPositionVal.length === 1 ? oldPositionVal[0] : oldPositionVal;
                    dungeonArrNew[targetRow][targetCol] = Array.prototype.concat([], _newPosValue, 100);

                    //IF WEAPON, TAKE IT (show weapon name on screen)
                    if (chestNr >= 50 && chestNr <= 53) {
                        dungeonArrNew[targetRow][targetCol].splice(dungeonArrNew[targetRow][targetCol].indexOf(chestNr), 1); // delete player from old spot
                        dungeonArrNew[targetRow][targetCol] = dungeonArrNew[targetRow][targetCol].length === 1 ? dungeonArrNew[targetRow][targetCol][0] : dungeonArrNew[targetRow][targetCol];
                        showBonus(posId, weapons[chestNr - 49].replace('_', ' '));
                        return Object.assign({}, state, { dungeonArr: dungeonArrNew }, { player: { position: { row: targetRow,
                                    col: targetCol
                                },
                                weapon: weapon + 1,
                                level: level, attack: attack, nrEnemy: nrEnemy, HP: HP, XP: XP, topHP: topHP
                            } });
                        //IF FIRST AID, TAKE IT (show +HP number on screen)
                    } else if (chestNr >= 120 && chestNr <= 149 && chestNr !== keyes.index) {
                            dungeonArrNew[targetRow][targetCol].splice(dungeonArrNew[targetRow][targetCol].indexOf(chestNr), 1); // delete player from old spot
                            dungeonArrNew[targetRow][targetCol] = dungeonArrNew[targetRow][targetCol].length === 1 ? dungeonArrNew[targetRow][targetCol][0] : dungeonArrNew[targetRow][targetCol];
                            showBonus(posId, healthTkns.HP);
                            return Object.assign({}, state, { dungeonArr: dungeonArrNew }, { player: { position: { row: targetRow,
                                        col: targetCol
                                    },
                                    level: level, weapon: weapon, attack: attack, nrEnemy: nrEnemy,
                                    HP: HP + healthTkns.HP,
                                    XP: XP,
                                    topHP: topHP + healthTkns.HP / 1.5
                                } });
                            //FOUND KEY
                        } else if (chestNr === keyes.index) {
                                dungeonArrNew[targetRow][targetCol].splice(dungeonArrNew[targetRow][targetCol].indexOf(chestNr), 1); // delete player from old spot
                                dungeonArrNew[targetRow][targetCol] = dungeonArrNew[targetRow][targetCol].length === 1 ? dungeonArrNew[targetRow][targetCol][0] : dungeonArrNew[targetRow][targetCol];
                                showBonus(posId, 'Golden key!');
                                return Object.assign({}, state, { dungeonArr: dungeonArrNew }, { player: { position: { row: targetRow,
                                            col: targetCol
                                        },
                                        level: level, weapon: weapon, attack: attack, nrEnemy: nrEnemy, HP: HP, XP: XP, topHP: topHP }
                                }, { keyes: { index: keyes.index,
                                        haveKey: true
                                    }
                                });
                                // LADDER TO NEXT DUNGEON
                            } else if (chestNr === 48) {
                                    return makeInitialDungeon(player, dungeonSize.level + 1);
                                    // IF BOSS BEATEN GENERETE NEW DUNGEON AND NOTIFY PLAYER OF THE WIN
                                } else if (chestNr === 60) {
                                        document.getElementById('ftw').style.opacity = '1';
                                        setTimeout(function () {
                                            return document.getElementById('ftw').style.opacity = '0';
                                        }, 3000);
                                        return makeInitialDungeon();
                                        //JUST MOVE
                                    } else {
                                            return Object.assign({}, state, { dungeonArr: dungeonArrNew }, { player: { position: { row: targetRow,
                                                        col: targetCol
                                                    },
                                                    HP: HP, XP: XP, topHP: topHP, level: level, weapon: weapon, attack: attack, nrEnemy: nrEnemy } });
                                        }
                }
}
/*CALCULATE AND RENDER DAMAGE
------------------------------------------------------------------------------------------------------------------------------------*/
function fight(player, dungeonLvl) {

    // calculate attack power of enemy   
    var min = dungeonLvl * 4,
        max = dungeonLvl * 8;
    //if boss
    if (player.nrEnemy === 250 && dungeonLvl === 4) {
        min = 70;
        max = 110;
    }
    var playerAtt = Math.floor(Math.random() * (max - min)) + min;
    // calculate attack power of player
    min = player.attack;
    max = player.attack + (player.weapon === 0 ? 4 : player.weapon * 8);
    var enemyAtt = Math.floor(Math.random() * (max - min)) + min;
    return { playerAtt: playerAtt, enemyAtt: enemyAtt };
}
//showing damage data on screen (css animation)
function showDamage(playerId, enemyId, playerAtt, enemyAtt, direction) {

    var player = document.getElementById('_' + playerId),
        enemy = document.getElementById('_' + enemyId),
        dmgPlayer = direction === 'fromLeft' ? 'damageLeft' : 'damageRight',
        damageEn = direction === 'fromLeft' ? 'damageRight' : 'damageLeft';
    player.setAttribute('data', "-" + playerAtt);
    enemy.setAttribute('data', "-" + enemyAtt);
    window.setTimeout(function () {
        return player.classList.add(dmgPlayer);
    }, 100);
    window.setTimeout(function () {
        return player.classList.remove(dmgPlayer);
    }, 600);
    window.setTimeout(function () {
        return enemy.classList.add(damageEn);
    }, 100);
    window.setTimeout(function () {
        return enemy.classList.remove(damageEn);
    }, 600);
}
//showing damage data on screen (css animation)
function showBonus(newPosition, playerBonus) {

    var bonus = typeof playerBonus === 'number' ? "+" + playerBonus : '+ ' + playerBonus,
        bonusType = typeof playerBonus === 'number' ? 'bonus' : 'foundAsset',
        player = document.getElementById('_' + newPosition);
    player.setAttribute('data', bonus);
    window.setTimeout(function () {
        return player.classList.add(bonusType);
    }, 50);
    window.setTimeout(function () {
        return player.classList.remove(bonusType);
    }, 550);
}

/*REACT RENDERING COMPONENTS
------------------------------------------------------------------------------------------------------------------------------------*/
//HELPER REACT COMPONENTS
var DataHub = function DataHub(props) {

    var playerBarLen = props.player.topHP * 5 > props.style.width - 180 ? props.style.width - 180 : props.player.topHP * 5;

    var enemyBar = function enemyBar(nrEnemy, enemies) {
        if (nrEnemy > -1) {
            var enemyIndex = props.player.nrEnemy - 250,
                valueP = enemies.HP[enemyIndex] < 0 ? 0 : enemies.HP[enemyIndex];
            var boss = false;
            var fullHP = 0;
            if (props.dungeonSize.level === 4 && enemyIndex === 0) {
                fullHP = props.enemies.bossHP;
                boss = true;
            } else {
                fullHP = props.dungeonSize.level * 20 * 10;
            }
            return React.createElement(
                'div',
                { className: 'dataContainer' },
                React.createElement(
                    'div',
                    { className: 'hubData' },
                    'Enemy: '
                ),
                React.createElement(
                    'div',
                    { className: 'hubBar', style: { 'width': fullHP + 'px', 'box-shadow': 'inset ' + (boss ? valueP : valueP * 10) + 'px 0 0 0 brown' } },
                    valueP
                )
            );
        }
    };

    return React.createElement(
        'div',
        { id: 'hub' },
        React.createElement(
            'div',
            { className: 'playerBar' },
            React.createElement(
                'div',
                { className: 'hubData player' },
                'Player life: '
            ),
            React.createElement(
                'div',
                { className: 'hubBar player', style: { 'width': playerBarLen + "px", 'box-shadow': 'inset ' + props.player.HP / props.player.topHP * playerBarLen + 'px 0 0 0 darkgreen' } },
                " " + props.player.HP
            )
        ),
        React.createElement(
            'div',
            { className: 'enemyHub' },
            enemyBar(props.player.nrEnemy, props.enemies)
        ),
        React.createElement(
            'table',
            { className: 'weapon' },
            React.createElement(
                'tr',
                { className: 'weaponTitle' },
                React.createElement(
                    'th',
                    { colSpan: '2' },
                    'Weapon [damage]:'
                )
            ),
            React.createElement(
                'tr',
                { className: 'weaponData' },
                React.createElement(
                    'td',
                    null,
                    React.createElement('div', { className: '_' + (49 + props.player.weapon), style: { 'width': '25px', 'height': '25px' } })
                ),
                React.createElement(
                    'td',
                    null,
                    props.weapons[props.player.weapon].replace('_', ' '),
                    React.createElement(
                        'span',
                        { style: { 'color': 'black' } },
                        ' ',
                        ' [ ' + (props.player.weapon === 0 ? 4 : props.player.weapon * 8) + ' ] ',
                        ' '
                    )
                )
            )
        ),
        React.createElement(
            'table',
            { className: 'attackData', data: props.keyes.haveKey ? '_' + 37 : "" },
            React.createElement(
                'tr',
                { className: 'weaponTitle' },
                React.createElement(
                    'th',
                    null,
                    'min attack damage: '
                )
            ),
            React.createElement(
                'tr',
                { className: 'weaponData' },
                React.createElement(
                    'td',
                    { style: { 'color': 'black' } },
                    props.player.attack
                )
            )
        ),
        React.createElement('div', { className: '_key', style: props.keyes.haveKey ? { "display": 'block' } : { "display": 'none' } })
    );
};

var XPBar = function XPBar(props) {

    var colorArr = ['white', 'yellow', 'orange', 'green', 'blue', 'purple', 'red', 'brown', '#1a1a00'];
    var fontColArr = ['green', 'green', 'green', 'cyan', 'white', 'white', 'white', 'white', 'white'];

    return React.createElement(
        'div',
        { className: 'XPBar',
            'data-before': 'Player level: ' + props.player.level,
            'data-after': 'Dungeon Level: ' + props.dungeonSize.level,
            style: { 'color': fontColArr[props.player.level - 1], 'width': props.bar.width + 7, 'box-shadow': 'inset ' + props.player.XP / (props.player.level * 80) * props.bar.width + 'px 0 0 0 ' + colorArr[props.player.level - 1] } },
        props.player.XP + ' XP'
    );
};

var DirectionsBtn = function DirectionsBtn(props) {
    return React.createElement(
        'button',
        props,
        props.children
    );
};

var ToggleBtn = function ToggleBtn(props) {
    return React.createElement(
        'button',
        props,
        props.children
    );
};

var GridRow = function GridRow(props) {
    return React.createElement('div', props);
};

//MAIN REACT COMPONENT

var Dungeon = function (_React$Component) {
    _inherits(Dungeon, _React$Component);

    function Dungeon(props) {
        _classCallCheck(this, Dungeon);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.state = { mapHidden: false };
        var cellW = 0;
        _this.toggleInstr = false;
        _this.ww = screen.availWidth; //window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
        _this.wh = screen.availHeight; //window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;     
        _this.containerWidth = _this.ww * 0.80;
        _this.containerHeight = _this.wh * 0.6;
        if (_this.wh < 840) {
            _this.rowsToShow = 10;
        } else {
            _this.rowsToShow = 12;
        }
        _this.colsToShow = 30;
        _this.cellSize = parseFloat((_this.containerWidth / 61.1).toLocaleString('en', { maximumFractionDigits: 2, useGrouping: false }));

        _this.onClick = _this.onClick.bind(_this);
        _this.toggleInstructions = _this.toggleInstructions.bind(_this);

        ReactDOM.render(React.createElement(
            DirectionsBtn,
            { className: 'directionsBtn', onClick: _this.toggleInstructions },
            'Close'
        ), document.getElementById('insert'));
        return _this;
    }

    Dungeon.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        document.getElementById('c').focus();
        setTimeout(function () {
            return _this2.setState({ mapHidden: true });
        }, 500);
    };

    Dungeon.prototype._classReturn = function _classReturn(cellVal, obj) {
        // CALCULATING THE DARKNESS
        if (this.state.mapHidden) {
            var row = obj.position.row - obj.row,
                col = obj.position.col - obj.col,
                sqrs = 6;
            //RIGHT TOP
            if (row === sqrs && col === sqrs || row === sqrs && col === sqrs - 1 || row === sqrs - 1 && col === sqrs) {
                return 'cell _0';
            } //RIGHT BOTTOM
            if (row === -sqrs && col === sqrs || row === -sqrs && col === sqrs - 1 || row === -sqrs + 1 && col === sqrs) {
                return 'cell _0';
            } //LEFT BOTTOM
            if (row === sqrs && col === -sqrs || row === sqrs && col === -sqrs + 1 || row === sqrs - 1 && col === -sqrs) {
                return 'cell _0';
            } //LEFT TOP
            if (row === -sqrs && col === -sqrs || row === -sqrs && col === -sqrs + 1 || row === -sqrs + 1 && col === -sqrs) {
                return 'cell _0';
            }
            //  CALC DOWN & UP           // CALC RIGHT & LEFT
            if (row >= sqrs + 1 || row <= -sqrs - 1 || col >= sqrs + 1 || col <= -sqrs - 1) {
                return 'cell _0';
            }
        }
        // RETURNING CLASSES
        if ((typeof cellVal === 'undefined' ? 'undefined' : _typeof(cellVal)) === 'object') {
            var cell = cellVal.slice(-1)[0];
            if (cell >= 150 && cell < 180) {
                return cssClass(35);
            } else if (cell >= 120 && cell < 150) {
                if (this.props.dungeon.keyes.index === cell) {
                    return cssClass(37);
                } else {
                    return cssClass(36);
                }
            } else if (cell >= 250 && cell <= 300) {
                if (this.props.dungeon.dungeonSize.level === 4 && cell === 250) {
                    return cssClass(254);
                } else {
                    return cssClass(this.props.dungeon.dungeonSize.level + 249);
                }
            } else {
                return cssClass(cell);
            }
        } else {
            return 'cell _' + cellVal;
        }

        // calculates only if cellVal is an array
        function cssClass(val) {
            if (cellVal.length === 2) {
                return 'cell _' + cellVal[0] + ' _' + val;
            } else if (cellVal.length > 2) {
                var temp = "cell";
                for (var i = 0; i < cellVal.length - 1; i++) {
                    temp += ' _' + cellVal[i];
                }
                return temp + ' _' + val;
            }
        }
    };

    Dungeon.prototype.onClick = function onClick() {
        this.setState({ mapHidden: !this.state.mapHidden });
    };

    Dungeon.prototype.toggleInstructions = function toggleInstructions() {

        if (this.toggleInstr) {
            document.getElementById('instructions').className = '';
        } else {
            document.getElementById('instructions').className = 'open';
        }
        this.toggleInstr = !this.toggleInstr;
    };

    Dungeon.prototype.render = function render() {
        var _this3 = this;

        var containerStyle = { width: this.containerWidth };
        var cellStyle = { width: this.cellSize, height: this.cellSize };
        var _props$dungeon$dungeo = this.props.dungeon.dungeonSize;
        var rows = _props$dungeon$dungeo.rows;
        var cols = _props$dungeon$dungeo.cols;
        var _props$dungeon = this.props.dungeon;
        var player = _props$dungeon.player;
        var position = _props$dungeon.player.position;
        var enemies = _props$dungeon.enemies;
        var dungeonSize = _props$dungeon.dungeonSize;
        var weapons = _props$dungeon.weapons;
        var keyes = _props$dungeon.keyes;

        var upperBorder = this.props.dungeon.player.position.row + this.rowsToShow,
            bottomBorder = this.props.dungeon.player.position.row - this.rowsToShow,
            leftBorder = this.props.dungeon.player.position.col - this.colsToShow < 0 ? 0 : this.props.dungeon.player.position.col - this.colsToShow,
            rightBorder = this.props.dungeon.player.position.col + this.colsToShow < this.colsToShow * 2 ? this.colsToShow * 2 : this.props.dungeon.player.position.col + this.colsToShow;
        //calculating if dungeon should render new tiles or not (e.g. when player close to the border)
        upperBorder = upperBorder >= rows ? rows : upperBorder;
        upperBorder = upperBorder <= this.rowsToShow * 2 ? this.rowsToShow * 2 : upperBorder;
        bottomBorder = bottomBorder >= rows - this.rowsToShow * 2 ? rows - this.rowsToShow * 2 : bottomBorder;
        bottomBorder = bottomBorder <= 0 ? 0 : bottomBorder;
        leftBorder = leftBorder >= this.colsToShow * 2 ? this.colsToShow * 2 : leftBorder;
        rightBorder = rightBorder >= cols ? cols : rightBorder;

        return React.createElement(
            'div',
            { onClick: this.onMissClick },
            React.createElement(DataHub, { style: containerStyle, player: player, enemies: enemies, dungeonSize: dungeonSize, weapons: weapons, keyes: keyes }),
            React.createElement(
                ToggleBtn,
                { className: 'toggleBtn', onClick: this.onClick },
                'Toggle dark'
            ),
            React.createElement(
                DirectionsBtn,
                { className: 'directionsBtn', onClick: this.toggleInstructions },
                'Instructions'
            ),
            React.createElement(XPBar, { player: this.props.dungeon.player, dungeonSize: dungeonSize, bar: containerStyle }),
            React.createElement(
                'div',
                { id: 'c', className: 'cont', tabIndex: '1', style: containerStyle, onKeyDown: this.props._handleKeyDown },
                this.props.dungeon.dungeonArr.map(function (arr, row) {
                    if (row <= upperBorder && row >= bottomBorder) {
                        return React.createElement(
                            GridRow,
                            { key: 'row' + row, id: '_row' + row, className: 'rowGrid' },
                            arr.map(function (value, col) {
                                if (col <= rightBorder && col >= leftBorder) {
                                    return React.createElement('div', { key: row * cols + col, id: '_' + (row * cols + col),
                                        className: _this3._classReturn.call(_this3, value, { position: position, row: row, col: col }), style: cellStyle });
                                }
                            })
                        );
                    }
                })
            )
        );
    };

    return Dungeon;
}(React.Component);

Dungeon.contextTypes = { store: React.PropTypes.object };

/*REACT-REDUX code: establishing connection between React components and Redux' state

------------------------------------------------------------------------------------------------------------------------------------*/
var mapStateToDungeonGrid = function mapStateToDungeonGrid(state) {
    return _extends({}, state);
};
var dispatchActionToGrid = function dispatchActionToGrid(dispatch) {
    return {
        _handleKeyDown: function _handleKeyDown(event) {
            return dispatch(captureKey(event.keyCode));
        }
    };
};

Dungeon = ReactRedux.connect(mapStateToDungeonGrid, dispatchActionToGrid)(Dungeon);

/*
const logger = store => next => action => {
  console.group(action.type)
  console.log('curr state', store.getState());
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}
  let createStoreWithMiddleware = Redux.applyMiddleware(logger)(Redux.createStore)

//ReactDOM.render(<Dungeon store={createStoreWithMiddleware(rootReducer)}/>, document.getElementById('main'));   for logging (const logger)
*/

document.addEventListener("DOMContentLoaded", function (event) {

    ReactDOM.render(React.createElement(Dungeon, { store: Redux.createStore(rootReducer) }), document.getElementById('main'));
});

// another way of putting it with ReactRedux
/*    ReactDOM.render(<Provider store={Redux.createStore(rootReducer)}>
                      <Dungeon/>
                  </Provider>, document.getElementById('main'));
*/
document.addEventListener("click", function(event) {  
    document.getElementById('c').focus();
}); 
