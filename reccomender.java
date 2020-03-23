import java.util.Random;
public class reccomender {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Random r = new Random();
		for (int i = 0; i<5; i++) { // sample 10-char passwords
			String word = "";
			while (word.length() < 10) {
				int cha = r.nextInt(127);
				while (cha < 32) {
					cha = r.nextInt(127);
				}
				word = word + (char)cha;
			}
			System.out.println(word);
		}
	}

}
