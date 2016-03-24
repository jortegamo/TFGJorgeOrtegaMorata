Lessons = new Mongo.Collection ('lessons');
UsersEnrolled = new Mongo.Collection('usersEnrolled');

Meteor.methods ({
    insertLesson: function(lesson){
        var id = Lessons.insert(lesson);
        return {_id: id};
    },
    insertUserEnrolledLesson: function(lesson_id, user_id){
        Lessons.update({_id: lesson_id},{$inc: {users_count: 1}});
        return UsersEnrolled.insert({context_id: lesson_id, user_id: user_id});
    },
    removeUserEnrolledLesson: function(lesson_id,user_id){
        Lessons.update({_id: lesson_id},{$inc: {users_count: -1}});
        return UsersEnrolled.remove({context_id: lesson_id, user_id: user_id});
    },
    incrementLessonComment: function(lesson_id){
        Lessons.update(lesson_id,{$inc: {comments_count: 1}});
    },
    lessonUpdate: function(lesson_id,objectUpdate){
        _(objectUpdate.sections).each(function(section){
            Sections.update(section._id,{$set: {order: section.order}});
        });
        return Lessons.update(lesson_id,{$set: _(objectUpdate).omit('sections')});
    },
    voteLesson: function(lesson_id,user_id,inc){
        Lessons.update(lesson_id,{$inc: {votes_count: inc}});
        if(inc > 0){
            Votes.insert({lesson_id: lesson_id,user_id: user_id});
        }else{
            Votes.remove({lesson_id: lesson_id,user_id: user_id});
        }
    },
});