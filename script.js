function addTable(name) {
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

function tableFill(name) {  
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

function movingCursor(name) {
    let nameFull = name + ' table';
    let table = document.querySelector(nameFull);

    table.onmouseover = function(event) {
        let target = event.target;
        if ((target.className != 'ruler') && (target.className != 'zeroCell') && (target.tagName.toLowerCase() == 'td')) target.style.background = 'pink';
    };
    table.onmouseout = function(event) {
        let target = event.target;
        target.style.background = '';
    };
};
//movingCursor('#your');
movingCursor('#opponent');

function cellDeinition(name) {    
    document.querySelector(name).onmouseover = (event) => {
        let cell = event.target;
        if (cell.tagName.toLowerCase() != 'td') return;
        let i = cell.parentNode.rowIndex;
        let j = cell.cellIndex;
        let res = [name, i, j];
        //console.log(res);
        return res;
    };
};

cellDeinition('#your');
cellDeinition('#opponent');

function shot() {    
    document.querySelector('#opponent').onclick = (event) => {
        let cell = event.target;
        if (cell.tagName.toLowerCase() != 'td') return;
        let i = cell.parentNode.rowIndex;
        let j = cell.cellIndex;    
        let table = document.querySelectorAll('table')[1];
        let elem = table.rows[i].cells[j];
        if ((elem.className != 'ruler') && (elem.className != 'zeroCell')) elem.classList.add('markOn');
    };
};

shot();

function shipMove () {
    let ship = document.querySelector('.ships__4')
    let currentDroppable = null;
    ship.onmousedown = function (event) {
        ship.classList.add('shipMoving')
        document.body.append(ship);

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            ship.style.left = pageX - 17 + 'px';
            ship.style.top = pageY - 17 + 'px';
        };

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);

            ship.hidden = true;
            let elemCell = document.elementFromPoint(event.clientX, event.clientY);  
            let x = elemCell.parentNode.rowIndex;
            let y = elemCell.cellIndex;
            ship.hidden = false;

            if (!elemCell) return;

            //arragementShipOn(x, y);


            let droppableBelow = elemCell.closest('.cell');
            if (currentDroppable != droppableBelow) {
                let table = document.querySelector('#your table'); 
                if (currentDroppable) {
                    for (let i = 0; i < 4; i++) {
                        let elemShip = table.rows[x].cells[y+i];
                        elemShip.classList.remove('cellShip');
                    };
                    arragementShipOff(x, y);
                };
                currentDroppable = droppableBelow;
                if (currentDroppable) {
                    for (let i = 0; i < 4; i++) {
                        let elemShip = table.rows[x].cells[y+i];
                        elemShip.classList.add('cellShip');
                    };
                    arragementShipOn(x, y);
                };
            };        

        };

        document.addEventListener('mousemove', onMouseMove);

        ship.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            ship.onmouseup = null;
        };
    };
    ship.ondragstart = function () {
        return false;
    };
};

shipMove();

var arrYour = Array(10).fill(0);
for (let i = 0; i < 10; i++) arrYour[i] = Array(10).fill(0);

function arragementShipOn(x, y) {
    arrYour[x-1][y-1] = 1;
}
function arragementShipOff(x, y) {
    arrYour[x-1][y-1] = 0;
}

