define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/toc.html',
], function($, _, BackBone, tocTemplate) {

  var TOCBar = BackBone.View.extend({
    id: 'toc',
    className: 'sidebar',

    events: {
      'click a' : 'onClick'
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template(tocTemplate);
      this.render();
    },

    render: function() {
      console.log('rendering tocbar');
      $(this.el).html(this.template({}));
      return this;
    },

    onClick: function(e) {
      console.log('clicked', e);

      // If no query, make everything in the search results invisible before
      // showing the one that was clicked.
      var query = $.trim($('#search-box').val()).toLowerCase();
      if (query === '') {
        this.collection.each(function(model) {
          if (model.get('mainVisible')) {
            model.set({ mainVisible: false });
          }
        });
      }

      var name = $(e.currentTarget).text();
      var model = this.collection.find(function(model) {
        return model.get('title') === name;
      });
      model.set({ mainVisible: true });

      var modelid = $(e.currentTarget).attr('data-model-id');
      var searchResultsTopVal = $('#search-results').scrollTop();
      var topVal = $('#search-results [data-model-id="' + modelid + '"]').offset().top;
      $('#search-results').animate({
        scrollTop: searchResultsTopVal + topVal - 60
      }, 'slow');
    }

  });

  return TOCBar;
});
