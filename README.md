# FaceLyft

[FaceLyft live][heroku]

[heroku]: http://facelyft.heroku.com

FaceLyft is a full-stack web application inspired by Facebook.  It utilizes Ruby on Rails on the backend, a PostgreSQL database, and React.js with a Flux architectural framework on the frontend.

### Single-Page App

FaceLyft is a single-page app. This is accomplished by having a single html root page which uses React Router to allow for navigation around the single-page. Logging in is handled on the frontend via a `SessionStore` and React Router `onEnter` hooks to prevent navigation to pages beyond the login/signup page without the proper authorization. Logging in on the backend makes use of a password digest implemented using `BCrypt` (so that passwords are not directly stored) and a session token to establish user identity.

### User Profile

Each user is stored as a row in the users table in the database. The only required columns for the `User` table are the user's `email_address`, `password_digest` generated by BCrypt from their password and `session_token`. There are many other optional columns (such as `name`, `hometown`, `current city`, `birthday`, etc) that users can fill out if they so wish via their user profile.

Changes to these fields are made using the `Introduction` panel on the user's `Profile`. This panel is a react component where each field toggles between being editable and fixed via a button. Once changes are saved they are immediately updated via a flux loop involving the `SessionStore` on the frontend while the backend is updated via an AJAX post request.

### Friends

A major feature of FaceLyft is the ability to friend other users. Doing so allows you to make posts on their profile timeline as well as their posts appearing on your newsfeed.

This was implemented by means of friendship table. Each row represented a single friendship by means of a `friender_id` (a foreign key linked to the `id` of the user who submitted the friend request) and a `friended_id` (the user who the request was made to). In addition to this the status of the request was stored in a boolean column `accepted`. Friendship requests are made via a React component on the user's profile. This creates the row in the table and defaults its accepted status to false. If the request is accepted its accepted status is toggled to true. If it is not the row is deleted from the database.

This structure allowed me to use some interesting ActiveRecord methods so that only the correct rows in the table were sent down when requested. One interesting complication was that most of the rendering of friendships is agnostic as to who friended whom but the database is not. This meant that any call for this data had to check whether the user's id was the friender or the friended in the table. This was one of the most fun mental challenges of the project!

### Friend Request Notifications

Users accept friend requests by means of a React component visible from both their timeline and newsfeed. When they receive a friend request, a counter in this component increments to inform them of how many requests they have. When the user hovers over the component a list of friend requests drops down. Each one allows for the user to confirm or delete the request.

### Posts

Users can post on their own timeline or on their friends' timelines but not on those of unfriended users. To accomplish this a `Post` table was used. This has columns for `author_id` (a foreign key linked to the id of the user who wrote the post), `profile_id` (a foreign key linked to the id of the user whose profile the post was written on) and `body` to contain the contents of the post.

Rendering posts was handled in React by rendering a `PostsIndex` containing `PostIndexItem`s accessed on the frontend via a `PostStore`. Posts are stored in chronological order by means of their primary key so their order was reversed in the render to make the most recent posts appear at the top.

`PostIndex` render method:

```javascript

render: function () {
  var posts = <div/>;
  if (this.state.posts.length > 0) {
    posts = this.state.posts.reverse().map(function(post) {
      return <li key={post.id}><PostsIndexItem
        post={post}
        /></li>;
    });
  }
  return (
    <ul className="posts-index">
      {posts}
    </ul>
  );
}
```

### Profile Pic and Cover Photo

Users can include two images on their profile page. These images are hosted by Amazon Web Services and uploaded by means of the Paperclip gem. Access to updating these fields is given by buttons that appear when a user hovers over the `profile_pic` or `coverpic` respectively. They can then select a file to upload, save it and the page will re-render with the new image while an AJAX post request is made asynchronously to the backend to update the user table with this information.

## Future Directions for the Project

I'm excited to include even more features in FaceLyft. Here's a selection of a few of the things I have in mind:

### Search

Allowing users to search for other users is an important feature. In lieu of this my app currently generates a component which displays random users on the newsfeed page.

### Comments

Users can currently make posts but these posts can't be commented on. I would implement this via a similar structure to the existing one for Posts.

### Likes

Users cannot currently like posts. I plan to implement this via a Like React component with a toggleable status which listens to a LikeStore and calls for data from a Like table on the backend.

### Notifications

Friend request notifications have been implemented in my app as of now but other notifications are yet to come. It would be exciting to include live updates here using pusher or somesuch.
