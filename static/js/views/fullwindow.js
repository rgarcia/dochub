define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, BackBone) {

  // handles events on the entire window

  var FullWindowView = BackBone.View.extend({

    initialize: function() {
      _.bindAll(this, 'onScroll');
      $(window).scroll(this.onScroll);
    },

    onScroll: function() {
      // make sure the margin-top of the TOC is correct
      var scrollTop = $(window).scrollTop();
      $('#toc').animate({'margin-top':Math.max(138,scrollTop)},
                        25);
    },
  });

  return FullWindowView;
});
