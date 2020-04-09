import java.util.Properties;
import java.util.Random;
import java.util.regex.Pattern;
import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.Session;
import javax.mail.Transport;

class EmailVerification {

    public static String code = "";
    public static PasswordManager pm;

    public static void emailVerify(){
        String email = "";
        email = pm.handleUserInput("Verification: Enter your email to verify your identity. Must be a valid email address.", pm.emailRegex, true);
        sendEmail(email);
        String codeCheck = "";
        codeCheck = pm.handleUserInput("Email sent. Enter your 4 digit code, found in the email. Must be a four digit number. ", pm.fourDigitRegex, true);
        while(!codeVerify(codeCheck)){
            codeCheck = pm.handleUserInput("Code incorrect. Retry: ", pm.fourDigitRegex, true);
        }
        pm.println("Email has been verified!");
    }
    public static Boolean codeVerify(String codeEntered){
        return codeEntered.equals(code);
    }
    public static void sendEmail(String recipient) {

        final String username = "weWillEncryptYou@gmail.com";
        final String password = "isntThisIronic";

        Properties prop = new Properties();
        prop.put("mail.smtp.host", "smtp.gmail.com");
        prop.put("mail.smtp.port", "587");
        prop.put("mail.smtp.auth", "true");
        prop.put("mail.smtp.starttls.enable", "true");

        Session session = Session.getInstance(prop,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("from@gmail.com"));
            message.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(recipient)
            );

            //New verification code

            Random gen = new Random();
            code = String.format("%04d", gen.nextInt(10000));

            //Message details
            message.setSubject("Your verification code for passwordManager");
            message.setText("Dear "+recipient+","
                    + "\n\n Your verification code is: "
                    + "\n\n \b" + code);

            Transport.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About

