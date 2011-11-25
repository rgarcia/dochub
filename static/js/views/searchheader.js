define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/searchheader.html',
], function($, _, BackBone, searchHeaderTemplate) {

  // the header does not re-render on collection events
  // it just handles applying the query to the collection of models
  var SearchHeaderView = BackBone.View.extend({
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
      $(this.el).html(this.template({ query: initialQuery }));
      return this;
    },

    onChangeLanguage: function(evt) {
      var targetText = evt.target.text.toLowerCase();
      if (this.languageType !== targetText) {
        // Change the active tab
        $('#toc-tabs > .active').removeClass('active');
        $('#' + evt.target.id).parent().addClass('active'); // Add 'active' to the li, not the a

        if ('css' === targetText) {
          $('#search-box').attr('placeholder', 'Type a CSS property name');
        } else if ('html' === targetText) {
          $('#search-box').attr('placeholder', 'Type an HTML element name');
        }

        this.languageType = targetText;
        this.onSearch();  // refresh TOC bar
      }
    },

    onSearch: function(evt) {
      console.log('onSearch');
      var query = $.trim(this.$('#search-box').val()).toLowerCase();

      // TODO: replacestate...
      BackBone.history.navigate(query, false);

      var queryExists = !(query === '');
      if (!queryExists) {
        query = '.';
      }
      console.log('searching for ' + query);

      query = new RegExp(query, 'i'); // Ignore case
      var searchfn = function(model) {
        // BEGIN GLORIOUS SEARCH ALGORITHM
        return query.test(model.get('htmlEscapedTitle'));
        // END GLORIOUS SEARCH ALGORITHM
      };
      var self = this;
      this.collection.each(function(model) {
        var visible = searchfn(model) && model.get('type') === self.languageType;
        model.set({tocVisible: visible, mainVisible: visible && queryExists});
      });
    },

  });

  return SearchHeaderView;
});
