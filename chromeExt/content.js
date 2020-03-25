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
This is the constant that holds the Rijndael S-box values for the AES algorithm.
It is used in subByte function to return the polynomial coefficient XOR summation over GF(2) of the (8b) input data.
This is the look-up table that was calculated for all hexadecimal values in 1B.
*/
const sBox = [
	0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
	0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
	0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
	0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
	0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
	0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
	0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
	0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
	0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
	0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
	0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
	0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
	0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
	0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
	0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
	0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];

/*
This is the Rijndael's Galois MDS "matrix" represented with in a vector form.
This is a constant matrix that was derived by polynomial expansion and modular reduction.
*/
const galoisField = [
	2, 3, 1, 1,
	1, 2, 3, 1,
	1, 1, 2, 3,
	3, 1, 1, 2
];

/*
These are the round constants found by performing polynomial XOR over GF(2) finite field.
These are used to produce new keys.
*/
const rc = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1B, 0x36];

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
This will - given an array of char - dequeue and then enqueue the first element.
The modified array is returned.
*/
function rotateAByteClock(data){
	let temp = [];
	for(let i = 0; i < data.length - 1; i++){
		temp[i] = data[i + 1];
	}
	temp[data.length - 1] = data[0];
	return temp;
}

/*
This will use the S-table array constant to return an 8b output after GF(2) polynomial and Nyberg transformation.
*/
function subBytes(data){
	let temp = [];
	for(let i = 0; i < data.length; i++){
		temp[i] = sBox[data[i]];
	}
	return temp;
}

/*
This function will perform row shifting of the data.
The input data is assumed to be an 16B vector, but it is interpreted like a 4X4 matrix.
Given the n-th row of the "matrix", it will call the rotatAByteClock function n times.
The new modified matrix is returned.
*/
function shiftRows(data){
	var arr = [];
	var vector = [];
	for(let i = 0; i < 4; i++){
		let temp = data.slice(4 * i, 4 * (i + 1));
		for(let j = 0; j < i; j++){
			vector = rotateAByteClock(temp);
			temp = vector;
		}
		arr = arr.concat(temp);
	}
	return arr;
}

/*
This is a helper function for the mixColumns function.
It is mostly dealing with hexadecimal multiplication with 1, 2, and 3.
When multiplying a hexadecimal with a '2', one can left (bit) shift once and then perform XOR with 0x1B if there was an overflow during the shift.
When multiplying a hexadecimal with a '3', one can left (bit) shift once and then perform XOR with 0x1B if there was an overflow during the shift and then another XOR with the original hex value prior to the bit shift.
When multiplying a hexdecimal with a '1', one can simply return the hex value since one times anything is one.
Before returning the result of the function, 256 is subtracted from the original if there is was an overflow.
*/
function mixColumnsHelper(col, galVect){
	let n = 0;
	let result = -1;
	for(let i = 0; i < galVect.length; i++){
		if(galVect[i] == 2){
			n = col[i] << 1;
			if(col[i] >= 128){
				n = n ^ 0x1b;
			}
		}else if(galVect[i] == 3){
			n = col[i] << 1;
			if(col[i] >= 128){
				n = n ^ 0x1b;
			}
			n = n ^ col[i];
		}else{
			n = col[i];
		}
		if(result == -1){
			result = n;
		}else{
			result = n ^ result;
		}
	}
	while(result / 256 >= 1){
		result -= 256;
	}
	return result;
}

/*
This function will shuffle the columns using Galois field matrix and the helper function.
The modified array is returned.
*/
function mixColumns(data){
	let arr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	for(let i = 0; i < 4; i++){
		let col = [data[i], data[4 + i], data[8 + i], data[12 + i]];
		for(let j = 0; j < 4; j++){
			arr[4 * j + i] = mixColumnsHelper(col, galoisField.slice(4 * j, 4 * (j + 1)));
		}
	}
	return arr;
}

/*
This function will XOR add the data with the key.
The modified array is returned.
*/
function addRoundKey(data, key){
	let arr = [];
	for(let i = 0; i < 16; i++){
		arr[i] = data[i] ^ key[i];
	}
	return arr;
}

/*
This function will return a new key value given the old key and the round value r.
It uses the round constant and byte rotation and XOR additions.
*/
function keySchedule(key, r){
	let result = [];
	let lastCol = [key[3], key[7], key[11], key[15]];
	let recentCol = [];
	lastCol = rotateAByteClock(lastCol);
	lastCol = subBytes(lastCol);
	for(let i = 0; i < 4; i++){
		if(i == 0){
			result[4 * i] = key[i] ^ lastCol[i] ^ rc[r];
		}else{
			result[4 * i] = key[4 * i] ^ lastCol[i] ^ 0x00;
		}
	}
	recentCol = [result[0], result[4], result[8], result[12]];
	for(let j = 1; j < 4; j++){
		for(let k = 0; k < 4; k++){
			result[4 * k + j] = key[4 * k + j] ^ recentCol[k];
			recentCol[k] = result[4 * k + j];
		}
	}
	return result;
}

/*
Input data is an array of char with length of 16. (16 bytes)
Input key is an array of char with length of 16. (16 bytes)
Visual representation of the arraies is that of a matrix.
[0, 1, 2, 3,
4, 5, 6, 7,
8, 9, 10, 11,
12, 13, 14, 15]
*/
function encrypt(data, key){
	let encrypted = [];
	let newKey = key;
	encrypted = addRoundKey(data, key);
	for(let i = 1; i < 10; i++){
		encrypted = subBytes(encrypted);
		encrypted = shiftRows(encrypted);
		encrypted = mixColumns(encrypted);
		newKey = keySchedule(newKey, i - 1);
		encrypted = addRoundKey(encrypted, newKey);
	}
	encrypted = subBytes(encrypted);
	encrypted = shiftRows(encrypted);
	newKey = keySchedule(newKey, 9);
	encrypted = addRoundKey(encrypted, newKey);
	return encrypted;
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
let arr1 = [0x32, 0x88, 0x31, 0xe0, 0x43, 0x5a, 0x31, 0x37, 0xf6, 0x30, 0x98, 0x07, 0xa8, 0x8d, 0xa2, 0x34];
let arr2 = [0x2b, 0x28, 0xab, 0x09, 0x7e, 0xae, 0xf7, 0xcf, 0x15, 0xd2, 0x15, 0x4f, 0x16, 0xa6, 0x88, 0x3c];
console.log(encrypt(arr1, arr2));
setOnClickSaveCredential();
autoFillCredential();
//chrome.storage.local.clear();
