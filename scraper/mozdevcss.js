define([
  'scraper',
  'underscore',
  '../models/mozdevcssprop',
  '../config'
], function(scraper, _, MozDevCSSProp, config) {
  // scrapes mozdev css reference page

  var rootURL = 'https://developer.mozilla.org/en/CSS/CSS_Reference';
  var detailURLs = [];

  return {

    detailPageScraper: function(err, $) {
      if (err) throw(err);

      mozdevdoc = new MozDevCSSProp();

      mozdevdoc['title'] = $('#title').text();
      console.log('-----------------')
      console.log('scraping ' + mozdevdoc['title']);

      if ( !mozdevdoc['title'] ) {
        console.log('ERROR: could not find title');
        return;
      }

      // function that looks for a section_* with a certain title,
      // sets a document field to the html contents or null if it can't find any
      var sectionScraper = function(title, dbfield) {
        //console.log('looking for ' + title);
        var $section = $('[id^=section_]').filter(function() {
          return $(this).children(0).attr('id').toLowerCase() === title.toLowerCase();
        });
        mozdevdoc[dbfield] = $section.length > 0 ? $section.html() : null;
      };

      // map from section title to database field
      var sectionTitles = {
        'summary' : 'summary',
        'syntax'  : 'syntax',
        'values'  : 'values',
        'related properties' : 'relatedProperties',
        'examples' : 'examples',
        'notes' : 'notes',
        'specifications' : 'specifications',
        'browser compatibility' : 'browserCompatability'
      };

      for ( section in sectionTitles ) {
        sectionScraper(section,sectionTitles[section]);
      }

      // save to db!
      if ( config.environment === 'production' )
        mozdevdoc.save();
      //console.log(mozdevdoc);
    },

    rootLevelScraper: function() {
       // all the useful links on this page are in <code>... elements
      var self = this;
      scraper(rootURL, function(err, $) {
        $('code a').each(function() {
          detailURLs.push($(this).attr('href').trim());
        });

        console.log(detailURLs);
        console.log(detailURLs.length);
        scraper(detailURLs,self.detailPageScraper);
      });
   }

  }
});
