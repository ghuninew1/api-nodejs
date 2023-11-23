const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

// Define output and input directories
const directory = "./INPUT";

const convertToWebp = (directory) => {
    fs.readdirSync(directory).forEach((file) => {
        const imgName = file.split(".")[0];
        const ext = path.extname(file);
        if (String(ext).match(/(png|jpg|jpeg|avif)/gi)) {
            sharp(`${directory}/${file}`)
                .rotate()
                .webp()
                .toFile(directory + `/${imgName}.webp`);

            console.log(`Converted ${file} to webp`);
        } else {
            console.log(`Skipping ${file}`);
        }
    });
};

const convertToAvif = (directory) => {
    fs.readdirSync(directory).forEach((file) => {
        const imgName = file.split(".")[0];
        const ext = path.extname(file);
        if (String(ext).match(/(png|jpg|jpeg|webp)/gi)) {
            sharp(`${directory}/${file}`)
                .avif()
                .toFile(directory + `/${imgName}.avif`);

            console.log(`Converted ${file} to avif`);
        } else {
            console.log(`Skipping ${file}`);
        }
    });
};

const resizeFile = (directory, width, height) => {
    fs.readdirSync(directory).forEach((file) => {
        const imgName = file.split(".")[0];
        const ext = path.extname(file);
        if (String(ext).match(/(png|jpg|jpeg|avif|webp)/gi)) {
            sharp(`${directory}/${file}`)
                .resize(
                    width ? width : 200,
                    height ? height : width ? width : 200
                )
                .toFile(
                    directory +
                        `/${imgName}-${width}x${height ? height : width}.${ext}`
                );

            console.log(`Resized ${file}`);
        } else {
            console.log(`Skipping ${file}`);
        }
    });
};
const getFolderNames = (pFolderName) => {
    const pwd = process.cwd();
    fs.readdirSync(pFolderName, "utf8").filter((pFileName) => {
        fs.statSync(path.join(pFolderName, pFileName)).isDirectory();
        console.log(
            "path ",
            pwd + "/" + pFolderName.split("/")[1] + "/" + pFileName
        );
    });
};

let nFile = 0;
let nFolder = 0;
const listSubDirectiories = (base) => {
    fs.readdirSync(base, { withFileTypes: true }).forEach((dirent) => {
        const res = path.resolve(base, dirent.name);
        if (dirent.isDirectory()) {
            listSubDirectiories(res);
            console.log("directory ", res);
            nFolder = nFolder + 1;
        } else {
            console.log("file ", res);
            nFile = nFile + 1;
        }
        return res;
    });
};

// listSubDirectiories("./public");
// console.log("nFolder ", nFolder, " nFile ", nFile);

module.exports = {
    convertToWebp,
    convertToAvif,
    resizeFile,
    getFolderNames,
    listSubDirectiories,
};
