const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        status: !statusCode ? "error" : "fail",
        statusCode: statusCode || 500,
        message,
    });
}

module.exports = {
    handleError
};