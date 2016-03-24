Template.conversationSubmit.created = function(){
    if(this.data.userToSend) Session.set('userToSend',this.data.userToSend);
};

Template.conversationSubmit.rendered = function(){
    Session.set('formType','conversationSubmitForm');
};

Template.conversationSubmit.destroyed = function(){
    Session.set('userToSend',null);
};

Template.conversationSubmit.events({
    'submit .conversation-form': function(e){
        e.preventDefault();
        var subject = $(e.target).find('[name=subject]').val();
        var memberObjects = Session.get('memberList');
        var message = $('#message-input').html();
        $('.errormsg').remove();

        if(message && memberObjects.length > 1){
            var membersArray = [];
            var startDate = new Date();

            _(memberObjects).each(function(member){
                membersArray.push({
                    _id: member._id,
                   startDate: startDate,
                   bg_img: '/conversationBGDefault.jpg'
                });
            });

            var message = {
                author: Meteor.userId(),
                createdAt: new Date(),
                message: message
            };

            var conversation = {
                members: membersArray,
                members_count: membersArray.length,
                author: membersArray[0]._id,
                last_modified: message.createdAt,
                subject: subject
            };

            Meteor.call('insertConversation',conversation,function(err,conversation_id){
                if (err) console.log('insertConversation ERROR: ' + err.reason);
                if (conversation_id){
                    message.conversation_id = conversation_id;
                    Meteor.call('insertConversationAlerts',conversation_id,Session.get('memberList'),function(err,res){
                        if(err) console.log('insertConversationAlerts ERROR: ' + err.reason);
                    });
                    Meteor.call('insertMessage',message,function(err,message_id){
                        if (err) console.log('insertMessage ERROR: ' + err.reason);
                    });
                    Router.go('conversation',{_id: conversation_id});
                }
            });
        }else{
            if (!message){
                $("#inputMessageBox")
                    .append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Please, write a message before!!</p>');
            }
            if (memberObjects.length <2){
                $("#inputMembersBox")
                    .append('<p class="errormsg"><i class="fa fa-exclamation-triangle"></i> Conversation should have almost 2 members</p>');
            }
        }

    }
});
