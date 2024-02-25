const mongoose = require("mongoose");

const department = mongoose.Schema({
  department: { type: String },
});

module.exports = mongoose.model("Department", department);
