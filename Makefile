JC = javac
JFLAGS = -cp
DB_JAR_PATH = ./Db/sqlite-jdbc-3.30.1.jar
EMAIL_JAR_PATH = ./Email/javax.mail-1.6.2.jar

.SUFFIXES: .java .class

CLASSES = \
	EncryptionManager.java \
	PasswordManager.java \
	RecommendationManager.java \
	AccountManager.java \
	EmailVerification.java
	
default: classes

classes: 
	$(JC) $(JFLAGS) $(DB_JAR_PATH):$(EMAIL_JAR_PATH) $(CLASSES)

clean:
	$(RM) *.class
