import java.util.Scanner;
import java.util.regex.*;

/* This is the main file for the program with the main(). */

class PasswordManager{

	private static String menuValidRegEx = "^[12345]$";
	private static String nonEmptyWildCardRegEx = ".+";
	private static AccountManager ac = new AccountManager("Db/passwordManagerDb.db"); 
	private static EncryptionManager ec;
/*
Utility Function that prompts the user for and returns a valid input.
String prompt is the String message instruction to prompt the user for an input.
If |list| == 0, then it is assumed that all user inputs are valid.
If valid, user input is valid iff the user input matches matches the regEx.
If !valid, user input is valid iff the user input does not match the regEx.
*/
	public static String handleUserInput(String prompt, String regEx, boolean valid){
		Pattern r = Pattern.compile(regEx);
		Matcher m;
		String ret = "";
		boolean validInput = false;
		Scanner in = new Scanner(System.in);
		do {
			System.out.println(prompt);
			ret = in.nextLine();
			m = r.matcher(ret);
		} while(valid != m.find());
		return ret;
	}

/*
Handles Adding Account
*/
	public static void addAccount(){
		String website = handleUserInput("Enter the website for the account", nonEmptyWildCardRegEx, true);
		int unId = Integer.parseInt(handleUserInput("Enter your userID. This must be an integer", "^\\d+$", true));
		String pw = handleUserInput("Enter your password", nonEmptyWildCardRegEx, true);
		ac.addUserData(website, ec.encrypt(pw), unId);
	}

/*
*/
	public static void deleteAccount(){
	}

/*
*/
	public static void updateAccount(){
	}

/*
*/
	public static void viewAllAccount(){
		ac.queryAllUserData();
	}

	public static void main(String args[]){
		boolean endLoop = false;
		while (!endLoop){
			String choice = handleUserInput("\nMenu\n--------------------\n1. Add Account\n2. Delete Account\n3. Update Account\n4. View All Accounts\n5. Quit\n--------------------\n", menuValidRegEx, true);
			switch(choice){
				case "1":
					addAccount();
					break;
				case "2":
					break;
				case "3":
					break;
				case "4":
					viewAllAccount();
					break;
				default: //"5"
					System.out.println("Terminating Program.\n");
					endLoop = true;
			}
		}
	}
}
