define([
  'jQuery',
  'Underscore',
  'Backbone',

  // Models
  'models/pageelement',
  
  // Collection
  'collections/pageelements',

  // Views
  'views/pagetocbar',
  'views/pagesearchheader',
  'views/searchresults',
  'views/pagesearchresults',

  // Templates
  'text!templates/tocpagescraperesult.html',
  'text!templates/page.html',
], function($, _, Backbone,
            PageElement, PageElements,
            PageTOCBarView, PageSearchHeaderView, SearchResultsView, PageSearchResultsView,
            tocResultTemplate, pageTemplate) {

  var PageScrapedLanguageView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render', 'setActive', 'setQuery');

      this.active = false;

      this.languageName = this.options.languageName;

      // Save for later
      this.$searchResultsDiv = $('#search-results');

      var mainSearchResultsView = this.options.mainSearchResultsView
        ? this.options.mainSearchResultsView
        : PageSearchResultsView;
      this.mainResultsView = new mainSearchResultsView({
        el: '#search-results',
        collection:   this.collection,
        itemTemplate: pageTemplate,
        visibleField: 'mainVisible',
        languageName  : this.languageName,
        spinner: true
      });

      this.createAndRenderViews = _.once(function() {
        this.pageElements  = new PageElements();
        var nameToPageMap = {};
        for (var i = 0; i < this.collection.length; ++i) {
          var page = this.collection.at(i);
          var searchableItems = page.get('searchableItems');
          for (var j = 0; j < searchableItems.length ; ++j) {
            var item = searchableItems[j];
            this.pageElements.add(new PageElement({
              domId : item.domId,
              name  : item.name,
              page  : page,
            }), {silent : true});
            nameToPageMap[item.name] = page;
          }
        }

        console.log('[Rendering ' + this.languageName + '.]');

        this.tocBarView = new PageTOCBarView({
          el            : '#toc',
          collection    : this.collection,
          nameToPageMap : nameToPageMap,
          languageName  : this.languageName
        });

        this.searchHeaderView = new PageSearchHeaderView({
          el: '#search-header',
          pages          : this.collection,
          pageElements   : this.pageElements,
          nameToPageMap  : nameToPageMap,
          placeholder    : this.options.placeholder,
          languageName   : this.languageName,
          debounceTime   : this.options.debounceTime,
          minQueryLength : this.options.minQueryLength
        });

        var tocSearchResultsView = this.options.tocSearchResultsView
          ? this.tocSearchResultsView
          : SearchResultsView;
        this.tocResultsView = new tocSearchResultsView({
          el            : '#toc-results',
          collection    : this.pageElements,
          itemTemplate  : tocResultTemplate,
          languageName  : this.languageName,
          visibleField  : 'tocVisible'
        });
        this.tocResultsView.render();

      });
    },

    render: function() {
      if (this.searchHeaderView) {
        this.searchHeaderView.render(); // Need to do this to change the placeholder 
      }
      return this;
    },

    setActive: function(active) {
      console.log('[setActive: ' + this.languageName + ' = ' + active + '.]');

      if (active && !this.active) {
        this.render();
        this.$searchResultsDiv.addClass(this.options.resultsClassNames);

        if (this.collection.length > 0) {

          // (Re)bind events
          this.searchHeaderView.addBindings();
          this.tocBarView.addBindings();

          this.searchHeaderView.onSearch();
          this.active = true;
        } else {
          console.log('[Fetching ' + this.languageName + '.]');

          this.mainResultsView.startSpinner();
          var self = this;
          this.collection.fetch({
            success: function(coll, resp) {
              console.log('[Success fetching ' + self.languageName + '.]');

              self.createAndRenderViews();    // _.once'd

              self.searchHeaderView.lastQuery = null; // TODO: use abstractions
              self.searchHeaderView.onSearch();
              self.mainResultsView.spinner.stop();

              if (self.lastQuery) {
                self.setQuery(self.lastQuery);
              }
              
              self.active = true;
            }
          });
        }
      } else if (!active && this.active) {
        // Unbind events
        this.searchHeaderView.removeBindings();
        this.tocBarView.removeBindings();

        // Hide everything
        this.collection.each(function(model) {
          model.set({ mainVisible: false });
        });
        if (this.pageElements) {
          this.pageElements.each(function(model) {
            model.set({ tocVisible: false });
          });
        }
        this.active = false;

        // Necessary so toc is displayed when clicking back to a language
        this.searchHeaderView.lastQuery = null;

        // Remove css styles
        this.$searchResultsDiv.removeClass(this.options.resultsClassNames);
      }
    },

    setQuery: function(query) {
      if (_.isUndefined(this.searchHeaderView)) {
        this.lastQuery = query;
      } else {
        this.searchHeaderView.$('#search-box').val(query);
        this.searchHeaderView.onSearch();
      }
    },

  });

  return PageScrapedLanguageView;
});

