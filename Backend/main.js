const express = require("express");
const cors = require("cors");
const path = require("path");

const itemRoutes = require("./routes/item.routes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/items", itemRoutes);

// root check
app.get("/", (req, res) => {
    res.send("FoundIt AI Backend is running 🚀");
});

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
