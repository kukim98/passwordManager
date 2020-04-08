var editableTable = null;
var count = 1;

function restore_options() {
    chrome.storage.local.get(null, function (data) {

        if (Object.keys(data).length != 0) {

            for (var propName in data) {
                propValue = data[propName]

                console.log(propName, propValue);
                console.log(propName, propValue.un[0]);
                console.log(propName, propValue.pw[0]);
                //alert(propValue.key)
                var someKey = propValue.key;

                if (typeof someKey !== "undefined" && propValue.un !== "") {
                    createTableRow(count, propName, propValue.un, decrypt(propValue.pw, someKey));
                    count++;
                }

            }
        }
    });
    init_dataTable();
}
// $("img").click(function () {
//     alert("click!");
// });
// $(document).ready(function () {
//     alert("document ready!");
// });
function init_dataTable() {
    editableTable = new BSTable("mainTable", {
        $addButton: $('#new-row-button'),
        onAdd: function () {
            //alert("on add");
            //createTableRow(count, "", "", "");
        },
        onEdit: function (someObj) {
            let keyValue = someObj[0].cells[1].innerHTML;
            let us = someObj[0].cells[2].innerHTML;
            let ps = someObj[0].cells[3].innerHTML;

            save_to_chrome(keyValue, us, ps);
        },
        onBeforeDelete: function (row, allowDelete) {
            let domainName = row[0].cells[1].innerHTML;
            if (confirm("Are you sure you want to permanently delete your data for "
                + domainName + "?")) {
                allowDelete.accept = true;
                delete_from_chrome(domainName);
            }
        }
        //onDelete: function (someVar1, someVar2) { alert("delete"); return; }
    });
    editableTable.init();
}

function save_to_chrome(domain, un, pw) {
    let key = "";
    for (let i = 0; i < 16; i++) {
        key = key.concat(Math.floor(Math.random() * 256));
    }

    pair = encrypt(pw, key);
    alert("encrypted: " + pair[0]);
    chrome.storage.local.set({
        [domain]: {
            un: un,
            pw: pair[0],
            key: pair[1]
        }
    });
}

function delete_from_chrome(domain) {
    //we will just remove the "username" to delete
    chrome.storage.local.set({
        [domain]: {
            un: "",
            pw: "",
            key: ""
        }
    });
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