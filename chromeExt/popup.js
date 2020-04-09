function switchIt() {
var config = document.getElementById('switch').checked;

chrome.tabs.executeScript({
    code: 'var config = ' + (config)
}, function() {
    chrome.tabs.executeScript({file: 'script.js'});
});
}

document.getElementById('switch').addEventListener('click', switchIt);
