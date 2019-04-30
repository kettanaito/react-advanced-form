import { configure, addDecorator } from '@storybook/react'
import { withOptions } from '@storybook/addon-options'
import centered from '@storybook/addon-centered/react'

withOptions({
  hierarchySeparator: /\/|\./,
  hierarchyRootSeparator: /\|/,
})

addDecorator(centered)

function loadStories() {
  require('../examples')
}

configure(loadStories, module)
