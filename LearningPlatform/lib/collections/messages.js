Messages = new Mongo.Collection('messages');

Meteor.methods({
    insertMessage: function(msg){
        return Messages.insert(msg);
    }
});