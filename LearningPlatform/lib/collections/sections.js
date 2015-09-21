Sections = new Mongo.Collection('sections');


Meteor.methods({
    insertSection: function(section){
        Lessons.update({_id: section.lesson_id},{$inc: {sections_count: 1}});
        return Sections.insert(section);
    }
});
