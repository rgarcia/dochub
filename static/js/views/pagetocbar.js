define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/tocbar',
  'text!templates/toc.html',
], function($, _, Backbone, TOCBarView, tocTemplate) {

  var PageTOCBarView = TOCBarView.extend({
    events: {
      'click a' : 'onClick'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'addBindings', 'removeBindings');
      this.template = _.template(tocTemplate);
      this.lowercaseLanguageName = this.options.languageName.toLowerCase();
      
      this.$searchBox     = this.$('#search-box');
      this.$searchResults = $('#search-results');

      this.nameToPageMap = this.options.nameToPageMap;
      if (_.isUndefined(this.nameToPageMap)) {
        throw "Need to pass nameToPageMap to PageTOCBarView";
      }
    },

    onClick: function(e) {
      // If no query, make everything in the search results invisible before
      // showing the page of the one that was clicked.
      var query = $.trim(this.$searchBox.val()).toLowerCase();
      if (query === '') {
        this.collection.each(function(page) {
          if (page.get('mainVisible')) {
            page.set({ mainVisible: false });
          }
        });
      }

      var clicked     = this.$(e.currentTarget);
      var elementId   = clicked.attr('data-model-id');
      var elementName = clicked.text();
      this.nameToPageMap[elementName].set({ mainVisible: true });

      var topVal = $(document.getElementById(elementId)).offset().top;
      // For some reason, with python, using the jQuery ID selector does not work
      // var topVal = $('#' + elementId).offset().top; // ID selection is the fastest
      this.$searchResults.scrollTop(this.$searchResults.scrollTop() + topVal - 60);

      // Set url 
      Backbone.history.navigate(this.lowercaseLanguageName + '/' + elementName, false);
    }

  });

  return PageTOCBarView;
});

