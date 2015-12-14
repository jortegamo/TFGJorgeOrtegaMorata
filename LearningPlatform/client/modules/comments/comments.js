Template.commentsTabContent.helpers({
	hasComments: function(){
		return this.comments_count;
	}
});



//PUBLISH BOXES
Template.commentPublishBox.helpers({
	currentAvatar: function(){
		return Meteor.users.findOne(Meteor.userId()).avatar;
	}
});

Template.replyPublishBox.helpers({
	currentAvatar: function(){
		return Meteor.users.findOne(Meteor.userId()).avatar;
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
		return Comments.find({comment_id: this._id},{sort: {createdAt: -1}});
	}
});

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
	hasReplies: function(){
		return this.replies_count;
	}
});

Template.comment.events({
	'submit': function(e,template){
		e.preventDefault();
		var text = $(e.currentTarget).find('textarea').val();
		if (text){
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
		if (this.author != Meteor.userId()){
			var paramsNotification = {
				to: this.author,
				from: Meteor.userId(),
				type: Session.get('contextType'),
				createdAt: new Date(),
				parentContext_id: this.contextId
			};
			switch(Session.get('contextType')){
				case 'channel':
					paramsNotification.action = 'replyCommentChannel';
					break;
				case 'lesson':
					paramsNotification.action = 'replyCommentLesson';
					break;
				case 'record':
					paramsNotification.action = 'reply';
					break;
				case 'innerRecordChannel':
					paramsNotification.parentContext_id = Records.findOne(this.context_id).context_id;
					paramsNotification.action = 'replyCommentRecord';
					paramsNotification.context.title = Channels.findOne(paramsNotification.context_id).title;
					break;
				case 'innerRecordLesson':
					paramsNotification.parentContext_id = Records.findOne(this.context_id).context_id;
					paramsNotification.action = 'replyCommentRecord';
					paramsNotification.context.title = Lessons.findOne(paramsNotification.context_id).title;
					break;
			};
			NotificationsCreator.createNotification(paramsNotification,function(err,result){
				if(err) console.log('createNotification ERROR: ' + err.reason);
				if(result) console.log('created new Notification');
			});
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


