//initialization of game variables ---------------------------------
const arrYour = Array(10).fill(0);
const arrOpp = Array(10).fill(0);
const randomCoor = [0, 0] // random coordinates
const opponentShips = [];
const yourShips = [];
let hor = true;
let isWounded = false;
let indexOpp;
let indexYour;
let lastWoundedShip;
let pathUp = true;
let pathDown = false;
let pathLeft = false;
let pathRight = false;
let finishOff = false;
let lastX;
let lastY;
let lastZ;
let moveTransition = 'your';

function initGame() { ///initialization of game arrays
  for (let i = 0; i < 10; i++) {
    arrYour[i] = Array(10).fill(0);
  };

  for (let i = 0; i < 10; i++) {
    arrOpp[i] = Array(10).fill(0);
  };
};
initGame();

function addTable(name) { //creating a playing field
  const table = document.createElement("table");
  const fullName = name + '-table'
  table.setAttribute('id', fullName);
  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  for (let i = 0; i < 11; i++) {
    const tr = document.createElement('tr');
    for (let j = 0; j < 11; j++) {
      const td = document.createElement('td');
      tr.appendChild(td);
    };
    tbody.appendChild(tr);
  };

  document.getElementById(name).appendChild(table);
  tableFill('#' + name);
};

function tableFill(name) { //filling the playing field
  const nameFull = name + ' table';
  const table = document.querySelector(nameFull);
  const elemZero = table.rows[0].cells[0];
  elemZero.classList.add('zero-cell');

  for (let i = 1; i < 11; i++) {
    let elemR = table.rows[0].cells[i];
    elemR.classList.add('ruler');
    elemR.textContent = String.fromCharCode(64 + i);
    let elemC = table.rows[i].cells[0];
    elemC.textContent = i;
    elemC.classList.add('ruler');
  };

  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      let elem = table.rows[i].cells[j];
      elem.classList.add('cell');
    };
  };
};
addTable('your');
addTable('opponent');

function autoPlacement(shipLength, ships, arrField) {//automatic placement of ships 
  let shipOn = true;

  while (shipOn) {
    let occupied = false;
    randomCoordinates();
    const x = randomCoor[0];
    const y = randomCoor[1];
    let horOpp = (Math.floor(Math.random() * 10) % 2 == 0);
    let verOpp = (Math.floor(Math.random() * 10) % 2 == 0);

    for (let i = 0; i < shipLength; i++) {

      if (((horOpp) && (verOpp)) && (y + shipLength - 1 <= 9) && (arrField[x][y + i] != 0)) occupied = true;
      if (((horOpp) && (!verOpp)) && (y - shipLength + 1 >= 0) && (arrField[x][y - i] != 0)) occupied = true;
      if (((!horOpp) && (verOpp)) && (x + shipLength - 1 <= 9) && (arrField[x + i][y] != 0)) occupied = true;
      if (((!horOpp) && (!verOpp)) && (x - shipLength + 1 >= 0) && (arrField[x - i][y] != 0)) occupied = true;
    };

    if (!occupied) {
      ships[ships.length - 1] = [];
      ships[ships.length - 1][0] = +shipLength;
      for (let i = 0; i < shipLength; i++) {
        if (((horOpp) && (verOpp)) && (y + shipLength - 1 <= 9)) {
          arrField[x][y + i] = 2;
          ships[ships.length - 1].push([x, (y + i), 0]);
          shipOn = false;
        };
        if (((horOpp) && (!verOpp)) && (y - shipLength + 1 >= 0)) {
          arrField[x][y - i] = 2;
          ships[ships.length - 1].push([x, (y - i), 0]);
          shipOn = false;
        };
        if (((!horOpp) && (verOpp)) && (x + shipLength - 1 <= 9)) {
          arrField[x + i][y] = 2;
          ships[ships.length - 1].push([(x + i), y, 0]);
          shipOn = false;
        };
        if (((!horOpp) && (!verOpp)) && (x - shipLength + 1 >= 0)) {
          arrField[x - i][y] = 2;
          ships[ships.length - 1].push([(x - i), y, 0]);
          shipOn = false;
        };
      };
    };
  };

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (arrField[i][j] == 2) {
        if ((i > 0) && (arrField[i - 1][j] != 2)) arrField[i - 1][j] = 3;
        if ((i < 9) && (arrField[i + 1][j] != 2)) arrField[i + 1][j] = 3;
        if ((j > 0) && (arrField[i][j - 1] != 2)) arrField[i][j - 1] = 3;
        if ((j < 9) && (arrField[i][j + 1] != 2)) arrField[i][j + 1] = 3;
        if ((i > 0) && (j > 0) && (arrField[i - 1][j - 1] != 2)) arrField[i - 1][j - 1] = 3;
        if ((i < 9) && (j > 0) && (arrField[i + 1][j - 1] != 2)) arrField[i + 1][j - 1] = 3;
        if ((i > 0) && (j < 9) && (arrField[i - 1][j + 1] != 2)) arrField[i - 1][j + 1] = 3;
        if ((i < 9) && (j < 9) && (arrField[i + 1][j + 1] != 2)) arrField[i + 1][j + 1] = 3;
      };
    };
  };
  return true;
};

