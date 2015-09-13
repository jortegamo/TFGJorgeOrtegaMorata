Router.configure({
  	layoutTemplate: 'layout',
	waitOn: function(){
		return Meteor.subscribe('userById',Meteor.userId());
	}
});

Router.route('/', {
	name: 'mainPage',
	waitOn: function(){return Meteor.subscribe('allUsers');}
});

Router.route('/redirect',{name: 'redirect'});


//RECORDS

Router.route('/records',{
	name: 'records',
	waitOn: function(){ return [Meteor.subscribe('records'),Meteor.subscribe('allUsers')]; }
});

Router.route('/records/submit',{name: 'recordSubmit'});


Router.route('/record/:_id',{
	name: 'record',
	data: function(){ return Records.findOne(this.params._id);},
	waitOn: function(){
		var subscriptions = [Meteor.subscribe('documentsRecord',this.params._id),
			 				 Meteor.subscribe('records'),
							 Meteor.subscribe('commentsRecord',this.params._id)];
		return subscriptions;
	}
});


//CHANNELS

Router.route('/channels',{
	name: 'channels',
	waitOn: function(){ return [Meteor.subscribe('channels'),Meteor.subscribe('allUsers')]; }
});

Router.route('/channels/submit',{
	name: 'channelSubmit'
});


Router.route('/channel/:_id',{
	name: 'channel',
	data: function(){return Channels.findOne(this.params._id);},
	waitOn: function(){
		var subscriptions = [Meteor.subscribe('channels'),
							 Meteor.subscribe('commentsChannel',this.params._id)];
		return subscriptions;
	}
});

//TEAMS
Router.route('/teams',{
	name: 'teams',
	waitOn: function(){return [Meteor.subscribe('teams'),Meteor.subscribe('allUsers')]; }
});

Router.route('/teams/submit',{
	name: 'teamSubmit'
});

Router.route('/team/:_id',{
	name: 'team',
	data: function(){return Teams.findOne(this.params._id);},
	waitOn: function(){
		//subscriptions
	}
});


//LESSONS
Router.route('/lessons',{
	name: 'lessons',
	waitOn: function(){ [Meteor.subscribe('lessons'),Meteor.subscribe('allUsers')]; }
});

Router.route('/lessons/submit',{
	name: 'lessonSubmit'
});

Router.route('/lesson/:_id',{
	name: 'lesson',
	data: function(){
		console.log(Lessons.findOne(this.params._id));
		console.log(this.params._id)
		return Lessons.findOne(this.params._id);},
	waitOn: function(){
		return [Meteor.subscribe('lesson', this.params._id),
				Meteor.subscribe('allUsers'),
				Meteor.subscribe('recordsByLesson', this.params._id),
				Meteor.subscribe('lessonSections', this.params._id)];
	}
})



//PROFILE
Router.route('/profile/:_id',{
	name: 'profile',
	data: function(){
		return {user_id: this.params._id, section: Session.get('currentSection')};
	},
	waitOn: function(){
		return [Meteor.subscribe('allUsers'),
				Meteor.subscribe('channelsByUser',this.params._id),
				Meteor.subscribe('lessonsByUser',this.params._id),
				Meteor.subscribe('teamsByUser',this.params._id),
				Meteor.subscribe('recordsByUser',this.params._id),
				Meteor.subscribe('conversationsByUser',this.params._id),
				Meteor.subscribe('contactsByUser',this.params._id),
				Meteor.subscribe('requestsByUser',this.params._id)];

	}
});

Router.route('/profile/:_id/edit',{
	name: 'profileEdit',
	data: function() {
		return {user_id: this.params._id};
	},
	waitOn: function(){
		return Meteor.subscribe('allUsers');
	}
});

//CONVERSATIONS

Router.route('/conversation/:_id',{
	name: 'conversation',
	data: function(){return Conversations.findOne(this.params._id);},
	waitOn: function(){
		return Meteor.subscribe('conversationById',this.params._id);
	}
});


