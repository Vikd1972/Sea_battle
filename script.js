//initiating game arrays
var arrYour = Array(10).fill(0);
for (let i = 0; i < 10; i++) arrYour[i] = Array(10).fill(0);
var arrOpp = Array(10).fill(0);
for (let i = 0; i < 10; i++) arrOpp[i] = Array(10).fill(0);

var hor = true; //horizontal arrangement ships
var randomCoor = [0, 0] // random coordinates
var opponentShips = [];
let yourShips = [];

function addTable(name) { //creating a playing field
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for(var i = 0; i < 11; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 11; j++){
            var td = document.createElement('td');
            tr.appendChild(td);
        };
        tbody.appendChild(tr);
    };
    document.getElementById(name).appendChild(table);
    tableFill('#' + name);
};

function tableFill(name) { //filling the playing field
    let nameFull = name + ' table';
    let table = document.querySelector(nameFull);  
    
    let elemZero = table.rows[0].cells[0];
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

function moveCursor(x, y) { //tracking cursor movement across the field
    let table = document.querySelector('#opponent table');
    //for (let i = 1; i < 11; i++) {
    //    for (let j = 1; j < 11; j++) {
    //        if (arrOpp[i - 1][j - 1] == 9) arrOpp[i - 1][j - 1] = 0;       
    //    };        
    //};   
    //if (x > 1) arrOpp[x - 1][y - 1] = 9;
   
    table.onmouseover = function (event) {
        let target = event.target;
        if ((target.className != 'ruler') && (target.className != 'zero-cell') && (target.tagName.toLowerCase() == 'td')) target.classList.add('move-cursor');
    };
    table.onmouseout = function (event) {
        let target = event.target;
        target.classList.remove('move-cursor')
        target.style.background = '';
    };
};

function cellDeinition() { //getting the coordinates of a single cell
    document.querySelector('#opponent').onmouseover = (event) => {
        let cell = event.target;
        if (cell.tagName.toLowerCase() != 'td') return;
        let i = cell.parentNode.rowIndex;
        let j = cell.cellIndex;
        moveCursor(i, j)
        //let res = [i, j];
        //console.log(res);
        //return res;
    };
};
cellDeinition();

function shotYour() { //shot  
    document.querySelector('#opponent table').onmousedown = (event) => {
        let index;
        let sunk = false;
        function isSunk(x, y) {         
            searchShip: for (let i = 0; i < opponentShips.length; i++) { //search ship by shot
                for (let j = 1; j < opponentShips[i].length; j++) {
                    if ((opponentShips[i][j][0] == x) && (opponentShips[i][j][1] == y)) {
                        console.log('Ships: ' + (i + 1))
                        index = i;
                        opponentShips[i][j][2] = 1;
                        break searchShip;
                    };
                };
            };           
            for (let j = 1; j < opponentShips[index].length; j++) {                
                if (opponentShips[index][j][2] == 1) {
                    sunk = true;
                } else {
                    sunk = false;
                    break;
                };
            };               
            return sunk;
        };
        function shotNot() {
            console.log('shot not')
            let currentShip = opponentShips[index]
            for (let k = 1; k < currentShip.length; k++) {
                let i = currentShip[k][0];
                let j = currentShip[k][1];
                console.log(i,j)
                if (arrOpp[i][j] == 5) {
                    if ((i > 0) && (arrOpp[i - 1][j] != 5)) arrOpp[i - 1][j] = 1;
                    if ((i < 9) && (arrOpp[i + 1][j] != 5)) arrOpp[i + 1][j] = 1;
                    if ((j > 0) && (arrOpp[i][j - 1] != 5)) arrOpp[i][j - 1] = 1;
                    if ((j < 9) && (arrOpp[i][j + 1] != 5)) arrOpp[i][j + 1] = 1;
                    if ((i > 0) && (j > 0) && (arrOpp[i - 1][j - 1] != 5)) arrOpp[i - 1][j - 1] = 1;
                    if ((i < 9) && (j > 0) && (arrOpp[i + 1][j - 1] != 5)) arrOpp[i + 1][j - 1] = 1;
                    if ((i > 0) && (j < 9) && (arrOpp[i - 1][j + 1] != 5)) arrOpp[i - 1][j + 1] = 1;
                    if ((i < 9) && (j < 9) && (arrOpp[i + 1][j + 1] != 5)) arrOpp[i + 1][j + 1] = 1;
                };
            }
        };
        
        let cell = event.target;
        if (cell.tagName.toLowerCase() != 'td') return;
        let x = cell.parentNode.rowIndex;
        let y = cell.cellIndex;    
        let table = document.querySelectorAll('table')[1];
        let elem = table.rows[x].cells[y];      
        if (arrOpp[x - 1][y - 1] != 2) { // away(1) wounded(4) sunk(5)
            arrOpp[x - 1][y - 1] = 1;
            shotOpp();
        } else {
            if (isSunk(x - 1, y - 1)) {
                for (let j = 1; j < opponentShips[index].length; j++) {
                    let xX = opponentShips[index][j][0];
                    let yY = opponentShips[index][j][1];
                    //console.log(xX, yY);
                    arrOpp[xX][yY] = 5;                    
                }
                shotNot();
            } else {
                arrOpp[x - 1][y - 1] = 4;
            }
        };
        for (let i = 1; i < 11; i++) {
            for (let j = 1; j < 11; j++) {
                if (arrOpp[i - 1][j - 1] == 1) {
                    elem = table.rows[i].cells[j];
                    elem.classList.add('shot-away');
                };
                if (arrOpp[i - 1][j - 1] == 2) {
                    elem = table.rows[i].cells[j];
                    elem.classList.add('opponent-ship');
                };
                if (arrOpp[i - 1][j - 1] == 4) {
                    elem = table.rows[i].cells[j];
                    elem.classList.add('shot-wounded');
                };
                if (arrOpp[i - 1][j - 1] == 5) {
                    elem = table.rows[i].cells[j];
                    elem.classList.add('shot-sunk');
                };
            };
        };
    };
};
shotYour();

function shotOpp() {
    let index;
    function isSunkMe(x, y) {
        console.log(x, y)
        searchShip: for (let i = 0; i < yourShips.length; i++) { //search ship by shot
            for (let j = 1; j < yourShips[i].length; j++) {
                if ((yourShips[i][j][0] == x) && (yourShips[i][j][1] == y)) {
                    console.log('My ships: ' + (i + 1))
                    index = i;
                    yourShips[i][j][2] = 1;
                    break searchShip;
                };
            };
        };
        for (let j = 1; j < yourShips[index].length; j++) {
            if (yourShips[index][j][2] == 1) {
                sunk = true;
            } else {
                sunk = false;
                break;
            };
        }; 
        return sunk;
    };
    function shotNotMe() {
            console.log('shot not me')
            let currentShip = yourShips[index]
            for (let k = 1; k < currentShip.length; k++) {
                let i = currentShip[k][0];
                let j = currentShip[k][1];
                console.log(i,j)
                if (arrYour[i][j] == 5) {
                    if ((i > 0) && (arrYour[i - 1][j] != 5)) arrYour[i - 1][j] = 1;
                    if ((i < 9) && (arrYour[i + 1][j] != 5)) arrYour[i + 1][j] = 1;
                    if ((j > 0) && (arrYour[i][j - 1] != 5)) arrYour[i][j - 1] = 1;
                    if ((j < 9) && (arrYour[i][j + 1] != 5)) arrYour[i][j + 1] = 1;
                    if ((i > 0) && (j > 0) && (arrYour[i - 1][j - 1] != 5)) arrYour[i - 1][j - 1] = 1;
                    if ((i < 9) && (j > 0) && (arrYour[i + 1][j - 1] != 5)) arrYour[i + 1][j - 1] = 1;
                    if ((i > 0) && (j < 9) && (arrYour[i - 1][j + 1] != 5)) arrYour[i - 1][j + 1] = 1;
                    if ((i < 9) && (j < 9) && (arrYour[i + 1][j + 1] != 5)) arrYour[i + 1][j + 1] = 1;
                };
            }
        };
        
    randomCoordinates();
    let x = randomCoor[0];
    let y = randomCoor[1];
    if ((arrYour[x][y] == 1) || (arrYour[x][y] == 1) || (arrYour[x][y] == 1)) shotOpp();
    let table = document.querySelectorAll('#your table')[0];
    let elem = table.rows[x + 1].cells[y + 1];      
    if (arrYour[x][y] != 2) { // away(1) wounded(4) sunk(5)
        arrYour[x][y] = 1;
    } else {
        if (isSunkMe(x, y)) {
            console.log('Sunk me!!!!')
            for (let j = 1; j < yourShips[index].length; j++) {
                let xX = yourShips[index][j][0];
                let yY = yourShips[index][j][1];
                //console.log(xX, yY);
                arrYour[xX][yY] = 5;
            }
            shotNotMe();
        } else {
            arrYour[x][y] = 4;
        }
    };
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (arrYour[i][j] == 1) {
                elem = table.rows[i + 1].cells[j + 1];
                elem.classList.add('shot-away');
            };
            if (arrYour[i][j] == 4) {
                elem = table.rows[i + 1].cells[j + 1];
                elem.classList.add('shot-wounded');
            };
            if (arrYour[i][j] == 5) {
                elem = table.rows[i + 1].cells[j + 1];
                elem.classList.add('shot-sunk');
            };
        };
    };

  /*  
    arrYour[x][y] = 1;
    let table = document.querySelector('#your table');
    let elemShip = table.rows[x + 1].cells[y + 1];
    elemShip.classList.add('shot-away');   
    isSunkMe(x, y)*/


}

