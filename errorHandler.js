const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof Error) {
        res.status(500).render('error', { message: 'internal server error'});
    } else {
        res.status(err.status || 500).render('error', { message: 'err.message'})
    }
};

export default errorHandler;