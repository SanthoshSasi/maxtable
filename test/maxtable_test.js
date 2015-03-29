(function ($) {
  module('jQuery#maxtable', {
    setup: function () {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function () {
    expect(1);
    strictEqual(this.elems.maxtable(), this.elems, 'should be chainable');
  });

  test('is maxtable', function () {
    expect(1);
    strictEqual(this.elems.maxtable().text(), 'maxtable0maxtable1maxtable2', 'should be maxtable');
  });

}(jQuery));
