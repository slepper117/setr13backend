const errorLogger = (err, req, res, next) => {
  const { originalUrl, ip } = req;
  if (err.statusCode === 400) {
    console.log({ error: err, request: { originalUrl, ip } });
  } else {
    console.log({ error: err, request: { originalUrl, ip } });
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {
  let { name, message, statusCode, infoCode } = err;

  if (statusCode === undefined) {
    name = 'internal-error';
    message = 'Something wrong happened. Our Techical Team was advised.';
    statusCode = 500;
    infoCode = 'Internal Server Error';
  }

  res
    .header('Content-Type', 'application/json')
    .status(statusCode)
    .send(
      JSON.stringify({ name, message, data: { statusCode, infoCode } }, null, 4)
    );
};

export { errorHandler, errorLogger };
