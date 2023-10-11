const { set } = require("../../server");

exports.toLocalTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString("th-TH");
};

exports.isData = (data) => {
    if (data !== null && data !== undefined && data) return data;
};

exports.isDataArray = (data) => {
    if (data !== null && data !== undefined && data.length > 0) return data;
};

exports.isDataObject = (data) => {
    if (data !== null && data !== undefined && Object.keys(data).length > 0) return data;
};

exports.isDataObjectArray = (data) => {
    if (data !== null && data !== undefined && data.length > 0 && Object.keys(data[0]).length > 0)
        return data;
};

exports.isHidden = (data) => {
    if (data === null || data === undefined || data === "") return data ? true : false;
};

exports.resTime = (start) => {
    if ( !start ) return process.hrtime();
    const end = process.hrtime(start);
    const responseTime = (end[0] * 1e3 + end[1]) * 1e-6;
    return responseTime;
};