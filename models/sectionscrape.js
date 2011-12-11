define(['mongoose'], function(mongoose) {

  var Schema    = mongoose.Schema;
  var ObjectId  = Schema.ObjectId;

  var SectionScrape = new Schema({
    id             : ObjectId,
    url            : String,
    title          : { type: String, required: true },
    sectionNames   : [String],  // ordering important
    sectionHTMLs   : [String]
  });

  return mongoose.model('SectionScrape',SectionScrape);

});
