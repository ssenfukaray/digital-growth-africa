const User = require("../models/User");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve users"
    });
  }
};

module.exports = {
  getUsers
};