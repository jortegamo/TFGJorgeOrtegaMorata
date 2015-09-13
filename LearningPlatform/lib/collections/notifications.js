Notifications = new Mongo.Collection('notifications');

Meteor.methods({
    insertNotification: function(notification){
        Notifications.insert(notification);
    }
});