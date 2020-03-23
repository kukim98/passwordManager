import java.util.Scanner;
import java.util.regex.*;

/* This is the main file for the program with the main(). */

class PasswordManager{

	private static String menuValidRegEx = "^[12345]$";
	private static String nonEmptyWildCardRegEx = ".+";
	public static String fourDigitRegex = "\\d{4}";
	public static String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\."+
                "[a-zA-Z0-9_+&*-]+)*@" +
                "(?:[a-zA-Z0-9-]+\\.)+[a-z" +
                "A-Z]{2,7}$";

	private static AccountManager ac = new AccountManager("Db/passwordManagerDb.db"); 
	private static EncryptionManager ec;
	private static EmailVerification ev;

/*
Utility Functions that substitutes the Java print statements with something terser.
*/
	public static void print(Object o){
		System.out.print(o);
	}

	public static void println(Object o){
		System.out.println(o);
	}

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
			println(prompt);
			ret = in.nextLine();
			m = r.matcher(ret);
		} while(valid != m.find());
		return ret;
	}


/*
Handles Adding Account
*/
	public static void addAccount(){
		ec = new EncryptionManager();
		String website = handleUserInput("Enter what password is for.", nonEmptyWildCardRegEx, true);
//		int unId = Integer.parseInt(handleUserInput("Enter your userID. This must be an integer", "^\\d+$", true));
		String pw = handleUserInput("Enter password.", nonEmptyWildCardRegEx, true);
		ac.addUserData(website, ec.decrypt(pw), 1);

		ac.queryAllUserDataEncrypted();
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
		ev.emailVerify();
		ac.queryAllUserData();
	}

	public static void main(String args[]){
		boolean endLoop = false;
		while (!endLoop){
			String choice = handleUserInput("\nMenu\n" + 
																			"--------------------\n" + 
																			"1. Add Account\n" + 
																			"2. Delete Account\n" + 
																			"3. Update Account\n" + 
																			"4. View All Accounts\n" + 
																			"5. Quit\n" + 
																			"--------------------\n", menuValidRegEx, true);
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
				case "5":
					println("Terminating Program.\n");
					endLoop = true;
					break;
				default: //"5"
					println("Invalid Input. Please try again\n");

			}
		}
	}
}
