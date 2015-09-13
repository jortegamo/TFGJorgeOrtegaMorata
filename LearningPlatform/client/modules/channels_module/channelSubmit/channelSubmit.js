Template.channelSubmit.helpers({

});

Template.channelSubmit.events({
    'submit form': function(e){
        e.preventDefault();
        var title = $(e.target).find("[name='title']").val();
        var description = $(e.target).find("[name='description']").val();
        var channel = {
            author: Meteor.userId(),
            title: title,
            description: description,
            createdAt: new Date(),
            records_count: 0,
            comments_count: 0,
            votes_count: 0,
            users_count: 0
        };
        Meteor.call('insertChannel',channel,function(err,result){
            if (err) {
                console.log('insertChannel Error: ' + err.reason);
            }
            if(result){
                Router.go('channel',{_id: result._id});
            }
        })

    }
});

Template.channelSubmit.rendered = function(){
    Session.set('formType','channelForm');
};