/* This file contains functions that deal with encrypting passwords. */

class EncryptionManager{

/* This method will encrypt the password input and return an encrypted 	version of the password. It will replace characters with ASCII number N with characters with ASCII number (127 - N). Then, the encrypted password is reversed before it is returned. */
	public static String encrypt(String password){
		String encrypted = "";
		for (int i = 0; i < password.length(); i++){
			char letter = password.charAt(i);
			int asciiNum = (int) letter;
			encrypted += (char)(159 - asciiNum);
		}
		return reverse(encrypted);
	}

/* This method will decrypt the encrypted password input and return the original password. It will undo what encrypt() has done. */
	public static String decrypt(String encrypted){
		String password = "";
		encrypted = reverse(encrypted);
		for (int i = 0; i < encrypted.length(); i++){
			char letter = encrypted.charAt(i);
			int asciiNum = (int) letter;
			password += (char)(159 - asciiNum);
		}
		return password;
	}

/* This method will reverse the input String s and return the result. */
	public static String reverse(String s){
		String res = "";
		for (int i = s.length() - 1; i >= 0; i--){
			char letter = s.charAt(i);
			res += letter;			
		}
		return res;
	}

	public static void main(String args[]){
		/* This is just for testing */
		String password = "`1234567890-=~!@#$%^&*()_+|][}{';:/.?>,<poiuytrewqasdfghjklmnbvcxzPOIUYTREWQASDFGHJKLMNBVCXZ";
		String encrypted = encrypt(password);
		String decrypted = decrypt(encrypted);
		System.out.println(encrypted);
		System.out.println(decrypted);
		System.out.println(password.compareTo(decrypted) == 0);
	}
}

