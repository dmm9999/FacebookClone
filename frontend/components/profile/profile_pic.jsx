var React = require('react');

var SessionStore = require('./../../stores/session_store');
var SessionApiUtil = require('./../../util/session_api_util');

var ProfilePic = React.createClass({

  getInitialState: function () {

    return( { imageUrl : SessionStore.currentUser().profile_pic_url } ) ;

  },

  updateFile: function (e) {

    e.preventDefault();

    var reader = new FileReader();
    var file = e.currentTarget.files[0];
    reader.onloadend = function() {
      this.setState( { imageUrl: reader.result, imageFile: file } );
    }.bind(this);



    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.setState( { imageFile: null } );
    }
  },

  savePic: function (e) {

    e.preventDefault();

    var formData = new FormData();
    formData.append("user[profile_pic]", this.state.imageFile);

    SessionApiUtil.updateCurrentUser(formData);
  },

  render: function () {

    return (
      <div className="profile-pic">
        <img src={this.state.imageUrl}/>
        <input type="file" onChange={this.updateFile}/>
        <input type="submit" value="Save Profile Pic" onClick={this.savePic} />
      </div>
    );

  }

});




module.exports = ProfilePic;
