export default (err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;

    res.status(status).json({
        success: false,
        error: {
            code: err.code || 'SERVER_ERROR',
            message: err.isOperational ? err.message : 'Internal Server Error'
        }
    });
};