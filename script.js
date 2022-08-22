//initiating game arrays
var arrYour = Array(10).fill(0);
for (let i = 0; i < 10; i++) arrYour[i] = Array(10).fill(0);
var arrOpp = Array(10).fill(0);
for (let i = 0; i < 10; i++) arrOpp[i] = Array(10).fill(0);

var hor = true; //horizontal arrangement ships

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
    elemZero.classList.add('zeroCell');

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
    if (x > 1) arrOpp[x - 1][y - 1] = 9;
   
    table.onmouseover = function (event) {
        let target = event.target;
        if ((target.className != 'ruler') && (target.className != 'zeroCell') && (target.tagName.toLowerCase() == 'td')) target.classList.add('moveCursor');
    };
    table.onmouseout = function (event) {
        let target = event.target;
        target.classList.remove('moveCursor')
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

function shot() { //shot  
    document.querySelector('#opponent table').onmousedown = (event) => {
        let cell = event.target;
        if (cell.tagName.toLowerCase() != 'td') return;
        let i = cell.parentNode.rowIndex;
        let j = cell.cellIndex;    
        let table = document.querySelectorAll('table')[1];
        let elem = table.rows[i].cells[j];
        arrOpp[i - 1][j - 1] = 1;
        console.log(i, j);
        if ((elem.className != 'ruler') && (elem.className != 'zeroCell')) elem.classList.add('shot');
    };
};
shot();

function shipMove() { //moving ships
    let x, xX, y, yY, shipLength;
    let currentCell = null;
    document.addEventListener('mousedown', function(event) { 
        event.preventDefault()
        let ship = event.target.closest('.ships')
        if (!ship) return;
        ship.ondragstart = function () {
            return false;
        };
        if (ship.className.includes(4)) shipLength = 4;
        if (ship.className.includes(3)) shipLength = 3;
        if (ship.className.includes(2)) shipLength = 2;
        if (ship.className.includes(1)) shipLength = 1;

        console.log(shipLength)

        ship.classList.add('movingShip')
        document.body.append(ship);

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            ship.style.left = pageX - 17 + 'px';
            ship.style.top = pageY - 17 + 'px';
        };

        let table = document.querySelector('#your table');
        
        document.addEventListener("keydown", function (event) {
            if (event.code == 'Space')  rotateShip(ship, table, x, y, shipLength);
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
                        elemShip.classList.remove('cellShip');
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
                        elemShip.classList.add('cellShip');
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
            ship.hidden = true;
            if (hor) {
                if (y > (11 - shipLength)) y = (11 - shipLength);
            } else {
                if (x > (11 - shipLength)) x = (11 - shipLength);
            };   
            fixingShip(x, y, shipLength);
            ship.onmouseup = null;
            hor = true;
        };
         
    });
   
};
shipMove();

function arragementShipOn(x, y, shipLength) { //drawing the ship's movement in the array
    for (let i = 0; i < shipLength; i++) {
        if (hor) {
            arrYour[x - 1][y + i - 1] = 1;  
        } else {
            arrYour[x + i - 1][y - 1] = 1;
        };         
    };
};

function arragementShipOff(x, y, shipLength) { //erasing the trace from moving the ship
    for (let i = 0; i < shipLength; i++) {
        if (hor) {
            arrYour[x - 1][y + i - 1] = 0;  
        } else {
            arrYour[x + i - 1][y - 1] = 0;
        };   
    }; 
};

function fixingShip(x, y, shipLength) { //drawing of installed ships
    let table = document.querySelector('#your table');  
        for (let i = 0; i < shipLength; i++) {
        if (hor) {
            arrYour[x - 1][y + i - 1] = 2;  
        } else {
            arrYour[x + i - 1][y - 1] = 2;
        };         
    };
    for (let i = 1; i < 11; i++) {
        for (let j = 1; j < 11; j++) {
            if (arrYour[i-1][j-1] == 2) {
                let elemShip = table.rows[i].cells[j];
                elemShip.classList.add('elemShip');
            };
        };
    };
};

function rotateShip(ship, table, x, y, shipLength) { //ship rotation
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
            elemShip.classList.remove('cellShip');                             
        };
    };  
    
};
    
