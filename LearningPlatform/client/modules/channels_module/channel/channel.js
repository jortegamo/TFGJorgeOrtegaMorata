Template.channel.helpers({
    isOwner: function(){
        return Meteor.userId() === this.author;
    },
    tabNamesArray: function(){
        return [{template: 'recordsTabContent',  name: 'records', icon: 'fa-film', initialActive: true},
                {template: 'commentsTabContent', name: 'comments', icon: 'fa-comments'},
                {template: 'usersTabContent', name: 'users', icon: 'fa fa-users'}];
    },
    avatar: function(){
        return Meteor.users.findOne(this.author).avatar;
    },
    username: function(){
        return Meteor.users.findOne(this.author).username;
    },
    dateFrom: function(d){
        return smartDate(d);
    },
    sectionActive: function(){
        return Session.get('currentSection');
    },
    voted: function(){
       return (VotesChannels.findOne({user_id: Meteor.userId()}))? 'active' : '';
    },
    userEnrolled: function(){
        return UsersEnrolled.findOne({user_id: Meteor.userId()});
    }
});

Template.channel.events({
    'click .vote-button': function(e){
        $like = $(e.currentTarget);

        if($like.hasClass('active')){
            $like.removeClass('active');
            Meteor.call('voteChannel',this._id,Meteor.userId(),-1);
        }else{
            $like.addClass('active');
            Meteor.call('voteChannel',this._id,Meteor.userId(),1);
        }
    },
    'submit #form-comment': function(e){
        e.preventDefault();
        var text = $(e.currentTarget).find('textarea').val();
        if (text){
            var comment = {
                createdAt: new Date(),
                author: Meteor.userId(),
                text: text,
                contextId: this._id,
                replies_count: 0,
                isReply: false
            };
            Meteor.call('insertComment',comment);
            Meteor.call('incrementChannelComment',this._id);
            $(e.currentTarget).find('textarea').val('');
        }
    },
    'click .subscribe-button': function(){
        Meteor.call('insertUserEnrolledChannel',this._id, Meteor.userId());
    }
});

Template.channel.rendered = function(){
    $('.records-count').tooltip({placement: 'top', title: 'records'});
    $('.comments-count').tooltip({placement: 'bottom', title: 'comments'});
    $('.votes-count').tooltip({placement: 'top', title: 'votes'});
    $('.subscriptions-count').tooltip({placement: 'bottom', title: 'subscriptions'});
}