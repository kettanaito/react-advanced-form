describe('utils', function () {
  describe('Misc', function () {
    require('./ensafeMap.spec');
    require('./flushFieldRefs.spec');
  });

  /* Field utils */
  require('./fieldUtils/index.spec');

  /* Reactive utils */
  require('./rxUtils.spec');
});
