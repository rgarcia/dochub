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
      this.$tocWell = $('#toc');
      this.$tocResultsDiv = $('#toc-results');
      this.$searchResults = $('#search-results');
      this.$container = $('#container');
      this.onResize();
    },

    onResize: function() {
      // make sure the TOC div reaches the bottom of the screen
      var windowHeight = $(window).height();
/*       this.$tocWell.height(windowHeight - 100); */
      this.$tocWell.height(windowHeight - 20);

      // Adjust the -196 magic # to account for the heights of new objects
      // put in the tocbar. For example, if a new thing occupies +24px height
      // in the toc bar, make the magic number -(196 + 24) = -220.
/*       this.$tocResultsDiv.height(windowHeight - 125); */
      this.$tocResultsDiv.height(windowHeight - 42);

/*       this.$searchResults.height(windowHeight - 80); */
      this.$searchResults.height(windowHeight - 0);
      this.$container.height(Math.max($('#toc').height(), this.$searchResults.height()));
    },
  });

  return FullWindowView;
});
