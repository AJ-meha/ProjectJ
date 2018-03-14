var functions = require('firebase-functions');

var emailjs=require('emailjs/email')

exports.sendmailfn=functions.database.ref('/sendmail/{emailkey}/').onWrite(event=>{
    var email=event.data.val().emailid;
    var server 	= emailjs.server.connect({
        user:    "jobsproject2018@gmail.com", 
        password: "Jobsproject2018!@#", 
        host:    "smtp.gmail.com", 
        ssl:     true
     });
     var message	= {
        text:	"i hope this works", 
        from:	"jobsproject2018@gmail.com", 
        to:		email,
        cc:		email,
        subject:	"testing emailjs",
        
     };
     // send the message and get a callback with an error or details of the message that was sent
     server.send(message, function(err, message) { console.log(err || message); });
})