var requirejs = require('requirejs');

requirejs([
  '../../config',
  'step',
  'spider',
  'mongoose',
  'underscore',   // used by mongoose.save
  'cheerio',      // used by mongoose.save
  '../../models/mdndomobj',
], function(config, step, spider, mongoose, _, cheerio, MDNDomObj) {

  // Config that shiz
  var jsSpider = spider();
  jsSpider.route('developer.mozilla.org', '/en/Gecko_DOM_Reference', function ($) {
    var crawlfn = function() {
      var href = $(this).attr('href');
      jsSpider.get(href);
    };
    $('#section_3 a').each(crawlfn);
  });

  var subroutes = [
    'DOM',
  ];
  var desiredRoutes = [
    /^document/i,
    /^element/i,
    /^event/i,
    /^range/i,
    /^selection/i,
    /^style/i,
    /^window/i,
  ];
  for (var i = 0; i < subroutes.length; ++i) {
    // Need this closure to get the subroute
    (function() {
      var subroute = subroutes[i] + '/';
      jsSpider.route('developer.mozilla.org', '/en/' + subroute + '*', function ($, url) {
        var remaining = url.split(subroute)[1];
        var urlMatch = false;
        for (var i = 0; i < desiredRoutes.length; ++i) {
          if (desiredRoutes[i].test(remaining)) {
            urlMatch = true;
            break;
          }
        }
        if (!urlMatch) {
          return;
        }

        var title = $('#title').text().trim();
        if (title === '') return;

        // Extract everything after the subroute and lowercase first letter
        var objName = remaining.replace(/\//g, '.');
        objName = objName[0].toLowerCase() + objName.substr(1);
        console.log('[Scraping ' + url + ' :: ' + objName + ']');

        // Create new obj to save
        var mdnobj = new MDNDomObj();
        step(
          function searchForExistingDoc() {
            MDNDomObj.findOne({ fullTitle: objName }, this);
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

    jsSpider.get('https://developer.mozilla.org/en/Gecko_DOM_Reference').log('info');
  });

  return;
});

