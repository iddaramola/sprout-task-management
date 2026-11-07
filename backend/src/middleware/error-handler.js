export function notFound(req, res, next) {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
}

export function errorHandler(error, req, res, next) {
  

  const statusCode =
    error.statusCode ||
    error.status ||
    500;

    if (statusCode >= 500) {
  console.error(error);
  }

  const message =
    statusCode >= 500
      ? "Internal server error"
      : error.message;

  return res.status(statusCode).json({
    success: false,
    message,
  });
}