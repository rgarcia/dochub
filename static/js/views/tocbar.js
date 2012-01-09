define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/toc.html',
], function($, _, Backbone, tocTemplate) {

  var TOCBar = Backbone.View.extend({
    events: {
      'click a' : 'onClick'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'addBindings', 'removeBindings');
      this.template = _.template(tocTemplate);
      this.lowercaseLanguageName = this.options.languageName.toLowerCase();
      
      this.$searchBox     = this.$('#search-box');
      this.$searchResults = $('#search-results');
    },

    render: function() {
      // NOP
      return this;
    },

    addBindings: function() {
      this.delegateEvents();
    },

    removeBindings: function() {
      $(this.el).undelegate();
    },

    onClick: function(e) {
      // If no query, make everything in the search results invisible before
      // showing the one that was clicked.
      var query = $.trim(this.$searchBox.val()).toLowerCase();
      if (query === '') {
        this.collection.each(function(model) {
          if (model.get('mainVisible')) {
            model.set({ mainVisible: false });
          }
        });
      }

      var $elt = this.$(e.currentTarget);
      var modelid = $elt.attr('data-model-id');
      this.collection.get(modelid).set({ mainVisible: true });

      var searchResultsTopVal = this.$searchResults.scrollTop();
      var topVal = $('#' + modelid).offset().top; // ID selection is the fastest
      this.$searchResults.scrollTop(searchResultsTopVal + topVal - 60);

      // Set url 
      var clickedItemName = $elt.text().trim();
      Backbone.history.navigate(this.lowercaseLanguageName + '/' + clickedItemName, false);
    }

  });

  return TOCBar;
});
