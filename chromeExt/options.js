var editableTable = null;
function init_dataTable() {

}

function restore_options() {
    chrome.storage.local.get(null, function (data) {

        if (Object.keys(data).length != 0) {

            let count = 1;
            for (var propName in data) {
                propValue = data[propName]

                console.log(propName, propValue);
                console.log(propName, propValue.un[0]);
                console.log(propName, propValue.pw[0]);

                createTableRow(count, propName, propValue.un[0], propValue.pw[0]);
                count++;
            }
        }
    });

    editableTable = new BSTable("mainTable", {
        $addButton: $('#new-row-button')
    });
    editableTable.init();
}

function on_save() {

}

function createTableRow(index, website, username, password) {
    var tableRow = document.createElement("TR");

    var tableCell0 = document.createElement("TH");
    tableCell0.setAttribute("scope", "row")
    var textNode = document.createTextNode(index.toString());
    tableCell0.appendChild(textNode);

    var tableCell1 = document.createElement("TD");
    var textNode = document.createTextNode(website);
    tableCell1.appendChild(textNode);

    var tableCell2 = document.createElement("TD");
    tableCell2.appendChild(document.createTextNode(username));

    var tableCell3 = document.createElement("TD");
    tableCell3.appendChild(document.createTextNode(password));

    tableRow.appendChild(tableCell0);
    tableRow.appendChild(tableCell1);
    tableRow.appendChild(tableCell2);
    tableRow.appendChild(tableCell3);

    document.getElementById("table_content").appendChild(tableRow);

    editableTable.refresh();
}

document.addEventListener('DOMContentLoaded', restore_options);