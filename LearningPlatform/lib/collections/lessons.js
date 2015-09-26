Lessons = new Mongo.Collection ('lessons');
UsersEnrolled = new Mongo.Collection('usersEnrolledLesson');

Meteor.methods ({
    insertLesson: function(lesson){
        var id = Lessons.insert(lesson);
        return {_id: id};
    },
    insertUserEnrolledLesson: function(lesson_id, user_id){
        Lessons.update({_id: lesson_id},{$inc: {users_count: 1}});
        return UsersEnrolled.insert({context_id: lesson_id, user_id: user_id});
    }
});