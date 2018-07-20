# Reducing boilerplate

React Advanced Form encourages functional programming paradigm in a form of favoring pure functions and high-order functions. However, you don't have to be a guru in functional programming to use the library.

## High-order validator functions

Consider writing a set of pure high-order validator functions that accept any custom parameters and always return a validator function expected by React Advanced Form:

```javascript
// validators/minLength.js
export default function minLength(length) {
    // returns a validator function expected by RAF
    return ({ value, fieldProps, fields, form }) => {
        return value.length >= length
    }
}
```

Now you can use the minLength function in multiple places:

```javascript
// validation-rules.js
import minLength from './validators/minLength'

const validationRules = {
    type: {
        tel: {
            minLength: minLength(8) // phones must be at least 8 chars long
        }
    },
    name: {
        firstName: {
            minLength: minLength(2) // first name must be at least 2 chars long
        }
    }
}
```

> Use this approach to create validator functions of any kind!

