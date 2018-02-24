/**
 * Synchronous validation.
 */
describe('validateSync', () => {
  /* Type-specific validation */
  require('./type.spec');

  /* Name-specific validation */
  require('./name.spec');

  /* Mixed validation */
  require('./mixed.spec');
});
