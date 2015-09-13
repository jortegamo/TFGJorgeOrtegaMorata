Messages = new Mongo.Collection('messages');

Meteor.methods({
    insertMessage: function(msg){
        Messages.insert(msg);
    }
});