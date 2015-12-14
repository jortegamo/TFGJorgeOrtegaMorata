Template.lessonSubmit.helpers({

});

Template.lessonSubmit.events({
    'submit form': function(e){
        e.preventDefault();
        var title = $(e.target).find("[name='title']").val();
        var description = $(e.target).find("[name='description']").val();
        var lesson = {
            author: Meteor.userId(),
            title: title,
            description: description,
            tags: Session.get('tagsChoosen'),
            createdAt: new Date(),
            sections_count: 0,
            comments_count: 0,
            votes_count: 0,
            users_count: 0
        };
        Meteor.call('insertLesson',lesson,function(err,result){
            if (err) {
                console.log('inserLesson Error: ' + err.reason);
            }
            if(result){
                Router.go('lesson',{_id: result._id});
            }
        })
    }
});

Template.lessonSubmit.rendered = function(){
    Session.set('formType','lessonForm');
};