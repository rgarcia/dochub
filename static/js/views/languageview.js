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
  'text!templates/mozdevcssprop.html',
], function($, _, Backbone,
            TOCBarView, SearchHeaderView, SearchResultsView,
            tocResultTemplate, fullResultTemplate) {

  var LanguageView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render', 'setActive');

      this.languageName = this.options.languageName;
      this.createAndRenderViews = _.once(function() {
        console.log('Rendering ' + this.languageName);

        this.tocBarView = new TOCBarView({
          el: '#toc',
          collection: this.collection
        });
        this.tocBarView.render();

        this.searchHeaderView = new SearchHeaderView({
          el: '#search-header',
          collection: this.collection
        });
        this.searchHeaderView.render();

        this.tocResultsView = new SearchResultsView({
          el: '#toc-results',
          collection: this.collection,
          itemTemplate: tocResultTemplate,
          visibleField: 'tocVisible'
        });

        this.mainResultsView = new SearchResultsView({
          el: '#search-results',
          collection: this.collection,
          itemTemplate: fullResultTemplate,
          visibleField: 'mainVisible',
          spinner: true
        });
      });
    },

    render: function() {
      this.createAndRenderViews();  // _.once'd
      return this;
    },

    setActive: function(active) {
      console.log('setActive: ' + this.languageName + ' = ' + active);

      var self = this;
      if (active) {
        this.render();
        if (this.collection.length > 0) {
          this.searchHeaderView.onSearch();
        } else {
          this.mainResultsView.startSpinner();
          console.log('Fetching ' + this.languageName);
          this.collection.fetch({
            success: function(coll, resp) {
              console.log('Success fetching ' + self.languageName);
              self.searchHeaderView.onSearch();
              self.mainResultsView.spinner.stop();
            }
          });
        }
      } else {
        // Nothing for now
      }
    },

  });

  return LanguageView;
});

