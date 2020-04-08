// content.js
//This is just a test function
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.message === "clicked_browser_action") {
			var firstHref = $("a[href^='http']").eq(0).attr("href");

			console.log(firstHref);

			// This line is new!
			chrome.runtime.sendMessage({ "message": "open_new_tab", "url": firstHref });
		} else if (request.message === "fillFields") {
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

const inverseSBox = [
	0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
	0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
	0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
	0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
	0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
	0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
	0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
	0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
	0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
	0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
	0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
	0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
	0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
	0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
	0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
	0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
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

const inverseGaloisField = [
	14, 11, 13, 9,
	9, 14, 11, 13,
	13, 9, 14, 11,
	11, 13, 9, 14
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
function getLoginFields() {
	let inputs = document.getElementsByTagName("input");
	for (let i = 0; i < inputs.length; i++) {
		let loginField = inputs[i];
		if (i + 1 < inputs.length && inputs[i + 1].hasAttribute('type')) {
			if (inputs[i + 1].getAttribute('type') === "password") {
				let passwordField = inputs[i + 1];
				return [loginField, passwordField];
			}
		}
	}
	return undefined;
}

/*str.length == 16*/
function strToArr(str) {
	let res = [];
	for (let i = 0; i < 16; i++) {
		res[i] = str.charCodeAt(i);
	}
	return res;
}

function arrToStr(arr) {
	let res = "";
	for (let i = 0; i < 16; i++) {
		res = res.concat(String.fromCharCode(arr[i]));
	}
	return res;
}

/*
This will - given an array of char - dequeue and then enqueue the first element.
The modified array is returned.
*/
function rotateAByteClock(data) {
	let temp = [];
	for (let i = 0; i < data.length - 1; i++) {
		temp[i] = data[i + 1];
	}
	temp[data.length - 1] = data[0];
	return temp;
}

function roatateAByteCClock(data) {
	let temp = [];
	for (let i = 0; i < data.length - 1; i++) {
		temp[i + 1] = data[i];
	}
	temp[0] = data[data.length - 1];
	return temp;
}

/*
This will use the S-table array constant to return an 8b output after GF(2) polynomial and Nyberg transformation.
*/
function subBytes(data) {
	let temp = [];
	for (let i = 0; i < data.length; i++) {
		temp[i] = sBox[data[i]];
	}
	return temp;
}

function unSubBytes(data) {
	let temp = [];
	for (let i = 0; i < data.length; i++) {
		temp[i] = inverseSBox[data[i]];
	}
	return temp;
}

/*
This function will perform row shifting of the data.
The input data is assumed to be an 16B vector, but it is interpreted like a 4X4 matrix.
Given the n-th row of the "matrix", it will call the rotatAByteClock function n times.
The new modified matrix is returned.
*/
function shiftRows(data) {
	var arr = [];
	var vector = [];
	for (let i = 0; i < 4; i++) {
		let temp = data.slice(4 * i, 4 * (i + 1));
		for (let j = 0; j < i; j++) {
			vector = rotateAByteClock(temp);
			temp = vector;
		}
		arr = arr.concat(temp);
	}
	return arr;
}

function unShiftRows(data) {
	var arr = [];
	var vector = [];
	for (let i = 0; i < 4; i++) {
		let temp = data.slice(4 * i, 4 * (i + 1));
		for (let j = 0; j < i; j++) {
			vector = roatateAByteCClock(temp);
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
function mixColumnsHelper(col, galVect) {
	let n = 0;
	let result = -1;
	for (let i = 0; i < galVect.length; i++) {
		if (galVect[i] == 2) {
			n = col[i] << 1;
			if (col[i] >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
		} else if (galVect[i] == 3) {
			n = col[i] << 1;
			if (col[i] >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			n = n ^ col[i];
		} else {
			n = col[i];
		}
		if (result == -1) {
			result = n;
		} else {
			result = n ^ result;
		}
	}
	while (result / 256 >= 1) {
		result -= 256;
	}
	return result;
}

/*
This is a helper function for the mixColumns function.
It is mostly dealing with hexadecimal multiplication with 1, 2, and 3.
When multiplying a hexadecimal with a '2', one can left (bit) shift once and then perform XOR with 0x1B if there was an overflow during the shift.
When multiplying a hexadecimal with a '3', one can left (bit) shift once and then perform XOR with 0x1B if there was an overflow during the shift and then another XOR with the original hex value prior to the bit shift.
When multiplying a hexdecimal with a '1', one can simply return the hex value since one times anything is one.
Before returning the result of the function, 256 is subtracted from the original if there is was an overflow.
*/
function unMixColumnsHelper(col, galVect) {
	let n = 0;
	let result = -1;
	let c;
	for (let i = 0; i < galVect.length; i++) {
		if (galVect[i] == 9) {
			n = col[i] << 1;
			if (col[i] >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			c = 0;
			while (c < 2) {
				let temp = n;
				n = temp << 1;
				if (temp >= 128) {
					n = n ^ 0x1b;
					n -= 256;
				}
				c++;
			}
			n = n ^ col[i];
		} else if (galVect[i] == 11) {
			n = col[i] << 1;
			if (col[i] >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			let temp = n;
			n = temp << 1;
			if (temp >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			n = n ^ col[i];
			temp = n;
			n = temp << 1;
			if (temp >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			n = n ^ col[i];
		} else if (galVect[i] == 13) {
			n = col[i] << 1;
			if (col[i] >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			n = n ^ col[i];
			let temp = n;
			n = temp << 1;
			if (temp >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			temp = n;
			n = temp << 1;
			if (temp >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			n = n ^ col[i];
		} else { //14
			n = col[i] << 1;
			if (col[i] >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			n = n ^ col[i];
			let temp = n;
			n = temp << 1;
			if (temp >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
			n = n ^ col[i];
			temp = n;
			n = temp << 1;
			if (temp >= 128) {
				n = n ^ 0x1b;
				n -= 256;
			}
		}
		if (result == -1) {
			result = n;
		} else {
			result = n ^ result;
		}
	}
	while (result / 256 >= 1) {
		result -= 256;
	}
	return result;
}

/*
This function will shuffle the columns using Galois field matrix and the helper function.
The modified array is returned.
*/
function mixColumns(data) {
	let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (let i = 0; i < 4; i++) {
		let col = [data[i], data[4 + i], data[8 + i], data[12 + i]];
		for (let j = 0; j < 4; j++) {
			arr[4 * j + i] = mixColumnsHelper(col, galoisField.slice(4 * j, 4 * (j + 1)));
		}
	}
	return arr;
}

function unMixColumns(data) {
	let arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (let i = 0; i < 4; i++) {
		let col = [data[i], data[4 + i], data[8 + i], data[12 + i]];
		for (let j = 0; j < 4; j++) {
			arr[4 * j + i] = unMixColumnsHelper(col, inverseGaloisField.slice(4 * j, 4 * (j + 1)));
		}
	}
	return arr;
}

/*
This function will XOR add the data with the key.
The modified array is returned.
*/
function addRoundKey(data, key) {
	let arr = [];
	for (let i = 0; i < 16; i++) {
		arr[i] = data[i] ^ key[i];
	}
	return arr;
}

function unAddRoundKey(data, key) {
	let arr = [];
	for (let i = 0; i < 16; i++) {
		arr[i] = data[i] ^ key[i];
	}
	return arr;
}

/*
This function will return a new key value given the old key and the round value r.
It uses the round constant and byte rotation and XOR additions.
*/
function keySchedule(key, r) {
	let result = [];
	let lastCol = [key[3], key[7], key[11], key[15]];
	let recentCol = [];
	lastCol = rotateAByteClock(lastCol);
	lastCol = subBytes(lastCol);
	for (let i = 0; i < 4; i++) {
		if (i == 0) {
			result[4 * i] = key[i] ^ lastCol[i] ^ rc[r];
		} else {
			result[4 * i] = key[4 * i] ^ lastCol[i] ^ 0x00;
		}
	}
	recentCol = [result[0], result[4], result[8], result[12]];
	for (let j = 1; j < 4; j++) {
		for (let k = 0; k < 4; k++) {
			result[4 * k + j] = key[4 * k + j] ^ recentCol[k];
			recentCol[k] = result[4 * k + j];
		}
	}
	return result;
}

function unKeySchedule(key, r) {
	let result = [];
	for (let i = 3; i > 0; i--) {
		for (let j = 0; j < 4; j++) {
			result[4 * j + i] = key[4 * j + i - 1] ^ key[4 * j + i];
		}
	}
	let lastCol = [result[3], result[7], result[11], result[15]];
	lastCol = rotateAByteClock(lastCol);
	lastCol = subBytes(lastCol);
	for (let i = 0; i < 4; i++) {
		if (i == 0) {
			result[4 * i] = key[i] ^ lastCol[i] ^ rc[r];
		} else {
			result[4 * i] = key[4 * i] ^ lastCol[i] ^ 0x00;
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
function encrypt(data, key) {
	let x = 0;
	let res = "";
	let newKey;
	let m = data.length % 16;
	//Add suffix
	if (m == 0) {
		data = data.concat(String.fromCharCode(15));
		for (let y = 0; y < 15; y++) {
			let num = Math.floor(Math.random() * 241) + 16;
			data = data.concat(String.fromCharCode(num));
		}
	} else {
		data = data.concat(String.fromCharCode(15 - m));
		for (let y = 0; y < 16 - m - 1; y++) {
			let num = Math.floor(Math.random() * 241) + 16
			data = data.concat(String.fromCharCode(num));
		}
	}
	/*password$$^FXXXXX*/
	while (data.length - 16 * x != 0) {
		let subs = data.substring(16 * x, 16 * (x + 1));
		let encrypted = [];
		newKey = key;
		let arr = strToArr(subs);
		encrypted = addRoundKey(arr, key);
		for (let i = 1; i < 10; i++) {
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
		x++;
		let strr = arrToStr(encrypted);
		res = res.concat(strr);
	}
	/*String-ify newKey*/
	let reskey = "";
	for (let y = 0; y < 16; y++) {
		reskey = reskey.concat(String.fromCharCode(newKey[y]));
	}
	return [res, reskey];
}

/**/
function decrypt(data, key) {
	let reskey = [];
	for (let y = 0; y < 16; y++) {
		reskey[y] = key.charCodeAt(y);
	}
	let x = 0;
	let res = "";
	while (data.length - 16 * x != 0) {
		let subs = data.substring(16 * x, 16 * (x + 1));
		let decrypted = [];
		let newKey = reskey;
		let arr = strToArr(subs);
		decrypted = unAddRoundKey(arr, reskey);
		newKey = unKeySchedule(reskey, 9);
		decrypted = unShiftRows(decrypted);
		decrypted = unSubBytes(decrypted);
		for (let i = 1; i < 10; i++) {
			decrypted = unAddRoundKey(decrypted, newKey);
			newKey = unKeySchedule(newKey, 9 - i);
			decrypted = unMixColumns(decrypted);
			decrypted = unShiftRows(decrypted);
			decrypted = unSubBytes(decrypted);
		}
		decrypted = unAddRoundKey(decrypted, newKey);
		x++;
		let strr = arrToStr(decrypted);
		for (let k = 0; k < 16; k++) {
			if (strr.charCodeAt(k) + k == 15) {
				strr = strr.substring(0, k + 1);
			}
		}
		res = res.concat(strr);
	}
	let c = 0;
	/*
		while(res.charCodeAt(res.length - 1 - c) != 32 + c){
			c++;
		}*/
	res = res.substring(0, res.length - c - 1);
	return res;
}

/*
This will store a JSON data structure to the local Chrome storage.
The data structure has the host-domain name as the key and the credentials (username and password) as the values.
This function will only be triggered when the user submits the form to with username and password <input> fields.
This function will only be triggered when the username and the password are not empty strings.
*/
function saveCredentials(un, pw) {
	if (un.length > 0 && pw.length > 0) {
		var subURL = psl.parse(window.location.hostname);
		let sub = subURL.domain;
		let key = "";
		for (let i = 0; i < 16; i++) {
			key = key.concat(Math.floor(Math.random() * 256));
		}
		pair = encrypt(pw, key);
		console.log(sub);
		console.log(un);
		console.log(pair[0]);
		chrome.storage.local.set({
			[sub]: {
				un: un,
				pw: pair[0],
				key: pair[1]
			}
		});
	}
}

/*
This will add an onClick attribute to the submit button so that saveCredentials() is triggered when the user submits his/her credentials to the web app.
*/
function setOnClickSaveCredential() {
	let arr = getLoginFields();
	if (arr != undefined) {
		var form = arr[0].closest('form');
		form.onsubmit = function () {
			if (confirm("Would you like to save this credent")){
				saveCredentials(arr[0].value, arr[1].value);
			}
		};
	}
}

/*
This will auto fill user credentials given there has been a saved user credential for the host-name web app and given there is a <form> with <input> tags for username and password.
*/
function autoFillCredential() {
	var subURL = psl.parse(window.location.hostname);
	let sub = subURL.domain;
	chrome.storage.local.get(sub, function (data) {
		console.log(data);
		if (Object.keys(data).length != 0) {
			let arr = getLoginFields();
			if (arr != undefined) {
				arr[0].value = data[sub].un;
				let k = decrypt(data[sub].pw, data[sub].key);
				console.log(k);
				arr[1].value = k;
			}
		}
	});
}

function openRecommender(){
	document.getElementById("recommender").style.display = "block";
}

function closeRecommender(){
	document.getElementById("recommender").style.display = "none";
}

function createRecommender(){
	var recommenderContainer = document.createElement("div");
	recommenderContainer.id = "recommender";
	recommenderContainer.style.position = "fixed";
	recommenderContainer.style.bottom = "0";
	recommenderContainer.style.right = "0";
	recommenderContainer.style.width = "300px";
	recommenderContainer.style.backgroundColor = "white";
	recommenderContainer.style["overflow-wrap"] = "break-word";
	var recommenderForm = document.createElement("form");
	var formTitle = document.createElement("h1");
	formTitle.innerHTML = "Recommender";

	var radio1 = document.createElement("input");
	radio1.type = "radio";
	radio1.name = "pwtype";
	radio1.value = "Regular";
	radio1.onclick = function(){
	document.getElementById('radio1div').style.display = 'block';
	document.getElementById('radio2div').style.display = 'none';
	document.getElementById('radio3div').style.display = 'none';
	};
	var radio1Label = document.createElement("label");
	radio1Label.innerHTML = "Regular";
	var radio2 = document.createElement("input");
	radio2.type = "radio";
	radio2.name = "pwtype";
	radio2.value = "Sentence";
	radio2.onclick = function(){
	document.getElementById('radio1div').style.display = 'none';
	document.getElementById('radio2div').style.display = 'block';
	document.getElementById('radio3div').style.display = 'none';
	};
	var radio2Label = document.createElement("label");
	radio2Label.innerHTML = "Sentence";
	var radio3 = document.createElement("input");
	radio3.type = "radio";
	radio3.name = "pwtype";
	radio3.value = "Passphrase";
	radio3.onclick = function(){
	document.getElementById('radio1div').style.display = 'none';
	document.getElementById('radio2div').style.display = 'none';
	document.getElementById('radio3div').style.display = 'block';
	};
	var radio3Label = document.createElement("label");
	radio3Label.innerHTML = "Passphrase";

	var radio1Div = document.createElement("div");
	radio1Div.id = "radio1div";
	radio1Div.style.display = "none";
	var specialLabel = document.createElement("label");
	specialLabel.innerHTML = "Number of Symbols";
	var specialInput = document.createElement("input");
	specialInput.id = "specialInput";
	specialInput.type = "number";
	specialInput.min = "0";
	specialInput.value = "0";
	var numberLabel = document.createElement("label");
	numberLabel.innerHTML = "Number of Numbers";
	var numberInput = document.createElement("input");
	numberInput.id = "numberInput";
	numberInput.type = "number";
	numberInput.min = "0";
	numberInput.value = "0";
	var capitalLabel = document.createElement("label");
	capitalLabel.innerHTML = "Number of Capitals";
	var capitalInput = document.createElement("input");
	capitalInput.id = "capitalInput";
	capitalInput.type = "number";
	capitalInput.min = "0";
	capitalInput.value = "0";
	var lengthLabel = document.createElement("label");
	lengthLabel.innerHTML = "Length of Password";
	var lengthInput = document.createElement("input");
	lengthInput.id = "lengthInput";
	lengthInput.type = "number";
	lengthInput.min = "0";
	lengthInput.value = "6";
	var regularButton = document.createElement("button");
	regularButton.innerHTML = "Recommend Me"
	var regularRecommendation = document.createElement("p");
	regularRecommendation.innerHTML = " ";
	regularRecommendation.id = "regularRec";
	regularButton.onclick = function() { 
		var regularRecommendation = document.getElementById("regularRec");
		let specialNum = parseInt(document.getElementById("specialInput").value);
		let numNum = parseInt(document.getElementById("numberInput").value);
		let capitalNum = parseInt(document.getElementById("capitalInput").value);
		let lengthNum = parseInt(document.getElementById("lengthInput").value);
		let lowerNum = lengthNum - capitalNum - numNum - specialNum;
		if(specialNum + numNum + capitalNum > lengthNum){
			regularRecommendation.innerHTML = "Password length must be less than\nthe sum of the three criteria.";
		}else{
			var stringRec = "";
			for(let i = 0; i < lengthNum; i++){
				let decider = Math.floor(Math.random() * 4);
				if(decider == 0 && specialNum > 0){
					var symbols = '~!@#$%^&*()_+=-][{};:/?.,`';
					let ran = symbols.charAt(Math.floor(Math.random() * symbols.length));
					stringRec = stringRec.concat(ran);
					specialNum--;
				}else if(decider == 1 && numNum > 0){
					var numbers = '0192837465';
					let ran = numbers.charAt(Math.floor(Math.random() * numbers.length));
					stringRec = stringRec.concat(ran);
					numNum--;
				}else if(decider == 2 && capitalNum > 0){
					var capitals = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
					let ran = capitals.charAt(Math.floor(Math.random() * capitals.length));
					stringRec = stringRec.concat(ran);
					capitalNum--;
				}else if(lowerNum > 0){
					var lowers = 'abcdefghijklmnopqrstuvwxyz';
					let ran = lowers.charAt(Math.floor(Math.random() * lowers.length));
					stringRec = stringRec.concat(ran);
					lowerNum--;
				}else{
					i--;
				}
			}
			regularRecommendation.innerHTML = stringRec;
		}
		return false; 
	};

	var radio2Div = document.createElement("div");
	radio2Div.id = "radio2div";
	radio2Div.style.display = "none";
	var sentenceLabel = document.createElement("label");
	sentenceLabel.innerHTML = "Type in your Sentence Here";
	var sentenceInput = document.createElement("input");
	sentenceInput.id = "sentenceInput";
	sentenceInput.type = "text";
	sentenceInput.value = "SampleSentence";
	var sentenceButton = document.createElement("button");
	sentenceButton.innerHTML = "Recommend Me"
	var sentenceRecommendation = document.createElement("p");
	sentenceRecommendation.innerHTML = " ";
	sentenceRecommendation.id = "sentenceRec";
	sentenceButton.onclick = function() { 
		var sentence = document.getElementById("sentenceInput").value;
		var result = "";
		if(sentence.length < 8){
			let sentenceRecommendation = document.getElementById("sentenceRec");
			sentenceRecommendation.innerHTML = "Your sentence must contain at least 8 characters.";
		}else{
			for(let i = 0;i < sentence.length; i++){
				if(Math.floor(Math.random() * 10) < 4){
					var radicals = '~!@#$%^&*()_+=-][{};:/?.,`0192837465';
					let c = radicals.charAt(Math.floor(Math.random() * radicals.length));
					result = result.concat(c);
					result = result.concat(sentence.charAt(i));
				}else if(Math.floor(Math.random() * 10) < 2){
					var radicals = '~!@#$%^&*()_+=-][{};:/?.,`0192837465';
					let c = radicals.charAt(Math.floor(Math.random() * radicals.length));
					result = result.concat(c);
				}else{
					result = result.concat(sentence.charAt(i));
				}
			}
			let sentenceRecommendation = document.getElementById("sentenceRec");
			sentenceRecommendation.innerHTML = result;
		}
		return false;
	};

	var radio3Div = document.createElement("div");
	radio3Div.id = "radio3div";
	radio3Div.style.display = "none";
	var passphraseLabel = document.createElement("label");
	passphraseLabel.innerHTML = "Number of Words";
	var passphraseInput = document.createElement("input");
	passphraseInput.id = "passphraseInput";
	passphraseInput.min = 1;
	passphraseInput.type = "number";
	passphraseInput.value = "1";
	var passphraseButton = document.createElement("button");
	passphraseButton.innerHTML = "Recommend Me"
	var passphraseRecommendation = document.createElement("p");
	passphraseRecommendation.innerHTML = " ";
	passphraseRecommendation.id = "passphraseRec";
	passphraseButton.onclick = function() { 
		var num = document.getElementById("passphraseInput").value;
		var result = "";
		const passphraseList = ["a", "a&p", "a's", "aa", "aaa", "aaaa", "aaron", "ab", "aba", "ababa", "aback", "abase", "abash", "abate", "abbas", "abbe", "abbey", "abbot", "abbott", "abc", "abe", "abed", "abel", "abet", "abide", "abject", "ablaze", "able", "abner", "abo", "abode", "abort", "about", "above", "abrade", "abram", "absorb", "abuse", "abut", "abyss", "ac", "acadia", "accra", "accrue", "ace", "acetic", "ache", "acid", "acidic", "acm", "acme", "acorn", "acre", "acrid", "act", "acton", "actor", "acts", "acuity", "acute", "ad", "ada", "adage", "adagio", "adair", "adam", "adams", "adapt", "add", "added", "addict", "addis", "addle", "adele", "aden", "adept", "adieu", "adjust", "adler", "admit", "admix", "ado", "adobe", "adonis", "adopt", "adore", "adorn", "adult", "advent", "advert", "advise", "ae", "aegis", "aeneid", "af", "afar", "affair", "affine", "affix", "afire", "afoot", "afraid", "africa", "afro", "aft", "ag", "again", "agate", "agave", "age", "agee", "agenda", "agent", "agile", "aging", "agnes", "agnew", "ago", "agone", "agony", "agree", "ague", "agway", "ah", "ahead", "ahem", "ahoy", "ai", "aid", "aida", "aide", "aides", "aiken", "ail", "aile", "aim", "ain't", "ainu", "air", "aires", "airman", "airway", "airy", "aisle", "aj", "ajar", "ajax", "ak", "akers", "akin", "akron", "al", "ala", "alai", "alamo", "alan", "alarm", "alaska", "alb", "alba", "album", "alcoa", "alden", "alder", "ale", "alec", "aleck", "aleph", "alert", "alex", "alexei", "alga", "algae", "algal", "alger", "algol", "ali", "alia", "alias", "alibi", "alice", "alien", "alight", "align", "alike", "alive", "all", "allah", "allan", "allay", "allen", "alley", "allied", "allis", "allot", "allow", "alloy", "allure", "ally", "allyl", "allyn", "alma", "almost", "aloe", "aloft", "aloha", "alone", "along", "aloof", "aloud", "alp", "alpha", "alps", "also", "alsop", "altair", "altar", "alter", "alto", "alton", "alum", "alumni", "alva", "alvin", "alway", "am", "ama", "amass", "amaze", "amber", "amble", "ambush", "amen", "amend", "ames", "ami", "amid", "amide", "amigo", "amino", "amiss", "amity", "amman", "ammo", "amoco", "amok", "among", "amort", "amos", "amp", "ampere", "ampex", "ample", "amply", "amra", "amulet", "amuse", "amy", "an", "ana", "and", "andes", "andre", "andrew", "andy", "anent", "anew", "angel", "angelo", "anger", "angie", "angle", "anglo", "angola", "angry", "angst", "angus", "ani", "anion", "anise", "anita", "ankle", "ann", "anna", "annal", "anne", "annex", "annie", "annoy", "annul", "annuli", "annum", "anode", "ansi", "answer", "ant", "ante", "anti", "antic", "anton", "anus", "anvil", "any", "anyhow", "anyway", "ao", "aok", "aorta", "ap", "apart", "apathy", "ape", "apex", "aphid", "aplomb", "appeal", "append", "apple", "apply", "april", "apron", "apse", "apt", "aq", "aqua", "ar", "arab", "araby", "arc", "arcana", "arch", "archer", "arden", "ardent", "are", "area", "arena", "ares", "argive", "argo", "argon", "argot", "argue", "argus", "arhat", "arid", "aries", "arise", "ark", "arlen", "arlene", "arm", "armco", "army", "arnold", "aroma", "arose", "arpa", "array", "arrear", "arrow", "arson", "art", "artery", "arthur", "artie", "arty", "aruba", "arum", "aryl", "as", "ascend", "ash", "ashen", "asher", "ashley", "ashy", "asia", "aside", "ask", "askew", "asleep", "aspen", "aspire", "ass", "assai", "assam", "assay", "asset", "assort", "assure", "aster", "astm", "astor", "astral", "at", "at&t", "ate", "athens", "atlas", "atom", "atomic", "atone", "atop", "attic", "attire", "au", "aubrey", "audio", "audit", "aug", "auger", "augur", "august", "auk", "aunt", "aura", "aural", "auric", "austin", "auto", "autumn", "av", "avail", "ave", "aver", "avert", "avery", "aviate", "avid", "avis", "aviv", "avoid", "avon", "avow", "aw", "await", "awake", "award", "aware", "awash", "away", "awe", "awful", "awl", "awn", "awoke", "awry", "ax", "axe", "axes", "axial", "axiom", "axis", "axle", "axon", "ay", "aye", "ayers", "az", "aztec", "azure", "b", "b's", "ba", "babe", "babel", "baby", "bach", "back", "backup", "bacon", "bad", "bade", "baden", "badge", "baffle", "bag", "baggy", "bah", "bahama", "bail", "baird", "bait", "bake", "baku", "bald", "baldy", "bale", "bali", "balk", "balkan", "balky", "ball", "balled", "ballot", "balm", "balmy", "balsa", "bam", "bambi", "ban", "banal", "band", "bandit", "bandy", "bane", "bang", "banish", "banjo", "bank", "banks", "bantu", "bar", "barb", "bard", "bare", "barfly", "barge", "bark", "barley", "barn", "barnes", "baron", "barony", "barr", "barre", "barry", "barter", "barth", "barton", "basal", "base", "basel", "bash", "basic", "basil", "basin", "basis", "bask", "bass", "bassi", "basso", "baste", "bat", "batch", "bate", "bater", "bates", "bath", "bathe", "batik", "baton", "bator", "batt", "bauble", "baud", "bauer", "bawd", "bawdy", "bawl", "baxter", "bay", "bayda", "bayed", "bayou", "bazaar", "bb", "bbb", "bbbb", "bc", "bcd", "bd", "be", "beach", "bead", "beady", "beak", "beam", "bean", "bear", "beard", "beast", "beat", "beau", "beauty", "beaux", "bebop", "becalm", "beck", "becker", "becky", "bed", "bedim", "bee", "beebe", "beech", "beef", "beefy", "been", "beep", "beer", "beet", "befall", "befit", "befog", "beg", "began", "beget", "beggar", "begin", "begun", "behind", "beige", "being", "beirut", "bel", "bela", "belch", "belfry", "belie", "bell", "bella", "belle", "belly", "below", "belt", "bema", "beman", "bemoan", "ben", "bench", "bend", "bender", "benny", "bent", "benz", "berea", "bereft", "beret", "berg", "berlin", "bern", "berne", "bernet", "berra", "berry", "bert", "berth", "beryl", "beset", "bess", "bessel", "best", "bestir", "bet", "beta", "betel", "beth", "bethel", "betsy", "bette", "betty", "bevel", "bevy", "beware", "bey", "bezel", "bf", "bg", "bh", "bhoy", "bi", "bias", "bib", "bibb", "bible", "bicep", "biceps", "bid", "biddy", "bide", "bien", "big", "biggs", "bigot", "bile", "bilge", "bilk", "bill", "billow", "billy", "bin", "binary", "bind", "bing", "binge", "bingle", "bini", "biota", "birch", "bird", "birdie", "birth", "bison", "bisque", "bit", "bitch", "bite", "bitt", "bitten", "biz", "bizet", "bj", "bk", "bl", "blab", "black", "blade", "blair", "blake", "blame", "blanc", "bland", "blank", "blare", "blast", "blat", "blatz", "blaze", "bleak", "bleat", "bled", "bleed", "blend", "bless", "blest", "blew", "blimp", "blind", "blink", "blinn", "blip", "bliss", "blithe", "blitz", "bloat", "blob", "bloc", "bloch", "block", "bloke", "blond", "blonde", "blood", "bloom", "bloop", "blot", "blotch", "blow", "blown", "blue", "bluet", "bluff", "blum", "blunt", "blur", "blurt", "blush", "blvd", "blythe", "bm", "bmw", "bn", "bo", "boa", "boar", "board", "boast", "boat", "bob", "bobbin", "bobby", "bobcat", "boca", "bock", "bode", "body", "bog", "bogey", "boggy", "bogus", "bogy", "bohr", "boil", "bois", "boise", "bold", "bole", "bolo", "bolt", "bomb", "bombay", "bon", "bona", "bond", "bone", "bong", "bongo", "bonn", "bonus", "bony", "bonze", "boo", "booby", "boogie", "book", "booky", "boom", "boon", "boone", "boor", "boost", "boot", "booth", "booty", "booze", "bop", "borax", "border", "bore", "borg", "boric", "boris", "born", "borne", "borneo", "boron", "bosch", "bose", "bosom", "boson", "boss", "boston", "botch", "both", "bottle", "bough", "bouncy", "bound", "bourn", "bout", "bovine", "bow", "bowel", "bowen", "bowie", "bowl", "box", "boxy", "boy", "boyar", "boyce", "boyd", "boyle", "bp", "bq", "br", "brace", "bract", "brad", "brady", "brae", "brag", "bragg", "braid", "brain", "brainy", "brake", "bran", "brand", "brandt", "brant", "brash", "brass", "brassy", "braun", "brave", "bravo", "brawl", "bray", "bread", "break", "bream", "breath", "bred", "breed", "breeze", "bremen", "brent", "brest", "brett", "breve", "brew", "brian", "briar", "bribe", "brice", "brick", "bride", "brief", "brig", "briggs", "brim", "brine", "bring", "brink", "briny", "brisk", "broad", "brock", "broil", "broke", "broken", "bronx", "brood", "brook", "brooke", "broom", "broth", "brow", "brown", "browse", "bruce", "bruit", "brunch", "bruno", "brunt", "brush", "brute", "bryan", "bryant", "bryce", "bryn", "bs", "bstj", "bt", "btl", "bu", "bub", "buck", "bud", "budd", "buddy", "budge", "buena", "buenos", "buff", "bug", "buggy", "bugle", "buick", "build", "built", "bulb", "bulge", "bulk", "bulky", "bull", "bully", "bum", "bump", "bun", "bunch", "bundy", "bunk", "bunny", "bunt", "bunyan", "buoy", "burch", "bureau", "buret", "burg", "buried", "burke", "burl", "burly", "burma", "burn", "burnt", "burp", "burr", "burro", "burst", "burt", "burton", "burtt", "bury", "bus", "busch", "bush", "bushel", "bushy", "buss", "bust", "busy", "but", "butane", "butch", "buteo", "butt", "butte", "butyl", "buxom", "buy", "buyer", "buzz", "buzzy", "bv", "bw", "bx", "by", "bye", "byers", "bylaw", "byline", "byrd", "byrne", "byron", "byte", "byway", "byword", "bz", "c", "c's", "ca", "cab", "cabal", "cabin", "cable", "cabot", "cacao", "cache", "cacm", "cacti", "caddy", "cadent", "cadet", "cadre", "cady", "cafe", "cage", "cagey", "cahill", "caiman", "cain", "caine", "cairn", "cairo", "cake", "cal", "calder", "caleb", "calf", "call", "calla", "callus", "calm", "calve", "cam", "camber", "came", "camel", "cameo", "camp", "can", "can't", "canal", "canary", "cancer", "candle", "candy", "cane", "canis", "canna", "cannot", "canny", "canoe", "canon", "canopy", "cant", "canto", "canton", "cap", "cape", "caper", "capo", "car", "carbon", "card", "care", "caress", "caret", "carey", "cargo", "carib", "carl", "carla", "carlo", "carne", "carob", "carol", "carp", "carpet", "carr", "carrie", "carry", "carson", "cart", "carte", "caruso", "carve", "case", "casey", "cash", "cashew", "cask", "casket", "cast", "caste", "cat", "catch", "cater", "cathy", "catkin", "catsup", "cauchy", "caulk", "cause", "cave", "cavern", "cavil", "cavort", "caw", "cayuga", "cb", "cbs", "cc", "ccc", "cccc", "cd", "cdc", "ce", "cease", "cecil", "cedar", "cede", "ceil", "celia", "cell", "census", "cent", "ceres", "cern", "cetera", "cetus", "cf", "cg", "ch", "chad", "chafe", "chaff", "chai", "chain", "chair", "chalk", "champ", "chance", "chang", "chant", "chao", "chaos", "chap", "chapel", "char", "chard", "charm", "chart", "chase", "chasm", "chaste", "chat", "chaw", "cheap", "cheat", "check", "cheek", "cheeky", "cheer", "chef", "chen", "chert", "cherub", "chess", "chest", "chevy", "chew", "chi", "chic", "chick", "chide", "chief", "child", "chile", "chili", "chill", "chilly", "chime", "chin", "china", "chine", "chink", "chip", "chirp", "chisel", "chit", "chive", "chock", "choir", "choke", "chomp", "chop", "chopin", "choral", "chord", "chore", "chose", "chosen", "chou", "chow", "chris", "chub", "chuck", "chuff", "chug", "chum", "chump", "chunk", "churn", "chute", "ci", "cia", "cicada", "cider", "cigar", "cilia", "cinch", "cindy", "cipher", "circa", "circe", "cite", "citrus", "city", "civet", "civic", "civil", "cj", "ck", "cl", "clad", "claim", "clam", "clammy", "clamp", "clan", "clang", "clank", "clap", "clara", "clare", "clark", "clarke", "clash", "clasp", "class", "claus", "clause", "claw", "clay", "clean", "clear", "cleat", "cleft", "clerk", "cliche", "click", "cliff", "climb", "clime", "cling", "clink", "clint", "clio", "clip", "clive", "cloak", "clock", "clod", "clog", "clomp", "clone", "close", "closet", "clot", "cloth", "cloud", "clout", "clove", "clown", "cloy", "club", "cluck", "clue", "cluj", "clump", "clumsy", "clung", "clyde", "cm", "cn", "co", "coach", "coal", "coast", "coat", "coax", "cobb", "cobble", "cobol", "cobra", "coca", "cock", "cockle", "cocky", "coco", "cocoa", "cod", "coda", "coddle", "code", "codon", "cody", "coed", "cog", "cogent", "cohen", "cohn", "coil", "coin", "coke", "col", "cola", "colby", "cold", "cole", "colon", "colony", "colt", "colza", "coma", "comb", "combat", "come", "comet", "cometh", "comic", "comma", "con", "conch", "cone", "coney", "congo", "conic", "conn", "conner", "conway", "cony", "coo", "cook", "cooke", "cooky", "cool", "cooley", "coon", "coop", "coors", "coot", "cop", "cope", "copra", "copy", "coral", "corbel", "cord", "core", "corey", "cork", "corn", "corny", "corp", "corps", "corvus", "cos", "cosec", "coset", "cosh", "cost", "costa", "cosy", "cot", "cotta", "cotty", "couch", "cough", "could", "count", "coup", "coupe", "court", "cousin", "cove", "coven", "cover", "covet", "cow", "cowan", "cowl", "cowman", "cowry", "cox", "coy", "coyote", "coypu", "cozen", "cozy", "cp", "cpa", "cq", "cr", "crab", "crack", "craft", "crag", "craig", "cram", "cramp", "crane", "crank", "crap", "crash", "crass", "crate", "crater", "crave", "craw", "crawl", "craze", "crazy", "creak", "cream", "credit", "credo", "creed", "creek", "creep", "creole", "creon", "crepe", "crept", "cress", "crest", "crete", "crew", "crib", "cried", "crime", "crimp", "crisp", "criss", "croak", "crock", "crocus", "croft", "croix", "crone", "crony", "crook", "croon", "crop", "cross", "crow", "crowd", "crown", "crt", "crud", "crude", "cruel", "crumb", "crump", "crush", "crust", "crux", "cruz", "cry", "crypt", "cs", "ct", "cu", "cub", "cuba", "cube", "cubic", "cud", "cuddle", "cue", "cuff", "cull", "culpa", "cult", "cumin", "cuny", "cup", "cupful", "cupid", "cur", "curb", "curd", "cure", "curfew", "curia", "curie", "curio", "curl", "curry", "curse", "curt", "curve", "cusp", "cut", "cute", "cutlet", "cv", "cw", "cx", "cy", "cycad", "cycle", "cynic", "cyril", "cyrus", "cyst", "cz", "czar", "czech", "d", "d'art", "d's", "da", "dab", "dacca", "dactyl", "dad", "dada", "daddy", "dade", "daffy", "dahl", "dahlia", "dairy", "dais", "daisy", "dakar", "dale", "daley", "dally", "daly", "dam", "dame", "damn", "damon", "damp", "damsel", "dan", "dana", "dance", "dandy", "dane", "dang", "dank", "danny", "dante", "dar", "dare", "dark", "darken", "darn", "darry", "dart", "dash", "data", "date", "dater", "datum", "daub", "daunt", "dave", "david", "davis", "davit", "davy", "dawn", "dawson", "day", "daze", "db", "dc", "dd", "ddd", "dddd", "de", "deacon", "dead", "deaf", "deal", "dealt", "dean", "deane", "dear", "death", "debar", "debby", "debit", "debra", "debris", "debt", "debug", "debut", "dec", "decal", "decay", "decca", "deck", "decker", "decor", "decree", "decry", "dee", "deed", "deem", "deep", "deer", "deere", "def", "defer", "deform", "deft", "defy", "degas", "degum", "deify", "deign", "deity", "deja", "del", "delay", "delft", "delhi", "delia", "dell", "della", "delta", "delve", "demark", "demit", "demon", "demur", "den", "deneb", "denial", "denny", "dense", "dent", "denton", "deny", "depot", "depth", "depute", "derby", "derek", "des", "desist", "desk", "detach", "deter", "deuce", "deus", "devil", "devoid", "devon", "dew", "dewar", "dewey", "dewy", "dey", "df", "dg", "dh", "dhabi", "di", "dial", "diana", "diane", "diary", "dibble", "dice", "dick", "dicta", "did", "dido", "die", "died", "diego", "diem", "diesel", "diet", "diety", "dietz", "dig", "digit", "dilate", "dill", "dim", "dime", "din", "dinah", "dine", "ding", "dingo", "dingy", "dint", "diode", "dip", "dirac", "dire", "dirge", "dirt", "dirty", "dis", "disc", "dish", "disk", "disney", "ditch", "ditto", "ditty", "diva", "divan", "dive", "dixie", "dixon", "dizzy", "dj", "dk", "dl", "dm", "dn", "dna", "do", "dobbs", "dobson", "dock", "docket", "dod", "dodd", "dodge", "dodo", "doe", "doff", "dog", "doge", "dogma", "dolan", "dolce", "dole", "doll", "dolly", "dolt", "dome", "don", "don't", "done", "doneck", "donna", "donor", "doom", "door", "dope", "dora", "doria", "doric", "doris", "dose", "dot", "dote", "double", "doubt", "douce", "doug", "dough", "dour", "douse", "dove", "dow", "dowel", "down", "downs", "dowry", "doyle", "doze", "dozen", "dp", "dq", "dr", "drab", "draco", "draft", "drag", "drain", "drake", "dram", "drama", "drank", "drape", "draw", "drawl", "drawn", "dread", "dream", "dreamy", "dreg", "dress", "dressy", "drew", "drib", "dried", "drier", "drift", "drill", "drink", "drip", "drive", "droll", "drone", "drool", "droop", "drop", "dross", "drove", "drown", "drub", "drug", "druid", "drum", "drunk", "drury", "dry", "dryad", "ds", "dt", "du", "dual", "duane", "dub", "dubhe", "dublin", "ducat", "duck", "duct", "dud", "due", "duel", "duet", "duff", "duffy", "dug", "dugan", "duke", "dull", "dully", "dulse", "duly", "duma", "dumb", "dummy", "dump", "dumpy", "dun", "dunce", "dune", "dung", "dunham", "dunk", "dunlop", "dunn", "dupe", "durer", "dusk", "dusky", "dust", "dusty", "dutch", "duty", "dv", "dw", "dwarf", "dwell", "dwelt", "dwight", "dwyer", "dx", "dy", "dyad", "dye", "dyer", "dying", "dyke", "dylan", "dyne", "dz", "e", "e'er", "e's", "ea", "each", "eagan", "eager", "eagle", "ear", "earl", "earn", "earth", "ease", "easel", "east", "easy", "eat", "eaten", "eater", "eaton", "eave", "eb", "ebb", "eben", "ebony", "ec", "echo", "eclat", "ecole", "ed", "eddie", "eddy", "eden", "edgar", "edge", "edgy", "edict", "edify", "edit", "edith", "editor", "edna", "edt", "edwin", "ee", "eee", "eeee", "eel", "eeoc", "eerie", "ef", "efface", "effie", "efg", "eft", "eg", "egan", "egg", "ego", "egress", "egret", "egypt", "eh", "ei", "eider", "eight", "eire", "ej", "eject", "ek", "eke", "el", "elan", "elate", "elba", "elbow", "elder", "eldon", "elect", "elegy", "elena", "eleven", "elfin", "elgin", "eli", "elide", "eliot", "elite", "elk", "ell", "ella", "ellen", "ellis", "elm", "elmer", "elope", "else", "elsie", "elton", "elude", "elute", "elves", "ely", "em", "embalm", "embark", "embed", "ember", "emcee", "emery", "emil", "emile", "emily", "emit", "emma", "emory", "empty", "en", "enact", "enamel", "end", "endow", "enemy", "eng", "engel", "engle", "engulf", "enid", "enjoy", "enmity", "enoch", "enol", "enos", "enrico", "ensue", "enter", "entrap", "entry", "envoy", "envy", "eo", "ep", "epa", "epic", "epoch", "epoxy", "epsom", "eq", "equal", "equip", "er", "era", "erase", "erato", "erda", "ere", "erect", "erg", "eric", "erich", "erie", "erik", "ernest", "ernie", "ernst", "erode", "eros", "err", "errand", "errol", "error", "erupt", "ervin", "erwin", "es", "essay", "essen", "essex", "est", "ester", "estes", "estop", "et", "eta", "etc", "etch", "ethan", "ethel", "ether", "ethic", "ethos", "ethyl", "etude", "eu", "eucre", "euler", "eureka", "ev", "eva", "evade", "evans", "eve", "even", "event", "every", "evict", "evil", "evoke", "evolve", "ew", "ewe", "ewing", "ex", "exact", "exalt", "exam", "excel", "excess", "exert", "exile", "exist", "exit", "exodus", "expel", "extant", "extent", "extol", "extra", "exude", "exult", "exxon", "ey", "eye", "eyed", "ez", "ezra", "f", "f's", "fa", "faa", "faber", "fable", "face", "facet", "facile", "fact", "facto", "fad", "fade", "faery", "fag", "fahey", "fail", "fain", "faint", "fair", "fairy", "faith", "fake", "fall", "false", "fame", "fan", "fancy", "fang", "fanny", "fanout", "far", "farad", "farce", "fare", "fargo", "farley", "farm", "faro", "fast", "fat", "fatal", "fate", "fatty", "fault", "faun", "fauna", "faust", "fawn", "fay", "faze", "fb", "fbi", "fc", "fcc", "fd", "fda", "fe", "fear", "feast", "feat", "feb", "fed", "fee", "feed", "feel", "feet", "feign", "feint", "felice", "felix", "fell", "felon", "felt", "femur", "fence", "fend", "fermi", "fern", "ferric", "ferry", "fest", "fetal", "fetch", "fete", "fetid", "fetus", "feud", "fever", "few", "ff", "fff", "ffff", "fg", "fgh", "fh", "fi", "fiat", "fib", "fibrin", "fiche", "fide", "fief", "field", "fiend", "fiery", "fife", "fifo", "fifth", "fifty", "fig", "fight", "filch", "file", "filet", "fill", "filler", "filly", "film", "filmy", "filth", "fin", "final", "finale", "finch", "find", "fine", "finite", "fink", "finn", "finny", "fir", "fire", "firm", "first", "fish", "fishy", "fisk", "fiske", "fist", "fit", "fitch", "five", "fix", "fj", "fjord", "fk", "fl", "flack", "flag", "flail", "flair", "flak", "flake", "flaky", "flam", "flame", "flank", "flap", "flare", "flash", "flask", "flat", "flatus", "flaw", "flax", "flea", "fleck", "fled", "flee", "fleet", "flesh", "flew", "flex", "flick", "flier", "flinch", "fling", "flint", "flip", "flirt", "flit", "flo", "float", "floc", "flock", "floe", "flog", "flood", "floor", "flop", "floppy", "flora", "flour", "flout", "flow", "flown", "floyd", "flu", "flub", "flue", "fluff", "fluid", "fluke", "flung", "flush", "flute", "flux", "fly", "flyer", "flynn", "fm", "fmc", "fn", "fo", "foal", "foam", "foamy", "fob", "focal", "foci", "focus", "fodder", "foe", "fog", "foggy", "fogy", "foil", "foist", "fold", "foley", "folio", "folk", "folly", "fond", "font", "food", "fool", "foot", "foote", "fop", "for", "foray", "force", "ford", "fore", "forge", "forgot", "fork", "form", "fort", "forte", "forth", "forty", "forum", "foss", "fossil", "foul", "found", "fount", "four", "fovea", "fowl", "fox", "foxy", "foyer", "fp", "fpc", "fq", "fr", "frail", "frame", "fran", "franc", "franca", "frank", "franz", "frau", "fraud", "fray", "freak", "fred", "free", "freed", "freer", "frenzy", "freon", "fresh", "fret", "freud", "frey", "freya", "friar", "frick", "fried", "frill", "frilly", "frisky", "fritz", "fro", "frock", "frog", "from", "front", "frost", "froth", "frown", "froze", "fruit", "fry", "frye", "fs", "ft", "ftc", "fu", "fuchs", "fudge", "fuel", "fugal", "fugue", "fuji", "full", "fully", "fum", "fume", "fun", "fund", "fungal", "fungi", "funk", "funny", "fur", "furl", "furry", "fury", "furze", "fuse", "fuss", "fussy", "fusty", "fuzz", "fuzzy", "fv", "fw", "fx", "fy", "fz", "g", "g's", "ga", "gab", "gable", "gabon", "gad", "gadget", "gaff", "gaffe", "gag", "gage", "gail", "gain", "gait", "gal", "gala", "galaxy", "gale", "galen", "gall", "gallop", "galt", "gam", "game", "gamin", "gamma", "gamut", "gander", "gang", "gao", "gap", "gape", "gar", "garb", "garish", "garner", "garry", "garth", "gary", "gas", "gash", "gasp", "gassy", "gate", "gates", "gator", "gauche", "gaudy", "gauge", "gaul", "gaunt", "gaur", "gauss", "gauze", "gave", "gavel", "gavin", "gawk", "gawky", "gay", "gaze", "gb", "gc", "gd", "ge", "gear", "gecko", "gee", "geese", "geigy", "gel", "geld", "gem", "gemma", "gene", "genie", "genii", "genoa", "genre", "gent", "gentry", "genus", "gerbil", "germ", "gerry", "get", "getty", "gf", "gg", "ggg", "gggg", "gh", "ghana", "ghent", "ghetto", "ghi", "ghost", "ghoul", "gi", "giant", "gibbs", "gibby", "gibe", "giddy", "gift", "gig", "gil", "gila", "gild", "giles", "gill", "gilt", "gimbal", "gimpy", "gin", "gina", "ginn", "gino", "gird", "girl", "girth", "gist", "give", "given", "gj", "gk", "gl", "glad", "gladdy", "glade", "glamor", "gland", "glans", "glare", "glass", "glaze", "gleam", "glean", "glee", "glen", "glenn", "glib", "glide", "glint", "gloat", "glob", "globe", "glom", "gloom", "glory", "gloss", "glove", "glow", "glue", "glued", "gluey", "gluing", "glum", "glut", "glyph", "gm", "gmt", "gn", "gnarl", "gnash", "gnat", "gnaw", "gnome", "gnp", "gnu", "go", "goa", "goad", "goal", "goat", "gob", "goer", "goes", "goff", "gog", "goggle", "gogh", "gogo", "gold", "golf", "golly", "gone", "gong", "goo", "good", "goode", "goody", "goof", "goofy", "goose", "gop", "gordon", "gore", "goren", "gorge", "gorky", "gorse", "gory", "gosh", "gospel", "got", "gouda", "gouge", "gould", "gourd", "gout", "gown", "gp", "gpo", "gq", "gr", "grab", "grace", "grad", "grade", "grady", "graff", "graft", "grail", "grain", "grand", "grant", "grape", "graph", "grasp", "grass", "grata", "grate", "grater", "grave", "gravy", "gray", "graze", "great", "grebe", "greed", "greedy", "greek", "green", "greer", "greet", "greg", "gregg", "greta", "grew", "grey", "grid", "grief", "grieve", "grill", "grim", "grime", "grimm", "grin", "grind", "grip", "gripe", "grist", "grit", "groan", "groat", "groin", "groom", "grope", "gross", "groton", "group", "grout", "grove", "grow", "growl", "grown", "grub", "gruff", "grunt", "gs", "gsa", "gt", "gu", "guam", "guano", "guard", "guess", "guest", "guide", "guild", "guile", "guilt", "guise", "guitar", "gules", "gulf", "gull", "gully", "gulp", "gum", "gumbo", "gummy", "gun", "gunk", "gunky", "gunny", "gurgle", "guru", "gus", "gush", "gust", "gusto", "gusty", "gut", "gutsy", "guy", "guyana", "gv", "gw", "gwen", "gwyn", "gx", "gy", "gym", "gyp", "gypsy", "gyro", "gz", "h", "h's", "ha", "haag", "haas", "habib", "habit", "hack", "had", "hades", "hadron", "hagen", "hager", "hague", "hahn", "haifa", "haiku", "hail", "hair", "hairy", "haiti", "hal", "hale", "haley", "half", "hall", "halma", "halo", "halt", "halvah", "halve", "ham", "hamal", "hamlin", "han", "hand", "handy", "haney", "hang", "hank", "hanna", "hanoi", "hans", "hansel", "hap", "happy", "hard", "hardy", "hare", "harem", "hark", "harley", "harm", "harp", "harpy", "harry", "harsh", "hart", "harvey", "hash", "hasp", "hast", "haste", "hasty", "hat", "hatch", "hate", "hater", "hath", "hatred", "haul", "haunt", "have", "haven", "havoc", "haw", "hawk", "hay", "haydn", "hayes", "hays", "hazard", "haze", "hazel", "hazy", "hb", "hc", "hd", "he", "he'd", "he'll", "head", "heady", "heal", "healy", "heap", "hear", "heard", "heart", "heat", "heath", "heave", "heavy", "hebe", "hebrew", "heck", "heckle", "hedge", "heed", "heel", "heft", "hefty", "heigh", "heine", "heinz", "heir", "held", "helen", "helga", "helix", "hell", "hello", "helm", "helmut", "help", "hem", "hemp", "hen", "hence", "henri", "henry", "her", "hera", "herb", "herd", "here", "hero", "heroic", "heron", "herr", "hertz", "hess", "hesse", "hettie", "hetty", "hew", "hewitt", "hewn", "hex", "hey", "hf", "hg", "hh", "hhh", "hhhh", "hi", "hiatt", "hick", "hicks", "hid", "hide", "high", "hij", "hike", "hill", "hilly", "hilt", "hilum", "him", "hind", "hindu", "hines", "hinge", "hint", "hip", "hippo", "hippy", "hiram", "hire", "hirsch", "his", "hiss", "hit", "hitch", "hive", "hj", "hk", "hl", "hm", "hn", "ho", "hoagy", "hoar", "hoard", "hob", "hobbs", "hobby", "hobo", "hoc", "hock", "hodge", "hodges", "hoe", "hoff", "hog", "hogan", "hoi", "hokan", "hold", "holdup", "hole", "holly", "holm", "holst", "holt", "home", "homo", "honda", "hondo", "hone", "honey", "hong", "honk", "hooch", "hood", "hoof", "hook", "hookup", "hoop", "hoot", "hop", "hope", "horde", "horn", "horny", "horse", "horus", "hose", "host", "hot", "hotbox", "hotel", "hough", "hound", "hour", "house", "hove", "hovel", "hover", "how", "howdy", "howe", "howl", "hoy", "hoyt", "hp", "hq", "hr", "hs", "ht", "hu", "hub", "hubbub", "hubby", "huber", "huck", "hue", "hued", "huff", "hug", "huge", "hugh", "hughes", "hugo", "huh", "hulk", "hull", "hum", "human", "humid", "hump", "humus", "hun", "hunch", "hung", "hunk", "hunt", "hurd", "hurl", "huron", "hurrah", "hurry", "hurst", "hurt", "hurty", "hush", "husky", "hut", "hutch", "hv", "hw", "hx", "hy", "hyde", "hydra", "hydro", "hyena", "hying", "hyman", "hymen", "hymn", "hymnal", "hz", "i", "i'd", "i'll", "i'm", "i's", "i've", "ia", "iambic", "ian", "ib", "ibex", "ibid", "ibis", "ibm", "ibn", "ic", "icc", "ice", "icing", "icky", "icon", "icy", "id", "ida", "idaho", "idea", "ideal", "idiom", "idiot", "idle", "idol", "idyll", "ie", "ieee", "if", "iffy", "ifni", "ig", "igloo", "igor", "ih", "ii", "iii", "iiii", "ij", "ijk", "ik", "ike", "il", "ileum", "iliac", "iliad", "ill", "illume", "ilona", "im", "image", "imbue", "imp", "impel", "import", "impute", "in", "inane", "inapt", "inc", "inca", "incest", "inch", "incur", "index", "india", "indies", "indy", "inept", "inert", "infect", "infer", "infima", "infix", "infra", "ingot", "inhere", "injun", "ink", "inlay", "inlet", "inman", "inn", "inner", "input", "insect", "inset", "insult", "intend", "inter", "into", "inure", "invoke", "io", "ion", "ionic", "iota", "iowa", "ip", "ipso", "iq", "ir", "ira", "iran", "iraq", "irate", "ire", "irene", "iris", "irish", "irk", "irma", "iron", "irony", "irs", "irvin", "irwin", "is", "isaac", "isabel", "ising", "isis", "islam", "island", "isle", "isn't", "israel", "issue", "it", "it&t", "it'd", "it'll", "italy", "itch", "item", "ito", "itt", "iu", "iv", "ivan", "ive", "ivory", "ivy", "iw", "ix", "iy", "iz", "j", "j's", "ja", "jab", "jack", "jacky", "jacm", "jacob", "jacobi", "jade", "jag", "jail", "jaime", "jake", "jam", "james", "jan", "jane", "janet", "janos", "janus", "japan", "jar", "jason", "java", "jaw", "jay", "jazz", "jazzy", "jb", "jc", "jd", "je", "jean", "jed", "jeep", "jeff", "jejune", "jelly", "jenny", "jeres", "jerk", "jerky", "jerry", "jersey", "jess", "jesse", "jest", "jesus", "jet", "jew", "jewel", "jewett", "jewish", "jf", "jg", "jh", "ji", "jibe", "jiffy", "jig", "jill", "jilt", "jim", "jimmy", "jinx", "jive", "jj", "jjj", "jjjj", "jk", "jkl", "jl", "jm", "jn", "jo", "joan", "job", "jock", "jockey", "joe", "joel", "joey", "jog", "john", "johns", "join", "joint", "joke", "jolla", "jolly", "jolt", "jon", "jonas", "jones", "jorge", "jose", "josef", "joshua", "joss", "jostle", "jot", "joule", "joust", "jove", "jowl", "jowly", "joy", "joyce", "jp", "jq", "jr", "js", "jt", "ju", "juan", "judas", "judd", "jude", "judge", "judo", "judy", "jug", "juggle", "juice", "juicy", "juju", "juke", "jukes", "julep", "jules", "julia", "julie", "julio", "july", "jumbo", "jump", "jumpy", "junco", "june", "junk", "junky", "juno", "junta", "jura", "jure", "juror", "jury", "just", "jut", "jute", "jv", "jw", "jx", "jy", "jz", "k", "k's", "ka", "kabul", "kafka", "kahn", "kajar", "kale", "kalmia", "kane", "kant", "kapok", "kappa", "karate", "karen", "karl", "karma", "karol", "karp", "kate", "kathy", "katie", "katz", "kava", "kay", "kayo", "kazoo", "kb", "kc", "kd", "ke", "keats", "keel", "keen", "keep", "keg", "keith", "keller", "kelly", "kelp", "kemp", "ken", "keno", "kent", "kenya", "kepler", "kept", "kern", "kerr", "kerry", "ketch", "kevin", "key", "keyed", "keyes", "keys", "kf", "kg", "kh", "khaki", "khan", "khmer", "ki", "kick", "kid", "kidde", "kidney", "kiev", "kigali", "kill", "kim", "kin", "kind", "king", "kink", "kinky", "kiosk", "kiowa", "kirby", "kirk", "kirov", "kiss", "kit", "kite", "kitty", "kiva", "kivu", "kiwi", "kj", "kk", "kkk", "kkkk", "kl", "klan", "klaus", "klein", "kline", "klm", "klux", "km", "kn", "knack", "knapp", "knauer", "knead", "knee", "kneel", "knelt", "knew", "knick", "knife", "knit", "knob", "knock", "knoll", "knot", "knott", "know", "known", "knox", "knurl", "ko", "koala", "koch", "kodak", "kola", "kombu", "kong", "koran", "korea", "kp", "kq", "kr", "kraft", "krause", "kraut", "krebs", "kruse", "ks", "kt", "ku", "kudo", "kudzu", "kuhn", "kulak", "kurd", "kurt", "kv", "kw", "kx", "ky", "kyle", "kyoto", "kz", "l", "l's", "la", "lab", "laban", "label", "labia", "labile", "lac", "lace", "lack", "lacy", "lad", "laden", "ladle", "lady", "lag", "lager", "lagoon", "lagos", "laid", "lain", "lair", "laity", "lake", "lam", "lamar", "lamb", "lame", "lamp", "lana", "lance", "land", "lane", "lang", "lange", "lanka", "lanky", "lao", "laos", "lap", "lapel", "lapse", "larch", "lard", "lares", "large", "lark", "larkin", "larry", "lars", "larva", "lase", "lash", "lass", "lasso", "last", "latch", "late", "later", "latest", "latex", "lath", "lathe", "latin", "latus", "laud", "laue", "laugh", "launch", "laura", "lava", "law", "lawn", "lawson", "lax", "lay", "layup", "laze", "lazy", "lb", "lc", "ld", "le", "lea", "leach", "lead", "leaf", "leafy", "leak", "leaky", "lean", "leap", "leapt", "lear", "learn", "lease", "leash", "least", "leave", "led", "ledge", "lee", "leech", "leeds", "leek", "leer", "leery", "leeway", "left", "lefty", "leg", "legal", "leggy", "legion", "leigh", "leila", "leland", "lemma", "lemon", "len", "lena", "lend", "lenin", "lenny", "lens", "lent", "leo", "leon", "leona", "leone", "leper", "leroy", "less", "lessee", "lest", "let", "lethe", "lev", "levee", "level", "lever", "levi", "levin", "levis", "levy", "lew", "lewd", "lewis", "leyden", "lf", "lg", "lh", "li", "liar", "libel", "libido", "libya", "lice", "lick", "lid", "lie", "lied", "lien", "lieu", "life", "lifo", "lift", "light", "like", "liken", "lila", "lilac", "lilly", "lilt", "lily", "lima", "limb", "limbo", "lime", "limit", "limp", "lin", "lind", "linda", "linden", "line", "linen", "lingo", "link", "lint", "linus", "lion", "lip", "lipid", "lisa", "lise", "lisle", "lisp", "list", "listen", "lit", "lithe", "litton", "live", "liven", "livid", "livre", "liz", "lizzie", "lj", "lk", "ll", "lll", "llll", "lloyd", "lm", "lmn", "ln", "lo", "load", "loaf", "loam", "loamy", "loan", "loath", "lob", "lobar", "lobby", "lobe", "lobo", "local", "loci", "lock", "locke", "locus", "lodge", "loeb", "loess", "loft", "lofty", "log", "logan", "loge", "logic", "loin", "loire", "lois", "loiter", "loki", "lola", "loll", "lolly", "lomb", "lome", "lone", "long", "look", "loom", "loon", "loop", "loose", "loot", "lop", "lope", "lopez", "lord", "lore", "loren", "los", "lose", "loss", "lossy", "lost", "lot", "lotte", "lotus", "lou", "loud", "louis", "louise", "louse", "lousy", "louver", "love", "low", "lowe", "lower", "lowry", "loy", "loyal", "lp", "lq", "lr", "ls", "lsi", "lt", "ltv", "lu", "lucas", "lucia", "lucid", "luck", "lucky", "lucre", "lucy", "lug", "luge", "luger", "luis", "luke", "lull", "lulu", "lumbar", "lumen", "lump", "lumpy", "lunar", "lunch", "lund", "lung", "lunge", "lura", "lurch", "lure", "lurid", "lurk", "lush", "lust", "lusty", "lute", "lutz", "lux", "luxe", "luzon", "lv", "lw", "lx", "ly", "lydia", "lye", "lying", "lykes", "lyle", "lyman", "lymph", "lynch", "lynn", "lynx", "lyon", "lyons", "lyra", "lyric", "lz", "m", "m&m", "m's", "ma", "mabel", "mac", "mace", "mach", "macho", "mack", "mackey", "macon", "macro", "mad", "madam", "made", "madman", "madsen", "mae", "magi", "magic", "magma", "magna", "magog", "maid", "maier", "mail", "maim", "main", "maine", "major", "make", "malady", "malay", "male", "mali", "mall", "malt", "malta", "mambo", "mamma", "mammal", "man", "mana", "manama", "mane", "mange", "mania", "manic", "mann", "manna", "manor", "mans", "manse", "mantle", "many", "mao", "maori", "map", "maple", "mar", "marc", "march", "marco", "marcy", "mardi", "mare", "margo", "maria", "marie", "marin", "marine", "mario", "mark", "marks", "marlin", "marrow", "marry", "mars", "marsh", "mart", "marty", "marx", "mary", "maser", "mash", "mask", "mason", "masque", "mass", "mast", "mat", "match", "mate", "mateo", "mater", "math", "matte", "maul", "mauve", "mavis", "maw", "mawr", "max", "maxim", "maxima", "may", "maya", "maybe", "mayer", "mayhem", "mayo", "mayor", "mayst", "mazda", "maze", "mb", "mba", "mc", "mccoy", "mcgee", "mckay", "mckee", "mcleod", "md", "me", "mead", "meal", "mealy", "mean", "meant", "meat", "meaty", "mecca", "mecum", "medal", "medea", "media", "medic", "medley", "meek", "meet", "meg", "mega", "meier", "meir", "mel", "meld", "melee", "mellow", "melon", "melt", "memo", "memoir", "men", "mend", "menlo", "menu", "merck", "mercy", "mere", "merge", "merit", "merle", "merry", "mesa", "mescal", "mesh", "meson", "mess", "messy", "met", "metal", "mete", "meter", "metro", "mew", "meyer", "meyers", "mezzo", "mf", "mg", "mh", "mi", "miami", "mica", "mice", "mickey", "micky", "micro", "mid", "midas", "midge", "midst", "mien", "miff", "mig", "might", "mike", "mila", "milan", "milch", "mild", "mildew", "mile", "miles", "milk", "milky", "mill", "mills", "milt", "mimi", "mimic", "mince", "mind", "mine", "mini", "minim", "mink", "minnow", "minor", "minos", "minot", "minsk", "mint", "minus", "mira", "mirage", "mire", "mirth", "miser", "misery", "miss", "missy", "mist", "misty", "mit", "mite", "mitre", "mitt", "mix", "mixup", "mizar", "mj", "mk", "ml", "mm", "mmm", "mmmm", "mn", "mno", "mo", "moan", "moat", "mob", "mobil", "mock", "modal", "mode", "model", "modem", "modish", "moe", "moen", "mohr", "moire", "moist", "molal", "molar", "mold", "mole", "moll", "mollie", "molly", "molt", "molten", "mommy", "mona", "monad", "mondo", "monel", "money", "monic", "monk", "mont", "monte", "month", "monty", "moo", "mood", "moody", "moon", "moor", "moore", "moose", "moot", "mop", "moral", "morale", "moran", "more", "morel", "morn", "moron", "morse", "morsel", "mort", "mosaic", "moser", "moses", "moss", "mossy", "most", "mot", "motel", "motet", "moth", "mother", "motif", "motor", "motto", "mould", "mound", "mount", "mourn", "mouse", "mousy", "mouth", "move", "movie", "mow", "moyer", "mp", "mph", "mq", "mr", "mrs", "ms", "mt", "mu", "much", "muck", "mucus", "mud", "mudd", "muddy", "muff", "muffin", "mug", "muggy", "mugho", "muir", "mulch", "mulct", "mule", "mull", "multi", "mum", "mummy", "munch", "mung", "munson", "muon", "muong", "mural", "muriel", "murk", "murky", "murre", "muse", "mush", "mushy", "music", "musk", "muslim", "must", "musty", "mute", "mutt", "muzak", "muzo", "mv", "mw", "mx", "my", "myel", "myers", "mylar", "mynah", "myopia", "myra", "myron", "myrrh", "myself", "myth", "mz", "n", "n's", "na", "naacp", "nab", "nadir", "nag", "nagoya", "nagy", "naiad", "nail", "nair", "naive", "naked", "name", "nan", "nancy", "naomi", "nap", "nary", "nasa", "nasal", "nash", "nasty", "nat", "natal", "nate", "nato", "natty", "nature", "naval", "nave", "navel", "navy", "nay", "nazi", "nb", "nbc", "nbs", "nc", "ncaa", "ncr", "nd", "ne", "neal", "near", "neat", "neath", "neck", "ned", "nee", "need", "needy", "neff", "negate", "negro", "nehru", "neil", "nell", "nelsen", "neon", "nepal", "nero", "nerve", "ness", "nest", "net", "neuron", "neva", "neve", "new", "newel", "newt", "next", "nf", "ng", "nh", "ni", "nib", "nibs", "nice", "nicety", "niche", "nick", "niece", "niger", "nigh", "night", "nih", "nikko", "nil", "nile", "nimbus", "nimh", "nina", "nine", "ninth", "niobe", "nip", "nit", "nitric", "nitty", "nixon", "nj", "nk", "nl", "nm", "nn", "nnn", "nnnn", "no", "noaa", "noah", "nob", "nobel", "noble", "nod", "nodal", "node", "noel", "noise", "noisy", "nolan", "noll", "nolo", "nomad", "non", "nonce", "none", "nook", "noon", "noose", "nop", "nor", "nora", "norm", "norma", "north", "norway", "nose", "not", "notch", "note", "notre", "noun", "nov", "nova", "novak", "novel", "novo", "now", "np", "nq", "nr", "nrc", "ns", "nsf", "nt", "ntis", "nu", "nuance", "nubia", "nuclei", "nude", "nudge", "null", "numb", "nun", "nurse", "nut", "nv", "nw", "nx", "ny", "nyc", "nylon", "nymph", "nyu", "nz", "o", "o'er", "o's", "oa", "oaf", "oak", "oaken", "oakley", "oar", "oases", "oasis", "oat", "oath", "ob", "obese", "obey", "objet", "oboe", "oc", "occur", "ocean", "oct", "octal", "octave", "octet", "od", "odd", "ode", "odin", "odium", "oe", "of", "off", "offal", "offend", "offer", "oft", "often", "og", "ogden", "ogle", "ogre", "oh", "ohio", "ohm", "ohmic", "oi", "oil", "oily", "oint", "oj", "ok", "okay", "ol", "olaf", "olav", "old", "olden", "oldy", "olga", "olin", "olive", "olsen", "olson", "om", "omaha", "oman", "omega", "omen", "omit", "on", "once", "one", "onion", "only", "onset", "onto", "onus", "onward", "onyx", "oo", "ooo", "oooo", "ooze", "op", "opal", "opec", "opel", "open", "opera", "opium", "opt", "optic", "opus", "oq", "or", "oral", "orate", "orb", "orbit", "orchid", "ordain", "order", "ore", "organ", "orgy", "orin", "orion", "ornery", "orono", "orr", "os", "osaka", "oscar", "osier", "oslo", "ot", "other", "otis", "ott", "otter", "otto", "ou", "ouch", "ought", "ounce", "our", "oust", "out", "ouvre", "ouzel", "ouzo", "ov", "ova", "oval", "ovary", "ovate", "oven", "over", "overt", "ovid", "ow", "owe", "owens", "owing", "owl", "owly", "own", "ox", "oxen", "oxeye", "oxide", "oxnard", "oy", "oz", "ozark", "ozone", "p", "p's", "pa", "pablo", "pabst", "pace", "pack", "packet", "pact", "pad", "paddy", "padre", "paean", "pagan", "page", "paid", "pail", "pain", "paine", "paint", "pair", "pal", "pale", "pall", "palm", "palo", "palsy", "pam", "pampa", "pan", "panama", "panda", "pane", "panel", "pang", "panic", "pansy", "pant", "panty", "paoli", "pap", "papa", "papal", "papaw", "paper", "pappy", "papua", "par", "parch", "pardon", "pare", "pareto", "paris", "park", "parke", "parks", "parr", "parry", "parse", "part", "party", "pascal", "pasha", "paso", "pass", "passe", "past", "paste", "pasty", "pat", "patch", "pate", "pater", "path", "patio", "patsy", "patti", "patton", "patty", "paul", "paula", "pauli", "paulo", "pause", "pave", "paw", "pawn", "pax", "pay", "payday", "payne", "paz", "pb", "pbs", "pc", "pd", "pe", "pea", "peace", "peach", "peak", "peaky", "peal", "peale", "pear", "pearl", "pease", "peat", "pebble", "pecan", "peck", "pecos", "pedal", "pedro", "pee", "peed", "peek", "peel", "peep", "peepy", "peer", "peg", "peggy", "pelt", "pen", "penal", "pence", "pencil", "pend", "penh", "penn", "penna", "penny", "pent", "peony", "pep", "peppy", "pepsi", "per", "perch", "percy", "perez", "peril", "perk", "perky", "perle", "perry", "persia", "pert", "perth", "peru", "peruse", "pest", "peste", "pet", "petal", "pete", "peter", "petit", "petri", "petty", "pew", "pewee", "pf", "pg", "ph", "ph.d", "phage", "phase", "phd", "phenol", "phi", "phil", "phlox", "phon", "phone", "phony", "photo", "phyla", "physic", "pi", "piano", "pica", "pick", "pickup", "picky", "pie", "piece", "pier", "pierce", "piety", "pig", "piggy", "pike", "pile", "pill", "pilot", "pimp", "pin", "pinch", "pine", "ping", "pinion", "pink", "pint", "pinto", "pion", "piotr", "pious", "pip", "pipe", "piper", "pique", "pit", "pitch", "pith", "pithy", "pitney", "pitt", "pity", "pius", "pivot", "pixel", "pixy", "pizza", "pj", "pk", "pl", "place", "plague", "plaid", "plain", "plan", "plane", "plank", "plant", "plasm", "plat", "plate", "plato", "play", "playa", "plaza", "plea", "plead", "pleat", "pledge", "pliny", "plod", "plop", "plot", "plow", "pluck", "plug", "plum", "plumb", "plume", "plump", "plunk", "plus", "plush", "plushy", "pluto", "ply", "pm", "pn", "po", "poach", "pobox", "pod", "podge", "podia", "poe", "poem", "poesy", "poet", "poetry", "pogo", "poi", "point", "poise", "poke", "pol", "polar", "pole", "police", "polio", "polis", "polk", "polka", "poll", "polo", "pomona", "pomp", "ponce", "pond", "pong", "pont", "pony", "pooch", "pooh", "pool", "poole", "poop", "poor", "pop", "pope", "poppy", "porch", "pore", "pork", "porous", "port", "porte", "portia", "porto", "pose", "posey", "posh", "posit", "posse", "post", "posy", "pot", "potts", "pouch", "pound", "pour", "pout", "pow", "powder", "power", "pp", "ppm", "ppp", "pppp", "pq", "pqr", "pr", "prado", "pram", "prank", "pratt", "pray", "preen", "prefix", "prep", "press", "prexy", "prey", "priam", "price", "prick", "pride", "prig", "prim", "prima", "prime", "primp", "prince", "print", "prior", "prism", "prissy", "privy", "prize", "pro", "probe", "prod", "prof", "prom", "prone", "prong", "proof", "prop", "propyl", "prose", "proud", "prove", "prow", "prowl", "proxy", "prune", "pry", "ps", "psalm", "psi", "psych", "pt", "pta", "pu", "pub", "puck", "puddly", "puerto", "puff", "puffy", "pug", "pugh", "puke", "pull", "pulp", "pulse", "puma", "pump", "pun", "punch", "punic", "punish", "punk", "punky", "punt", "puny", "pup", "pupal", "pupil", "puppy", "pure", "purge", "purl", "purr", "purse", "pus", "pusan", "pusey", "push", "pussy", "put", "putt", "putty", "pv", "pvc", "pw", "px", "py", "pygmy", "pyle", "pyre", "pyrex", "pyrite", "pz", "q", "q's", "qa", "qatar", "qb", "qc", "qd", "qe", "qed", "qf", "qg", "qh", "qi", "qj", "qk", "ql", "qm", "qn", "qo", "qp", "qq", "qqq", "qqqq", "qr", "qrs", "qs", "qt", "qu", "qua", "quack", "quad", "quaff", "quail", "quake", "qualm", "quark", "quarry", "quart", "quash", "quasi", "quay", "queasy", "queen", "queer", "quell", "query", "quest", "queue", "quick", "quid", "quiet", "quill", "quilt", "quinn", "quint", "quip", "quirk", "quirt", "quit", "quite", "quito", "quiz", "quo", "quod", "quota", "quote", "qv", "qw", "qx", "qy", "qz", "r", "r&d", "r's", "ra", "rabat", "rabbi", "rabbit", "rabid", "rabin", "race", "rack", "racy", "radar", "radii", "radio", "radium", "radix", "radon", "rae", "rafael", "raft", "rag", "rage", "raid", "rail", "rain", "rainy", "raise", "raj", "rajah", "rake", "rally", "ralph", "ram", "raman", "ramo", "ramp", "ramsey", "ran", "ranch", "rand", "randy", "rang", "range", "rangy", "rank", "rant", "raoul", "rap", "rape", "rapid", "rapt", "rare", "rasa", "rascal", "rash", "rasp", "rat", "rata", "rate", "rater", "ratio", "rattle", "raul", "rave", "ravel", "raven", "raw", "ray", "raze", "razor", "rb", "rc", "rca", "rd", "re", "reach", "read", "ready", "reagan", "real", "realm", "ream", "reap", "rear", "reave", "reb", "rebel", "rebut", "recipe", "reck", "recur", "red", "redeem", "reduce", "reed", "reedy", "reef", "reek", "reel", "reese", "reeve", "refer", "regal", "regina", "regis", "reich", "reid", "reign", "rein", "relax", "relay", "relic", "reman", "remedy", "remit", "remus", "rena", "renal", "rend", "rene", "renown", "rent", "rep", "repel", "repent", "resin", "resort", "rest", "ret", "retch", "return", "reub", "rev", "reveal", "revel", "rever", "revet", "revved", "rex", "rf", "rg", "rh", "rhea", "rheum", "rhine", "rhino", "rho", "rhoda", "rhode", "rhyme", "ri", "rib", "rica", "rice", "rich", "rick", "rico", "rid", "ride", "ridge", "rifle", "rift", "rig", "riga", "rigel", "riggs", "right", "rigid", "riley", "rill", "rilly", "rim", "rime", "rimy", "ring", "rink", "rinse", "rio", "riot", "rip", "ripe", "ripen", "ripley", "rise", "risen", "risk", "risky", "rite", "ritz", "rival", "riven", "river", "rivet", "riyadh", "rj", "rk", "rl", "rm", "rn", "ro", "roach", "road", "roam", "roar", "roast", "rob", "robe", "robin", "robot", "rock", "rocket", "rocky", "rod", "rode", "rodeo", "roe", "roger", "rogue", "roil", "role", "roll", "roman", "rome", "romeo", "romp", "ron", "rondo", "rood", "roof", "rook", "rookie", "rooky", "room", "roomy", "roost", "root", "rope", "rosa", "rose", "rosen", "ross", "rosy", "rot", "rotc", "roth", "rotor", "rouge", "rough", "round", "rouse", "rout", "route", "rove", "row", "rowdy", "rowe", "roy", "royal", "royce", "rp", "rpm", "rq", "rr", "rrr", "rrrr", "rs", "rst", "rsvp", "rt", "ru", "ruanda", "rub", "rube", "ruben", "rubin", "rubric", "ruby", "ruddy", "rude", "rudy", "rue", "rufus", "rug", "ruin", "rule", "rum", "rumen", "rummy", "rump", "rumpus", "run", "rune", "rung", "runge", "runic", "runt", "runty", "rupee", "rural", "ruse", "rush", "rusk", "russ", "russo", "rust", "rusty", "rut", "ruth", "rutty", "rv", "rw", "rx", "ry", "ryan", "ryder", "rye", "rz", "s", "s's", "sa", "sabine", "sable", "sabra", "sac", "sachs", "sack", "sad", "saddle", "sadie", "safari", "safe", "sag", "saga", "sage", "sago", "said", "sail", "saint", "sake", "sal", "salad", "sale", "salem", "saline", "salk", "salle", "sally", "salon", "salt", "salty", "salve", "salvo", "sam", "samba", "same", "sammy", "samoa", "samuel", "san", "sana", "sand", "sandal", "sandy", "sane", "sang", "sank", "sans", "santa", "santo", "sao", "sap", "sappy", "sara", "sarah", "saran", "sari", "sash", "sat", "satan", "satin", "satyr", "sauce", "saucy", "saud", "saudi", "saul", "sault", "saute", "save", "savoy", "savvy", "saw", "sawyer", "sax", "saxon", "say", "sb", "sc", "scab", "scala", "scald", "scale", "scalp", "scam", "scamp", "scan", "scant", "scar", "scare", "scarf", "scary", "scat", "scaup", "scene", "scent", "school", "scion", "scm", "scoff", "scold", "scoop", "scoot", "scope", "scops", "score", "scoria", "scorn", "scot", "scott", "scour", "scout", "scowl", "scram", "scrap", "scrape", "screw", "scrim", "scrub", "scuba", "scud", "scuff", "scull", "scum", "scurry", "sd", "se", "sea", "seal", "seam", "seamy", "sean", "sear", "sears", "season", "seat", "sec", "secant", "sect", "sedan", "seder", "sedge", "see", "seed", "seedy", "seek", "seem", "seen", "seep", "seethe", "seize", "self", "sell", "selma", "semi", "sen", "send", "seneca", "senor", "sense", "sent", "sentry", "seoul", "sepal", "sepia", "sepoy", "sept", "septa", "sequin", "sera", "serf", "serge", "serif", "serum", "serve", "servo", "set", "seth", "seton", "setup", "seven", "sever", "severe", "sew", "sewn", "sex", "sexy", "sf", "sg", "sh", "shack", "shad", "shade", "shady", "shafer", "shaft", "shag", "shah", "shake", "shaken", "shako", "shaky", "shale", "shall", "sham", "shame", "shank", "shape", "shard", "share", "shari", "shark", "sharp", "shave", "shaw", "shawl", "shay", "she", "she'd", "shea", "sheaf", "shear", "sheath", "shed", "sheen", "sheep", "sheer", "sheet", "sheik", "shelf", "shell", "shied", "shift", "shill", "shim", "shin", "shine", "shinto", "shiny", "ship", "shire", "shirk", "shirt", "shish", "shiv", "shoal", "shock", "shod", "shoe", "shoji", "shone", "shoo", "shook", "shoot", "shop", "shore", "short", "shot", "shout", "shove", "show", "shown", "showy", "shrank", "shred", "shrew", "shrike", "shrub", "shrug", "shu", "shuck", "shun", "shunt", "shut", "shy", "si", "sial", "siam", "sian", "sib", "sibley", "sibyl", "sic", "sick", "side", "sidle", "siege", "siena", "sieve", "sift", "sigh", "sight", "sigma", "sign", "signal", "signor", "silas", "silk", "silky", "sill", "silly", "silo", "silt", "silty", "sima", "simon", "simons", "sims", "sin", "sinai", "since", "sine", "sinew", "sing", "singe", "sinh", "sink", "sinus", "sioux", "sip", "sir", "sire", "siren", "sis", "sisal", "sit", "site", "situ", "situs", "siva", "six", "sixgun", "sixth", "sixty", "size", "sj", "sk", "skat", "skate", "skeet", "skew", "ski", "skid", "skied", "skiff", "skill", "skim", "skimp", "skimpy", "skin", "skip", "skirt", "skit", "skulk", "skull", "skunk", "sky", "skye", "sl", "slab", "slack", "slag", "slain", "slake", "slam", "slang", "slant", "slap", "slash", "slat", "slate", "slater", "slav", "slave", "slay", "sled", "sleek", "sleep", "sleet", "slept", "slew", "slice", "slick", "slid", "slide", "slim", "slime", "slimy", "sling", "slip", "slit", "sliver", "sloan", "slob", "sloe", "slog", "sloop", "slop", "slope", "slosh", "slot", "sloth", "slow", "slug", "sluice", "slum", "slump", "slung", "slur", "slurp", "sly", "sm", "smack", "small", "smart", "smash", "smear", "smell", "smelt", "smile", "smirk", "smith", "smithy", "smog", "smoke", "smoky", "smug", "smut", "sn", "snack", "snafu", "snag", "snail", "snake", "snap", "snare", "snark", "snarl", "snatch", "sneak", "sneer", "snell", "snick", "sniff", "snip", "snipe", "snob", "snook", "snoop", "snore", "snort", "snout", "snow", "snowy", "snub", "snuff", "snug", "so", "soak", "soap", "soapy", "soar", "sob", "sober", "social", "sock", "sod", "soda", "sofa", "sofia", "soft", "soften", "soggy", "soil", "sol", "solar", "sold", "sole", "solemn", "solid", "solo", "solon", "solve", "soma", "somal", "some", "son", "sonar", "song", "sonic", "sonny", "sonora", "sony", "soon", "soot", "sooth", "sop", "sora", "sorb", "sore", "sorry", "sort", "sos", "sou", "sough", "soul", "sound", "soup", "sour", "source", "sousa", "south", "sow", "sown", "soy", "soya", "sp", "spa", "space", "spade", "spain", "span", "spar", "spare", "sparge", "spark", "spasm", "spat", "spate", "spawn", "spay", "speak", "spear", "spec", "speck", "sped", "speed", "spell", "spend", "spent", "sperm", "sperry", "spew", "spica", "spice", "spicy", "spike", "spiky", "spill", "spilt", "spin", "spine", "spiny", "spire", "spiro", "spit", "spite", "spitz", "splat", "splay", "spline", "split", "spoil", "spoke", "spoof", "spook", "spooky", "spool", "spoon", "spore", "sport", "spot", "spout", "sprain", "spray", "spree", "sprig", "spruce", "sprue", "spud", "spume", "spun", "spunk", "spur", "spurn", "spurt", "spy", "sq", "squad", "squat", "squaw", "squibb", "squid", "squint", "sr", "sri", "ss", "sss", "ssss", "sst", "st", "st.", "stab", "stack", "stacy", "staff", "stag", "stage", "stagy", "stahl", "staid", "stain", "stair", "stake", "stale", "stalk", "stall", "stamp", "stan", "stance", "stand", "stank", "staph", "star", "stare", "stark", "starr", "start", "stash", "state", "statue", "stave", "stay", "stead", "steak", "steal", "steam", "steed", "steel", "steele", "steen", "steep", "steer", "stein", "stella", "stem", "step", "stern", "steve", "stew", "stick", "stiff", "stile", "still", "stilt", "sting", "stingy", "stink", "stint", "stir", "stock", "stoic", "stoke", "stole", "stomp", "stone", "stony", "stood", "stool", "stoop", "stop", "store", "storey", "stork", "storm", "story", "stout", "stove", "stow", "strafe", "strap", "straw", "stray", "strewn", "strip", "stroll", "strom", "strop", "strum", "strut", "stu", "stuart", "stub", "stuck", "stud", "study", "stuff", "stuffy", "stump", "stun", "stung", "stunk", "stunt", "sturm", "style", "styli", "styx", "su", "suave", "sub", "subtly", "such", "suck", "sud", "sudan", "suds", "sue", "suey", "suez", "sugar", "suit", "suite", "sulfa", "sulk", "sulky", "sully", "sultry", "sum", "sumac", "summon", "sun", "sung", "sunk", "sunny", "sunset", "suny", "sup", "super", "supra", "sure", "surf", "surge", "sus", "susan", "sushi", "susie", "sutton", "sv", "sw", "swab", "swag", "swain", "swam", "swami", "swamp", "swampy", "swan", "swank", "swap", "swarm", "swart", "swat", "swath", "sway", "swear", "sweat", "sweaty", "swede", "sweep", "sweet", "swell", "swelt", "swept", "swift", "swig", "swim", "swine", "swing", "swipe", "swirl", "swish", "swiss", "swoop", "sword", "swore", "sworn", "swum", "swung", "sx", "sy", "sybil", "sykes", "sylow", "sylvan", "synge", "synod", "syria", "syrup", "sz", "t", "t's", "ta", "tab", "table", "taboo", "tabu", "tabula", "tacit", "tack", "tacky", "tacoma", "tact", "tad", "taffy", "taft", "tag", "tahoe", "tail", "taint", "take", "taken", "talc", "tale", "talk", "talky", "tall", "tallow", "tally", "talon", "talus", "tam", "tame", "tamp", "tampa", "tan", "tang", "tango", "tangy", "tanh", "tank", "tansy", "tanya", "tao", "taos", "tap", "tapa", "tape", "taper", "tapir", "tapis", "tappa", "tar", "tara", "tardy", "tariff", "tarry", "tart", "task", "tass", "taste", "tasty", "tat", "tate", "tater", "tattle", "tatty", "tau", "taunt", "taut", "tavern", "tawny", "tax", "taxi", "tb", "tc", "td", "te", "tea", "teach", "teal", "team", "tear", "tease", "teat", "tech", "tecum", "ted", "teddy", "tee", "teem", "teen", "teensy", "teet", "teeth", "telex", "tell", "tempo", "tempt", "ten", "tend", "tenet", "tenney", "tenon", "tenor", "tense", "tensor", "tent", "tenth", "tepee", "tepid", "term", "tern", "terra", "terre", "terry", "terse", "tess", "test", "testy", "tete", "texan", "texas", "text", "tf", "tg", "th", "thai", "than", "thank", "that", "thaw", "the", "thea", "thee", "theft", "their", "them", "theme", "then", "there", "these", "theta", "they", "thick", "thief", "thigh", "thin", "thine", "thing", "think", "third", "this", "thong", "thor", "thorn", "thorny", "those", "thou", "thread", "three", "threw", "throb", "throes", "throw", "thrum", "thud", "thug", "thule", "thumb", "thump", "thus", "thy", "thyme", "ti", "tiber", "tibet", "tibia", "tic", "tick", "ticket", "tid", "tidal", "tidbit", "tide", "tidy", "tie", "tied", "tier", "tift", "tiger", "tight", "til", "tilde", "tile", "till", "tilt", "tilth", "tim", "time", "timex", "timid", "timon", "tin", "tina", "tine", "tinge", "tint", "tiny", "tioga", "tip", "tipoff", "tippy", "tipsy", "tire", "tit", "titan", "tithe", "title", "titus", "tj", "tk", "tl", "tm", "tn", "tnt", "to", "toad", "toady", "toast", "toby", "today", "todd", "toe", "tofu", "tog", "togo", "togs", "toil", "toilet", "token", "tokyo", "told", "toll", "tom", "tomb", "tome", "tommy", "ton", "tonal", "tone", "tong", "toni", "tonic", "tonk", "tonsil", "tony", "too", "took", "tool", "toot", "tooth", "top", "topaz", "topic", "topple", "topsy", "tor", "torah", "torch", "tore", "tori", "torn", "torr", "torso", "tort", "torus", "tory", "toss", "tot", "total", "tote", "totem", "touch", "tough", "tour", "tout", "tow", "towel", "tower", "town", "toxic", "toxin", "toy", "tp", "tq", "tr", "trace", "track", "tract", "tracy", "trade", "trag", "trail", "train", "trait", "tram", "tramp", "trap", "trash", "trawl", "tray", "tread", "treat", "treble", "tree", "trek", "trench", "trend", "tress", "triad", "trial", "tribe", "trick", "tried", "trig", "trill", "trim", "trio", "trip", "tripe", "trite", "triton", "trod", "troll", "troop", "trot", "trout", "troy", "truce", "truck", "trudge", "trudy", "true", "truly", "trump", "trunk", "truss", "trust", "truth", "trw", "try", "ts", "tsar", "tt", "ttl", "ttt", "tttt", "tty", "tu", "tub", "tuba", "tube", "tuck", "tudor", "tuff", "tuft", "tug", "tulane", "tulip", "tulle", "tulsa", "tum", "tun", "tuna", "tune", "tung", "tunic", "tunis", "tunnel", "tuple", "turf", "turin", "turk", "turn", "turvy", "tusk", "tussle", "tutor", "tutu", "tuv", "tv", "tva", "tw", "twa", "twain", "tweak", "tweed", "twice", "twig", "twill", "twin", "twine", "twirl", "twist", "twisty", "twit", "two", "twx", "tx", "ty", "tyburn", "tying", "tyler", "type", "typic", "typo", "tyson", "tz", "u", "u's", "ua", "ub", "uc", "ucla", "ud", "ue", "uf", "ug", "ugh", "ugly", "uh", "ui", "uj", "uk", "ul", "ulan", "ulcer", "ultra", "um", "umber", "umbra", "umpire", "un", "unary", "uncle", "under", "unify", "union", "unit", "unite", "unity", "unix", "until", "uo", "up", "upend", "uphold", "upon", "upper", "uproar", "upset", "uptake", "upton", "uq", "ur", "urban", "urbane", "urea", "urge", "uri", "urine", "uris", "urn", "ursa", "us", "usa", "usaf", "usage", "usc", "usda", "use", "useful", "usgs", "usher", "usia", "usn", "usps", "ussr", "usual", "usurp", "usury", "ut", "utah", "utica", "utile", "utmost", "utter", "uu", "uuu", "uuuu", "uv", "uvw", "uw", "ux", "uy", "uz", "v", "v's", "va", "vacua", "vacuo", "vade", "vaduz", "vague", "vail", "vain", "vale", "valet", "valeur", "valid", "value", "valve", "vamp", "van", "vance", "vane", "vary", "vase", "vast", "vat", "vault", "vb", "vc", "vd", "ve", "veal", "veda", "vee", "veer", "veery", "vega", "veil", "vein", "velar", "veldt", "vella", "vellum", "venal", "vend", "venial", "venom", "vent", "venus", "vera", "verb", "verde", "verdi", "verge", "verity", "verna", "verne", "versa", "verse", "verve", "very", "vessel", "vest", "vet", "vetch", "veto", "vex", "vf", "vg", "vh", "vi", "via", "vial", "vicar", "vice", "vichy", "vicky", "vida", "video", "vie", "viet", "view", "vigil", "vii", "viii", "vile", "villa", "vine", "vinyl", "viola", "violet", "virgil", "virgo", "virus", "vis", "visa", "vise", "visit", "visor", "vista", "vita", "vitae", "vital", "vito", "vitro", "viva", "vivian", "vivid", "vivo", "vixen", "viz", "vj", "vk", "vl", "vm", "vn", "vo", "vocal", "vogel", "vogue", "voice", "void", "volt", "volta", "volvo", "vomit", "von", "voss", "vote", "vouch", "vow", "vowel", "vp", "vq", "vr", "vs", "vt", "vu", "vulcan", "vv", "vvv", "vvvv", "vw", "vx", "vy", "vying", "vz", "w", "w's", "wa", "waals", "wac", "wack", "wacke", "wacky", "waco", "wad", "wade", "wadi", "wafer", "wag", "wage", "waggle", "wah", "wahl", "wail", "waist", "wait", "waite", "waive", "wake", "waken", "waldo", "wale", "walk", "walkie", "wall", "walls", "wally", "walsh", "walt", "walton", "waltz", "wan", "wand", "wane", "wang", "want", "war", "ward", "ware", "warm", "warmth", "warn", "warp", "warren", "wart", "warty", "wary", "was", "wash", "washy", "wasp", "wast", "waste", "watch", "water", "watt", "watts", "wave", "wavy", "wax", "waxen", "waxy", "way", "wayne", "wb", "wc", "wd", "we", "we'd", "we'll", "we're", "we've", "weak", "weal", "wealth", "wean", "wear", "weary", "weave", "web", "webb", "weber", "weco", "wed", "wedge", "wee", "weed", "weedy", "week", "weeks", "weep", "wehr", "wei", "weigh", "weir", "weird", "weiss", "welch", "weld", "well", "wells", "welsh", "welt", "wendy", "went", "wept", "were", "wert", "west", "wet", "wf", "wg", "wh", "whack", "whale", "wham", "wharf", "what", "wheat", "whee", "wheel", "whelk", "whelm", "whelp", "when", "where", "whet", "which", "whiff", "whig", "while", "whim", "whine", "whinny", "whip", "whir", "whirl", "whisk", "whit", "white", "whiz", "who", "who'd", "whoa", "whole", "whom", "whoop", "whoosh", "whop", "whose", "whup", "why", "wi", "wick", "wide", "widen", "widow", "width", "wield", "wier", "wife", "wig", "wild", "wile", "wiley", "wilkes", "will", "willa", "wills", "wilma", "wilt", "wily", "win", "wince", "winch", "wind", "windy", "wine", "wing", "wink", "winnie", "wino", "winter", "winy", "wipe", "wire", "wiry", "wise", "wish", "wishy", "wisp", "wispy", "wit", "witch", "with", "withe", "withy", "witt", "witty", "wive", "wj", "wk", "wl", "wm", "wn", "wo", "woe", "wok", "woke", "wold", "wolf", "wolfe", "wolff", "wolve", "woman", "womb", "women", "won", "won't", "wonder", "wong", "wont", "woo", "wood", "woods", "woody", "wool", "woozy", "word", "wordy", "wore", "work", "world", "worm", "wormy", "worn", "worry", "worse", "worst", "worth", "wotan", "would", "wound", "wove", "woven", "wow", "wp", "wq", "wr", "wrack", "wrap", "wrath", "wreak", "wreck", "wrest", "wring", "wrist", "writ", "write", "writhe", "wrong", "wrote", "wry", "ws", "wt", "wu", "wuhan", "wv", "ww", "www", "wwww", "wx", "wxy", "wy", "wyatt", "wyeth", "wylie", "wyman", "wyner", "wynn", "wz", "x", "x's", "xa", "xb", "xc", "xd", "xe", "xenon", "xerox", "xf", "xg", "xh", "xi", "xj", "xk", "xl", "xm", "xn", "xo", "xp", "xq", "xr", "xs", "xt", "xu", "xv", "xw", "xx", "xxx", "xxxx", "xy", "xylem", "xyz", "xz", "y", "y's", "ya", "yacht", "yah", "yak", "yale", "yalta", "yam", "yamaha", "yang", "yank", "yap", "yaqui", "yard", "yarn", "yates", "yaw", "yawl", "yawn", "yb", "yc", "yd", "ye", "yea", "yeah", "year", "yearn", "yeast", "yeasty", "yeats", "yell", "yelp", "yemen", "yen", "yet", "yf", "yg", "yh", "yi", "yield", "yin", "yip", "yj", "yk", "yl", "ym", "ymca", "yn", "yo", "yodel", "yoder", "yoga", "yogi", "yoke", "yokel", "yolk", "yon", "yond", "yore", "york", "yost", "you", "you'd", "young", "your", "youth", "yow", "yp", "yq", "yr", "ys", "yt", "yu", "yucca", "yuck", "yuh", "yuki", "yukon", "yule", "yv", "yves", "yw", "ywca", "yx", "yy", "yyy", "yyyy", "yz", "z", "z's", "za", "zag", "zaire", "zan", "zap", "zazen", "zb", "zc", "zd", "ze", "zeal", "zealot", "zebra", "zeiss", "zen", "zero", "zest", "zesty", "zeta", "zeus", "zf", "zg", "zh", "zi", "zig", "zilch", "zinc", "zing", "zion", "zip", "zj", "zk", "zl", "zloty", "zm", "zn", "zo", "zoe", "zomba", "zone", "zoo", "zoom", "zorn", "zp", "zq", "zr", "zs", "zt", "zu", "zurich", "zv", "zw", "zx", "zy", "zz", "zzz", "zzzz", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "111", "123", "200", "222", "234", "300", "333", "345", "400", "444", "456", "500", "555", "567", "600", "666", "678", "700", "777", "789", "800", "888", "900", "999", "1000", "1111", "1234", "1492", "1500", "1600", "1700", "1776", "1800", "1812", "1900", "1910", "1920", "1925", "1930", "1935", "1940", "1945", "1950", "1955", "1960", "1965", "1970", "1975", "1980", "1985", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "2000", "2001", "2020", "2222", "2345", "2468", "3000", "3333", "3456", "4000", "4321", "4444", "4567", "5000", "5555", "5678", "6000", "6666", "6789", "7000", "7777", "8000", "8888", "9000", "9876", "9999", "100th", "101st", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "1st", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "2nd", "30th", "31st", "32nd", "33rd", "34th", "35th", "36th", "37th", "38th", "39th", "3rd", "40th", "41st", "42nd", "43rd", "44th", "45th", "46th", "47th", "48th", "49th", "4th", "50th", "51st", "52nd", "53rd", "54th", "55th", "56th", "57th", "58th", "59th", "5th", "60th", "61st", "62nd", "63rd", "65th", "66th", "67th", "68th", "69th", "6th", "70th", "71st", "72nd", "73rd", "74th", "75th", "76th", "77th", "78th", "79th", "7th", "80th", "81st", "82nd", "83rd", "84th", "85th", "86th", "87th", "88th", "89th", "8th", "90th", "91st", "92nd", "93rd", "94th", "95th", "96th", "97th", "98th", "99th", "9th", "!", "!!", '"', "#", "##", "$", "$$", "%", "%%", "&", "(", "()", ")", "*", "**", "+", "-", ":", ";", "=", "?", "??", "@"];
		for(let i = 0;i < parseInt(num); i++){
			result = result.concat(passphraseList[Math.floor(Math.random() * passphraseList.length)]);
		}
		console.log("fygy");
		let passphraseRec = document.getElementById("passphraseRec");
		passphraseRec.innerHTML = result;
		return false;
	}

	document.body.appendChild(recommenderContainer);
	recommenderContainer.appendChild(recommenderForm);
	recommenderForm.appendChild(formTitle);
	recommenderForm.appendChild(radio1);
	recommenderForm.appendChild(radio1Label);
	recommenderForm.appendChild(radio2);
	recommenderForm.appendChild(radio2Label);
	recommenderForm.appendChild(radio3);
	recommenderForm.appendChild(radio3Label);
	radio1Div.appendChild(document.createElement("br"));
	recommenderForm.appendChild(radio1Div);
	radio1Div.appendChild(specialLabel);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(specialInput);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(numberLabel);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(numberInput);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(capitalLabel);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(capitalInput);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(lengthLabel);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(lengthInput);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(regularButton);
	radio1Div.appendChild(document.createElement("br"));
	radio1Div.appendChild(regularRecommendation);

	recommenderForm.appendChild(radio2Div);
	radio2Div.appendChild(sentenceLabel);
	radio2Div.appendChild(document.createElement("br"));
	radio2Div.appendChild(sentenceInput);
	radio2Div.appendChild(document.createElement("br"));
	radio2Div.appendChild(sentenceButton);
	radio2Div.appendChild(document.createElement("br"));
	radio2Div.appendChild(sentenceRecommendation);

	recommenderForm.appendChild(radio3Div);
	radio3Div.appendChild(passphraseLabel);
	radio3Div.appendChild(document.createElement("br"));
	radio3Div.appendChild(passphraseInput);
	radio3Div.appendChild(document.createElement("br"));
	radio3Div.appendChild(passphraseButton);
	radio3Div.appendChild(document.createElement("br"));
	radio3Div.appendChild(passphraseRecommendation);

	recommenderForm.appendChild(radio3Div);
}

//These are functions called when the web browser is loaded or refreshed.
setOnClickSaveCredential();
autoFillCredential();
createRecommender();
//chrome.storage.local.clear();
