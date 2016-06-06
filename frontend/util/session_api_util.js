var SessionActions = require('../actions/session_actions');
var ErrorActions = require('../actions/error_actions');

var SessionApiUtil = {

  login: function (credentials) {
    $.ajax({
      url: '/api/session',
      type: 'POST',
      data: { user: credentials },
      success: function (currentUser) {
        SessionActions.receiveCurrentUser(currentUser);
      },
      error: function (xhr) {
        var errors = xhr.responseJSON;
        ErrorActions.setErrors("login", errors);
      }
    });
  },

  logout: function () {
    $.ajax({
      url: '/api/session',
      type: 'DELETE',
      success: function () {
        SessionActions.removeCurrentUser();
      },
    });
  },

  fetchCurrentUser: function (complete) {
    $.ajax({
      url: '/api/session',
      type: 'GET',
      success: function (currentUser) {
        SessionActions.receiveCurrentUser(currentUser);
      },
      complete: complete
    });
  },

  updateCurrentUser: function (data) {
    $.ajax({
      url: '/api/users',
      type: 'PATCH',
      data: { user : data } ,
      success: function (updatedCurrentUser) {
        SessionActions.updateCurrentUser(updatedCurrentUser);
      },
      error: function () {
      }
    });
  }

};

module.exports = SessionApiUtil;
