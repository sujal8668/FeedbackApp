const express = require("express");
const router = express.Router();
const { submitFeedback, getAllFeedback } = require("../controllers/feedbackController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

router.post("/submit", protect, submitFeedback);
router.get("/all", protect, adminOnly, getAllFeedback);

module.exports = router;