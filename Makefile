JC = javac
JFLAGS = -classpath
DB_JAR_PATH = Db/*.jar
EMAIL_JAR_PATH = Email/*.jar

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
