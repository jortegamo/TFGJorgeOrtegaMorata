Sections = new Mongo.Collection('sections');

Meteor.methods({
    insertSection: function(section){
        return Sections.insert(section);
    }
});