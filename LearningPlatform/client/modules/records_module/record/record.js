Template.record.helpers({
	authorAvatar: function(){
		return Meteor.users.findOne(this.author).avatar;
	},
	username: function(){
		return Meteor.users.findOne(this.author).username;
	},
	dateFrom: function(d){
		return smartDate(d);
	},
	tabNamesArray: function(){
		return [{template: 'commentsTabContent', name: 'comments', icon: 'fa-comments', initialActive: true},
			{template: 'repliesTabContent',    name: 'replies', icon: 'fa-reply'},
			{template: 'relatedTabContent', name: 'related', icon: 'fa-tags'}];
	},
	sectionActive: function(){
		return Session.get('currentSection');
	},
	playerObjectData: function(){
		console.log(this);
		return {
			recordPlayer: new RecordPlayer(),
			editorPlayerManager: new EditorPlayerManager(),
			record: this
		};
	},
	isALessonRecord: function(){
		return this.lesson_id;
	},
	docActual: function(){
		var doc = null;
		if (Session.get('docAct')){
			var docActual = Session.get('docAct');
			var doc = {
				title: docActual.title,
				mode: docActual.mode.split('/')[2],
				theme: docActual.theme.split('/')[2]
			};
		}
		return doc;
	},
	channel: function(){
		console.log(Channels.findOne(this.channel_id));
		return Channels.findOne(this.channel_id);
	},
	lesson: function(){
		return Lessons.findOne(this.lesson_id);
	},
	hasTags: function(){
		return this.tags.length;
	}
});

Template.record.events({
	'click #show-play-list': function(e){
		console.log('estoy haciendo click');
		var $button = $(e.currentTarget);
		if($button.hasClass('active')){
			$button.removeClass('active');
			$('.play-list-wrapper').removeClass('active');
		}else{
			$button.addClass('active');
			$('.play-list-wrapper').addClass('active');
		};
	},
	'submit form': function(e){
		e.preventDefault();
		var text = $(e.currentTarget).find('textarea').val();
		if (text){
			var comment = {
				createdAt: new Date(),
				author: Meteor.userId(),
				text: text,
				contextId: this._id,
				replies_count: 0,
				isReply: false
			};
			Meteor.call('insertComment',comment);
			Meteor.call('incrementRecordComment',this._id);
			$(e.currentTarget).find('textarea').val('');
		}
	}
});

Template.record.rendered = function(){
	Session.set('docAct',false);
	$('#docs_counter').tooltip({placement: 'left',title: 'docs'});
	$('#comments_counter').tooltip({placement: 'bottom',title: 'comments'});
	$('#votes_counter').tooltip({placement: 'bottom',title: 'votes'});
	$('#replies_counter').tooltip({placement: 'right',title: 'replies'});
};

//Replies tab
Template.repliesTabContent.helpers({
	replies_count: function(){
		return Records.find({isReply: true}).count();
	},
	timeMarks: function(){
		var timeMarksArray = _(Records.find({isReply: true}).fetch()).pluck('timeMark');
		return _(timeMarksArray).uniq();
	}
});
Template.timeMarkList.helpers({
	timeMark: function(){
		var mark = parseInt(this.toString());
		var d = new Date(mark);
		var min = (d.getMinutes() > 9)? '' + d.getMinutes() : '0' + d.getMinutes();
		var sec = (d.getSeconds() > 9)? '' + d.getSeconds() : '0' + d.getSeconds();
		return min + ':' + sec;
	},
	records: function(){
		return Records.find({timeMark: parseFloat(this.toString())},{sort: {createdAt: 1}});
	}
});
//Related tab
Template.relatedTabContent.helpers({
	relatedCount: function(){
		return Records.find({_id: {$ne: this._id}, isReply: false,tags: {$in: this.tags}},{limit: 10, sort: {votes_count: -1}}).count();
	},
	relatedRecords: function(){
		return Records.find({_id: {$ne: this._id}, isReply: false,tags: {$in: this.tags}},{limit: 10, sort: {votes_count: -1}});
	}
});
