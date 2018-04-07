import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import centered from '@storybook/addon-centered';

setOptions({
  hierarchySeparator: /\/|\./,
  hierarchyRootSeparator: /\|/
});

addDecorator(centered);

function loadStories() {
  require('../examples');
}

configure(loadStories, module);
