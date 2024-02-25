const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Coordinator = require("../model/coordinatorModel");
const Items = require("../model/ItemModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("../config/nodemailer.config");
const dotenv = require("dotenv");
dotenv.config();

// @desc   Authenticate a Coordinator
// @route  Post /api/users/login
// access  Public
const loginCoordinator = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin email
    const user = await Coordinator.findOne({ email });
    if (!user) {
      res.json({ message: "User not found" });
    } else if (user && (await bcrypt.compare(password, user.password))) {
      const token = await user.generateAuthToken();

      // Create jwt in Cookies
      res.cookie("jwtokenCoordinator", token, {
        expires: new Date(Date.now() + 1296000000), // For 15 Days
        httpOnly: true,
      });

      res.status(200).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: token,
        message: "Successfully logged in",
      });
    } else {
      res.json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
  }
});

//------------------------------------------------Register new Coordinator----------------------------------------------------------->

const signupCoordinator = asyncHandler(async (req, res) => {
  try {
    const { userName, email, department, password, conPassword } = req.body;

    //Check empty fields

    if (!userName || !email || !department || !password || !conPassword) {
      res.status(400).json({ message: "Please add all fields" });
      throw new Error("Please add all field");
    }
    // Check if Coordinator exist
    const coordinatorExists = await Coordinator.findOne({ email });

    if (coordinatorExists) {
      res.status(400).json({ message: "User alreay exists" });
      throw new Error("User already exists");
    }

    const forSendPassword = password; // Copy password for sending mail to Coordinator

    // Hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create Coordinator
    const coordinator = await Coordinator.create({
      userName,
      email,
      department,
      password: hashedPassword,
      status: "Active",
    });

    if (coordinator) {
      const token = await coordinator.generateAuthToken();
      console.log(token);

      // Save user
      await coordinator.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });

      // Send email to Coordinator for ther password
      nodemailer.sendPasswordMail(
        coordinator.userName,
        forSendPassword,
        coordinator.email,
        coordinator.token
      );

      res.status(200).json({
        message: "Register successfully",
        _id: coordinator.id,
        firstName: coordinator.userName,
        email: coordinator.email,
        department: coordinator.department,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.log(error);
  }
});

//----------------------------------------->  Logout - Coordinator <----------------------------------------------------------------//

const logoutCoordinator = async (req, res) => {
  try {
    res.clearCookie("jwtokenCoordinator", { path: "/" }); // Clear Cookies (jwt)
    res.status(200).send("user logout");
    console.log("logout finish ");
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  Get Coordinator Info Display in user page <----------------------------------------------------------------//

const getCoordinatorInfo = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.user._id);
    const userName = coordinator.userName;
    res.status(200).json({
      userName,
    });
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  delete Coordinator from admin <----------------------------------------------------------------//

const deleteCoordinator = async (req, res) => {
  try {
    // res.clearCookie("jwtokenCoordinator", { path: "/" });
    const { email } = req.body;

    // Find Coordinator by email
    const coordinator = await Coordinator.findOne({ email });

    if (!coordinator) {
      res.status(400);
      console.log("Coordinator not found to be deleted");
    }
    nodemailer.sendDeclineEmail(coordinator.email, coordinator.token);

    // Remove Coordinator
    await coordinator.remove();

    return res.status(404).json({ message: "Coordinator deleted" });
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  get all-Coordinator (For Display to admin) <----------------------------------------------------------------//

const getAllUser = async (req, res) => {
  try {
    const { status } = req.body;

    const coordinator = await Coordinator.find({ status });
    if (!coordinator) {
      res.json({ message: "No Coordinator" });
    } else {
      res.json({ message: "Coordinator Details", coordinator: coordinator });
    }
  } catch (error) {
    console.log(error);
  }
};

//----------------------------------------->  My-Listing (Only posts that req by Coordinator) <----------------------------------------------------------------//

const getMyListing = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.user._id); // Find Specific loged-in Coordinator

    // Find their own listed items
    const items = await Items.find({
      ItemType: "Found",
      status: "Not claimed",
      listedBy: coordinator.userName,
    });

    if (!items) {
      res.json({ message: "No items !" });
    } else {
      res.status(200).json({
        message: "List Items that List by Requested Coordinator",
        items: items,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> Mt listing by search <----------------------------------------------------------------//

const getMyLitingBySearch = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.user._id); // Find Specific loged-in Coordinator
    const query = req.query.q; // Get query from frontend
    const items = await Items.find({
      ItemType: "Found",
      status: "Not claimed",
      listedBy: coordinator.userName,

      // Search any Word
      $or: [
        { itemName: { $regex: new RegExp(query), $options: "i" } },
        { description: { $regex: new RegExp(query), $options: "i" } },
        { location: { $regex: new RegExp(query), $options: "i" } },
        { foundDate: { $regex: new RegExp(query), $options: "i" } },
        { listedBy: { $regex: new RegExp(query), $options: "i" } },
        { ListedAt: { $regex: new RegExp(query), $options: "i" } },
        { status: { $regex: new RegExp(query), $options: "i" } },
      ],
    });
    if (!items) {
      res.json({ message: "No Items" });
    } else {
      res.status(200).json({ message: "Items Details", items: items });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginCoordinator,
  signupCoordinator,
  logoutCoordinator,
  getCoordinatorInfo,
  deleteCoordinator,
  getAllUser,
  getMyListing,
  getMyLitingBySearch,
};
