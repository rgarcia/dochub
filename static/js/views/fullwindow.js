define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, BackBone) {

  // handles events on the entire window

  var FullWindowView = BackBone.View.extend({

    initialize: function() {
      _.bindAll(this, 'onScroll', 'onResize');
      $(window).scroll(this.onScroll);
      $(window).resize(this.onResize);
      this.onResize();
    },

    onScroll: function() {
      // make sure the margin-top of the TOC is correct
      var scrollTop = $(window).scrollTop();
      $('#toc').animate({'margin-top':Math.max(138,scrollTop)},
                        25);
    },

    onResize: function() {
      // make sure the TOC div reaches the bottom of the screen
      console.log('window height',$(window).height());
      var tocHeight = $(window).height() - 255;
      $('#toc-well').css('height',tocHeight);
      $('#toc-well').css('overflow-y','scroll');
    },
  });

  return FullWindowView;
});
