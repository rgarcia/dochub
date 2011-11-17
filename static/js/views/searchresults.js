define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/mozdevcssprop'
], function($, _, BackBone, MozDevCSSPropView) {

  // the results view is just tied to a collection and re-renders itself
  var SearchResultsView = BackBone.View.extend({
    id: 'search-results',
    tagName: 'div',
    className: 'content',

    initialize: function() {
      _.bindAll(this, 'render');
      this.collection.bind('reset', this.render);
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
