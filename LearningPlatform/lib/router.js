Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'mainPage'});

Router.route('/submit',{name: 'postSubmit'});

Router.route('/post/:_id',{
	name: 'post',
	data: function(){ return Records.findOne(this.params._id);},
	waitOn: function(){ return [Meteor.subscribe('documentsByRC',this.params._id),
								Meteor.subscribe('records'),
								Meteor.subscribe('commentsRC',this.params._id)]}
});

Router.route('/redirect',{name: 'redirect'});

Router.route('/records',{
	name: 'records',
	waitOn: function(){ return Meteor.subscribe('records')}
});

Router.route('/channels',{
	name: 'channels',
	waitOn: function(){ return Meteor.subscribe('channels')} 
});