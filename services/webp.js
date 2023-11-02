// Importing required libraries
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Define output and input directories
const OUTPUT_DIR = "./OUTPUT";
const INPUT_DIR = "./INPUT";

// Prompt user for a new file name pattern
const nPattern = process.argv[2];

// Define a function to convert image files to WebP format
let imgs = [];

const convertToWebp = async (img, index, mode) => {
    // Define the name of the new WebP file
    const imgName = nPattern ? `${nPattern} ${index && index}` : path.parse(img).name;
    const outputFolder = () => {
        if (mode === "webp") {
            return `${OUTPUT_DIR}/webp`;
        } else if (mode === "png") {
            return `${OUTPUT_DIR}/png`;
        } else if (mode === "jpg" || mode === "jpeg") {
            return `${OUTPUT_DIR}/jpg`;
        } else if (mode === "heic") {
            return `${OUTPUT_DIR}/heic`;
        } else if (mode === "gif") {
            return `${OUTPUT_DIR}/gif`;
        } else {
            throw new Error("Mode is undefined");
        }
    };
    // If output directory exists, remove it and its contents
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    if (!fs.existsSync(outputFolder())) {
        fs.mkdirSync(outputFolder());
    }

    if (mode === "webp") {
        await sharp(`${INPUT_DIR}/${img}`)
            .rotate()
            .webp()
            // .resize({ width: 192 })
            .toFile(outputFolder() + `/${imgName}.webp`);
    } else if (mode === "png") {
        await sharp(`${INPUT_DIR}/${img}`)
            .png()
            .toFile(outputFolder() + `/${imgName}.png`);
    } else if (mode === "jpg" || mode === "jpeg") {
        await sharp(`${INPUT_DIR}/${img}`)
            .jpeg()
            .toFile(outputFolder() + `/${imgName}.jpeg`);
    } else if (mode === "heic") {
        await sharp(`${INPUT_DIR}/${img}`)
            .heif()
            .toFile(outputFolder() + `/${imgName}.heic`);
    } else if (mode === "gif") {
        await sharp(`${INPUT_DIR}/${img}`, { animated: true })
            .gif({ interFrameMaxError: 8 })
            .resize({ width: 300, height: 300 })
            .toFile(outputFolder() + `/${imgName}.gif`);
    } else {
        throw new Error("Mode is undefined");
    }
};
// Read the input directory and filter for image files (PNG, JPG, JPEG)
fs.readdir(INPUT_DIR, (err, files) => {
    if (err) console.log("Error reading input directory: ", err);
    // Filter for image files
    imgs = files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ext;
    });
    // For each image file found, call the convertToWebp function
    imgs.forEach((img, i) =>
        convertToWebp(img, i, "webp")
            .then(() => console.log("Done! ", i))
            .catch((err) => console.log("Error converting to WebP: ", err))
    );
});

exports.convertToWebp = convertToWebp;
