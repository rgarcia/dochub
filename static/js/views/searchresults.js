define([
  'jQuery',
  'Underscore',
  'Backbone',
  'libs/spin/spin',
  'views/mozdevcssprop'
], function($, _, BackBone, Spinner, MozDevCSSPropView) {

  // the results view is just tied to a collection and re-renders itself
  var SearchResultsView = BackBone.View.extend({
    id: 'search-results',
    tagName: 'div',
    className: 'content',

    initialize: function() {
      _.bindAll(this, 'render', 'onLoad');
      this.collection.bind('reset', this.render);
      this.dataLoaded = false;

      // Render the loading spinner 
      var opts = {
        lines  : 12,      // The number of lines to draw
        length : 30,      // The length of each line
        width  : 10,      // The line thickness
        radius : 31,      // The radius of the inner circle
        color  : '#000',  // #rgb or #rrggbb
        speed  : 0.7,     // Rounds per second
        trail  : 60,      // Afterglow percentage
        shadow : false    // Whether to render a shadow
      };
      this.spinner = new Spinner(opts);
    },

    // Callback to handle when the db loads, so we can remove the spinner
    onLoad: function() {
      this.dataLoaded = true;
      this.spinner.stop();
    },

    renderSpinner: function() {
      if (!this.dataLoaded) {
        this.spinner.spin($('#container')[0]);
      }
    },

    render: function() {
      // render a subview for each model in the collection
      var self = this;
      this.collection.each(function(cssprop) {
        var view = new MozDevCSSPropView({model: cssprop});
        $(self.el).append(view.render().el);
      });
      return this;
    },
  });

  return SearchResultsView;
});