function startAutoPlacementYour() { //start auto-placement of your ships
  if (yourShips.length == 10) return;
  for (let i = 0; i < 10; i++) {
    let ship = document.querySelectorAll('.ships')[i];
    let shipLength = ship.className[ship.className.length - 1];
    if (yourShips.length == 10) break; 
    yourShips.push(shipLength); 
    if (!isNaN(shipLength / shipLength)) autoPlacement(shipLength, yourShips, arrYour);
    ship.hidden = true
  };

  const table = document.querySelector('#your table');
  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      if (arrYour[i - 1][j - 1] == 2) {
        let myShip = table.rows[i].cells[j];
        myShip.classList.add('elem-ship');
      };
    };
  };
};

function shipMove() { //manual placement of ships
  let x, xX, y, yY, shipLength;
  let currentCell = null;
  let shipRotate;
  let currentTable;

  document.addEventListener('mousedown', function (event) {
    event.preventDefault();
    shipRotate = event.target.closest('.ships')
    if (!shipRotate) return;
    shipRotate.ondragstart = function () {
      return false;
    };
    if (shipRotate.className.includes(4)) shipLength = 4;
    if (shipRotate.className.includes(3)) shipLength = 3;
    if (shipRotate.className.includes(2)) shipLength = 2;
    if (shipRotate.className.includes(1)) shipLength = 1;

    shipRotate.classList.add('moving-ship')
    document.body.append(shipRotate);

    moveAt(event.pageX, event.pageY);

    function moveAt(pageX, pageY) {
      shipRotate.style.left = pageX - 17 + 'px';
      shipRotate.style.top = pageY - 17 + 'px';
    };

    let table = document.querySelector('#your table');
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
      shipRotate.hidden = true;
      let elemCell = document.elementFromPoint(event.clientX, event.clientY);
      x = elemCell.parentNode.rowIndex;
      y = elemCell.cellIndex;
      shipRotate.hidden = false;

      if (!elemCell) return;

      let necessaryCell = elemCell.closest('.cell');
      if (currentCell != necessaryCell) {
        let table = document.querySelector('#your table');
        if (currentCell) {
          for (let i = 0; i < shipLength; i++) {
            if (hor) {
              if (yY > (11 - shipLength)) yY = (11 - shipLength);
              elemShip = table.rows[xX].cells[yY + i];
            } else {
              if (xX > (11 - shipLength)) xX = (11 - shipLength);
              elemShip = table.rows[xX + i].cells[yY];
            };
            elemShip.classList.remove('cell-ship');
          };
          arragementShipOff(xX, yY, shipLength);
        };
        currentCell = necessaryCell;
        if (currentCell) {
          for (let i = 0; i < shipLength; i++) {
            let elemShip
            if (hor) {
              if (y > (11 - shipLength)) y = (11 - shipLength);
              elemShip = table.rows[x].cells[y + i];
            } else {
              if (x > (11 - shipLength)) x = (11 - shipLength);
              elemShip = table.rows[x + i].cells[y];
            };
            elemShip.classList.add('cell-ship');
          };
          arragementShipOn(x, y, shipLength);
        };
        xX = x;
        yY = y;
      };

    };
    currentTable = table;

    document.addEventListener('mousemove', onMouseMove);
    shipRotate.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      if (hor) {
        if (y > (11 - shipLength)) y = (11 - shipLength);
      } else {
        if (x > (11 - shipLength)) x = (11 - shipLength);
      };
      if (fixingShip(x, y, shipLength)) {
        shipRotate.hidden = true;
        hor = true;
      };
      shipRotate.onmouseup = null;
    };
  });

  document.addEventListener("keydown", function (event) {
    if (event.code == 'Space') rotateShip(shipRotate, currentTable, shipLength);
  });
};
shipMove();

