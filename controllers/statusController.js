const User = require("../models/User");

const updateStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be a boolean."
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.isActive = isActive;

    await user.save();

    return res.status(200).json({
      message: "User status updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update user status"
    });
  }
};

module.exports = {
  updateStatus
};