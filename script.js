function addTable(name) {
    var table = document.createElement("table");
    var tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for(var i = 0; i < 11; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 11; j++){
            var td = document.createElement('td');
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    document.getElementById(name).appendChild(table);
    tableFill('#' + name);
}

function tableFill(name) {  
    let name1 = name + ' table';
    let table = document.querySelector(name1);    
    table.getElementsByTagName('td')[0].style.border = 'none';
    table.getElementsByTagName('td')[0].style.backgroundColor = '#dcdcdc';
    for (let i = 1; i < 11; i++) {
        let elemR = table.rows[0].cells[i];
        elemR.textContent = String.fromCharCode(64 + i);
        let elemC = table.rows[i].cells[0];
        elemC.textContent = i;
    };
};



addTable('your');
addTable('opponent');
//tableFill('#your');