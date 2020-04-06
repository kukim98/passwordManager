package reccomender;
import java.util.Random;
import java.util.Scanner;
public class reccomender {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Random r = new Random();
		Scanner in = new Scanner(System.in);
		System.out.print("Choose password length:");
		int length = in.nextInt();
		while  (length < 1) {
			System.out.print("Password needs to be at least 1, try again:");
			length = in.nextInt();
		}
		boolean goodChar = false;
		int speChar = 0;
		int noCount = 0;
		int lowCount = 0;
		int uppCount = 0;
		System.out.println("Specify desired criteria. Make sure criteria totals to length of password.");
		System.out.print("How many special Characters? (select 0 for none):");
		int speCharin = in.nextInt();
		System.out.print("How many numbers? (select 0 for none):");
		int noCountin = in.nextInt();
		System.out.print("How many lowercase letters:");
		int lowCountin = in.nextInt();
		System.out.print("How many uppercase?:");
		int uppCountin = in.nextInt();
		while (speCharin + noCountin + lowCountin + uppCountin!= length) {
			System.out.println("Specify desired criteria. Make sure criteria totals to length of password.");
			System.out.print("How many special Characters? (select 0 for none):");
			speCharin = in.nextInt();
			System.out.print("How many numbers? (select 0 for none):");
			noCountin = in.nextInt();
			System.out.print("How many lowercase letters:");
			lowCountin = in.nextInt();
			System.out.print("How many uppercase?:");
			uppCountin = in.nextInt();
		}
		for (int i = 0; i<5; i++) { // sample 10-char passwords
			String word = "";
			speChar = speCharin;
			noCount = noCountin;
			lowCount = lowCountin;
			uppCount = uppCountin;
			while (word.length() < length) {
				int cha = r.nextInt(127);
				while (true) {
					while (cha < 32) {
						cha = r.nextInt(127);
					}
					if ((cha >= 32 &&  cha <= 47) || (cha >= 58 &&  cha <= 64) || (cha >= 91 &&  cha <= 96) || (cha >= 123 &&  cha <= 126)) {
						if (speChar > 0) {
							speChar--;
							break;
						}
						else {
							cha = r.nextInt(127);
						}
					}
					if (cha >= 48 &&  cha <= 57) {
						if (noCount > 0) {
							noCount--;
							break;
						}
						else {
							cha = r.nextInt(127);
						}
					}
					if (cha >= 65 &&  cha <= 90) {
						if (lowCount > 0) {
							lowCount--;
							break;
						}
						else {
							cha = r.nextInt(127);
						}
					}
					if (cha >= 97 &&  cha <= 122) {
						if (uppCount > 0) {
							uppCount--;
							break;
						}
						else {
							cha = r.nextInt(127);
						}
					}	
				}
				word = word + (char)cha;
			}
			System.out.println(word);
		}
	}

}
