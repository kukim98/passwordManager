function restore_options() {

    chrome.storage.local.get(null, function (data) {

        if (Object.keys(data).length != 0) {

            for (var propName in data) {
                propValue = data[propName]

                console.log(propName, propValue);
                console.log(propName, propValue.un[0]);
                console.log(propName, propValue.pw[0]);

                document.body.insertAdjacentHTML('beforeend', propName +
                    " username: " +
                    propValue.un[0] + " password: " + propValue.pw[0] + '<br>');

            }
        }
    });

}
document.addEventListener('DOMContentLoaded', restore_options);