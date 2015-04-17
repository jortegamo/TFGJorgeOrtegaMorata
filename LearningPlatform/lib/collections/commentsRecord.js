CommentsRC = new Mongo.Collection('commentsRC');

Meteor.methods({
	insertComment: function(comment){
		console.log('me han llamado apra guardar un comentario');
		CommentsRC.insert(comment);
		console.log('he guardado el cometnario');
	}
})