function shipMove() { //moving ships
    let x, xX, y, yY, shipLength;
    let currentCell = null;
    document.addEventListener('mousedown', function(event) { 
        event.preventDefault();
        let ship = event.target.closest('.ships')
        if (!ship) return;
        ship.ondragstart = function () {
            return false;
        };
        if (ship.className.includes(4)) shipLength = 4;
        if (ship.className.includes(3)) shipLength = 3;
        if (ship.className.includes(2)) shipLength = 2;
        if (ship.className.includes(1)) shipLength = 1;

        //console.log(shipLength)

        ship.classList.add('moving-ship')
        document.body.append(ship);

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            ship.style.left = pageX - 17 + 'px';
            ship.style.top = pageY - 17 + 'px';
        };

        let table = document.querySelector('#your table');
        
        document.addEventListener("keydown", function (event) {
            if (event.code == 'Space')  rotateShip(ship, table, shipLength);
        });

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);

            ship.hidden = true;
            let elemCell = document.elementFromPoint(event.clientX, event.clientY);  
            x = elemCell.parentNode.rowIndex;
            y = elemCell.cellIndex;          
            ship.hidden = false;

            if (!elemCell) return;           
            
            let necessaryCell = elemCell.closest('.cell');
            if (currentCell != necessaryCell) {
                let table = document.querySelector('#your table'); 
                if (currentCell) {
                    for (let i = 0; i < shipLength; i++) {
                        if (hor) {
                            if (yY > (11 - shipLength)) yY = (11 - shipLength);
                            elemShip = table.rows[xX].cells[yY+i];
                        } else {
                            if (xX > (11 - shipLength)) xX = (11 - shipLength);
                            elemShip = table.rows[xX+i].cells[yY];
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
                            elemShip = table.rows[x].cells[y+i];
                        } else {
                            if (x > (11 - shipLength)) x = (11 - shipLength);
                            elemShip = table.rows[x+i].cells[y];
                        };                        
                        elemShip.classList.add('cell-ship');
                    };
                    arragementShipOn(x, y, shipLength);
                };
                xX = x;
                yY = y;
            };        

        };

        document.addEventListener('mousemove', onMouseMove);

        ship.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);            
            if (hor) {
                if (y > (11 - shipLength)) y = (11 - shipLength);
            } else {
                if (x > (11 - shipLength)) x = (11 - shipLength);
            };   
            if (fixingShip(x, y, shipLength)) ship.hidden = true;
            ship.onmouseup = null;
            hor = true;
            
        };
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
    let table = document.querySelector('#your table');  
    //console.log(arrYour)
    if ((y < 1) || (x < 1) )return false;
    for (let i = 0; i < shipLength; i++) {
        if (hor) {
            if ((arrYour[x - 1][y + i - 1] == 2) || (arrYour[x - 1][y + i - 1] == 3)) return false;  
        } else {
            if ((arrYour[x + i - 1][y - 1] == 2) || (arrYour[x + i - 1][y - 1] == 3)) return false;
        };         
    };
    yourShips.push(shipLength);
    yourShips[yourShips.length - 1] = []; 
    yourShips[yourShips.length - 1][0] = shipLength;  
    console.log(yourShips)
    for (let i = 0; i < shipLength; i++) {        
        if (hor) {
            arrYour[x - 1][y + i - 1] = 2;  
            yourShips[yourShips.length-1].push([(x - 1), (y + i - 1), 0]);
        } else {
            arrYour[x + i - 1][y - 1] = 2;
            yourShips[yourShips.length-1].push([(x + i - 1), (y - i), 0]);
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
            if (arrYour[i-1][j-1] == 2) {
                let elemShip = table.rows[i].cells[j];
                elemShip.classList.add('elem-ship');
            };
        };
    };
    return true;
};

