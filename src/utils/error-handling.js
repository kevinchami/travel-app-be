export class Exception extends Error {
  status;
  constructor(message = '', status = 500) {
    super(message);
    this.status = status;
  }
}

export const safe = fn => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (error) {
    res.status(error?.status || 500).json({
      message: error?.message || error || 'Internal Error',
    });

    next(error);
  }
};
