var requirejs = require('requirejs');

requirejs([
  '../../config',
  'step',
  'spider',
  'mongoose',
  'underscore',   // used by mongoose.save
  'cheerio',      // used by mongoose.save
  '../../models/jqentry',
], function(config, step, spider, mongoose, _, cheerio, JQEntry) {

  // Config that shiz
  var jsSpider = spider();
  jsSpider.route('api.jquery.com', '/', function ($) {
    var crawlfn = function() {
      var href = $(this).attr('href');
      jsSpider.get(href);
    };
    $('#content a.title-link').each(crawlfn);
  });

  // Change '.add()' to 'add'
  var jQueryFunctionNameRegex = /^\.?(\S+)\(\)$/;
  var defunctionfy = function(txt) {
    var result = txt.match(jQueryFunctionNameRegex);
    if (result === null) {
      return txt;
    } else {
      return result[1];
    }
  }

  jsSpider.route('api.jquery.com', '/*', function ($, url) {
    var title = defunctionfy($('h1.jq-clearfix').text().trim());
    if (title === '') return;

    var objName = title;
    console.log('[Scraping ' + url + ' :: ' + objName + ']');

    // Create new obj to save
    var jqentry = new JQEntry();
    step(
      function searchForExistingDoc() {
        JQEntry.findOne({ fullTitle: objName }, this);
      },

      function processFind(err, doc) {
        if (err) {
          console.log('[processFind error: ' + err + ']');
          throw err;
        }

        if ( !doc ) {
          console.log('[No existing doc, creating one.]');
          return null;
        } else {
          console.log('[Removing doc and creating a new one.]');
          doc.remove(this);
        }
      },

      function processRemoveAndAddNewDoc(err) {
        if (err) {
          console.log('[processRemoveAndAddNewDoc error: ' + err + ']');
          throw err;
        }

        jqentry['title']     = title;
        jqentry['fullTitle'] = objName;
        jqentry['sectionNames'] = [ title ];
        jqentry['sectionHTMLs'].push($($($('div.entry-content').children()[1]).children()[1]).html());

        jqentry.save(this);
      },

      function postDBSave(err) {
        if (err) {
          console.log('[ERROR could not save to db: ' + err + ']');
          throw err;
        }

        console.log('[Successfully saved to db.]');
        return null;
      }
    );
  });

  // Do it son
  console.log('[Connecting to db: ' + config.mongo_uri + ']');
  mongoose.connect(config.mongo_uri, function(err) {
    if (err) {
      console.log('[Error connecting to db: ' + err + ']');
      throw err;
    } else {
      console.log('[Connected to ' + config.mongo_uri + ']');
    }

    jsSpider.get('http://api.jquery.com/').log('info');
  });

  return;
});