function arragementShipOn(x, y, shipLength) { //drawing the ship's movement in the array
  for (let i = 0; i < shipLength; i++) {
    if (hor) {
      if ((arrYour[x - 1][y + i - 1] != 2) && (arrYour[x - 1][y + i - 1] != 3)) arrYour[x - 1][y + i - 1] = 1;
    } else {
      if ((arrYour[x + i - 1][y - 1] != 2) && (arrYour[x + i - 1][y - 1] != 3)) arrYour[x + i - 1][y - 1] = 1;
    };
  };
};

function arragementShipOff(x, y, shipLength) { //erasing the trace from moving the ship
  for (let i = 0; i < shipLength; i++) {
    if (hor) {
      if ((arrYour[x - 1][y + i - 1] != 2) && (arrYour[x - 1][y + i - 1] != 3)) arrYour[x - 1][y + i - 1] = 0;
    } else {
      if ((arrYour[x + i - 1][y - 1] != 2) && (arrYour[x + i - 1][y - 1] != 3)) arrYour[x + i - 1][y - 1] = 0;
    };
  };
};

function fixingShip(x, y, shipLength) { //drawing of installed ships    
  const table = document.querySelector('#your table');
  if ((y < 1) || (x < 1)) return false;

  for (let i = 0; i < shipLength; i++) {
    if (hor) {
      if ((arrYour[x - 1][y + i - 1] == 2) || (arrYour[x - 1][y + i - 1] == 3)) return false;
    } else {
      if ((arrYour[x + i - 1][y - 1] == 2) || (arrYour[x + i - 1][y - 1] == 3)) return false;
    };
  };

  yourShips.push(shipLength);
  yourShips[yourShips.length - 1] = [];
  yourShips[yourShips.length - 1][0] = +shipLength;
  console.log(yourShips);

  for (let i = 0; i < shipLength; i++) {
    if (hor) {
      arrYour[x - 1][y + i - 1] = 2;
      yourShips[yourShips.length - 1].push([(x - 1), (y + i - 1), 0]);
    } else {
      arrYour[x + i - 1][y - 1] = 2;
      yourShips[yourShips.length - 1].push([(x + i - 1), (y - i), 0]);
    };
  };

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (arrYour[i][j] == 2) {
        if ((i > 0) && (arrYour[i - 1][j] != 2)) arrYour[i - 1][j] = 3;
        if ((i < 9) && (arrYour[i + 1][j] != 2)) arrYour[i + 1][j] = 3;
        if ((j > 0) && (arrYour[i][j - 1] != 2)) arrYour[i][j - 1] = 3;
        if ((j < 9) && (arrYour[i][j + 1] != 2)) arrYour[i][j + 1] = 3;
        if ((i > 0) && (j > 0) && (arrYour[i - 1][j - 1] != 2)) arrYour[i - 1][j - 1] = 3;
        if ((i < 9) && (j > 0) && (arrYour[i + 1][j - 1] != 2)) arrYour[i + 1][j - 1] = 3;
        if ((i > 0) && (j < 9) && (arrYour[i - 1][j + 1] != 2)) arrYour[i - 1][j + 1] = 3;
        if ((i < 9) && (j < 9) && (arrYour[i + 1][j + 1] != 2)) arrYour[i + 1][j + 1] = 3;
      };
    };
  };

  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      if (arrYour[i - 1][j - 1] == 2) {
        let elemShip = table.rows[i].cells[j];
        elemShip.classList.add('elem-ship');
      };
    };
  };

  return true;
};

function rotateShip(ship, table, shipLength) { //ship rotation
  const name = shipLength == 4 ? 'ships__4-ver' : shipLength == 3 ? 'ships__3-ver' : shipLength == 2 ? 'ships__2-ver' : 'ships__1';
  if (hor) {
    ship.classList.add(name);
    hor = false;
  } else {
    ship.classList.remove(name);
    hor = true;
  };

  for (let i = 1; i < 11; i++) {
    for (let j = 1; j < 11; j++) {
      if (arrYour[i - 1][j - 1] == 9) arrYour[i - 1][j - 1] = 0
      let elemShip = table.rows[i].cells[j];
      elemShip.classList.remove('cell-ship');
    };
  };
};

