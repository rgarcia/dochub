var requirejs = require('requirejs');

requirejs([
  '../../config',
  'step',
  'spider',
  'mongoose',
  'underscore',   // used by mongoose.save
  'cheerio',      // used by mongoose.save
  '../../models/mdnjsobj',
], function(config, step, spider, mongoose, _, cheerio, MDNJsObj) {

  // Config that shiz
  var jsSpider = spider();
  jsSpider.route('developer.mozilla.org', '/en/JavaScript/Reference', function ($) {
    var crawlfn = function() {
      var href = $(this).attr('href');
      jsSpider.get(href);
    };
    $('#section_2 a').each(crawlfn);
    $('#section_4 a').each(crawlfn);
    $('#section_5 a').each(crawlfn);
  });

  var subroutes = [
    'JavaScript/Reference/Global_Objects',
    'JavaScript/Reference/Statements',
    'JavaScript/Reference/Operators',
    'JavaScript_typed_arrays',
  ];
  for (var i = 0; i < subroutes.length; ++i) {
    // Need this closure to get the subroute
    (function() {
      var subroute = subroutes[i] + '/';
      jsSpider.route('developer.mozilla.org', '/en/' + subroute + '*', function ($, url) {
        var title = $('#title').text().trim();
        if (title === '') return;

        // Extract everything after the subroute
        var remaining = url.split(subroute)[1];
        var objName = remaining.replace(/\//g, '.');
        console.log('[Scraping ' + url + ' :: ' + objName + ']');

        // Create new obj to save
        var mdnobj = new MDNJsObj();
        step(
          function searchForExistingDoc() {
            MDNJsObj.findOne({ fullTitle: objName }, this);
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

            mdnobj['title']     = title;
            mdnobj['fullTitle'] = objName;
            mdnobj['sectionNames'] = [];
            mdnobj['sectionHTMLs'] = [];

            var ids = _.map($('[id^=section_]'), function(div) { return div.attribs.id } );

            for ( var i = 0; i < ids.length; i++ ) {
              var $section = cheerio.load($('[id^=' + ids[i] + ']').html());
              $section('script').remove(); // strip scripts
              var sectionName = "";
              for ( var j = 1; j <= 4; j++ ) {
                var headers = $section('h' + j);
                if ( headers.length > 0 ) {
                  sectionName = headers.text();
                  break;
                }
              }
              mdnobj['sectionNames'].push(sectionName);
              mdnobj['sectionHTMLs'].push($section.html());
            }

            mdnobj.save(this);
          },

          function postDBSave(err) {
            if (err) {
              console.log('[ERROR could not save to db: ' + err + ']');
              throw err;
            }

            console.log('[Successfully saved to db.]');
            return null;
          },

          function continueCrawling() {
            var crawlfn = function() {
              var href = $(this).attr('href');
              jsSpider.get(href);
            };
            $('#pageText a').each(crawlfn);
          }
        );
      });
    })();
  }

  // Do it son
  console.log('[Connecting to db: ' + config.mongo_uri + ']');
  mongoose.connect(config.mongo_uri, function(err) {
    if (err) {
      console.log('[Error connecting to db: ' + err + ']');
      throw err;
    } else {
      console.log('[Connected to ' + config.mongo_uri + ']');
    }

    jsSpider.get('https://developer.mozilla.org/en/JavaScript/Reference').log('info');
  });

  return;
});

