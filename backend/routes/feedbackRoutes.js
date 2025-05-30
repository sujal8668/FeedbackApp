const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  deleteFeedback,
  deleteAllFeedbacks,
} = require("../controllers/feedbackController");

const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.post("/submit", protect, submitFeedback);
router.get("/all", protect, adminOnly, getAllFeedback);
router.delete("/:id", protect, adminOnly, deleteFeedback);
router.delete("/", protect, adminOnly, deleteAllFeedbacks);

module.exports = router;
