var requirejs = require('requirejs');

requirejs([
  '../../config',
  'step',
  'spider',
  'mongoose',
  'underscore',   // used by mongoose.save
  'cheerio',      // used by mongoose.save
  '../../models/phpext',
], function(config, step, spider, mongoose, _, cheerio, PhpExt) {

  // c.f. http://docs.jquery.com/Frequently_Asked_Questions#How_do_I_select_an_element_by_an_ID_that_has_characters_used_in_CSS_notation.3F
  function jq(myid) { 
    // return '#' + myid.replace(/(:|\.)/g,'\\$1');
    // XXX: This is cheerio, NOT jQuery
    return '#' + myid;
  }
  var extractJqueryId = function(url) {
    var remaining = url.split('manual/en/')[1];
    return jq(remaining.replace('.php', ''));
  }

  var desiredExts = _.map([
    "Apache",
    "Arrays",
    "Bzip2",
    "Calendar",
    "Classkit",
    "Class/Objects",
    "COM",
    "cURL",
    "Date/Time",
    "DBA",
    "DB++",
    "Direct IO",
    "Directories",
    "DOM",
    ".NET",
    "Eio",
    "Error Handling",
    "Program execution",
    "Filesystem",
    "FTP",
    "Function Handling",
    "Gearman",
    "GeoIP",
    "Hash",
    "HTTP",
    "ID3",
    "IIS",
    "IMAP",
    "Ingres",
    "Java",
    "JSON",
    "LDAP",
    "Libeventlibxml",
    "Mail",
    "Math",
    "Mailparse",
    "Memcache",
    "Memcached",
    "Mongo",
    "MySQL",
    "MySQLi",
    "OAuth",
    "OpenSSL",
    "Output Control",
    "PostgreSQL",
    "POSIX",
    "Readline",
    "SimpleXML",
    "SQLite",
    "SQLite3",
    "SQLSRV",
    "SSH2",
    "Streams",
    "Strings",
    "SWF",
    "Sybase",
    "ODBC",
    "URLs",
    "Variable handling",
    "WinCache",
    "XML-RPC",
    "XSL",
    "Yaml",
    "Zip",
    "Zlib",
  ], function(str) {
    return str.toLowerCase();
  });

  // Config that shiz
  var jsSpider = spider();
  jsSpider.route('www.php.net', '/manual/en/extensions.alphabetical.php', function ($, url) {
    console.log(url);
    var crawlfn = function() {
      var href = 'http://www.php.net/manual/en/' + $(this).attr('href');
      jsSpider.get(href);
    };

    var links = _.filter($(jq('extensions.alphabetical') + ' a'), function(link) {
      var txt = $(link).text().trim().toLowerCase();
      return desiredExts.indexOf(txt) > -1;
    });
    $(links).each(crawlfn);
  }).route('www.php.net', '/manual/en/book*', function ($, url) {
    console.log(url);
    var crawlfn = function() {
      var href = 'http://www.php.net/manual/en/' + $(this).attr('href');
      jsSpider.get(href);
    };

    var jqId = extractJqueryId(url);
    $(jqId + ' a').each(crawlfn);
  }).route('www.php.net', '/manual/en/ref*', function ($, url) {
    console.log(url);
    var crawlfn = function() {
      var href = 'http://www.php.net/manual/en/' + $(this).attr('href');
      jsSpider.get(href);
    };

    var jqId = extractJqueryId(url);
    $(jqId + ' a').each(crawlfn);
  });

  var subroutes = [
    'function*',
  ];
  for (var i = 0; i < subroutes.length; ++i) {
    // Need this closure to get the subroute
    (function() {
      var subroute = subroutes[i];
      jsSpider.route('www.php.net', '/manual/en/' + subroute, function ($, url) {
        var title = $('h1.refname').text().trim();
        if (title === '') return;

        // Extract everything after the subroute and lowercase first letter
        var remaining = url.split('manual/en/')[1];
        var objName = title;
        console.log('[Scraping ' + url + ' :: ' + objName + ']');

        // Create new obj to save
        var phpobj = new PhpExt();
        step(
          function searchForExistingDoc() {
            PhpExt.findOne({ fullTitle: objName }, this);
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

            phpobj['title']     = title;
            phpobj['fullTitle'] = objName;
            phpobj['sectionNames'] = [ title ];
            phpobj['sectionHTMLs'] = [ $(extractJqueryId(url)).html() ];

            phpobj.save(this);
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
              var href = 'http://www.php.net/manual/en/' + $(this).attr('href');
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

    jsSpider.get('http://www.php.net/manual/en/extensions.alphabetical.php').log('info');
  });

  return;
});

