define([
  'jQuery',
  'Underscore',
  'Backbone',

  // Views
  'views/tocbar',
  'views/searchheader',
  'views/searchresults',

  // Templates
  'text!templates/tocresult.html',
  'text!templates/sectionscrape.html',
], function($, _, Backbone,
            TOCBarView, SearchHeaderView, SearchResultsView,
            tocResultTemplate, fullResultTemplate) {

  var LanguageView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render', 'setActive', 'setQuery');

      this.active = false;

      this.languageName = this.options.languageName;
      this.createAndRenderViews = _.once(function() {
        console.log('[Rendering ' + this.languageName + '.]');

        // Save for later
        this.searchResultsDiv = $('#search-results');

        this.tocBarView = new TOCBarView({
          el: '#toc',
          collection:   this.collection,
          languageName: this.languageName
        });
        this.tocBarView.render();

        this.searchHeaderView = new SearchHeaderView({
          el: '#search-header',
          collection:   this.collection,
          placeholder:  this.options.placeholder,
          languageName: this.languageName,
          debounceTime: this.options.debounceTime
        });

        var tocSearchResultsView = this.options.tocSearchResultsView
          ? this.tocSearchResultsView
          : SearchResultsView;
        this.tocResultsView = new tocSearchResultsView({
          el: '#toc-results',
          collection:   this.collection,
          itemTemplate: tocResultTemplate,
          itemViewOptions: { tagName: 'li' },
          languageName: this.languageName,
          visibleField: 'tocVisible'
        });

        var mainSearchResultsView = this.options.mainSearchResultsView
          ? this.options.mainSearchResultsView
          : SearchResultsView;
        this.mainResultsView = new mainSearchResultsView({
          el: '#search-results',
          collection:   this.collection,
          itemTemplate: this.options.mainResultTemplate ?
                        this.options.mainResultTemplate :
                        fullResultTemplate,
          visibleField: 'mainVisible',
          languageName  : this.languageName,
          spinner: true
        });
      });
    },

    render: function() {
      this.createAndRenderViews();    // _.once'd
      this.searchHeaderView.render(); // Need to do this to change the placeholder 
      return this;
    },

    setActive: function(active) {
      console.log('[setActive: ' + this.languageName + ' = ' + active + '.]');

      if (active && !this.active) {
        this.render();
        this.searchResultsDiv.addClass(this.options.resultsClassNames);
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
/*
            xhr: function() {
              var xhr = jQuery.ajaxSettings.xhr();
              if (xhr instanceof window.XMLHttpRequest) {
                // XMLHttpRequest 2
                xhr.addEventListener("progress", function(evt) {
                  if (evt.lengthComputable) {
                    self.mainResultsView.setDownloadProgress(evt.loaded, evt.total);
                  }
                }, false);
              }
              return xhr;
            },
*/
            success: function(coll, resp) {
              console.log('[Success fetching ' + self.languageName + '.]');
              self.searchHeaderView.lastQuery = null; // TODO: use abstractions
              self.searchHeaderView.onSearch();
              self.mainResultsView.spinner.stop();
              //self.mainResultsView.removeDownlaodProgress();
              self.active = true;
            },
          });
        }
      } else if (!active && this.active) {
        // Unbind events
        this.searchHeaderView.removeBindings();
        this.tocBarView.removeBindings();

        // Hide everything
        this.collection.each(function(model) {
          model.set({ tocVisible: false, mainVisible: false });
        });
        this.active = false;

        // Necessary so toc is displayed when clicking back to a language
        this.searchHeaderView.lastQuery = null;

        // Remove css styles
        this.searchResultsDiv.removeClass(this.options.resultsClassNames);
      }
    },

    setQuery: function(query) {
      this.searchHeaderView.$('#search-box').val(query);
      this.searchHeaderView.onSearch();
    },

  });

  return LanguageView;
});

