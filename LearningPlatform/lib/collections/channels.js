Channels = new Mongo.Collection ('channels');
Votes = new Mongo.Collection('votes');

Meteor.methods ({
	insertChannel: function(channel){
		var id = Channels.insert(channel);
		return {_id: id};
	},
	voteChannel: function(channel_id,user_id,inc){
		Channels.update(channel_id,{$inc: {votes_count: inc}});
		if(inc > 0){
			Votes.insert({channel_id: channel_id,user_id: user_id});
		}else{
			Votes.remove({channel_id: channel_id,user_id: user_id});
		}

	},
	incrementChannelComment: function(channel_id){
		Channels.update(channel_id,{$inc: {comments_count: 1}});
	},
	incrementChannelRecord: function(channel_id){
		Channels.update(channel_id,{$inc: {records_count: 1}});
	},
	channelUpdate: function(channel_id,params){
		return Channels.update(channel_id,{$set: params});
	},
	insertUserEnrolledChannel: function(channel_id, user_id){
		Channels.update({_id: channel_id},{$inc: {users_count: 1}});
		return UsersEnrolled.insert({context_id: channel_id, user_id: user_id});
	},
	removeUserEnrolledChannel: function(channel_id,user_id){
		Channels.update({_id: channel_id},{$inc: {users_count: -1}});
		return UsersEnrolled.remove({context_id: channel_id, user_id: user_id});
	},

})