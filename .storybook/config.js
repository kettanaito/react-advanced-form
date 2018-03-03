import { configure, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import centered from '@storybook/addon-centered';

setOptions({
  name: 'React Advanced Form',
  showAddonPanel: false
});

addDecorator(centered);

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
