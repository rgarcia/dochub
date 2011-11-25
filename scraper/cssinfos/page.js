var requirejs = require('requirejs');

requirejs.config({
  // Pass the top-level main.js/index.js require
  // function to requirejs so that node modules
  // are loaded relative to the top-level JS file.
  nodeRequire: require
});

requirejs([
  '../../config',
  'step',
  'request',
  'cheerio',
  'mongoose',
  '../../models/mozdevcssprop',
  'underscore'
], function(config, step, request, cheerio, mongoose, MDNProp, _) {

  console.log('---------');
  console.log('scraping:',process.argv)

  var propName = process.argv[2];
  var url = process.argv[3];

  if ( propName[0] == '"' && propName[propName.length-1] == '"' )
    propName = propName.substring(1,propName.length-1);
  if ( url[0] == '"' && url[url.length-1] == '"' )
    url = url.substring(1,url.length-1);

  // connect to teh mongo db
  console.log(config.mongo_uri);

  var mdnprop = new MDNProp();

  step(
    function connectToDB() {
      mongoose.connect(config.mongo_uri, this);
    },

    function searchForExistingDoc(err) {
      if (err)
        throw err;
      else
        console.log('connected to ' + config.mongo_uri);

      MDNProp.findOne({title:propName},this);
    },

    function processFind(err, doc) {
      if (err)
        throw err;

      if ( !doc ) {
        console.log('no existing doc, creating one');
        return null;
      } else {
        console.log('removing doc and creating a new one');
        doc.remove(this);
      }
    },

    function processRemove(err) {
      if (err)
        throw err;
      request({uri:url}, this);
    },

    function scrapeHTML(err, response, body) {
      if (err) {
        console.log('ERROR loading ' + url)
        throw err;
      }

      if ( response.statusCode % 300 < 100 ) {
        console.log('ERROR: redirected, bad url');
        throw "";
      }

      var $ = cheerio.load(body);
      mdnprop['type']  = 'css';
      mdnprop['title'] = propName;
      mdnprop['sectionNames'] = [];
      mdnprop['sectionHTMLs'] = [];

      $('article section').each(function(i,elem) {
        var $section = cheerio.load($(this).html());
        $section('section').attr('style','padding-top:0px');
        var sectionName = "";
        for ( var j = 1; j <= 4; j++ ) {
          var headers = $section('h' + j);
          if ( headers.length > 0 ) {
            sectionName = headers.text();
            // replace w/ h3
            headers.after('<h3>' + headers.text() +'</h3>');
            headers.remove();
            break;
          }
        }
        console.log('found section ' + sectionName);
        mdnprop['sectionNames'].push(sectionName);
        mdnprop['sectionHTMLs'].push($section.html());
      });

      mdnprop.save(this);
    },

    function postDBSave(err) {
      if (err) {
        console.log('ERROR could not save to db');
        throw err;
      }

      console.log(mdnprop);
      console.log('successfully saved to db');
      mongoose.disconnect();
    }
  );
  return;
});
