define([
  'mongoose',
  'scraper',
  'underscore',
  '../config',
  '../models/cssproperty',
  './w3schools'
], function (mongoose, scraper, _, config, CSSPropertyModel, w3schools) {

  // connect to db
  var db = mongoose.connect(
    'mongodb://' + config.db_user_prod + ':' + config.db_pass_prod +
      '@' + config.db_host_prod + ':' + config.db_port_prod + '/' + config.db_name_prod,
    function(err) {
      if (err) {
        console.log(err);
        throw err;
      } else {
        console.log('connected to db');

        console.log('clearing out collections');
        CSSPropertyModel.collection.remove({});

        console.log('scraping w3schools');
        w3schools.rootLevelScraper();
      }
    });
});
