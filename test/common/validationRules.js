export default {
  type: {
    tel: ({ value }) => /^\d+$/.test(value)
  },
  name: {
    username: ({ value }) => (value === 'admin')
  }
};
