define(['mongoose'], function(mongoose) {

  var Schema    = mongoose.Schema;
  var ObjectId  = Schema.ObjectId;

  var PHPExtension = new Schema({
    id             : ObjectId,
    title          : { type: String, required: true },  // e.g. length
    fullTitle      : { type: String, required: true },  // e.g. Array.length
    sectionNames   : [String],  // ordering important
    sectionHTMLs   : [String]
  });

  return mongoose.model('PHPExtension', PHPExtension);

});

