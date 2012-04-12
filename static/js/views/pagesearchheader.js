define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/searchheader',
], function($, _, Backbone, SearchHeaderView) {

  var DEFAULT_MIN_QUERY_LENGTH = 2;

  var PageSearchHeaderView = SearchHeaderView.extend({

    initialize: function() {
      _.bindAll(this, 'render', 'addBindings', 'removeBindings', 'searchFunc');

      this.placeholder  = this.options.placeholder;
      this.languageName = this.options.languageName.toLowerCase();
      this.lastQuery = null;

      this.debounceTime = this.options.debounceTime
        ? this.options.debounceTime
        : DEFAULT_SEARCH_DEBOUNCE_MS;
      this.minQueryLength = this.options.minQueryLength
        ? this.options.minQueryLength
        : DEFAULT_MIN_QUERY_LENGTH;
      this.onSearch = _.debounce(this.searchFunc, this.debounceTime);
      _.bindAll(this, 'onSearch');

      this.$searchBox     = $('#search-box');
      this.$searchResults = $('#search-results');

      // Only accept queries that have some alphanumeric character
      this.alphaNumRegex = /\w+/;

      this.addBindings();
    },

    searchFunc: function() {
      var query = $.trim(this.$searchBox.val()).toLowerCase();

      // TODO: replacestate...
      Backbone.history.navigate(this.languageName + '/' + query,
                                {trigger: false});

      // Do this after we set url
      var queryExists = (query !== '');
      if (queryExists &&
            (
              query === this.lastQuery ||
              query.length < this.minQueryLength ||
              !this.alphaNumRegex.test(query)
            )
          ) {
        return;
      }
      this.lastQuery = query;

      if (!queryExists) {
        // No query, so can do some optimizations.
        //  1. Don't use the search function
        //  2. Make all pages invisible
        //  3. Make all PageElements visible
        this.options.pages.each(function(page) {
          page.set({ mainVisible: false });
        });
        this.options.pageElements.each(function(pageElement) {
          pageElement.set({ tocVisible: true });
        });
      } else {
        console.log('[Searching for ' + query + '.]');

        // Which pages should we show?
        var visiblePages = {};
        for (var i = 0; i < this.options.pages.length; ++i) {
          var page = this.options.pages.at(i);
          visiblePages[page.get('title')] = false;
        }

        // Find all matching elements and the pages they're on
        query = new RegExp(query);
        var firstVisibleElement = null;
        for (var i = 0; i < this.options.pageElements.length; ++i) {
          var pageElement = this.options.pageElements.at(i);

          var visible = query.test(pageElement.get('lowerCaseTitle'));
          pageElement.set({ tocVisible: visible });
          if (visible) {
            if (firstVisibleElement === null) {
              firstVisibleElement = pageElement;
            }
            visiblePages[this.options.nameToPageMap[pageElement.get('name')].get('title')] = visible;
          }
        }

        // Hide/show each page accordingly
        for (var i = 0; i < this.options.pages.length; ++i) {
          var page = this.options.pages.at(i);
          page.set({ mainVisible : visiblePages[page.get('title')] });
        }

        // Scroll to the first search result
        if (firstVisibleElement !== null) {
          topVal = $(document.getElementById(firstVisibleElement.get('domId'))).offset().top;
          // For some reason, the bottom fails:
          // var topVal = $('dt[id="' + firstVisibleElement.get('domId') + '"]').offset().top;
          this.$searchResults.scrollTop(this.$searchResults.scrollTop() + topVal - 60);
        }
      }
    },
  });

  return PageSearchHeaderView;
});

