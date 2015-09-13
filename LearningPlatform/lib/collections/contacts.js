Relations = new Mongo.Collection('relations');

Meteor.methods({
    insertRelation: function(arrayIds) {
        return Relations.insert({users: arrayIds});
    }
});