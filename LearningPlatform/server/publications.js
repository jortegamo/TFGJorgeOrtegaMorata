Meteor.publish('records',function(){
	return Records.find({});
});