function startAutoPlacementOpp() {  //start auto-placement of opponent's ships
  const ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
  for (let i = 0; i < ships.length; i++) {
    opponentShips.push(ships[i]);
    autoPlacement(ships[i], opponentShips, arrOpp)
  };
}
startAutoPlacementOpp()

function randomCoordinates() { //getting random coordinates
  let arrRandom = [];

  do {
    randomCoor[0] = Math.floor(Math.random() * 10);
    for (let i = 0; i < 10; i++) {
      if ((arrYour[randomCoor[0]][i] != 1) && (arrYour[randomCoor[0]][i] != 4) && (arrYour[randomCoor[0]][i] != 5)) arrRandom.push(i);
    }
  } while (arrRandom.length == 0);

  const indexRandom = Math.random() * arrRandom.length | 0;
  const valueRandom = arrRandom[indexRandom];

  randomCoor[1] = valueRandom;
};

function winMessage(info) {
  const messageWin = document.querySelector('.field-game__info');
  const message = document.querySelector('.message-info');
  message.innerHTML = info;
  messageWin.style.visibility = 'visible';
};

function restartGame() {
  const messageWin = document.querySelector('.field-game__info');
  messageWin.style.visibility = 'hidden';
  location.reload();
};

function fieldRendering(name, arr) { //rendering fields
  let table = document.getElementById(name);

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (arr[i][j] == 1) {
        elem = table.rows[i + 1].cells[j + 1];
        elem.classList.add('shot-away');
      };
      if (arr[i][j] == 4) {
        elem = table.rows[i + 1].cells[j + 1];
        elem.classList.add('shot-wounded');
      };
      if (arr[i][j] == 5) {
        elem = table.rows[i + 1].cells[j + 1];
        elem.classList.add('shot-sunk');
      };
    };
  };
  return;
};

function moveCursor() { //tracking cursor movement across the field
  const table = document.getElementById('opponent-table');
  table.onmouseover = function (event) {
    let target = event.target;
    if ((target.className != 'ruler') &&
      (target.className != 'zero-cell') &&
      (target.tagName.toLowerCase() == 'td')) {
      target.classList.add('move-cursor');
    }
  };
  table.onmouseout = function (event) {
    let target = event.target;
    target.classList.remove('move-cursor')
    target.style.background = '';
  };
};
moveCursor();

function shotYour() { //shot  
  document.querySelector('#opponent table').onmousedown = (event) => {
    if (yourShips.length < 10) {
      console.log('before starting the game, arrange your ships')
    } else {
      let cell = event.target;
      if (cell.tagName.toLowerCase() != 'td') return;
      let x = cell.parentNode.rowIndex;
      let y = cell.cellIndex;
      const table = document.querySelectorAll('table')[1];
      let elem = table.rows[x].cells[y];
      elem.classList.remove('move-cursor');

      if (moveTransition == 'your') {
        if (arrOpp[x - 1][y - 1] != 2) {
          arrOpp[x - 1][y - 1] = 1;
          if (isWounded) {
            console.log('shot by: ' + (lastX + 1) + ', ' + (lastY + 1));
            sunkWounded(lastX, lastY);
          } else {
            moveTransition = 'opp';
            shotOppRandom(1);
          };
        } else {
          if (isSunk(x - 1, y - 1, opponentShips, 'opp')) {
            for (let j = 1; j < opponentShips[indexOpp].length; j++) {
              let xX = opponentShips[indexOpp][j][0];
              let yY = opponentShips[indexOpp][j][1];
              arrOpp[xX][yY] = 5;
            }
            shotNot(opponentShips, indexOpp, arrOpp);
          } else {
            arrOpp[x - 1][y - 1] = 4;
          }
        };
      };
      let yourWin = 0;
      for (let i = 0; i < opponentShips.length; i++) {
        for (let j = 1; j < opponentShips[i].length; j++) {
          if (opponentShips[i][j][2] == 0) {
            yourWin += 1
          };
        };
      };
      fieldRendering('opponent-table', arrOpp);

      if (yourWin == 0) winMessage('YOU HAVE WON!!!');
    };
  };
};
shotYour();

