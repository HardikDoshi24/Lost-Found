const jwt = require("jsonwebtoken");
const Student = require("../model/studentModel");

const protectStudent = async (req, res, next) => {
  try {
    const token = req.cookies.jwtokenStudent;
    // console.log(token);
    const verify_token = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(verify_token); 
    const root_user = await Student.findOne({
      _id: verify_token._id,
      // token: token,
    });

    req.user = verify_token;
    // res.json(verify_token);

    next();
  } catch (error) {
    res.status(401).send("unauthorized....");
    console.log(error);
  }
};

module.exports = { protectStudent };
