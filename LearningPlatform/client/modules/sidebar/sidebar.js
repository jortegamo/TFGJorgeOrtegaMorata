Template.sidebar.helpers({
	username: function(){
		var username = Meteor.user().username;
		return (username.length > 16) ? username.slice(0,16) + '...' : username;
	},
	menuTab: function(){
		return Session.get('menu-active');
	}
})

Template.sidebar.events({
	'click #logoutButton': function(){
		Meteor.logout();
	},
	'click .tab': function(e){
		$('.tab').removeClass('active');
		$(e.currentTarget).addClass('active');
		if (e.currentTarget.id == 'menu-tab'){
			Session.set('menu-active',true);
		}else{
			Session.set('menu-active',false);
		}
	},
});

Template.sidebar.rendered = function(){
	console.log('hola');
	Session.set('menu-active',true);
	console.log(Session.get('menu-active'))
};