function sunkWounded(x, y) { //logic of shooting at the wounded
  if (moveTransition = 'opp') {
    if (pathUp && finishOff) {
      while ((x < 9) && (arrYour[x + 1][y] != 1)) {
        x += 1;
        console.log('shot down after up: ' + (x + 1) + ', ' + (y + 1));
        if (!shotOppCoord(x, y, 1) && (arrYour[x][y] == 4)) {
          continue;
        } else break;
      };
      finishOff = false;
      return;
    };
    if (pathUp) {
      console.log('shot: ' + (x + 1) + ', ' + (y + 1) + ', check up')
      if ((x > 0) && (arrYour[x - 1][y] != 1)) {
        x -= 1;
        if (!shotOppCoord(x, y, 2) && (arrYour[x][y] == 1)) {
          console.log(x + 1, y + 1);
          console.log('up away, go left')
          lastX = x + 1;
          lastY = y;
          //lastZ = 11;
          //console.log(lastX, lastY, lastZ)
          moveTransition = 'your';
          pathUp = false;
          pathLeft = true;
          return true;
        } 
        if (!shotOppCoord(x, y, 21) && (arrYour[x][y] != 1)) {
          while ((x > 0) && (arrYour[x - 1][y] != 1)) {
            x -= 1;
            console.log('shot up: ' + (x + 1) + ', ' + (y + 1));
            if (!shotOppCoord(x, y, 3) && (arrYour[x][y] == 4)) {
              continue;
            } else break;
          };
          finishOff = true;
          lastX = x + 1;
          lastY = y;
          //lastZ = 12;
          //console.log(lastX, lastY, lastZ)
          moveTransition = 'your';
          return;
        };
      } else {
        console.log('up already shot or outside the field')
        pathUp = false;
        pathLeft = true;
        lastX = x;
        lastY = y;
        //lastZ = 13;
        //console.log(lastX, lastY, lastZ)
      };
    };

    if (pathLeft && finishOff) {
      while ((y < 9) && (arrYour[x][y + 1] != 1)) {
        y += 1;
        console.log('shot right after left: ' + (x + 1) + ', ' + (y + 1));
        if (!shotOppCoord(x, y, 4) && (arrYour[x][y] == 4)) {
          continue;
        } else break;
      };
      finishOff = false;
      return;
    };
    if (pathLeft) {
      console.log('shot: ' + (x + 1) + ', ' + (y + 1) + ', check left')
      if ((y > 0) && (arrYour[x][y - 1] != 1)) {
        y -= 1;
        if (!shotOppCoord(x, y, 5) && (arrYour[x][y] == 1)) {
          console.log(x + 1, y + 1);
          console.log('left away, go down')
          lastX = x;
          lastY = y + 1;
          //lastZ = 21;
          //console.log(lastX, lastY, lastZ)
          moveTransition = 'your';
          pathLeft = false;
          pathDown = true;
          return true;
        } 
        if (!shotOppCoord(x, y, 51) && (arrYour[x][y] != 1)) {
          while ((y > 0) && (arrYour[x][y - 1] != 1)) {
            y -= 1;
            console.log('shot left: ' + (x + 1) + ', ' + (y + 1));
            if (!shotOppCoord(x, y, 6) && (arrYour[x][y] == 4)) {
              continue;
            } else break;
          };
          finishOff = true;
          lastX = x;
          lastY = y + 1;
          //lastZ = 22;
          //console.log(lastX, lastY, lastZ)
          moveTransition = 'your';
          return;
        };
      } else {
        console.log('left already shot or outside the field')
        pathLeft = false;
        pathDown = true;
        lastX = x;
        lastY = y;
        //lastZ = 23;
        //console.log(lastX, lastY, lastZ)
      };
    };

    if (pathDown && finishOff) {
      while ((x > 0) && (arrYour[x - 1][y] != 1)) {
        x -= 1;
        console.log('shot up after down: ' + (x + 1) + ', ' + (y + 1));
        if (!shotOppCoord(x, y, 7) && (arrYour[x][y] == 4)) {
          continue;
        } else break;
      };
      finishOff = false;
      return;
    };
    if (pathDown) {
      console.log('shot: ' + (x + 1) + ', ' + (y + 1) + ', check down')
      if ((x < 9) && (arrYour[x + 1][y] != 1)) {
        x += 1;
        if (!shotOppCoord(x, y, 8) && (arrYour[x][y] == 1)) {
          console.log(x + 1, y + 1);
          console.log('down away, go right')
          lastX = x - 1;
          lastY = y;
          //lastZ = 31;
          //console.log(lastX, lastY, lastZ)
          moveTransition = 'your';
          pathDown = false;
          pathRight = true;
          return true;
        } 
        if (!shotOppCoord(x, y, 81) && (arrYour[x][y] != 1)) {
          while ((x < 9) && (arrYour[x + 1][y] != 1)) {
            x += 1;
            console.log('shot down: ' + (x + 1) + ', ' + (y + 1));
            if (!shotOppCoord(x, y, 9) && (arrYour[x][y] == 4)) {
              continue;
            } else break;
          };
          finishOff = true;
          lastX = x - 1;
          lastY = y;
          //lastZ = 32;
          //console.log(lastX, lastY, lastZ)
          moveTransition = 'your';
          return;
        };
      } else {
        console.log('down already shot or outside the field')
        pathDown = false;
        pathRight = true;
        lastX = x;
        lastY = y;
        //lastZ = 33;
        //console.log(lastX, lastY, lastZ)
      };
    };

    if (pathRight && finishOff) {
      while ((y > 0) && (arrYour[x][y - 1] != 1)) {
        y -= 1;
        console.log('shot left after right: ' + (x + 1) + ', ' + (y + 1));
        if (!shotOppCoord(x, y, 10) && (arrYour[x][y] == 4)) {
          continue;
        } else break;
      };
      finishOff = false;
      return;
    };
    if (pathRight) {
      console.log('shot: ' + (x + 1) + ', ' + (y + 1) + ', check right')
      if ((y < 9) && (arrYour[x][y + 1] != 1)) {
        y += 1;
        if (!shotOppCoord(x, y, 11) && (arrYour[x][y] == 1)) {
          console.log(x + 1, y + 1);
          console.log('right away, go up')
          lastX = x;
          lastY = y - 1;
          //lastZ = 41;
          //console.log(lastX, lastY, lastZ)
          moveTransition = 'your';
          pathRight = false;
          pathUp = true;
          return true;
        } 
        if (!shotOppCoord(x, y, 111) && (arrYour[x][y] != 1)) {
          while ((y < 9) && (arrYour[x][y + 1] != 1)) {
            y += 1;
            console.log('shot rigth: ' + (x + 1) + ', ' + (y + 1));
            if (!shotOppCoord(x, y, 12) && (arrYour[x][y] == 4)) {
              continue;
            } else break;
          };
          finishOff = true;
          lastX = x;
          lastY = y - 1;
          //lastZ = 42;
          //console.log(lastX, lastY, lastZ)
          moveTransition = 'your';
          return;
        };
      } else {
        console.log('right already shot or outside the field')
        pathRight = false;
        pathUp = true;
        lastX = x;
        lastY = y;
        //lastZ = 43;
        //console.log(lastX, lastY, lastZ)
        sunkWounded(lastX, lastY)
      };
    };
  };
};

