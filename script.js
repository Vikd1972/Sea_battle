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
movingCursor('#your');
movingCursor('#opponent');

function cellDeinition(name) {
    document.querySelector(name).onmouseover = (event) => {
        let cell = event.target;
        if (cell.tagName.toLowerCase() != 'td') return;
        let i = cell.parentNode.rowIndex;
        let j = cell.cellIndex;
        let res = [i, j]; 
        console.log(name + ': ' + res);
        return res;
    }
}

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