Template.commentsTabContent.helpers({
	currentAvatar: function(){
		return Meteor.users.findOne(Meteor.userId()).avatar;
	},
	hasComments: function(){
		return this.comments_count;
	}
});

//LISTS
Template.commentsList.helpers({
	comments: function(){
		return Comments.find({isReply: false},{sort: {createdAt: -1}});
	}
});

Template.commentsRepliesList.helpers({
	replies: function(){
		return Comments.find({comment_id: this._id});
	}
});

Template.commentsRepliesList.rendered = function(){
	console.log('commentsRepliesList rendered');
};

//commentDefault
Template.commentDefault.helpers({
	avatar: function(){
		return Meteor.users.findOne(this.author).avatar;
	},
	username: function(){
		return Meteor.users.findOne(this.author).username;
	},
	dateFrom: function(d){
		return smartDate(d);
	},
	isNotReply: function(){return !this.isReply;}
});

Template.commentDefault.rendered = function(){
	console.log('commentDefault rendered');
};

//COMMENT
Template.comment.helpers({
	currentAvatar: function(){
		return Meteor.users.findOne(Meteor.userId()).avatar;
	},
	hasReplies: function(){
		return this.replies_count;
	}
});

Template.comment.events({
	'submit #form-reply-comment': function(e,template){
		e.preventDefault();
		var text = $(e.currentTarget).find('textarea').val();
		if (text){
			console.log('hay texto');
			var reply = {
				createdAt: new Date(),
				author: Meteor.userId(),
				text: text,
				contextId: this.contextId,
				replies_count: 0,
				isReply: true,
				comment_id: this._id
			};
			Meteor.call('insertComment',reply);
			Meteor.call('incrementChannelComment',this.contextId);
			Meteor.call('incrementCommentReply',this._id);
			$(e.currentTarget).find('textarea').val('');
			$(template.find('.cancel-publish-reply')).click();
		}
	},
	'click .create-reply-button': function(e,template){
		$(e.currentTarget).hide();
		$(template.find('.comment-publish-box')).fadeIn();
	},
	'click .cancel-publish-reply': function(e,template){
		$(template.find('.comment-publish-box')).fadeOut(function(){
			$(template.find('.create-reply-button')).show();
		});
	}
});

Template.comment.rendered = function(){
	$(this.firstNode).find('.comment-publish-box').hide();
};


