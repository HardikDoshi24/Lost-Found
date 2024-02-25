const express = require("express");
const router = express.Router();
const { protectStudent } = require("../middlewares/auth_student");

const {
  deleteStudent,
  getAllUser,
  getStudentInfo,
  getMyListing,
  getMyLitingBySearch,
  logoutStudent,
} = require("../controllers/StudentControllers");

const { getFoundItems } = require("../controllers/itemController");
const { route } = require("./coordinatorRoutes");

router.get("/dashboard", (req, res) => {
  res.json({ message: "Authorized" });
});

router.get("/logout",logoutStudent);

router.post("/delete", deleteStudent);

router.post("/req", getAllUser);

router.get("/getme", protectStudent, getStudentInfo);

router.get("/getMyListing", protectStudent, getMyListing);

router.get("/getMyListingBySearch", protectStudent, getMyLitingBySearch);

router.get("/getFounditems", getFoundItems);

module.exports = router;
