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






//DOCUMENTS
Meteor.publish('documents',function(){
	return Documents.find({});
});

Meteor.publish('documentsRecord',function(record_id){
	return Documents.find({record: record_id});
});





//COMMENTS
Meteor.publish('commentsRecord',function(record_id){
	return Comments.find({record: record_id});
});

Meteor.publish('commentsChannel',function(channel_id){
	return Comments.find({channel: channel_id});
});





//TEAMS
Meteor.publish('teams',function(){
	return Teams.find({});
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

Meteor.publish('userById',function(user_id){
	return Meteor.users.find(user_id);
});

Meteor.publish('usersContacts',function(user_id){
	var cursor = Relations.find({users: user_id});
	return Meteor.users.find({_id: {$in: cursor.users}});
});





//RELATIONS
Meteor.publish('contactsByUser',function(user_id){
	return Relations.find({users: user_id});
});




//REQUESTS
Meteor.publish('requestsByUser',function(user_id){
	return Requests.find({$or: [{'requested.id': user_id},{'applicant.id': user_id}]});
});

//SECTIONS
Meteor.publish('lessonSections',function(lesson_id){
	return Sections.find({lesson_id: lesson_id});
});
