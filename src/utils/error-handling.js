export class Exception extends Error {
  status;
  constructor(message = '', status = 500) {
    super(message);
    this.status = status;
  }
}

export const safe = fn => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error('Error in controller:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
};
