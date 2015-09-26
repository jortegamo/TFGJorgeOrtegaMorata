Channels = new Mongo.Collection ('channels');
VotesChannels = new Mongo.Collection('votesChannels');

Meteor.methods ({
	insertChannel: function(channel){
		var id = Channels.insert(channel);
		return {_id: id};
	},
	voteChannel: function(channel_id,user_id,inc){
		Channels.update(channel_id,{$inc: {votes_count: inc}});
		if(inc > 0){
			VotesChannels.insert({channel_id: channel_id,user_id: user_id});
		}else{
			VotesChannels.remove({channel_id: channel_id,user_id: user_id});
		}

	},
	incrementChannelComment: function(channel_id){
		Channels.update(channel_id,{$inc: {comments_count: 1}});
	},
	channelUpdate: function(channel_id,params){
		return Channels.update(channel_id,{$set: params});
	},
	insertUserEnrolledChannel: function(channel_id, user_id){
		Channels.update({_id: channel_id},{$inc: {users_count: 1}});
		return UsersEnrolled.insert({context_id: channel_id, user_id: user_id});
	}

})