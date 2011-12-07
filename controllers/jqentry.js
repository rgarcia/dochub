define([
  'underscore',
  '../models/jqentry'
], function(_, JQEntry) {

  return {

    mapping: {

      'read' : {
        'url'         : '/jqentry/:name',
        'method'      : 'get',
        'description' : 'returns docuemnt for css property name',
        'auth'        : false
      },

      'read_all' : {
        'url'         : '/jqentry',
        'method'      : 'get',
        'description' : 'returns everything',
        'auth'        : false
      },

    },

    read: function(req, res) {
      JQEntry.findOne({ name: req.params.name }, function(error, cssprop) {
        if (!error && cssprop) {
          res.header('Content-Type', 'application/json');
          res.send(JSON.stringify(cssprop), 200);
        } else {
          res.send('could not find css prop with name: ' + req.params.name, 404);
        }
      });
    },

    read_all: function(req, res) {
      JQEntry.find({}, function(error, cssprop) {
        if (!error && cssprop) {
          res.header('Content-Type', 'application/json');
          res.send(JSON.stringify(cssprop), 200);
        } else {
          res.send('error', 404);
        }
      });
    },

  };
});
