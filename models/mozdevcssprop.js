define(['mongoose'], function(mongoose) {

  var Schema    = mongoose.Schema;
  var ObjectId  = Schema.ObjectId;

  var MozDevCSSProp = new Schema({
    id           : ObjectId,
    title        : { type: String, required: true },
    summary              : String,
    syntax               : String,
    values               : String,
    relatedProperties    : String,
    examples             : String,
    notes                : String,
    specifications       : String,
    browserCompatability : String,
  });

  return mongoose.model('MozDevCSSProp',MozDevCSSProp);

});
