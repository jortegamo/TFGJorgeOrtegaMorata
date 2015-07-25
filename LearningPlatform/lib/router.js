Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'mainPage'});

Router.route('/redirect',{name: 'redirect'});


//Records

Router.route('/records',{
	name: 'records',
	waitOn: function(){ return Meteor.subscribe('records')}
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


//Channels

Router.route('/channels',{
	name: 'channels',
	waitOn: function(){ return Meteor.subscribe('channels')} 
});

Router.route('/channels/submit',{name: 'channelSubmit'});


Router.route('/channel/:_id',{
	name: 'channel',
	data: function(){return Channels.findOne(this.params._id);},
	waitOn: function(){
		var subscriptions = [Meteor.subscribe('channels'),
							 Meteor.subscribe('commentsChannel',this.params._id)];
		return subscriptions;
	}
});

//Teams
Router.route('/teams',{
	name: 'teams'
});

//Teams
Router.route('/lessons',{
	name: 'lessons'
});




//profile
Router.route('/profile/:_id',{
	name: 'profile',
	data: function(){return {_id: this.params._id}}
})

//teams


