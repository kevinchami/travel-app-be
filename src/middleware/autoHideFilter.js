export const addHideFilterMiddleware = schema => {
    // Aplica a todas las queries find y findOne (también sirve para findById porque internamente es findOne)
    const autoHideFilter = function (next) {
      if (!this.getQuery().hasOwnProperty('hide')) {
        this.where({ hide: { $ne: true } });
      }
      next();
    };
  
    schema.pre('find', autoHideFilter);
    schema.pre('findOne', autoHideFilter);
    schema.pre('findOneAndUpdate', autoHideFilter);
    schema.pre('countDocuments', autoHideFilter);
  };