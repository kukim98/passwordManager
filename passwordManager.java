/* This is the main file for the program with the main(). */

class PasswordManager{
	public static void main(String args[]){
		System.out.println("Hello, World");
		
		AccountManager ac = new AccountManager("Db/passwordManagerDb.db"); 

		ac.queryAllUserData();
		
		System.out.println();
		System.out.println("Adding some new data...");
		
		ac.addUserData("Amazon", "Pa$$word123", 1);
		
		ac.queryAllUserData();
		
	}
}
