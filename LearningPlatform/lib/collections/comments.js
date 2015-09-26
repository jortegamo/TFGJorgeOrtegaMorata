Comments = new Mongo.Collection('comments');

Meteor.methods({
	insertComment: function(comment){
		Comments.insert(comment);
	},
	incrementCommentReply: function(comment){
		Comments.update(comment,{$inc: {replies_count: 1}});
	}
});