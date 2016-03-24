Conversations = new Mongo.Collection('conversations');
ConversationAlerts = new Mongo.Collection('conversationAlerts');

Meteor.methods({
    insertConversation: function(conversation){
        return Conversations.insert(conversation);
    },
    updateLatestMsgConversation: function(conversation_id,message_id){
        var message = Messages.findOne(message_id);
        Conversations.update(conversation_id,{$set: {last_modified: message.createdAt}, $inc: {messages_count: 1}});
        ConversationAlerts.update({conversation_id: message.conversation_id, alertsAllow: true},{$inc: {alerts_count: 1}},{multi: true});
    },
    conversationUpdate: function(conversation_id,updateParams,updateMembersObject){
        var params = {};
        params.author = updateParams.leader;
        params.subject = updateParams.subject;
        params.members = updateParams.members;

        if(updateMembersObject){
            _(updateMembersObject.membersExpelled).each(function(member){
                ConversationAlerts.remove({conversation_id: conversation_id, user_id: member._id});
            });
            _(updateMembersObject.membersAdded).each(function(member){
                var conversationAlertObject = {
                    user_id: member._id,
                    conversation_id: conversation_id,
                    alertsAllow: true,
                    alerts_count: 0
                };
                ConversationAlerts.insert(conversationAlertObject);
            });
        }
        return Conversations.update(conversation_id,{$set: params});
    },
    conversationExit: function(conversation_id,user_id){
        var members = Conversations.findOne(conversation_id).members;
        members = _(members).filter(function(member){
            return member._id != user_id;
        });
        Conversations.update(conversation_id,{$set: {members: members}});
        ConversationAlerts.remove({conversation_id: conversation_id, user_id: user_id});
    },
    insertConversationAlerts: function(conversation_id,members){
        _(members).each(function(member){
            var conversationAlertObject = {
                user_id: member._id,
                conversation_id: conversation_id,
                alertsAllow: true,
                alerts_count: 0
            };
            return ConversationAlerts.insert(conversationAlertObject);
        });
    },
    changeDateFilterMessages: function(conversation_id,user_id){
        var members = Conversations.findOne(conversation_id).members;
        members = _(members).map(function(m){
            if(m._id == user_id) m.startDate = new Date();
            return m;
        });
        Conversations.update({_id: conversation_id},{$set: {members: members}});
    },
    allowAlerts: function(conversation_id,user_id){
        ConversationAlerts.update({user_id: user_id, conversation_id: conversation_id},{$set: {alertsAllow: true}});
    },
    denyAlerts: function(conversation_id,user_id){
        ConversationAlerts.update({user_id: user_id, conversation_id: conversation_id},{$set: {alertsAllow: false, alerts_count: 0}});
    }
});