function rotateShip(ship, table, shipLength) { //ship rotation
    let name = shipLength == 4 ? 'ships__4-ver' : shipLength == 3 ? 'ships__3-ver' : shipLength == 2 ? 'ships__2-ver' : 'ships__1'; 
    if (hor) {
        ship.classList.add(name);
        hor = false;
    } else {
        ship.classList.remove(name);
        hor = true;
    };

    for (let i = 1; i < 11; i++) {
        for (let j = 1; j < 11; j++) {
            if (arrYour[i-1][j-1] == 9) arrYour[i-1][j-1] = 0
            let elemShip = table.rows[i].cells[j];
            elemShip.classList.remove('cell-ship');                             
        };
    };  
    
};
    
function randomCoordinates() { //getting random coordinates
    randomCoor[0] = Math.floor(Math.random() * 10);
    randomCoor[1] = Math.floor(Math.random() * 10);
};

function opponentShip(shipLength) {//placement of opponent's ships    
    let opponentShipOn = true;
    opponentShips.push(shipLength);

    while (opponentShipOn) {
        let occupied = false;         
        randomCoordinates();
        let x = randomCoor[0];
        let y = randomCoor[1];
        let rules = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        //console.log('coordinates: ' + (x + 1) + ':' + rules[y] + ', length: ' + shipLength);
        let horOpp = (Math.floor(Math.random() * 10) % 2 == 0);
        let verOpp = (Math.floor(Math.random() * 10) % 2 == 0);

        if ((horOpp) && (verOpp)) {
            //console.log(horOpp + ' ' + verOpp + ' right');
            if (y + shipLength - 1 <= 9) {
                //console.log('fit');
                for (let i = 0; i < shipLength; i++) {
                    if (arrOpp[x][y + i] != 0) {
                        //console.log('occupied');
                        occupied = true;
                        break;
                    };
                };
                if (!occupied) {
                    opponentShipOn = false;   
                    opponentShips[opponentShips.length - 1] = []; 
                    opponentShips[opponentShips.length-1][0] = shipLength;  
                    for (let i = 0; i < shipLength; i++) {
                        arrOpp[x][y + i] = 2;                
                        opponentShips[opponentShips.length-1].push([x, (y + i), 0]);
                    };
                    //console.log('done');               
                };
                
            };
        };
        if ((horOpp) && (!verOpp)) {
            //console.log(horOpp + ' ' + verOpp + ' left');
            if (y - shipLength + 1 >= 0) {
                //console.log('fit');
                for (let i = 0; i < shipLength; i++) {
                    if (arrOpp[x][y - i] != 0) {
                        //console.log('occupied');
                        occupied = true;
                        break;
                    };
                };
                if (!occupied) {
                    opponentShipOn = false;   
                    opponentShips[opponentShips.length - 1] = []; 
                    opponentShips[opponentShips.length-1][0] = shipLength;  
                    for (let i = 0; i < shipLength; i++) {
                        arrOpp[x][y - i] = 2;         
                        opponentShips[opponentShips.length-1].push([x, (y - i), 0]);
                    };
                    //console.log('done');
                };
            };
        };
        if ((!horOpp) && (verOpp)) {
            //console.log(horOpp + ' ' + verOpp + ' down');
            if (x + shipLength - 1 <= 9) {
                //console.log('fit');
                for (let i = 0; i < shipLength; i++) {
                    if (arrOpp[x + i][y] != 0) {
                        //console.log('occupied');
                        occupied = true;
                        break;
                    };
                };
                if (!occupied) {
                    opponentShipOn = false;   
                    opponentShips[opponentShips.length - 1] = []; 
                    opponentShips[opponentShips.length-1][0] = shipLength;  
                    for (let i = 0; i < shipLength; i++) {
                        arrOpp[x + i][y] = 2;
                        opponentShips[opponentShips.length-1].push([(x + i), y, 0]);
                    };
                    //console.log('done'); 
                };
            };
        };
        if ((!horOpp) && (!verOpp)) {
            //console.log(horOpp + ' ' + verOpp + ' up');
            if (x - shipLength + 1 >= 0) {
                //console.log('fit');
                for (let i = 0; i < shipLength; i++) {
                    if (arrOpp[x - i][y] != 0) {
                        occupied = true;
                        //console.log('occupied');
                        break;
                    };
                };
                if (!occupied) {
                    opponentShipOn = false;   
                    opponentShips[opponentShips.length - 1] = []; 
                    opponentShips[opponentShips.length-1][0] = shipLength;  
                    for (let i = 0; i < shipLength; i++) {
                        arrOpp[x - i][y] = 2;
                        opponentShips[opponentShips.length-1].push([(x - i), y, 0]);
                    };
                    //console.log('done');
                };
            };
        };
    };  

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (arrOpp[i][j] == 2) {
                if ((i > 0) && (arrOpp[i - 1][j] != 2)) arrOpp[i - 1][j] = 3; 
                if ((i < 9) && (arrOpp[i + 1][j] != 2)) arrOpp[i + 1][j] = 3;
                if ((j > 0) && (arrOpp[i][j - 1] != 2)) arrOpp[i][j - 1] = 3;
                if ((j < 9) && (arrOpp[i][j + 1] != 2)) arrOpp[i][j + 1] = 3;                
                if ((i > 0) && (j > 0) && (arrOpp[i - 1][j - 1] != 2)) arrOpp[i - 1][j - 1] = 3;
                if ((i < 9) && (j > 0) && (arrOpp[i + 1][j - 1] != 2)) arrOpp[i + 1][j - 1] = 3;
                if ((i > 0) && (j < 9) && (arrOpp[i - 1][j + 1] != 2)) arrOpp[i - 1][j + 1] = 3;
                if ((i < 9) && (j < 9) && (arrOpp[i + 1][j + 1] != 2)) arrOpp[i + 1][j + 1] = 3;
            };
        };
    };

    //designation of enemy ships
    /*let table = document.querySelector('#opponent table'); 
    for (let i = 1; i < 11; i++) { 
        for (let j = 1; j < 11; j++) {
            if (arrOpp[i-1][j-1] == 2) {
                let opponentsShip = table.rows[i].cells[j];
                opponentsShip.classList.add('opponent-ship');
            };
        };
    };*/
    
    return true;
};

var ships = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
for (let i = 0; i < ships.length; i++) {
    //console.log('run')
    opponentShip(ships[i]);
};