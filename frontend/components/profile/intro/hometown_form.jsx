var React = require('react');

var SessionStore = require('./../../../stores/session_store');
var SessionApiUtil = require('./../../../util/session_api_util');
var UserApiUtil = require('./../../../util/user_api_util');
var UserStore = require('./../../../stores/user_store');

var HometownForm = React.createClass({

  getInitialState: function () {

    if (SessionStore.currentUserId() === this.props.id) {
      return( { hometown : SessionStore.currentUser().hometown,
                editing : false } ) ;
    } else {
      UserApiUtil.fetchUser(this.props.id);
      return( { hometown : "", editing : false } );
    }
  },

  toggleEditing: function (e) {

    if (this.state.editing) {
      this.setState( { editing: false } );
    } else {
    this.setState( { editing: true } );
    }
  },

  componentDidMount: function () {
    this.listener = UserStore.addListener(this.handleChange);
  },

  componentWillUnmount: function () {
    this.listener.remove();
  },

  handleChange: function () {
    this.setState( { hometown : UserStore.retrieveUser().hometown || "" } );
  },

  updateHometown: function (e) {

    e.preventDefault();

    this.setState( { hometown: e.target.value } );
  },

  handleSubmit: function (e) {

    e.preventDefault();

    SessionApiUtil.updateCurrentUser( { hometown : this.state.hometown });

    this.toggleEditing();
  },

  render: function () {

    if (SessionStore.currentUserId() !== this.props.id) {

      return (
        <div className="group">
          <div
          className="hometown-form-value">Hometown: {this.state.hometown}</div>
        </div>
      )
    } else if (this.state.editing) {
      return (
        <form className="group"
          onSubmit={this.handleSubmit}>
          <input
          type="text"
          className="hometown-form-input"
          value={this.state.hometown}
          onChange={this.updateHometown}/>
          <input
          type="submit"
          className="hometown-form-save"
          value="Save"/>
        </form>
      )
    } else if (this.state.hometown === "") {
            return (
              <div className="group">
                <div
                className="hometown-form-value">What's your hometown?</div>
                <button
                className="hometown-form-edit"
                onClick={this.toggleEditing}>Edit</button>
              </div>
            )
      } else {

        return (
          <div className="group">
            <div
            className="hometown-form-value">Hometown: {this.state.hometown}</div>
            <button
            className="hometown-form-edit"
            onClick={this.toggleEditing}>Edit</button>
          </div>
        )
      }
    }
});

module.exports = HometownForm;
