const Feedback = require("../models/feedbackModel");
const User = require("../models/UserModel");

const submitFeedback = async (req, res) => {
  try {
    const userId = req.user._id;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ message: "Emoji selection is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const feedback = new Feedback({
      user: userId,
      userName: user.name,
      emoji,
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted!",
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("user", "name email");
    res.status(200).json(feedbacks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch feedback", error: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }
    res.status(200).json({ message: "Feedback deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting feedback", error: error.message });
  }
};

const deleteAllFeedbacks = async (req, res) => {
  try {
    await Feedback.deleteMany();
    res.status(200).json({ message: "All feedbacks deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting all feedbacks", error: error.message });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback,
  deleteFeedback,
  deleteAllFeedbacks,
};
