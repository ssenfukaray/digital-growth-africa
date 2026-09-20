const User = require("../models/User");
const jwt = require("jsonwebtoken");

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both current password and new password are required."
      });
    }

   const user = await User.findById(req.user._id).select("+password");
if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

  const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Incorect current password"
      });
    }


    
const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to the update password"
    });
  }
};

module.exports = {
 updatePassword
};