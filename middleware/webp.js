// Importing required libraries
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Define output and input directories
const OUTPUT_DIR = "./OUTPUT";
const INPUT_DIR = "./INPUT";

// Prompt user for a new file name pattern
const nPattern = process.argv[2];

// If output directory exists, remove it and its contents
if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}

// Create the output directory
fs.mkdirSync(OUTPUT_DIR);

// Define a function to convert image files to WebP format
let imgs = [];

const convertToWebp = async (img, index) => {
    // Define the name of the new WebP file
    const imgName = nPattern ? `${nPattern} ${index}` : path.parse(img).name;
    // Use sharp to convert the image to WebP format and save it to the output directory
    await sharp(`${INPUT_DIR}/${img}`).webp().toFile(`${OUTPUT_DIR}/${imgName}.webp`);
};

exports.convertWebp = (req, res, next) => {
    try {
        if (INPUT_DIR === undefined) throw new Error("INPUT_DIR is undefined");

        // Read the input directory and filter for image files (PNG, JPG, JPEG)
        fs.readdir(INPUT_DIR, (err, files) => {
            if (err) throw err;
            // Filter for image files
            imgs = files.filter((file) => {
                const ext = path.extname(file).toLowerCase();
                return ext;
            });
            // For each image file found, call the convertToWebp function
            imgs.forEach((img, i) => convertToWebp(img, i));
        });
        next();
    } catch (error) {
        next(error);
    }
};
