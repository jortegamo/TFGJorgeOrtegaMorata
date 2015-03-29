Router.configure({
  layoutTemplate: 'layout',
  waitOn: function() { return Meteor.subscribe('records'); }
});

Router.route('/', {name: 'mainPage'});

Router.route('/submit',{name: 'postSubmit'});

Router.route('/post/:_id',{
	name: 'post',
	data: function(){ return Records.findOne(this.params._id);}
});

Router.route('/redirect',{name: 'redirect'});

Router.route('/records',{name: 'records'});

Router.route('/channels',{name: 'channels'});