const jwt = require("jsonwebtoken");
const Admin = require("../model/adminModel");

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwtokenAdmin;

    // console.log("Token is from cookie" + token);

    const verify_token = jwt.verify(token, process.env.JWT_SECRET);
    /*     console.log(verify_token._id); */
    root_user = await Admin.findOne({
      _id: verify_token._id,
      token: token,
    });
    req.user = root_user;
    next();
  } catch (error) {
    res.status(401).send("unauthorized....");
    console.log(error);
  }
};

module.exports = { protectAdmin };
