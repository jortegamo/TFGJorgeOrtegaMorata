//RECORDS
Meteor.publish('records',function(){
	return Records.find({});
});
Meteor.publishComposite('record',function(record_id){
	var sub = {
		find: function(){
			return Records.find({_id: record_id});
		},
		children: [
			{find: function(){return Documents.find({record: record_id});}},
			{
				collection: 'audioRecordings',
				find: function(){
					return AudioRecordings.find({record_id: record_id});
				},
				children: [{
					find: function(audio){
						return AudioRCData.find(audio.audioData_id);
					}
				}]
			}
		]
	};
	return sub;
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






//DOCUMENTS
Meteor.publish('documents',function(){
	return Documents.find({});
});

Meteor.publish('documentsRecord',function(record_id){
	return Documents.find({record: record_id});
});





//COMMENTS
Meteor.publishComposite('commentsByContext',function(context_id){
	var sub = {
		collection: 'comments',
		find: function(){
			return Comments.find({contextId: context_id});
		},
		children: [
			{
				find: function(comment){
					return Meteor.users.find(comment.author,{params: {avatar: 1, username: 1}});
				}
			}
		]
	};
	return sub;
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

Meteor.publishComposite ('conversationsByUser',function(user_id){
	var sub = {
		collection: 'conversations',
		find: function(){
			return Conversations.find({members: {$elemMatch: {_id: user_id}}});
		},
		children: [{
			collection: 'messages',
			find: function(conversation){
				return Messages.find({conversation_id: conversation._id});
			},
			children: [{
				find: function(message){
					return Meteor.users.find({_id: message.author});
				}
			}]
		}]
	}
	return sub;
});

Meteor.publishComposite('conversationById',function(conversation_id){
	var sub = {
		collection: 'conversations',
		find: function(){
			return Conversations.find(conversation_id);
		},
		children: [
			{
				find: function(conversation){
					return Messages.find({conversation_id: conversation._id});
				}
			},
			{
				find: function(conversation){
					var arrayMembersIds = [];
					_(conversation.members).each(function(member){
						arrayMembersIds.push(member._id);
					});
					return Meteor.users.find({_id: {$in: arrayMembersIds}});
				}
			}
		]
	};
	return sub;
});




//NOTIFICATIONS
Meteor.publish('notifications',function(){
	return Notifications.find();
});

Meteor.publishComposite('userNotifications',function(user_id){
	var sub = {
		collection: 'notifications',
		find: function(){
			return Notifications.find({to: user_id});
		},
		children: [
			{
				find: function(notification) {
					return Meteor.users.find(notification.from);
				}
			},
			{
				find: function(notification){
					switch(notification.type){
						case 'channel':
							return Channels.find(notification.parentContext_id,{fields: {title: 1}});
							break;
						case 'lesson':
							return Lessons.find(notification.parentContext_id,{fields: {title: 1}});
							break;
						case 'record':
							return Records.find(notification.parentContext_id,{fields: {title: 1}});
							break;
						case 'conversation':
							return Conversations.find(notification.parentContext_id,{fields: {title: 1}});
							break;
					}
				}
			}
		]
	};
	return sub;
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

Meteor.publishComposite('usersEnrolled',function(context_id){
	var sub = {
		collection: 'usersEnrolledLesson',
		find: function(){
			return UsersEnrolled.find({context_id: context_id});
		},
		children: [
			{
				find: function(userEnrolled){
					return Meteor.users.find(userEnrolled.user_id,{params: {avatar: 1, username: 1}});
				}
			}
		]
	};
	return sub;
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

Meteor.publish('audioRCData',function(){
	return AudioRCData.find();
});


//TAGS

Meteor.publish('tagsBySearch',function(searchValue){
	return Tags.find({name: new RegExp(searchValue)});
});

//VOTES

//channel
Meteor.publish('voteChannelByUser',function(channel_id,user_id){
	return Votes.find({channel_id: channel_id, user_id: user_id});
});

//lesson
Meteor.publish('voteLessonByUser',function(lesson_id,user_id){
	return Votes.find({lesson_id: lesson_id, user_id: user_id});
});

//record
Meteor.publish('voteRecordByUser',function(record_id,user_id){
	return Votes.find({record_id: record_id, user_id: user_id});
});



