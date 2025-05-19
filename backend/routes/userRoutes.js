const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, deleteUser } = require("../controllers/userController");

const router = express.Router();

// GET all users — admin only
router.get("/", protect, adminOnly, getUsers);

// DELETE user by ID — admin only
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
