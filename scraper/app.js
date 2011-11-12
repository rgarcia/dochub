define([
  'mongoose',
  'scraper',
  'underscore',
  '../config',
  '../models/mozdevcssprop',
  './mozdevcss',
  './cssinfos'
], function (mongoose, scraper, _, config, MozDevCSSProp, mozdevcss, cssinfos) {

  var db = mongoose.connect(
    'mongodb://' + config.db_user_prod + ':' + config.db_pass_prod +
      '@' + config.db_host_prod + ':' + config.db_port_prod + '/' + config.db_name_prod,
    function(err) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log('connected to db');

        // have to set NODE_ENV to 'production' to actually hit the db
        // todo: just update db docs, don't reset like this
        //if ( config.environment === 'production' ) {
          //console.log('clearing out collections');
          //MozDevCSSProp.collection.remove({});
        //}

        // console.log('scraping mozdev');
        // mozdevcss.rootLevelScraper();

        console.log('scraping cssinfos for webkit data');
        cssinfos.rootLevelScraper();
      }
    });
});
