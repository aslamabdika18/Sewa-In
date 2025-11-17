module.exports.success = (res, data, message = `success`, statusCode = 200) => {
    return res.status(statusCode).json({
        status: true,
        message,
        data,
    });
};

module.exports.error = (res, message = `internal server error`, statusCode = 500) => {
    return res.status(statusCode).json({
        status: false,
        message,
    });
}