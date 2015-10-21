//RECORDS
Meteor.publish('records',function(){
	return Records.find({});
});

Meteor.publish('record',function(record_id){
	return Records.find({_id: record_id});
});

Meteor.publish('recordsByUser',function(user_id){
	return Records.find({author: user_id});
});

Meteor.publish('recordsByUserRanking',function(user_id){
	return Records.find({author: user_id, $orderby: {votes: -1}});
});

Meteor.publish('recordsBySection',function(section_id){
	return Records.find({section_id: section_id});
});

Meteor.publish('recordsByLesson',function(lesson_id){
	var cursor = Sections.find({lesson_id: lesson_id});
	return Records.find({section_id: cursor._id});
});



//CHANNELS
Meteor.publish('channels',function(){
	return Channels.find({});
});

Meteor.publish('sidebarChannels',function(user_id){
	return Channels.find({author: user_id},{$limit: 3});
});

Meteor.publish('channel',function(channel_id){
	return Channels.find({_id: channel_id});
});

Meteor.publish('channelsByUser',function(user_id){
	return Channels.find({author: user_id});
});

Meteor.publish('channelsRanking',function(){
	return Channels.find({$orderby: {votes: -1}});
});

Meteor.publish('channelsByUserRanking',function(user_id){
	return Channels.find({author: user_id, $orderby: {votes: -1}});
});

Meteor.publish('votesChannel',function(channel_id){
	return VotesChannels.find({channel_id: channel_id});
});






//DOCUMENTS
Meteor.publish('documents',function(){
	return Documents.find({});
});

Meteor.publish('documentsRecord',function(record_id){
	return Documents.find({record: record_id});
});





//COMMENTS
Meteor.publish('commentsByContext',function(context_id){
	return Comments.find({contextId: context_id});
});





//TEAMS
Meteor.publish('teams',function(){
	return Teams.find({});
});

Meteor.publish('sidebarTeams',function(user_id){
	return Teams.find({author: user_id},{$limit: 3});
});

Meteor.publish('team',function(team_id){
	return Teams.find({_id: team_id});
});

Meteor.publish('teamsByUser',function(user_id){
	return Teams.find({author: user_id});
});

Meteor.publish('teamsRanking',function(){
	return Teams.find({$orderby: {votes: -1}});
});

Meteor.publish('teamsByUserRanking',function(user_id){
	return Teams.find({author: user_id, $orderby: {votes: -1}});
});





//LESSONS
Meteor.publish('lessons',function(){
	return Lessons.find({});
});

Meteor.publish('sidebarLessons',function(user_id){
	return Lessons.find({author: user_id},{$limit: 3});
});

Meteor.publish('lesson',function(lesson_id){
	return Lessons.find({_id: lesson_id});
});

Meteor.publish('lessonsByUser',function(user_id){
	return Lessons.find({author: user_id});
});

Meteor.publish('lessonsRanking',function(){
	return Lessons.find({$orderby: {votes: -1}});
});

Meteor.publish('lessonsByUserRanking',function(user_id){
	return Lessons.find({author: user_id, $orderby: {votes: -1}});
});



//CONVERSATIONS

var getIds = function(cursor){
	return cursor.map(function(elem){
		return ObjectId(elem._id);
	});
};

Meteor.publish('conversationsByUser',function(user_id){
	var conversationsCursor = Conversations.find({members: user_id});
	var arrayIds = getIds(conversationsCursor);
	return [conversationsCursor, Messages.find({conversation: {$in: [arrayIds]}})];
});

Meteor.publish('conversationById',function(id){
	var conversationCursor = Conversations.findOne(id);
	var messagesCursor = Messages.find({conversation: conversationCursor._id});
	return [conversationCursor, messagesCursor];
});





//NOTIFICATIONS
Meteor.publish('notifications',function(){
	return Notifications.find();
});

Meteor.publish('userNotifications',function(user_id){
	return Notifications.find({to: user_id});
});





//USERS
Meteor.publish('allUsers',function(){
	return Meteor.users.find({},{fields: {username: 1, avatar: 1, banner: 1, description: 1}});
});

Meteor.publish('usersBySearch',function(searchVal){
	return Meteor.users.find({username: new RegExp(searchVal)});
});

Meteor.publish('userById',function(user_id){
	return Meteor.users.find(user_id);
});

Meteor.publish('userByChannel',function(channel_id){
	var cursor = Channels.findOne(channel_id);
	return Meteor.users.find(cursor.author);
});

Meteor.publish('usersLesson',function(lesson_id){
	var usersLessonIds = [];
	var lessonCursor = Lessons.findOne(lesson_id);
	_(UsersEnrolled.find({context_id: lessonCursor._id}).fetch()).each(function(elem){
		usersLessonIds.push(elem.user_id);
	});
	usersLessonIds.push(lessonCursor.author);
	return Meteor.users.find({_id: {$in: usersLessonIds}});
});

Meteor.publish('usersChannel',function(channel_id){
	var usersChannelIds = [];
	var channelCursor = Channels.findOne(channel_id);
	_(UsersEnrolled.find({context_id: channelCursor._id}).fetch()).each(function(elem){
		usersChannelIds.push(elem.user_id);
	});
	usersChannelIds.push(channelCursor.author);
	return Meteor.users.find({_id: {$in: usersChannelIds}});
});

Meteor.publish('commentsUsers',function(context_id){
	var cursor = Comments.find({contextId: context_id});
	var arrayIds = [];
	_(cursor.fetch()).each(function(elem){
		arrayIds.push(elem.author);
	});
	return Meteor.users.find({_id: {$in: arrayIds}});
});




//RELATIONS
Meteor.publishComposite('contactsByUser',function(user_id){
	var sub = {
		find: function(){
			return Relations.find({users: user_id});
		},
		children: [{
			find: function(){
				var arrayIds = [];
				var cursor = Relations.find({users: user_id});
				_(cursor.fetch()).each(function(relation){
					var matchIds = _(relation.users).filter(function(id){
						return id !== user_id;
					});
					arrayIds.push(matchIds[0]);
				});
				return Meteor.users.find({_id: {$in: arrayIds}},{fields: {username: 1, avatar: 1, description: 1, status: 1}});
			}
		}]
	}
	return sub;
});

//USERS ENROLLED

Meteor.publish('usersEnrolled',function(lesson_id){
	return UsersEnrolled.find({context_id: lesson_id});
});



//REQUESTS

Meteor.publishComposite('requestsByUser',function(user_id){
	var sub = {
		find: function(){
			return Requests.find({$or: [{'requested.id': user_id},{'applicant.id': user_id}]});
		},
		children: [
			{
				find: function(){
					var arrayIds = [];
					_(Requests.find({'applicant.id': user_id}).fetch()).each(function(elem){
						arrayIds.push(elem.requested.id);
					});
					_(Requests.find({'requested.id': user_id}).fetch()).each(function(elem){
						arrayIds.push(elem.applicant.id);
					});
					return Meteor.users.find({_id: {$in: arrayIds}});
				}
			}]
	};

	return sub;
});

//SECTIONS
Meteor.publish('lessonSections',function(lesson_id){
	return Sections.find({lesson_id: lesson_id});
});

//AUDIOS
Meteor.publish('audioRecordings',function(){
	return AudioRecordings.find();
});




