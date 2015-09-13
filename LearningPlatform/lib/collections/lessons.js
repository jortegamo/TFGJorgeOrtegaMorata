Lessons = new Mongo.Collection ('lessons');

Meteor.methods ({
    insertLesson: function(lesson){
        var id = Lessons.insert(lesson);
        return {_id: id};
    }
});