export const addHideFilterMiddleware = schema => {
    const autoHideFilter = function (next) {
      const options = this.getOptions?.() || {};
      const query = this.getQuery();
  
      // Revisa si el request vino con includeHidden desde req.query
      if (options?.['$queryOptions']?.includeHidden === 'true' || options.includeHidden === 'true') {
        return next();
      }
  
      if (!query.hasOwnProperty('hide')) {
        this.where({ hide: { $ne: true } });
      }
  
      next();
    };
  
    schema.pre('find', autoHideFilter);
    schema.pre('findOne', autoHideFilter);
    // schema.pre('findOneAndUpdate', autoHideFilter);
    schema.pre('countDocuments', autoHideFilter);
  };
  