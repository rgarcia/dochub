define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, BackBone) {

  // handles events on the entire window

  var FullWindowView = BackBone.View.extend({

    initialize: function() {
      _.bindAll(this, 'onResize');
      $(window).resize(this.onResize);
      this.onResize();
    },

    onResize: function() {
      // make sure the TOC div reaches the bottom of the screen
      console.log('window height',$(window).height());
      var windowHeight = $(window).height();
      $('#toc-well').height(windowHeight - 120);
      $('#toc-well').css('overflow-y', 'hidden');

      // Adjust the -196 magic # to account for the heights of new objects
      // put in the tocbar. For example, if a new thing occupies +24px height
      // in the toc bar, make the magic number -(196 + 24) = -220.
      $('#toc-results-div').height(windowHeight - 184);
      $('#toc-results-div').css('overflow-y', 'scroll');

      $('#search-results').height(windowHeight - 80);
      $('#search-results').css('overflow-y', 'scroll');
      $('#search-results').css('overflow-x', 'hidden');

      $('#container').height(Math.max($('#toc').height(), $('#search-results').height()));
    },
  });

  return FullWindowView;
});
