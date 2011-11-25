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
  'commander',
  'mongoose',
  '../../models/mozdevcssprop',
  'underscore'
], function(config, step, request, cheerio, program, mongoose, MozDevCssProp, _) {

  program
    .parse(global.process.argv);
//    .option('-r, --replace [false]', 'Replace existing document [false]', false)

  console.log('---------');
  console.log('scraping:',program.args);

  var propName = program.args[0];
  var url = program.args[1];

  if ( propName[0] == '"' && propName[propName.length-1] == '"' )
    propName = propName.substring(1,propName.length-1);
  if ( url[0] == '"' && url[url.length-1] == '"' )
    url = url.substring(1,url.length-1);

  // connect to teh mongo db
  console.log(config.mongo_uri);

  var mdnobj = new MozDevCssProp();

  step(
    function connectToDB() {
      mongoose.connect(config.mongo_uri, this);
    },

    function searchForExistingDoc(err) {
      if (err)
        throw err;
      else
        console.log('connected to ' + config.mongo_uri);

      MozDevCssProp.findOne({title:propName},this);
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
      mdnobj['type'] = 'html';
      mdnobj['title'] = propName;
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
        console.log('ERROR could not save to db');
        throw err;
      }

      console.log(mdnobj);
      console.log('successfully saved to db');
      mongoose.disconnect();
    }
  );
  return;
});
