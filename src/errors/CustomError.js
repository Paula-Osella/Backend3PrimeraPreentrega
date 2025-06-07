throw new CustomError(error);
export default class CustomError extends Error {
    constructor({ code, name, message }) {
      super(message);
      this.code = code || 5000; 
      this.name = name || 'ErrorInterno';
    }
  }
  