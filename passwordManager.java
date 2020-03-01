import java.util.Scanner;

/* This is the main file for the program with the main(). */

class PasswordManager{
	public static void main(String args[]){

		String answer = "initial";

		while(!answer.equals("1") && !answer.equals("2")){

			//Menu
			Scanner in = new Scanner(System.in);
			println("What would you like to do?");
			println("1 - Add a password");
			println("2 - View password list");
			answer = in.nextLine();

			if(answer.equals("1")){
				//Add a password

				//Get what the password is for
				println("Enter what password is for: ");
				String username = in.nextLine();
				//if line is blank
				while(username.equals("")){
					println("Enter what password is for: ");
					username = in.nextLine();
				}

				//Get password
				println("Enter password: ");
				String password = in.nextLine();
				//if line is blank
				while(password.equals("")){
					println("Enter password: ");
					password = in.nextLine();
				}

				AccountManager ac = new AccountManager("Db/passwordManagerDb.db");

				ac.queryAllUserData();

				println("");
				println("Adding some new data...");

				ac.addUserData("Amazon", "Pa$$word123", 1);

				ac.queryAllUserData();
				in.close();
			}else if(answer.equals("2")){
				//View Password list

				//Email Verification before they can view passwords.
				println("Verification: Enter your email to verify your identity.");
				String email = in.nextLine();

				//Check to make sure they entered an actual email (this is actually cool)
				while(!emailVerification.isValid(email)){
					println("Please enter a valid email:");
					email = in.nextLine();
				}

				emailVerification.sendEmail(email);
				//If( user has no passwords, need to set up an initial account first time email verification)


			}else{
				println("Error: Incorrect input entered.");
			}
		}
	}

	public static void print(Object o){
		System.out.print(o);
	}
	public static void println(Object o){
		System.out.println(o);
	}
	
}
