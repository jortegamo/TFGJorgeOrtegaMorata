Template.comment.helpers({
	hasReplies: function(){
		return CommentsRC.find({reply: this._id}).count() > 0;
	},
	replayList: function(){
		return CommentsRC.find({reply: this._id},{sort: {createAt: -1}});
	}
});

Template.comment.events({
	'click .like': function(){
		CommentsRC.update (this._id,{$inc: {votes: 1}});
	},

	'click .dislike': function(){
		CommentsRC.update (this._id,{$inc: {votes: -1}});
	},

	'click .createReplyComment': function(e,template){
		if (!$(template.find('.input-reply-comment')).is(':visible')){
			$(template.find('.input-reply-comment')).show();
		}
	},

	'click .cancel-input-reply': function(e,template){
		$(template.find('.input-reply-comment')).hide();
		$(template.find('.input-reply')).val("");
	},

	'click .showReplies': function(e,template){
		if ($(template.find('.replies-comment-list')).is(':visible')){
			$(template.find('.replies-comment-list')).fadeOut();
			$(e.target).text('show Replies');
		}else{
			$(template.find('.replies-comment-list')).fadeIn();
			$(e.target).text('hide Replies');
		}
	},

	'click .publish-replay': function(e,template){
		var replyMessage = $(template.find('.input-reply')).val();
		if (replyMessage !=""){
			var comment = {
				author: Meteor.user().username,
				record: this.record,
				reply: this._id,
				createAt: new Date(),
				message: replyMessage
			}
			CommentsRC.update(this._id,{$inc:{replies_count: 1}});
			Meteor.call('insertComment', comment, function(err){
				if(err){
					console.log(err.reason);
				}else{
					$(template.find('.cancel-input-reply')).click();
					if (!$(template.find('.replies-comment-list')).is(':visible')){ 
						$(template.find('.showReplies')).click();
					}
					console.log("he guardado un reply a este comentario");
				}
			})
		}
	}
});

Template.comment.rendered = function(){
	$('.input-reply-comment').hide();
	$('.replies-comment-list').hide();

	$('.votes_count').tooltip({
		placement: 'left',
		title: 'votes'
	});

	$('.replies_count').tooltip({
		placement: 'bottom',
		title: 'replies'
	});
	$('.like').tooltip({
		placement: 'left',
		title: 'like'
	});

	$('.dislike').tooltip({
		placement: 'bottom',
		title: 'dislike'
	});
}