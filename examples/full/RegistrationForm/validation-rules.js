import isEmail from 'validator/lib/isEmail'

export default {
  fieldPath: {
    primaryInfo: {
      type: {
        email: ({ value }) => {
          return !value.startsWith('foo')
        },
      },
      name: {
        userEmail: ({ value }) => {
          return !value.startsWith('bar')
        },
      },
    },
  },

  type: {
    email: ({ value }) => isEmail(value),
    password: {
      capitalLetter: ({ value }) => /[A-Z]/.test(value),
      oneNumber: ({ value }) => /[0-9]/.test(value),
      minLength: ({ value }) => value.length > 5,
    },
  },

  name: {
    birthDate: {
      day: ({ date: { day } }) => day.length > 0 && day <= 31,
      month: ({ date: { month } }) => month.length > 0 && month <= 12,
      year: ({ date: { year } }) => year.length === 4,
    },
    confirmPassword: {
      matches: ({ value, get }) => {
        return value === get(['userPassword', 'value'])
      },
    },
  },
}
