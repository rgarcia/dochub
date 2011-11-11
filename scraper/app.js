define([
  'mongoose',
  'scraper',
  'underscore',
  '../config',
  '../models/cssprop',
  '../models/mozdevcssprop',
  './w3schools',
  './mozdevcss'
], function (mongoose, scraper, _, config, CSSProp, MozDevCSSProp, w3schools, mozdevcss) {

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
        if ( config.environment === 'production' ) {
          console.log('clearing out collections');
          //CSSProp.collection.remove({});
          MozDevCSSProp.collection.remove({});
        }

        //console.log('scraping w3schools');
        //w3schools.rootLevelScraper();

        console.log('scraping mozdev');
        mozdevcss.rootLevelScraper();
      }
    });
});
