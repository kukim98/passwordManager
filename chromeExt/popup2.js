
function radioOne() {
  chrome.tabs.executeScript({

      file: 'script2.js'
  });
}


document.getElementById('radiocheck').addEventListener('click', radioOne());
