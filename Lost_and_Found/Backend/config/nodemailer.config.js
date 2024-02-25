const nodemailer = require("nodemailer");
const moment = require("moment");

const user = process.env.USER;
const pass = process.env.USER_PASS;

// Setup
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

// Sent email to Coordinator for their PASSWORD
module.exports.sendPasswordMail = (userName, password, email, token) => {
  console.log("Inside PasswordMail");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "Your Password",
      html: `<h4>Your are now Coordinator of Lost and Found Helper System of DDU</h4>
            <hr/>
            <h1>Your Name :</h1>
            <h3>${userName}</h3>
            <hr/>
            <h1>Your Email :</h1>
            <h3>${email}</h3>
            <hr/>
            <h1>Your Password :</h1>
            <h3>${password}</h3>
            </div>`,
    })
    .catch((err) => console.log(err));
};

//Send Suspention Email to Coordinator and Student
module.exports.sendDeclineEmail = (email, token) => {
  console.log("Inside decline");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "About account suspendation",
      html: `<h1>You account is removed from Lost and Found helper System</h1>
          <h2>User ${email} is deleted</h2>
          </div>`,
    })
    .catch((err) => console.log(err));
};

// Sent Email to Student that their item is found
module.exports.sendItemFoundEmail = (
  email,
  itemName,
  description,
  location,
  lostDate,
  ListedAt,
  userName,
  department,
  token
) => {
  console.log("Inside decline");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "About Item Found",
      html: `<h2>You ${itemName} is found</h2>
             <h2>You can collect it from : <h2>
             <h2>${userName},${department}<h2>
             <h3>Your Item Details</h3>
             <h5>Item name : ${itemName}<h5>
             <h5>Lost location : ${location}<h5>
             <h5>You Listed at : ${moment(ListedAt).format("DD- MM-YYYY")}<h5>
          </div>`,
    })
    .catch((err) => console.log(err));
};
