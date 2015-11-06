Conversations = new Mongo.Collection('conversations');

Meteor.methods({
    insertConversation: function(conversation){
        return Conversations.insert(conversation);
    },
    updateConversation: function(conversation_id,message_id){
        var message = Messages.findOne(message_id);
        Conversations.update(conversation_id,{$set: {last_modified: message.createdAt}, $inc: {messages_count: 1}});
    }
});