define(['mongoose'], function(mongoose) {

  var Schema    = mongoose.Schema;
  var ObjectId  = Schema.ObjectId;

  var CSSProperty = new Schema({
    id                : ObjectId,
    name              : { type: String, required: true },
    description       : { type: String, required: true },
    possibleValues    : String, // todo list
    example           : String,
    relatedProperties : String // todo list
  });

  return mongoose.model('CSSProperty',CSSProperty);

});
