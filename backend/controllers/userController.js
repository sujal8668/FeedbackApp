const User = require("../models/UserModel");

// Get all users with role 'member'
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select(
      "name email profileImageUrl"
    );
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUsers,
  deleteUser,
};
