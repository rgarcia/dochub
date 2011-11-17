define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/searchheader',
  'views/tocresult',
  'text!templates/toc.html',
], function($, _, BackBone, SearchHeader, TOCResult, tocTemplate) {

  // the contents view view is just tied to a collection and re-renders itself
  var TOCBar = BackBone.View.extend({
    id: 'toc',
    className: 'sidebar',

    events: {
      'click #goto-top' : 'gotoTop'
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.collection.bind('reset', this.render);
      this.template = _.template(tocTemplate);

      this.searchHeaderView = new SearchHeader({
        collection: this.collection,
        query: this.options.query
      });
    },

    render: function() {
      $(this.el).html(this.template({}));

      // Search bar
      $('#search-bar').append(this.searchHeaderView.render().el);

      var tocResultsUl = $('#toc-results');
      var self = this;
      this.collection.each(function(cssprop) {
        var view = new TOCResult({ model: cssprop });
        tocResultsUl.append(view.render().el);
      });

      return this;
    },

    gotoTop: function() {
      $('html,body').animate({scrollTop: 0},'slow');
    }

  });

  return TOCBar;
});
