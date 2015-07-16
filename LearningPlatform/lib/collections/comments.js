Comments = new Mongo.Collection('comments');

Meteor.methods({
	insertComment: function(comment){
		Comments.insert(comment);
	}
})