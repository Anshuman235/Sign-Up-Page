const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https')

const app = express();

//for using static files
app.use(express.static("public"));

//for using body-bodyParser
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  // console.log(firstName + " " + lastName + " email: " + email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PASSWORD: password
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/959fb11e69";
  const option = {
    method: "POST",
    auth: "anshuman:118ad1bce75639840d0733e67abcc5a4-us6"
  };

  const request = https.request(url, option, function(response) {

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();

});

//for failure button. when we click it, we get redirected to the home page.
app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("We are running at port 3000");
});


//api key
// 118ad1bce75639840d0733e67abcc5a4-us6

//audience id or list id
//it would help mailchimp to identify the list we want to put our subscibers into
// 959fb11e69