function isSunk(x, y, arrShips, name) { //checking whether the your ship is sunk
  let index;
  searchShip: for (let i = 0; i < arrShips.length; i++) { //search ship by shot
    for (let j = 1; j < arrShips[i].length; j++) {
      if ((arrShips[i][j][0] == x) && (arrShips[i][j][1] == y)) {
        index = i
        arrShips[i][j][2] = 1;
        break searchShip;
      };
    };
  };
  for (let j = 1; j < arrShips[index].length; j++) {
    if (arrShips[index][j][2] == 1) {
      sunk = true;
    } else {
      sunk = false;
      break;
    };
  };
  if (name == 'your') {    
    indexYour = index;
    console.log('indexYour: ' + indexYour)
  } else {
    indexOpp = index;
    console.log('indexOpp: ' + indexOpp)
  }
  return sunk;
};

function shotNot(ship, indexShip, arrField) { //drawing places where opponent don't need to shoot
  const currentShip = ship[indexShip]

  for (let k = 1; k < currentShip.length; k++) {
    let i = currentShip[k][0];
    let j = currentShip[k][1];
    if (arrField[i][j] == 5) {
      if ((i > 0) && (arrField[i - 1][j] != 5)) arrField[i - 1][j] = 1;
      if ((i < 9) && (arrField[i + 1][j] != 5)) arrField[i + 1][j] = 1;
      if ((j > 0) && (arrField[i][j - 1] != 5)) arrField[i][j - 1] = 1;
      if ((j < 9) && (arrField[i][j + 1] != 5)) arrField[i][j + 1] = 1;
      if ((i > 0) && (j > 0) && (arrField[i - 1][j - 1] != 5)) arrField[i - 1][j - 1] = 1;
      if ((i < 9) && (j > 0) && (arrField[i + 1][j - 1] != 5)) arrField[i + 1][j - 1] = 1;
      if ((i > 0) && (j < 9) && (arrField[i - 1][j + 1] != 5)) arrField[i - 1][j + 1] = 1;
      if ((i < 9) && (j < 9) && (arrField[i + 1][j + 1] != 5)) arrField[i + 1][j + 1] = 1;
    };
  };
  fieldRendering('your-table', arrYour);
};

