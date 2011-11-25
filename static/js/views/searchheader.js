define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/searchheader.html',
], function($, _, Backbone, searchHeaderTemplate) {

  // the header does not re-render on collection events
  // it just handles applying the query to the collection of models
  var SearchHeaderView = Backbone.View.extend({
    id: 'search-header',
    className: 'search-header',

    events: {
      'click #CSS-toc'       : 'onChangeLanguage',
      'click #HTML-toc'      : 'onChangeLanguage',
      'keyup #search-box'    : 'onSearch',
    },

    initialize: function() {
      _.bindAll(this, 'render', 'onChangeLanguage', 'onSearch');
      this.template = _.template(searchHeaderTemplate);

      this.languageType = 'css';  // TODO: unhack to pick based on which is "active"
      this.render();  // TODO: why are we calling render in initialize?
    },

    render: function() {
      console.log('rendering search header');
      var initialQuery = this.options.query ? this.options.query : "";
      this.$(this.el).html(this.template({ query: initialQuery }));
      return this;
    },

    onChangeLanguage: function(evt) {
      var targetText = evt.target.text.toLowerCase();
      if (this.languageType !== targetText) {
        // Change the active tab
        this.$('#toc-tabs > .active').removeClass('active');
        this.$('#' + evt.target.id).parent().addClass('active'); // Add 'active' to the li, not the a

        var searchBox = this.$('#search-box');
        if ('css' === targetText) {
          searchBox.attr('placeholder', 'Type a CSS property name');
        } else if ('html' === targetText) {
          searchBox.attr('placeholder', 'Type an HTML element name');
        }

        this.languageType = targetText;
        searchBox.focus();
        this.onSearch();  // refresh TOC bar
      }
    },

    onSearch: function(evt) {
      console.log('onSearch');
      var query = $.trim(this.$('#search-box').val()).toLowerCase();

      // TODO: replacestate...
      Backbone.history.navigate(query, false);

      var queryExists = (query !== '');
      if (!queryExists) {
        // query = '.';
        //
        // No query, so can do some optimizations.
        //  1. Don't use the search function
        //  2. Set tocVisibile for all elements based on self.languageType
        //  3. For all mainVisible, set mainVisible false
        var self = this;
        this.collection.each(function(model) {
          model.set({
            tocVisible  : model.get('type') === self.languageType,
            mainVisible : false
          });
        });
      } else {
        console.log('searching for ' + query);

        query = new RegExp(query, 'i'); // Ignore case
        var searchfn = function(model) {
          // BEGIN GLORIOUS SEARCH ALGORITHM
          return query.test(model.get('htmlEscapedTitle'));
          // END GLORIOUS SEARCH ALGORITHM
        };
        var self = this;
        this.collection.each(function(model) {
          var visible = (model.get('type') === self.languageType) && searchfn(model);
          model.set({ tocVisible: visible, mainVisible: visible });
        });
      }
    },

  });

  return SearchHeaderView;
});
