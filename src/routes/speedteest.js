const http = require("http");
const https = require("https");
let { URL, Url } = require("url");
const fs = require("fs");
/**
 * Use the default Node URL Class if found i.e. Inside a Node environment
 * to allow http and https, otherwise use the Url consturctor for browser environments
 * strictly limited to https for secure connections
 */
URL = URL ? URL : Url;

const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;':,./<>?";

class NetworkSpeedCheck {
    /**
     * Function to check download speed
     * @param {String} baseUrl {Required} The url to which the request should be made
     * @param {Number} fileSizeInBytes {Required} The size (in bytes) of the file to be downloaded
     * @returns {Object}
     */

    _protocol(url) {
        let u = new URL(url);
        return u.protocol === "http:" ? http : https;
    }
    checkDownloadSpeed(baseUrl, fileSizeInBytes) {
        this.validateDownloadSpeedParams(baseUrl, fileSizeInBytes);
        let startTime;
        let protocol = this._protocol(baseUrl);
        return new Promise((resolve, _) => {
            return protocol.get(baseUrl, (response) => {
                response.once("data", () => {
                    startTime = new Date().getTime();
                });

                response.once("end", () => {
                    const endTime = new Date().getTime();
                    const duration = (endTime - startTime) / 1000;
                    // Convert bytes into bits by multiplying with 8
                    const bitsLoaded = fileSizeInBytes * 8;
                    const bps = (bitsLoaded / duration).toFixed(2);
                    const kbps = (bps / 1000).toFixed(2);
                    const mbps = (kbps / 1000).toFixed(2);
                    const Gb = (mbps / 1000).toFixed(2);
                    //convert time to ms
                    const ms = duration * 1000;
                    //convert to MB
                    const MB = fileSizeInBytes / 1000000;
                    const speed = (MB / duration).toFixed(2);

                    resolve({ bps, kbps, mbps, Gb, ms, speed });
                });
            });
        }).catch((error) => {
            throw new Error(error);
        });
    }

    checkUploadSpeed(options, fileSizeInBytes = 2000000) {
        let startTime;
        const defaultData = this.generateTestData(fileSizeInBytes / 1000);
        const data = JSON.stringify({ defaultData });
        return new Promise((resolve, reject) => {
            let req = http.request(options, (res) => {
                res.setEncoding("utf8");
                res.on("data", () => {});
                res.on("end", () => {
                    const endTime = new Date().getTime();
                    const duration = (endTime - startTime) / 1000;
                    const bitsLoaded = fileSizeInBytes * 8;
                    const bps = (bitsLoaded / duration).toFixed(2);
                    const kbps = (bps / 1000).toFixed(2);
                    const mbps = (kbps / 1000).toFixed(2);
                    const Gb = (mbps / 1000).toFixed(2);
                    const timeres = duration.toFixed(2);
                    resolve({ bps, kbps, mbps, Gb, timeres });
                });
            });
            startTime = new Date().getTime();
            req.on("error", (error) => {
                reject(error);
            });
            req.write(data);
            req.end();
        });
    }

    validateDownloadSpeedParams(baseUrl, fileSizeInBytes) {
        if (typeof baseUrl !== "string") {
            throw new Error("baseUrl must be a string");
        }
        if (typeof fileSizeInBytes !== "number") {
            throw new Error("fileSizeInBytes must be a number");
        }
        return;
    }

    generateTestData(sizeInKmb) {
        const iterations = sizeInKmb * 1000; //get byte count
        let result = "";
        for (let index = 0; index < iterations; index++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

module.exports = (app) => {
    app.get("/speedtest", async (req, res) => {
        const speedCheck = new NetworkSpeedCheck();
        const fileSizeInBytes = 2000000;
        const baseUrl = "http://eu.httpbin.org/stream-bytes/" + fileSizeInBytes;
        const speed = await speedCheck.checkDownloadSpeed(baseUrl, fileSizeInBytes);
        res.status(200).json(speed);
    });

    app.get("/speedtest/upload", async (req, res) => {
        const speedCheck = new NetworkSpeedCheck();
        const options = {
            hostname: "www.google.com",
            port: 80,
            path: "/",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": 2000000,
            },
        };
        const fileSizeInBytes = 2000000;
        const speed = await speedCheck.checkUploadSpeed(options, fileSizeInBytes);
        res.json(speed);
    });
};
