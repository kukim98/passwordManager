// content.js
//This is just a test function
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if( request.message === "clicked_browser_action" ) {
			var firstHref = $("a[href^='http']").eq(0).attr("href");

			console.log(firstHref);

			// This line is new!
			chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
		}else if(request.message === "fillFields"){
			request.id.value = "default ID";
			request.pw = "default PW";
		}
	}
);

/*
This will retrun an array of login <input> and password <input> from the current webpage.
If the webpage does not have the tags, it will return undefined.
*/
function getLoginFields(){
	let inputs = document.getElementsByTagName("input");
	for(let i = 0; i < inputs.length; i++){
		let loginField = inputs[i];
		if(i + 1 < inputs.length && inputs[i + 1].hasAttribute('type')){
			if(inputs[i + 1].getAttribute('type') === "password"){
				let passwordField = inputs[i + 1];
				return [loginField, passwordField];
			}
		}
	}
	return undefined;
}

/*
This will store a JSON data structure to the local Chrome storage.
The data structure has the host-domain name as the key and the credentials (username and password) as the values.
This function will only be triggered when the user submits the form to with username and password <input> fields.
This function will only be triggered when the username and the password are not empty strings.
*/
function saveCredentials(un, pw){
	if(un.length > 0 && pw.length > 0){
		var subURL = psl.parse(window.location.hostname);
		let sub = subURL.domain
		console.log(sub);
		console.log(un);
		console.log(pw);
		chrome.storage.local.set({
			[sub]:{
				un:[un],
				pw:[pw]
			}
		});
	}
}

/*
This will add an onClick attribute to the submit button so that saveCredentials() is triggered when the user submits his/her credentials to the web app.
*/
function setOnClickSaveCredential(){
	let arr = getLoginFields();
	if(arr != undefined){
		var form = arr[0].closest('form');
		form.onclick = function(){
			saveCredentials(arr[0].value, arr[1].value);
		};
	}
}

/*
This will auto fill user credentials given there has been a saved user credential for the host-name web app and given there is a <form> with <input> tags for username and password.
*/
function autoFillCredential(){
	var subURL = psl.parse(window.location.hostname);
	let sub = subURL.domain;
	chrome.storage.local.get(sub, function(data){
		console.log(data);
		if(Object.keys(data).length != 0){
			let arr = getLoginFields();
			if(arr != undefined){
				console.log(data[sub]);
				arr[0].value = data[sub].un;
				arr[1].value = data[sub].pw;
			}
		}
	});
}

//These are functions called when the web browser is loaded or refreshed.
setOnClickSaveCredential();
autoFillCredential();
