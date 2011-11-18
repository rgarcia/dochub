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
      $('#toc').animate({'margin-top':Math.max(0,scrollTop)}, 25);
    },

    onResize: function() {
      // make sure the TOC div reaches the bottom of the screen
      console.log('window height',$(window).height());
      var windowHeight = $(window).height();
      $('#toc-well').css('height', windowHeight - 120);
      $('#toc-well').css('overflow-y','scroll');

      $('#search-results').css('height', windowHeight - 80);
      $('#search-results').css('overflow-y', 'scroll');
      $('#search-results').css('overflow-x', 'hidden');
    },
  });

  return FullWindowView;
});