function shotOppRandom(n) { //random shot of an opponent
  randomCoordinates();
  let x = randomCoor[0];
  let y = randomCoor[1];
  const table = document.querySelectorAll('#your table')[0];
  //let elem = table.rows[x + 1].cells[y + 1];
  if (arrYour[x][y] != 2) {
    arrYour[x][y] = 1;
    fieldRendering('your-table', arrYour)
    console.log('shot random away: ' + (x + 1) + ', ' + (y + 1) + ', where from: ' + n);
    moveTransition = 'your';
  } else {
    if (isSunk(x, y, yourShips, 'your')) {
      console.log('Sunk me!!!! ' + (x + 1) + ', ' + (y + 1))
      for (let j = 1; j < yourShips[indexYour].length; j++) {
        let xX = yourShips[indexYour][j][0];
        let yY = yourShips[indexYour][j][1];
        arrYour[xX][yY] = 5;
        isWounded = false;
        finishOff = false;
      }
      shotNot(yourShips, indexYour, arrYour);
      fieldRendering('your-table', arrYour)
      shotOppRandom(4);
    } else {
      console.log('Wounded me: ' + (x + 1) + ', ' + (y + 1) + ', where from: ' + n)
      arrYour[x][y] = 4;
      isWounded = true;
      finishOff = false;
      lastWoundedShip = indexYour;
      fieldRendering('your-table', arrYour)
      lastX = x;
      lastY = y;
      //lastZ = 50;
      //console.log(lastX, lastY, lastZ)
      sunkWounded(lastX, lastY);
    }
  };

  let oppWin = 0;
  for (let i = 0; i < yourShips.length; i++) {
    for (let j = 1; j < yourShips[i].length; j++) {
      if (yourShips[i][j][2] == 0) {
        oppWin += 1
      };
    };
  };
 
  if (oppWin == 0) winMessage('COMPUTER WON!!!');;
};

function shotOppCoord(x, y, n) { //opponent's shot at the coordinates    
  let table = document.querySelectorAll('#your table')[0];
  if ((arrYour[x][y] == 0) || (arrYour[x][y] == 3)) {
    arrYour[x][y] = 1;
    console.log('shot accurately away: ' + (x + 1) + ', ' + (y + 1) + ', where from: ' + n)
    fieldRendering('your-table', arrYour)
    moveTransition = 'your';
    return;
  } else {
    if (isSunk(x, y, yourShips, 'your')) {
      console.log('Sunk me!!!! ' + (x + 1) + ', ' + (y + 1))
      for (let j = 1; j < yourShips[indexYour].length; j++) {
        let xX = yourShips[indexYour][j][0];
        let yY = yourShips[indexYour][j][1];
        isWounded = false;
        finishOff = false;
        arrYour[xX][yY] = 5;
      }
      shotNot(yourShips, indexYour, arrYour);
      fieldRendering('your-table', arrYour)
      shotOppRandom(9);
    } else {
      console.log('Wounded me: ' + (x + 1) + ', ' + (y + 1) + ', where from: ' + n)
      isWounded = true;
      arrYour[x][y] = 4;
      fieldRendering('your-table', arrYour)
      return;
    }
  };

  let oppWin = 0;
  for (let i = 0; i < yourShips.length; i++) {
    for (let j = 1; j < yourShips[i].length; j++) {
      if (yourShips[i][j][2] == 0) {
        oppWin += 1
      };
    };
  };

  if (oppWin == 0) winMessage('COMPUTER WON!!!');
};
