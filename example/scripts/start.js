// scripts/start.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Path to the folder to be deleted
const folderPath = path.join(__dirname, "../.parcel-cache");

try {
    // Delete the folder and its contents
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`${folderPath} has been deleted.`);
} catch (err) {
    console.error(`Error deleting folder: ${err.message}`);
}

// Run Parcel
execSync("parcel index.html", { stdio: "inherit" });
