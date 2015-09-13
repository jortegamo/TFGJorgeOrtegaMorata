Conversations = new Mongo.Collection('conversations');

Meteor.methods({
    insertConversation: function(conversation){
        Conversations.insert(conversation);
    }
});