export const createUserValidationSchema = {
  name: {
    isString: {
      errorMessage: 'Name must be a string'
    },
    isLength: {
      options: {
        min: 3,
        max: 32
      },
      errorMessage: 'Name must be between 3 and 32 characters'
    },
    notEmpty: {
      errorMessage: 'Name is required'
    }
  },
  username: {
    isString: {
      errorMessage: 'Username must be a string'
    },
    isLength: {
      options: {
        min: 3,
        max: 20
      },
      errorMessage: 'Username must be between 3 and 20 characters'
    },
    notEmpty: {
      errorMessage: 'Username is required'
    }
  }
};
