define([
  'underscore',
  '../models/cssproperty'
], function(_, CSSPropertyModel) {

  return {

    mapping: {
      'read' : {
        'url'         : '/cssproperty/:name',
        'method'      : 'get',
        'description' : 'returns docuemnt for css property name',
        'auth'        : false
      },
      'find_cssproperty' : {
        'url':'/find_cssproperty',
        'method':'get',
        'description':'find css property. expects a GET parameter "query"',
        'auth':false
      }

    },

    read: function(req, res) {
      CSSPropertyModel.findOne({ name: req.params.name }, function(error, cssprop) {
        if (!error && cssprop) {
          res.header('Content-Type', 'application/json');
          res.send(JSON.stringify(cssprop), 200);
        } else {
          res.send('could not find css prop with name: ' + req.params.name, 404);
        }
      });
    },

    find_cssproperty: function(req, res) {
      res.header('Content-Type', 'application/json');

      var query = CSSPropertyModel.find({});

      // TODO: frontend only queries w/ "name"...should offer advanced search
      _.each(['name', 'description', 'possibleValues'], function(param) {
        if ( paramVal = req.param(param, null) ) {
          console.log('querying for ' + param + ': ' + paramVal)
          query.$regex(param, new RegExp(paramVal,'i'));
        }
      });

      query.limit(1);

      query.exec(function(err, cssprops) {
        if ( err || cssprops.length == 0 ) {
          res.send(JSON.stringify([]));
        } else {
          res.send(JSON.stringify(cssprops));
        }
      });
    }
  };
});
