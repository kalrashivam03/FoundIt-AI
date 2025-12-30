const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/items.json");

function ensureDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
}

function saveFoundItem(data, file) {
    ensureDataFile();

    const items = JSON.parse(fs.readFileSync(DATA_FILE));

    const newItem = {
        id: Date.now(),
        type: "found",
        itemName: data.itemName,
        description: data.description,
        location: data.location,
        contact: data.contact,
        image: file ? file.filename : null,
        timestamp: new Date().toISOString()
    };

    items.push(newItem);
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));

    return newItem;
}

function getFoundItems() {
    ensureDataFile();
    const items = JSON.parse(fs.readFileSync(DATA_FILE));
    return items.filter(item => item.type === "found");
}

module.exports = {
    saveFoundItem,
    getFoundItems
};
