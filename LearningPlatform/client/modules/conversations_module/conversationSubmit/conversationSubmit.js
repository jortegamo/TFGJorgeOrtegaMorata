Template.conversationSubmit.rendered = function(){
    Session.set('formType','conversationSubmitForm');
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
            _(memberObjects).each(function(member){
                membersArray.push({_id: member._id, status: 'pending'});
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
                last_modified: new Date(),
                subject: subject,
                messages_count: 1
            };

            Meteor.call('insertConversation',conversation,function(err,conversation_id){
                console.log('he hecho la llamada!!!');
                if (err) console.log('insertConversation ERROR: ' + err.reason);
                if (conversation_id){
                    console.log('conversation saved with Id: ' + conversation_id);
                    message.conversation_id = conversation_id;
                    //insert message
                    Meteor.call('insertMessage',message,function(err,message_id){
                        if (err) console.log('insertMessage ERROR: ' + err.reason);
                        if(message_id){
                            Router.go('conversation',{_id: conversation_id});
                            console.log('message saved with Id: ' + message_id);
                        }
                    });
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