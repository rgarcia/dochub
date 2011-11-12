define([
  'scraper',
  'underscore',
  '../models/mozdevcssprop',
  '../config'
], function(scraper, _, MozDevCSSProp, config) {

  // scrapes http://css-infos.net/properties/webkit for webkit data

  var rootURL = 'http://css-infos.net/properties/webkit';
  var detailURLs = [];

  return {

    detailPageScraper: function(err, $) {
      if (err) throw(err);

      doc = new MozDevCSSProp();

      doc['title'] = $('article h1 code').text().trim();
      console.log('-----------------')
      console.log('scraping ' + doc['title']);

      // map from section title to database field
      var sectionTitles = {
        'description' : 'summary',
        'syntax'  : 'syntax',
        'values'  : 'values',
      };

      $('section').each(function() {
        var sectionName = $(this).find('h1').text().trim().toLowerCase();
        var sectionContent = $(this).html();
        var docField = "";
        if ( sectionName in sectionTitles )
          docField = sectionTitles[sectionName];
        else
          docField = sectionName;
        doc[docField] = sectionContent;
        console.log('stored ' + docField);
      });

      // save to db!
      if ( config.environment === 'production' )
        doc.save();
    },

    rootLevelScraper: function() {
       // all the useful links on this page are in <code>... elements
      var self = this;
      scraper(rootURL, function(err, $) {
        $('ul.webkit a').each(function() {
          detailURLs.push('http://css-infos.net/' + $(this).attr('href').trim());
        });

        console.log(detailURLs);
        console.log(detailURLs.length);
        scraper(detailURLs,self.detailPageScraper);
      });
   }

  }
});
