define(['mongoose'], function(mongoose) {

  var Schema    = mongoose.Schema;
  var ObjectId  = Schema.ObjectId;

  var MozDevCSSProp = new Schema({
    id             : ObjectId,
    title          : { type: String, required: true },
    sectionNames   : [String],  // ordering important
    sectionHTMLs   : [String]
  });

  return mongoose.model('MozDevCSSProp',MozDevCSSProp);

});
