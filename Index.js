/* Manpreet Sidhu,Jalen, Xavier and saveron*/

const { error } = require("console");
const express = require("express");
const app = express();
const path = require("path");

//listening to port 8000
app.listen(8000, () => {
	console.log("Server is Listening on port 8000");
});

app.use(express.static(path.join(__dirname, "views"), { "extensions": ["html", "htm"] }))
app.use(express.static(path.join(__dirname, "public"), { "extensions": ["css", "js"] }));
app.use(express.static(path.join(__dirname, "Images"), { "extensions": ["jpeg", "jpg", "gif", "png"] }));
app.use(express.urlencoded({ "extensions": true }));
app.set("view engine", "ejs");

// code by Manpreet Sidhu
app.get("/", (request, response) => {
	response.sendFile("index.html");

});


// code by manpreet sidhu to view packages from database according to current date.
const mysql = require("mysql");

function getConnection() {
	var conn = mysql.createConnection({
		host: "localhost",
		user: "manpreet",
		password: "password",
		database: "travelexperts"
	});
	return conn;
}
//array of images to display on VacationPackage Page
	var images = ["Image15", "Image16", "Bali", "japan"];
app.get("/VacationPackage", (request, response) => {
	//create a connection with database
	var myconn = getConnection();
	myconn.connect((error) => {
		if (error) throw error;
		myconn.query("select * from packages WHERE PkgEndDate > CURRENT_TIMESTAMP;", (error, result, fields) => {
			if (error) throw error;
			// send data to the Vacation Package Page
			response.render("VacationPackage", { "result": result, "field": fields ,"images":images});
			for (i = 0; i < result.length; i++) {
				console.log(result[i].PkgName + " | " + result[i].PkgDesc + "|" + result[i].PkgBasePrice);
			}
			//end the database connection
			myconn.end(error, () => {
				if (error) throw error;
				console.log("disconnected from database");
			});


		});
	});
});
// on the submission of email insert booking data into booking Table.
//code by Manpreet Sidhu
app.post("/booking", (request, response) => {
	var email1 = request.body.email1;

	console.log("email"+ email1);
	var myconn = getConnection();
	myconn.connect((error) => {
		if (error) throw error;
		
		var sql = "insert into bookings(BookingDate,CustomerId) select CURRENT_TIMESTAMP,CustomerId from customers WHERE CustEmail = ?"
		myconn.query({ "sql": sql, "values": [email1] }, (error, result, fields) => {
			console.log(result.affectedRows);
			//console.log("Data added");
			
			if (error) throw error;
			
			// if data inserted redirect to the booking result page with confirmation.
			if (result.affectedRows > 0) {
				response.render("BookingResult.ejs", { "message": "Thankyou for the booking." });
			}
			//if booking not confirmed notify customer with a message.
			else {
				response.render("BookingResult.ejs", {"message":"email not found please check the email or register first"});
			}
			// end the database connection
			myconn.end(error, () => {
				if (error) throw error;
				console.log("disconnected from database");
			});


		});
	});
});

// get list of all agents with contact information on Contact Page.
//code created by Manpreet Kaur Sidhu
app.get("/Contact", (request, response) => {

	//create a connection with database
	var myconn = getConnection();
	myconn.connect((error) => {
		if (error) throw error;
		myconn.query("select * from agencies inner join agents where agents.AgencyId=agencies.AgencyId", (error, result, fields) => {
			if (error) throw error;
			// send data to the Vacation Package Page
			response.render("Contact", { "result": result, "field": fields });
			
			//end the database connection
			myconn.end(error, () => {
				if (error) throw error;
				console.log("disconnected from database");
			});


		});
	});
});


//This sends information inputted on the registration page to the Travel Experts database
//Code by Xavier
app.post("/Registration", (request, response) => {
	var fname = request.body.CustFirstName;
	var lname = request.body.CustLastName;
	var address = request.body.CustAddress;
	var city = request.body.CustCity;
	var province = request.body.CustProv;
	var country = request.body.CustCountry;
	var postal = request.body.CustPostal;
	var Email = request.body.CustEmail;
	var homephone = request.body.CustHomePhone;
	var bussinessphone = request.body.CustBusPhone;
	var values = [fname, lname, address, city, province, country, postal, country, homephone, bussinessphone, Email]



	var myConnection = getConnection();
	myConnection.connect((error) => {
		if (error) throw error;

		var sql = "insert into customers(CustomerId,CustFirstName, CustLastName, CustAddress,CustCity, CustProv, CustPostal, CustCountry, CustHomePhone, CustBusPhone, CustEmail) VALUES (0,?,?,?,?,?,?,?,?,?,?)";
		myConnection.query({ "sql": sql, "values": values }, (error, result, fields) => {
		if (error) throw error;
			console.log(result);
			
			if (result.affectedRows > 0) {
				response.sendFile(__dirname + "/views/Register.html");
				console.log("Customer Registered")
				
			}
			else {
				console.log("Registeration Failed");
			}
		myConnection.end(error, () => {
			if (error) throw error;
			console.log("Database disconnected");
		});
	});
});
});