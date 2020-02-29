import java.util.Scanner;

/* This is the main file for the program with the main(). */

class PasswordManager{
	public static void main(String args[]){
		Scanner in = new Scanner(System.in);
		//Get what the password is for
		System.out.println("Enter what password is for: ");
		String username = in.nextLine();
		//if line is blank
		while(username.equals("")){
			System.out.println("Enter what password is for: ");
			username = in.nextLine();
		}

		//Get password
		System.out.println("Enter password: ");
		String password = in.nextLine();
		//if line is blank
		while(password.equals("")){
			System.out.println("Enter password: ");
			password = in.nextLine();
		}

		AccountManager ac = new AccountManager("Db/passwordManagerDb.db"); 

		ac.queryAllUserData();
		
		System.out.println();
		System.out.println("Adding some new data...");
		
		ac.addUserData("Amazon", "Pa$$word123", 1);
		
		ac.queryAllUserData();
		in.close();
	}
	
}
