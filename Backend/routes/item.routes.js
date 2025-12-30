const express = require("express");
const multer = require("multer");
const {
    saveFoundItem,
    getFoundItems
} = require("../services/item.services");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST found item
router.post("/found", upload.single("itemImage"), (req, res) => {
    try {
        const item = saveFoundItem(req.body, req.file);
        res.json({ success: true, item });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET found items
router.get("/found", (req, res) => {
    try {
        const items = getFoundItems();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
