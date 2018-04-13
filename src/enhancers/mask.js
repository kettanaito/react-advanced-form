/**
 * Mask enhancer.
 * Applies the provided mask to the field.
 */
import PropTypes from 'prop-types';
import Enhancer from '../classes/Enhancer';

/**
 * Formats the given string based on the mask.
 * @param {string} string Original string.
 * @param {string} mask Mask string containing placeholder "#" characters.
 * @param {boolean} allowOverlay Controls the appending of string overlay to the formatted string.
 */
function ensureMask(string, mask, allowOverlay = true) {
  /* Bypass empty strings for masks which ensure prefixed substrings */
  if (string.trim() === '') {
    return string;
  }

  /* Forced convert the given string to an actual string and ensure linear character indexes */
  const forcedString = string.toString().replace(/\W+/g, '');

  /* Replace the mask's placeholders with the characters from the string, appending an overlay */
  let i = 0;
  let formatted = mask.replace(/#/gi, () => forcedString[i++] || '').trim();

  if (allowOverlay) {
    /* Get the overlay - the part of the string which goes beyond the mask */
    const overlay = forcedString.substr(mask.replace(/[^#]+/g, '').length, forcedString.length);
    formatted += overlay;
  }

  return formatted;
}

export default class Mask extends Enhancer {
  /* PropTypes added by the enhancer */
  //
  // TODO This doesn't seem to do anything anymore
  //
  appendPropTypes() {
    return {
      mask: PropTypes.string,
      useStrictMask: PropTypes.bool
    };
  }

  constructor(props) {
    super(props);
    const { mask, useStrictMask } = props;

    /**
     * Intercept field change event before updating the field record.
     * This enhancer affects the entered value of the field by pre-formatting it to match
     * the provided mask.
     */
    this.intercept('fieldChange', ({ nextValue, ...rest }) => {
      console.warn('mask: intercepting...');

      return {
        ...rest,
        nextValue: ensureMask(nextValue, mask, !useStrictMask)
      };
    });
  }
}
