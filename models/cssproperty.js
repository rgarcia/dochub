define(['mongoose'], function(mongoose) {

  var Schema    = mongoose.Schema;
  var ObjectId  = Schema.ObjectId;

  var PropValue = new Schema({
    value       : String,
    description : String,
  });

  var Example = new Schema({
    description : String,
    code        : String,
  });

  var CSSProp = new Schema({
    id           : ObjectId,
    name         : { type: String, required: true },
    srcUrl       : { type: String, required: true },
    description  : { type: String, required: true },
    version      : { type: String, required: true },
    defaultValue : String,
    inherited    : String,
    jsSyntax     : String,
    values       : [PropValue],
    examples     : [Example]
  });

  return mongoose.model('CSSProp',CSSProp);

});
