/* This file contains functions that deal with retrieving and storing username and password sets for an account. This file deals with the database. */
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

//following this tutorial: https://www.sqlitetutorial.net/sqlite-java/

class AccountManager{
	
	private String dbLocation = "";
	
	public AccountManager(String dbLocation)
	{
		this.dbLocation = "jdbc:sqlite:" + dbLocation;
	}
	
	private Connection getConnection() {
		// SQLite connection string
		Connection conn = null;
		try {
			conn = DriverManager.getConnection(this.dbLocation);
			System.out.println("Connection successful!");
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
			return conn;
	}
	
	//For testing...
	public void queryAllUsers()
	{
		
	}
	
	//For testing...
	public void queryAllUserData()
	{
		String sql = "SELECT * FROM UserData";
        
        try (Connection conn = getConnection();
             Statement stmt  = conn.createStatement();
             ResultSet rs    = stmt.executeQuery(sql)){
            
            // loop through the result set
            while (rs.next()) {
                System.out.println(rs.getInt("ID") +  "\t" + 
                                   rs.getString("AccountName") + "\t" +
                                   rs.getString("Password") + "\t" +
                                   rs.getString("UserID") );
            }
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
	}
	
	public void addUserData(String AccountName, String Password, int UserID)
	{
		String sql = "INSERT INTO UserData(AccountName,Password,UserID) VALUES(?,?,?)";
		 
        try (Connection conn = getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, AccountName);
            pstmt.setString(2, Password);
            pstmt.setInt(3, UserID);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
	}

	public void updateUserData(String AccountName, String CurrentPassword, String NewPassword)
	{
	String sql = "UPDATE UserData SET Password = ? , "
                + "WHERE  AccountName = ? "
				+ "AND Password = ?";
		 
        try (Connection conn = getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, NewPassword);
			pstmt.setString(2, AccountName);
			pstmt.setString(3, CurrentPassword);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
	}

	public void deleteUserData(String AccountName, String Password)
	{
		String sql = "DELETE FROM UserData WHERE AccountName = ? "
				+ "AND Password = ?";
		 
        try (Connection conn = getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, AccountName);
			pstmt.setString(2, Password);
			pstmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println(e.getMessage());
        }
	}
	
}
