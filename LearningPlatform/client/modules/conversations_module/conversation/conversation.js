Template.conversation.helpers({
    messages: function(){
        return Messages.find({});
    },
    membersMinified: function(){
        return (this.members.length > 3)? this.members.slice(0,3): this.members;
    },
    shortSubject: function(s,max){
        return ellipsis(s,max)
    },
    moreUsers: function(){
        return this.members.length > 3;
    },
    restUsersCounter: function(){
        return this.members.length - 3;
    }
});

Template.conversation.events({
    'click #send-button': function(){
        var message = $('#message-input').html();
        if (message){
            var messageObject = {
                author: Meteor.userId(),
                createdAt: new Date(),
                message: message,
                conversation_id: this._id
            };
            var conversation_id = this._id;
            Meteor.call('insertMessage', messageObject, function(err,msg_id) {
                if (err) console.log('insertMessage ERROR: ' + err.reason);
                if (msg_id){
                    Meteor.call('updateConversation',conversation_id,msg_id);
                }
            });
        }
        $('#message-input').html('');
    },
    'click .restUsers': function(){
        if($('.usersListPanel').hasClass('active')){
            $('.usersListPanel').removeClass('active');
        }else{
            $('.usersListPanel').addClass('active');
        }

    }
});


Template.conversation.created = function(){
    Session.set('memberList',this.data.members);
};

Template.conversation.rendered = function(){

};

Template.conversation.destroyed = function(){

};

Template.memberAvatar.helpers({
    avatar: function(){
        return Meteor.users.findOne(this._id).avatar;
    }
});

Template.memberInfo.helpers({
    avatar: function(){
        return Meteor.users.findOne(this._id).avatar;
    },
    username: function(){
        return Meteor.users.findOne(this._id).username;
    }
});

Template.memberInfo.events({
    'click button': function(){
        Router.go('profile',{_id: this._id});
    }
})

Template.messageItem.helpers({
    avatar: function(){
        return Meteor.users.findOne(this.author).avatar;
    },
    username: function(){
        return Meteor.users.findOne(this.author).username;
    },
    dateFrom: function(d){
        return smartDate(d);
    },
    owner: function(){
        return this.author == Meteor.userId();
    },
    message: function(){
        return new Handlebars.SafeString(this.message);
    }

});

Template.messageItem.rendered = function(){
    var content = document.getElementById("messages-list");
    content.scrollTop = content.scrollHeight;
}