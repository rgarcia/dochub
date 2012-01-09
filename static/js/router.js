// Filename: router.js
define([
  'libs/require/domReady-min!', // Use with the ! suffix (http://requirejs.org/docs/api.html#pageload)

  'jQuery',
  'Underscore',
  'Backbone',

  // Views
  'views/topnav',
  'views/jquerysearchresults',
  'views/languageview',
  'views/pagescrapedlanguageview',
  'views/fullwindow',

  // Collections
  'collections/mozdevcssprops',
  'collections/mdnhtmlelements',
  'collections/mdnjsobjs',
  'collections/mdndomobjs',
  'collections/phpexts',
  'collections/jqentries',
  'collections/xsltpages',
], function(doc, $, _, Backbone,
            TopNavView, JQuerySearchResultsView, LanguageView, PageScrapedLanguageView,
            FullWindowView,
            MozDevCSSPropCollection, MDNHtmlElementsCollection, MDNJsObjsCollection,
            MDNDomObjsCollection, PHPExtensionsCollection, JQEntriesCollection,
            XSLTPagesCollection) {

  var DocHub = Backbone.Router.extend({
    routes: {
      ''      : 'main',
      'about' : 'about'
    },

    initialize: function() {
      _.bindAll(this, 'changeLanguage');

      this.languageViews = {
        'css' : new LanguageView({
          languageName: 'CSS',
          resultsClassNames: 'pageText',
          collection: new MozDevCSSPropCollection(),
          placeholder: 'Type a CSS property name'
        }),
        'html' : new LanguageView({
          languageName: 'HTML',
          resultsClassNames: 'pageText',
          collection: new MDNHtmlElementsCollection(),
          placeholder: 'Type an HTML element name'
        }),
        'javascript' : new LanguageView({
          languageName: 'JavaScript',
          resultsClassNames: 'pageText',
          collection: new MDNJsObjsCollection(),
          placeholder: 'Type a JavaScript class/function name'
        }),
        'dom' : new LanguageView({
          languageName: 'DOM',
          resultsClassNames: 'pageText',
          collection: new MDNDomObjsCollection(),
          placeholder: 'Type a DOM object name'
        }),
        'jquery' : new LanguageView({
          languageName: 'jQuery',
          resultsClassNames: 'jq-primaryContent',
          collection: new JQEntriesCollection(),
          placeholder: 'Type a jQuery entry name',
          mainSearchResultsView: JQuerySearchResultsView,
        }),
        'php' : new LanguageView({
          languageName: 'PHP',
          resultsClassNames: '',
          collection: new PHPExtensionsCollection(),
          placeholder: 'Type a PHP function name',
          debounceTime: 150,  // PHP is slower b/c of larger data set
        }),
        'xslt' : new PageScrapedLanguageView({
          languageName: 'XSLT',
          resultsClassNames: '',
          collection: new XSLTPagesCollection(),
          placeholder: 'Type an XSLT element name',
          debounceTime: 100,  
        }),
      };

      this.currentLanguage = null;

      var self = this;
      this.renderTopNav = _.once(function() {
        self.topNavView = new TopNavView({
          el: $('#topbar-inner')
        });
        self.topNavView.render();
        self.topNavView.bind('changeLanguage', self.changeLanguage);
      });

      // Make a different route for each language:
      //  insta.com/#css
      //  insta.com/#html
      //  insta.com/#javascript
      //  ...
      for (languageName in this.languageViews) {
        console.log('Creating route for ' + languageName);
        var cb = {
          languageName: languageName,
          fn: function(query) {
            console.log('ROUTING ' + this.languageName + ' : ' + query);
            self.renderTopNav();  // _.once'd
            self.topNavView.setActiveElement('nav-' + this.languageName);
            self.languageViews[this.languageName].setQuery(query);
          }
        };
        _.bindAll(cb, 'fn');
        this.route(languageName + '/:query', languageName, cb.fn);
      }
    },

    changeLanguage: function(newLanguage) {
      // Hide about
      $('#about').css({'display': 'none'});

      // Show search
      $('#toc').css({'display': 'block'});
      $('#search-results').css({'display': 'block'});

      if (newLanguage === this.currentLanguage) {
        // TODO: To refresh the url in came from #about. Breaking abstractions everywhere.
        //       Super nasty :(
        this.languageViews[this.currentLanguage].searchHeaderView.onSearch();
        return;
      }
      if (this.currentLanguage !== null) {
        this.languageViews[this.currentLanguage].setActive(false);
      }

      console.log('Setting language to ' + newLanguage);
      this.languageViews[newLanguage].setActive(true);
      $('#search-box').focus();

      if (!this.fullWindow) {
        this.fullWindow = new FullWindowView();
      }
      // Make sure toc well height is set correctly (TODO: move this into tocbarview)
      this.languageViews[newLanguage].collection.bind('reset', this.fullWindow.onResize);

      this.currentLanguage = newLanguage;
    },

    main: function(query) {
      this.renderTopNav();  // _.once'd

      // Start everything
      this.changeLanguage('css');
    },

    about: function() {
      this.renderTopNav();  // _.once'd
      this.topNavView.setActiveElement('nav-about');

      // Hide search
      $('#toc').css({'display': 'none'});
      $('#search-results').css({'display': 'none'});

      // Show about
      $('#about').css({'display': 'block'});
    }
  });

  var initialize = function() {
    var mainApp = new DocHub();
    Backbone.history.start(); // can't do pushstate until we handle all routes on backend ({pushState: true});
  };

  return { initialize: initialize };
});

