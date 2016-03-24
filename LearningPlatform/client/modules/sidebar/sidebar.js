Template.sidebar.helpers({
	username: function(){
		return ellipsis(Meteor.user().username,16);
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
	conversations_counter: function(){
		return ConversationAlerts.find().count();
	},
	notifications_counter: function(){
		return Notifications.find().count();
	},
	userId: function(){return Meteor.userId();}
});

Template.sidebar.events({

	'click #logoutButton': function(){
		Meteor.logout();
		Router.go('/');
	},

	'click .tab': function(e){
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

	'click .close-toggle': function(){
		if($(window).width() <= 900){
			$('#sidebar-wrapper').addClass('unactive');
			$('#close-sidebar').removeClass('active');
		}
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
	userId: function(){
		return Meteor.userId();
	}
});

Template.menuTab.rendered = function(){
	$('.tab').removeClass('active');
	$('#menu-tab').addClass('active');
};

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
});

Template.notificationsTab.rendered = function(){
	$('.tab').removeClass('active');
	$('#notifications-tab').addClass('active');
}

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

Template.chatsTab.helpers({
	conversations_counter: function(){
		return ConversationAlerts.find({}).count();
	},
	conversationAlerts: function(){
		return ConversationAlerts.find({});
	}
});

Template.chatsTab.rendered = function(){
	$('.tab').removeClass('active');
	$('#chats-tab').addClass('active');
};

Template.conversationAlert.helpers({
	subject: function(){
		return ellipsis(Conversations.findOne({_id: this.conversation_id}).subject,10);
	},
	avatar: function(){
		var messageObj = Messages.findOne({conversation_id: this.conversation_id,
			createdAt: {$gte: Conversations.findOne(this.conversation_id).last_modified}});
		return Meteor.users.findOne(messageObj.author).avatar;
	},
	username: function(){
		var messageObj = Messages.findOne({conversation_id: this.conversation_id,
			createdAt: {$gte: Conversations.findOne(this.conversation_id).last_modified}});
		return Meteor.users.findOne(messageObj.author).username;
	},
	message: function(){
		var messageObj = Messages.findOne({conversation_id: this.conversation_id,
			createdAt: {$gte: Conversations.findOne(this.conversation_id).last_modified}});
		var messageBody = new Handlebars.SafeString(messageObj.message);
		return ellipsis(messageBody.string.split('&nbsp')[0],50);
	},
	date: function(){
		var messageObj = Messages.findOne({conversation_id: this.conversation_id,
			createdAt: {$gte: Conversations.findOne(this.conversation_id).last_modified}});
		return smartDate(messageObj.createdAt);
	}
});

Template.conversationAlert.events({
	'click .conversation-alert-item': function(e,template){
		Router.go('conversation',{_id: template.data.conversation_id});
	}
});