const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    if (err instanceof Error) {
      res.status(500).render('error', { message: 'Internal server error' });
    } else {
      res
        .status(err.status || 500)
        .render('./odinbook/views/error.js', { message: err.message });
    }
  };
  
  export default errorHandler;
  