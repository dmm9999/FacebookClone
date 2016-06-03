var React = require('react');
var SessionStore = require('./../../../stores/session_store');
var SessionApiUtil = require('./../../../util/session_api_util');

var HometownForm = React.createClass({

  getInitialState: function () {

    var currentUser = SessionStore.currentUser();

    return ( { currentUser : currentUser });

  },

  updateHometown: function (e) {

    e.preventDefault();

    this.setState( { currentUser : { hometown: e.target.value } } );
  },

  handleSubmit: function (e) {

    e.preventDefault();

    var currentUser = this.state.currentUser;

    SessionApiUtil.updateCurrentUser(currentUser);
  },

  render: function() {
    return (
      <div>
        <form
          onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.currentUser.hometown}
            onChange={this.updateHometown}
            placeholder="What's your hometown?"
            />
          <input
            type="submit"
            value="Save"
            />
        </form>
      </div>
    );
  }

});

module.exports = HometownForm;
