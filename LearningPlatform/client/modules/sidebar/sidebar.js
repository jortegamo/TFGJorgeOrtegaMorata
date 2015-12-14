Template.sidebar.helpers({
	username: function(){
		var username = Meteor.user().username;
		return (username.length > 16) ? username.slice(0,16) + '...' : username;
	},
	menuTab: function(){
		return Session.get('menu-active');
	},
	avatar: function(){
		return Meteor.users.findOne(Meteor.userId()).avatar;
	},
	currentSidebarTab: function(){
		return Session.get('currentSidebarTab');
	},
	conversations_counter: function(){return 0},
	notifications_counter: function(){
		return Notifications.find().count();
	}
});

Template.sidebar.events({

	'click #logoutButton': function(){
		Meteor.logout();
		Router.go('/')
	},

	'click .tab': function(e){
		$('.tab').removeClass('active');
		$(e.currentTarget).addClass('active');
		switch(e.currentTarget.id){
			case 'menu-tab':
				Session.set('currentSidebarTab','menuTab');
				break;
			case 'notifications-tab':
				Session.set('currentSidebarTab','notificationsTab');
				break;
			case 'chats-tab':
				Session.set('currentSidebarTab','chatsTab');
				break;
		}
	},

	'click #close-sidebar': function(e){
		$(e.currentTarget).removeClass('active');
		$('#sidebar-wrapper').addClass('unactive');
	},

	'click .profile-link':function(){
		Session.set('currentProfileId',Meteor.userId());
		Router.go('profile',{_id: Meteor.user()._id});
	}

});

Template.sidebar.rendered = function(){
	Session.set('menu-active',true);
	Session.set('currentSidebarTab','menuTab');
	/* sidebar display events */
	function closeSidebar(){
		$('#sidebar-wrapper').addClass('unactive');
		$(window).off('resize');
		openHandler();
	}

	function openSidebar(){
		$('#sidebar-wrapper').removeClass('unactive');
		$('#close-sidebar').removeClass('active'); //if it was active and we do click on it sidebar will close (important!!)
		$(window).off('resize');
		closeHandler();
	}

	function openHandler(){
		$(window).resize(function(){
			if($(window).width() > 990) openSidebar();
		});
	}

	function closeHandler(){
		$(window).resize(function(){
			if($(window).width() <= 990) closeSidebar();
		});
	}

	function initialzeSidebar (){
		($(window).width()<= 990) ? closeSidebar() : openSidebar();
	}
	/* end sidebar display events */

	initialzeSidebar();
};

Template.menuTab.helpers({
	channels: function(){return Channels.find({author: Meteor.userId()},{sort: {createdAt: -1},$limit: 3})},
	teams:  function(){return Teams.find({author: Meteor.userId()},{sort: {createdAt: -1},$limit: 3})},
	lessons:  function(){return Lessons.find({author: Meteor.userId()},{sort: {createdAt: -1},$limit: 3})},
});

Template.menuTab.events({

	'click .section-title': function(e){
		var elemId = e.currentTarget.id;

		switch(elemId){
			case 'sidebar-channels-browse':
				Router.go('channels')
				break;
			case 'sidebar-teams-browse':
				Router.go('teams')
				break;
			case 'sidebar-lessons-browse':
				Router.go('lessons')
				break;
			case 'sidebar-records-browse':
				Router.go('records')
				break;
		}
	},

	'click .more': function(e){
		Session.set('currentSection', e.currentTarget.id);
		Router.go('profile',{_id: Meteor.user()._id});
	},

	'click #my-records': function(e){
		Session.set('currentSection','recordsTabContent');
		Router.go('profile',{_id: Meteor.user()._id});
	},

	'click .channel-item': function(){
		Router.go('channel',{_id: this._id});
	},

	'click .team-item': function(){
		Router.go('team',{_id: this._id});
	},

	'click .lesson-item': function(){
		Router.go('lesson',{_id: this._id});
	}
});

Template.notificationsTab.helpers({
	counter: function(type){
		return Notifications.find({type: type}).count();
	},
	notifications: function(type){
		return Notifications.find({type: type});
	},
	notifications_counter: function(){
		return Notifications.find().count();
	}
});

Template.notificationsTab.events({
	'click .notifications-section-title a': function(e){
		if($(e.currentTarget) !== $('a[aria-expanded="true"]'))
			$('' + $('a[aria-expanded="true"]').attr('href')).collapse('hide');

	}
})

Template.notificationItem.helpers({
	avatar: function(){
		return Meteor.users.findOne(this.from).avatar;
	},
	username: function(){
		return Meteor.users.findOne(this.from).username;
	},
	smartDate: function(d){
		return smartDate(d);
	},
	title: function(max){
		switch(this.type){
			case 'channel':
				console.log('he entrado');
				return ellipsis(Channels.findOne(this.parentContext_id).title,max);
				break;
			case 'lesson':
				return ellipsis(Lessons.findOne(this.parentContext_id).title,max);
				break;
			case 'record':
				return ellipsis(Records.findOne(this.parentContext_id).title,max);
				break;
			case 'conversation':
				return ellipsis(Conversations.findOne(this.parentContext_id).title,max);
				break;
		}
	}
});

Template.notificationItem.events ({
	'click .notification-item': function(){
		Router.go(this.type,{_id: this.parentContext_id});
		Notifications.remove(this._id);
	},
	'click button':function(){
		Notifications.remove(this._id);
	}
});