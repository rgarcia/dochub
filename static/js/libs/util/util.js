// utils lib
define([
  'Underscore',
], function(_) {

  var exports = {

    // c.f. http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    S4: function() {
      return (((1+Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },

    // Not a TRUE guid, whatever that means.
    guid: function() {
      var S4 = this.S4; // For brevity
      return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },

    uid: function() {
      var S4 = this.S4; // For brevity
      return S4()+S4()+S4()+S4();
    },
  };

  return exports;
});

