Template.sidebar.helpers({
	username: function(){
		return Meteor.user().username;
	}
})

Template.sidebar.events({
	'click #logoutButton': function(){
		Meteor.logout();
	}
});