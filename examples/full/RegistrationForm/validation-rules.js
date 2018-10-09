import isEmail from 'validator/lib/isEmail'

export default {
  type: {
    email: ({ value }) => isEmail(value),
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value),
      minLength: ({ value }) => value.length > 5,
    },
  },

  name: {
    confirmPassword: {
      matches: ({ value, get }) => {
        return value === get(['userPassword', 'value'])
      },
    },
  },
}
