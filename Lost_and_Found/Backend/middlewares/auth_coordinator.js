const jwt = require("jsonwebtoken");
const Coordinator = require("../model/coordinatorModel");

const protectCoordinator = async (req, res, next) => {
  try {
    const token = req.cookies.jwtokenCoordinator;

    const verify_token = jwt.verify(token, process.env.JWT_SECRET);
    /*     console.log(verify_token._id); */
    const root_user = await Coordinator.findOne({
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

module.exports = { protectCoordinator };
