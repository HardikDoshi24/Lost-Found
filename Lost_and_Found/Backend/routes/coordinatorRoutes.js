const express = require("express");
const router = express.Router();
// const { check, validationResult } = require("express-validator");
const { protectCoordinator } = require("../middlewares/auth_coordinator");

const {
  loginCoordinator,
  signupCoordinator,
  logoutCoordinator,
  getCoordinatorInfo,
  deleteCoordinator,
  getAllUser,
  getMyListing,
  getMyLitingBySearch,
} = require("../controllers/coordinatorController");

const {
  getFoundItems,
  getLostItems,
  getFoundItemsBySearch,
  getLostItemsBySearch,
} = require("../controllers/itemController");

router.post("/login", loginCoordinator);

router.post("/signup", signupCoordinator);

router.get("/logout", logoutCoordinator);

router.get("/dashboard", protectCoordinator, (req, res) => {
  res.json({ message: "Authorized" });
});

router.get("/getme", protectCoordinator, getCoordinatorInfo);

router.get("/getMyListing", protectCoordinator, getMyListing);

router.get("/getMyListingBySearch", protectCoordinator, getMyLitingBySearch);

router.get("/getFoundItems", getFoundItems);
router.get("/getFoundItemsBySearch", getFoundItemsBySearch);

router.get("/getLostItems", getLostItems);
router.get("/getLostItemsBySearch", getLostItemsBySearch);

router.post("/delete", deleteCoordinator);

router.post("/req", getAllUser);

module.exports = router;
