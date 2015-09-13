Template.teamSubmit.helpers({

});

Template.teamSubmit.events({
    'submit form': function(e){
        e.preventDefault();
        var title = $(e.target).find("[name='title']").val();
        var description = $(e.target).find("[name='description']").val();
        var team = {
            author: Meteor.userId(),
            title: title,
            description: description,
            createdAt: new Date(),
            projects_count: 0,
            users_count: 0,
            votes_count: 0
        };
        Meteor.call('insertTeam',team,function(err,result){
            if (err) {
                console.log('insertTeam Error: ' + err.reason);
            }
            if(result){
                Router.go('team',{_id: result._id});
            }
        });
    }
});

Template.teamSubmit.rendered = function(){
    Session.set('formType','teamForm');
};