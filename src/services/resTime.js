module.exports = (startTime) => {
    const diff = process.hrtime(startTime);
    const responseTime = ((diff[0] * 1e3) + diff[1]) * 0.001;
    return responseTime.toFixed(3);
};
