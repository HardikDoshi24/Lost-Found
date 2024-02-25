const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Item = require("../model/ItemModel");
const Coordinator = require("../model/coordinatorModel");
const Student = require("../model/studentModel");
const Department = require("../model/departmentModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");

// For Excel
const xlsx = require("xlsx");
const path = require("path");

// const jsPDF = require("jspdf");
// const autotable = require("jspdf-autotable");
// Date Fns is used to format the dates we receive
// from our API call
// const format = require("date-fns");
const dotenv = require("dotenv");
dotenv.config();

//-------------------------------->Register Admin<------------------------------------------------------------------------------//

// @desc Register new Coordinator
const signupAdmin = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password, conPassword } = req.body;

    //Check empty fields
    if (!firstName || !lastName || !email || !password || !conPassword) {
      res.status(400);
      throw new Error("Please add all field");
    }

    // Check if Coordinator exist
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash the Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin user
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (admin) {
      const token = await admin.generateAuthToken(); // Generater Auth Token
      console.log(token);

      // Save User
      await admin.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        console.log("information of user: ");
      });

      // json response
      res.status(201).json({
        message: "Register successfully",
        _id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (err) {
    console.log(err);
  }
});

//-------------------------------->Login Admin<------------------------------------------------------------------------------//

const loginAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin email
    const user = await Admin.findOne({ email });
    if (!user) {
      res.json({ message: "User not found" });
    } else if (user && (await bcrypt.compare(password, user.password))) {
      const token = await user.generateAuthToken();

      // Make jwt in cookie
      res.cookie("jwtokenAdmin", token, {
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

//-------------------------------->Logout Admin<------------------------------------------------------------------------------//

const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("jwtokenAdmin", { path: "/" }); // learCookies
    res.status(200).send("user logout");
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> get-CountsForDashboard <----------------------------------------------------------------//

const getCounts = async (req, res) => {
  try {
    // Total Lost Items
    const totalLostItems = await Item.countDocuments({
      ItemType: "Lost",
    });

    // Total Found Items
    const totalFoundItems = await Item.countDocuments({
      ItemType: "Found",
    });

    //Total Claimed Items
    const totalClaimedItems = await Item.countDocuments({
      status: "Claimed",
    });

    //Total Lost And Found Items
    const totalLostAndFoundItems = totalFoundItems + totalLostItems;

    //Total Users
    const totalCoordinator = await Coordinator.countDocuments();
    const totalStudent = await Student.countDocuments();
    const totalUsers = totalCoordinator + totalStudent;

    //Current Lost Items
    const totalCurrentLostItems = await Item.countDocuments({
      ItemType: "Lost",
      status: "Not found",
    });

    //Current Founded Items
    const totalCurrentFoundedItems = await Item.countDocuments({
      ItemType: "Found",
      status: "Not claimed",
    });

    //Total Current Lost And Found Items
    const totalCurrentLostandFoundItems =
      totalCurrentFoundedItems + totalCurrentLostItems;

    res.status(200).json({
      totalUsers,
      totalClaimedItems,
      totalLostAndFoundItems,
      totalFoundItems,
      totalLostItems,
      totalCurrentLostandFoundItems,
      totalCurrentFoundedItems,
      totalCurrentLostItems,
    });
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> Add-Department <----------------------------------------------------------------//

const addDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    const ckeckDepartment = await Department.findOne({
      department: department,
    });

    // Check - Department already exists or not And then proceed
    if (ckeckDepartment) {
      res.json({ message: "Department already Exists" });
    } else {
      await Department.create({
        department,
      });
      res.json({ message: `Department added + ${department}` });
    }
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> Delete Department <----------------------------------------------------------------//

const delDept = async (req, res) => {
  try {
    const { department } = req.body;
    const dept = await Department.findOne({ department });
    if (!dept) {
      return res.status(400).json({ message: "Department not found" });
    }
    await dept.remove();

    return res.status(404).json({ message: "Department deleted" });
  } catch (error) {
    console.log(error);
  }
};

//-----------------------------------------> get Department <----------------------------------------------------------------//

const getdept = async (req, res) => {
  try {
    const depts = await Department.find();
    res.json({
      depts: depts,
    });
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------- Get Claimed Items ---------------------------------------------------------------------------------

const getClaimedItems = async (req, res) => {
  try {
    const items = await Item.find({
      status: "Claimed",
    });
    if (!items) {
      res.json({ message: "No Items" });
    } else {
      res.json({ message: "Items Details", items: items });
    }
  } catch (error) {
    console.log(error);
  }
};

// --------------------------------------------------- Get Claimed Items By Search ---------------------------------------------------------------------------------

const getClaimedItemsBySearch = async (req, res) => {
  try {
    const query = req.query.q; // Get query from frontend
    const items = await Item.find({
      status: "Claimed", // only status "CLAIMED"

      // Searching for any word
      $or: [
        { itemName: { $regex: new RegExp(query), $options: "i" } },
        { description: { $regex: new RegExp(query), $options: "i" } },
        { location: { $regex: new RegExp(query), $options: "i" } },
        { foundDate: { $regex: new RegExp(query), $options: "i" } },
        { lostDate: { $regex: new RegExp(query), $options: "i" } },
        { listedBy: { $regex: new RegExp(query), $options: "i" } },
        { ListedAt: { $regex: new RegExp(query), $options: "i" } },
        { ItemType: { $regex: new RegExp(query), $options: "i" } },
        { claimedAt: { $regex: new RegExp(query), $options: "i" } },
      ],
    });
    if (!items) {
      res.json({ message: "No Items" });
    } else {
      res.json({ message: "Items Details", items: items });
    }
  } catch (error) {
    console.log(error);
  }
};

// -------------------------------------------------------- GetItemsByFilter In Summary -------------------------------------------------------------------------

const getItemsByFilter = async (req, res) => {
  try {
    const { filter, duration, startDate, endDate } = req.body;

    // --------------------------------------------------- Lost Items ---------------------------------------------------------------------------------

    if (filter === "Lost Items") {
      // All time
      if (duration === "All Time") {
        const items = await Item.find(
          {
            ItemType: "Lost",
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        res.status(200).json({
          items: items,
        });
      }

      // Last week
      if (duration === "Last Week") {
        const startOfLastWeek = moment()
          .subtract(1, "weeks")
          .startOf("week")
          .format("YYYY-MM-DD");
        const endOfLastWeek = moment()
          .subtract(1, "weeks")
          .endOf("week")
          .format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Lost",
            ListedAt: {
              $gte: startOfLastWeek,
              $lte: endOfLastWeek,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        res.status(200).json({
          items: items,
        });
      }

      // This week
      if (duration === "This Week") {
        const startOfThisWeek = moment().startOf("week").format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Lost",
            ListedAt: {
              $gte: startOfThisWeek,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }

      // This month
      if (duration === "This Month") {
        const startOfThisMonth = moment().startOf("month").format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Lost",
            ListedAt: {
              $gte: startOfThisMonth,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        res.status(200).json({
          items: items,
        });
      }

      // Last month
      if (duration === "Last Month") {
        const currentDate = moment();
        const startOfLast30Days = moment(currentDate)
          .subtract(30, "days")
          .format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Lost",
            ListedAt: {
              $gte: startOfLast30Days,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        res.status(200).json({
          items: items,
        });
      }

      // Last 6 month
      if (duration === "Last 6 Month") {
        const currentDate = moment();
        const startOfLast180Days = moment(currentDate)
          .subtract(180, "days")
          .format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Lost",
            ListedAt: {
              $gte: startOfLast180Days,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        res.status(200).json({
          items: items,
        });
      }

      // This year
      if (duration === "This Year") {
        const currentYear = moment().year();
        const startOfCurrentYear = moment(`${currentYear}-01-01`).format(
          "YYYY-MM-DD"
        );
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Lost",
            ListedAt: {
              $gte: startOfCurrentYear,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        res.status(200).json({
          items: items,
        });
      }

      // Last year
      if (duration === "Last Year") {
        const currentYear = moment().year();
        const startOfLastYear = moment(`${currentYear - 1}-01-01`).format(
          "YYYY-MM-DD"
        );
        const endOfLastYear = moment(`${currentYear - 1}-12-31`).format(
          "YYYY-MM-DD"
        );

        const items = await Item.find(
          {
            ItemType: "Lost",
            ListedAt: {
              $gte: startOfLastYear,
              $lte: endOfLastYear,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        res.status(200).json({
          items: items,
        });
      }

      // Manually
      if (duration === "Manually") {
        var sd = moment(startDate).format("YYYY-MM-DD");
        var ed = moment(endDate).format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Lost",
            ListedAt: {
              $gte: sd,
              $lte: ed,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-foundDate");

        res.status(200).json({
          items: items,
        });
      }
    }

    // --------------------------------------------------- Found Items ---------------------------------------------------------------------------------

    if (filter === "Found Items") {
      // All time
      if (duration === "All Time") {
        const items = await Item.find(
          {
            ItemType: "Found",
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        console.log(items);

        res.status(200).json({
          items: items,
        });
      }

      // Last week
      if (duration === "Last Week") {
        const startOfLastWeek = moment()
          .subtract(1, "weeks")
          .startOf("week")
          .format("YYYY-MM-DD");
        const endOfLastWeek = moment()
          .subtract(1, "weeks")
          .endOf("week")
          .format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Found",
            ListedAt: {
              $gte: startOfLastWeek,
              $lte: endOfLastWeek,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        res.status(200).json({
          items: items,
        });
      }

      // This week
      if (duration === "This Week") {
        const startOfThisWeek = moment().startOf("week").format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Found",
            ListedAt: {
              $gte: startOfThisWeek,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        res.status(200).json({
          items: items,
        });
      }

      // This Month
      if (duration === "This Month") {
        const startOfThisMonth = moment().startOf("month").format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Found",
            ListedAt: {
              $gte: startOfThisMonth,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        res.status(200).json({
          items: items,
        });
      }

      // Last Month
      if (duration === "Last Month") {
        const currentDate = moment();
        const startOfLast30Days = moment(currentDate)
          .subtract(30, "days")
          .format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Found",
            ListedAt: {
              $gte: startOfLast30Days,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        res.status(200).json({
          items: items,
        });
      }

      // Last 6 month
      if (duration === "Last 6 Month") {
        const currentDate = moment();
        const startOfLast180Days = moment(currentDate)
          .subtract(180, "days")
          .format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Found",
            ListedAt: {
              $gte: startOfLast180Days,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        res.status(200).json({
          items: items,
        });
      }

      // This year
      if (duration === "This Year") {
        const currentYear = moment().year();
        const startOfCurrentYear = moment(`${currentYear}-01-01`).format(
          "YYYY-MM-DD"
        );
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Found",
            ListedAt: {
              $gte: startOfCurrentYear,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        res.status(200).json({
          items: items,
        });
      }

      // Last year
      if (duration === "Last Year") {
        const currentYear = moment().year();
        const startOfLastYear = moment(`${currentYear - 1}-01-01`).format(
          "YYYY-MM-DD"
        );
        const endOfLastYear = moment(`${currentYear - 1}-12-31`).format(
          "YYYY-MM-DD"
        );

        const items = await Item.find(
          {
            ItemType: "Found",
            ListedAt: {
              $gte: startOfLastYear,
              $lte: endOfLastYear,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        res.status(200).json({
          items: items,
        });
      }

      // Manually
      if (duration === "Manually") {
        var sd = moment(startDate).format("YYYY-MM-DD");
        var ed = moment(endDate).format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Found",
            ListedAt: {
              $gte: sd,
              $lte: ed,
            },
          },
          { _id: 0, __v: 0 }
        ).select("-lostDate");

        res.status(200).json({
          items: items,
        });
      }
    }

    // --------------------------------------------------- Claimed Items ---------------------------------------------------------------------------------

    if (filter === "Claimed Items") {
      // All time
      if (duration === "All Time") {
        const items = await Item.find(
          {
            status: "Claimed",
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Last week
      if (duration === "Last Week") {
        const startOfLastWeek = moment()
          .subtract(1, "weeks")
          .startOf("week")
          .format("YYYY-MM-DD");
        const endOfLastWeek = moment()
          .subtract(1, "weeks")
          .endOf("week")
          .format("YYYY-MM-DD");

        const items = await Item.find(
          {
            status: "Claimed",
            claimedAt: {
              $gte: startOfLastWeek,
              $lte: endOfLastWeek,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // This week
      if (duration === "This Week") {
        const startOfThisWeek = moment().startOf("week").format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            status: "Claimed",
            claimedAt: {
              $gte: startOfThisWeek,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // This month
      if (duration === "This Month") {
        const startOfThisMonth = moment().startOf("month").format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            status: "Claimed",
            claimedAt: {
              $gte: startOfThisMonth,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Last month
      if (duration === "Last Month") {
        const currentDate = moment();
        const startOfLast30Days = moment(currentDate)
          .subtract(30, "days")
          .format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            status: "Claimed",
            claimedAt: {
              $gte: startOfLast30Days,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Last 6 month
      if (duration === "Last 6 Month") {
        const currentDate = moment();
        const startOfLast180Days = moment(currentDate)
          .subtract(180, "days")
          .format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            status: "Claimed",
            claimedAt: {
              $gte: startOfLast180Days,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // This year
      if (duration === "This Year") {
        const currentYear = moment().year();
        const startOfCurrentYear = moment(`${currentYear}-01-01`).format(
          "YYYY-MM-DD"
        );
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            status: "Claimed",
            claimedAt: {
              $gte: startOfCurrentYear,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Last year
      if (duration === "Last Year") {
        const currentYear = moment().year();
        const startOfLastYear = moment(`${currentYear - 1}-01-01`).format(
          "YYYY-MM-DD"
        );
        const endOfLastYear = moment(`${currentYear - 1}-12-31`).format(
          "YYYY-MM-DD"
        );

        const items = await Item.find(
          {
            status: "Claimed",
            claimedAt: {
              $gte: startOfLastYear,
              $lte: endOfLastYear,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Manually
      if (duration === "Manually") {
        var sd = moment(startDate).format("YYYY-MM-DD");
        var ed = moment(endDate).format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ItemType: "Claimed",
            claimedAt: {
              $gte: sd,
              $lte: ed,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }
    }

    // --------------------------------------------------- All Items ---------------------------------------------------------------------------------

    if (filter === "All Items") {
      // All time
      if (duration === "All Time") {
        const items = await Item.find({ _id: 0, v: 0 });

        res.status(200).json(
          {
            items: items,
          },
          { _id: 0, __v: 0 }
        );
      }

      // Last year
      if (duration === "Last Week") {
        const startOfLastWeek = moment()
          .subtract(1, "weeks")
          .startOf("week")
          .format("YYYY-MM-DD");
        const endOfLastWeek = moment()
          .subtract(1, "weeks")
          .endOf("week")
          .format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ListedAt: {
              $gte: startOfLastWeek,
              $lte: endOfLastWeek,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // This week
      if (duration === "This Week") {
        const startOfThisWeek = moment().startOf("week").format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ListedAt: {
              $gte: startOfThisWeek,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // This month
      if (duration === "This Month") {
        const startOfThisMonth = moment().startOf("month").format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ListedAt: {
              $gte: startOfThisMonth,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Last Month
      if (duration === "Last Month") {
        const currentDate = moment();
        const startOfLast30Days = moment(currentDate)
          .subtract(30, "days")
          .format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ListedAt: {
              $gte: startOfLast30Days,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Last 6 month
      if (duration === "Last 6 Month") {
        const currentDate = moment();
        const startOfLast180Days = moment(currentDate)
          .subtract(180, "days")
          .format("YYYY-MM-DD");
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ListedAt: {
              $gte: startOfLast180Days,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // This year
      if (duration === "This Year") {
        const currentYear = moment().year();
        const startOfCurrentYear = moment(`${currentYear}-01-01`).format(
          "YYYY-MM-DD"
        );
        const endOfToday = moment().endOf("day").format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ListedAt: {
              $gte: startOfCurrentYear,
              $lte: endOfToday,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Last year
      if (duration === "Last Year") {
        const currentYear = moment().year();
        const startOfLastYear = moment(`${currentYear - 1}-01-01`).format(
          "YYYY-MM-DD"
        );
        const endOfLastYear = moment(`${currentYear - 1}-12-31`).format(
          "YYYY-MM-DD"
        );

        const items = await Item.find(
          {
            ListedAt: {
              $gte: startOfLastYear,
              $lte: endOfLastYear,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }

      // Manually
      if (duration === "Manually") {
        var sd = moment(startDate).format("YYYY-MM-DD");
        var ed = moment(endDate).format("YYYY-MM-DD");

        const items = await Item.find(
          {
            ListedAt: {
              $gte: sd,
              $lte: ed,
            },
          },
          { _id: 0, __v: 0 }
        );

        res.status(200).json({
          items: items,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signupAdmin,
  loginAdmin,
  logoutAdmin,
  getCounts,
  addDepartment,
  delDept,
  getdept,
  getItemsByFilter,
  getClaimedItems,
  getClaimedItemsBySearch,
};
