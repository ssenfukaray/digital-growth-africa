const User = require("../models/User");

const changeRole = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { role: newRole } = req.body;

    if (!["user", "admin"].includes(newRole)) {
      return res.status(400).json({
        message: "Invalid role. Only 'user' or 'admin' are allowed."
      });
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.role = newRole;

    await user.save();

    return res.status(200).json({
      message: "Role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update user role"
    });
  }
};

module.exports = {
  changeRole
};