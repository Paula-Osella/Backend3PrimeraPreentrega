export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  if (err.code && err.name) {

    return res.status(400).json({
      status: 'error',
      code: err.code,
      name: err.name,
      message: err.message
    });
  }


  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    error: err.message
  });
};
