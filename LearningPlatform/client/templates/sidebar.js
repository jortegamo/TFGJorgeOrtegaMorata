Template.sidebar.helpers({
	notMain: function(){
		return Session.get('notMainPage');
	}
})

Template.sidebar.events({
	'click #logoutButton': function(){
		Meteor.logout();
	}
});