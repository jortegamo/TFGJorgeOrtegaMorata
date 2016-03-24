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
       return (Votes.findOne({user_id: Meteor.userId()}))? 'active' : '';
    },
    userEnrolled: function(){
        return UsersEnrolled.findOne({user_id: Meteor.userId()});
    },
    hasTags: function(){
        return (this.tags)? this.tags.length : false;
    },
    getData: function(){
        return function(){
            return {saludo: 'hola'};
        }
    }
});

Template.channel.events({
    'click .vote-button': function(e){
        $like = $(e.currentTarget);

        ($like.hasClass('active')) ? $like.removeClass('active') : $like.addClass('active');

        Meteor.call('voteChannel',this._id,Meteor.userId(),($like.hasClass('active'))? 1 : -1);

        var paramsNotification = {
            to: this.author,
            from: Meteor.userId(),
            createdAt: new Date(),
            parentContext_id: this._id,
            type: 'channel',
            action: ($like.hasClass('active'))? 'likeChannel' : 'removeLikeChannel',
            urlParameters: this._id
        };

        NotificationsCreator.createNotification(paramsNotification,function(err){
            if(err)console.log('create Notification ERROR: likeChannel: ' + err.reason);
        });
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
        if (this.author != Meteor.userId()){
            var paramsNotification = {
                to: this.author,
                from: Meteor.userId(),
                createdAt: new Date(),
                parentContext_id: this._id,
                type: 'channel',
                action: 'newCommentChannel',
                urlParameters: this._id
            };

            NotificationsCreator.createNotification(paramsNotification,function(err,result){
                if(err) console.log('createNotification ERROR: ' + err.reason);
                if(result) console.log('created new Notification');
            });
        }
    },
    'click .subscribe-button': function(){
        Meteor.call('insertUserEnrolledChannel',this._id, Meteor.userId());
        var paramsNotification = {
            to: this.author,
            from: Meteor.userId(),
            createdAt: new Date(),
            parentContext_id: this._id,
            type: 'channel',
            action: 'subscription',
            urlParameters: this._id
        };
        NotificationsCreator.createNotification(paramsNotification,function(err){
            if(err) console.log('subscriptionChannel Notification ERROR: ' + err.reason);
        });
    },
    'click #cancel-subscription-button': function(){
        Meteor.call('removeUserEnrolledChannel',this._id,Meteor.userId(),function(err,res){
            if(err) console.log('removeUserEnrolledChannel ERROR: ' + err.reason);
            if(res) console.log(res);
        });
        var paramsNotification = {
            to: this.author,
            from: Meteor.userId(),
            createdAt: new Date(),
            parentContext_id: this._id,
            type: 'channel',
            action: 'cancelSubscription',
            urlParameters: this._id
        }
        NotificationsCreator.createNotification(paramsNotification,function(err){
            if(err) console.log('cancelSubscriptionChannel Notification ERROR: ' + err.reason);
        });
    },
    'click .filter': function(e){
        var elem = e.currentTarget;
        $('.filter').removeClass('active');
        $(elem).addClass('active');
    },
    'click .display-option': function(e){
        var elem = e.currentTarget;
        $('.display-option').removeClass('active');
        $(elem).addClass('active');
        if (elem.id == 'list'){
            Session.set('horizontalMode',true);
        }else{
            Session.set('horizontalMode',false);
        }
    }
});

Template.channel.rendered = function(){
    $('.records-count').tooltip({placement: 'top', title: 'records'});
    $('.comments-count').tooltip({placement: 'bottom', title: 'comments'});
    $('.votes-count').tooltip({placement: 'top', title: 'votes'});
    $('.subscriptions-count').tooltip({placement: 'bottom', title: 'subscriptions'});
    Session.set('contextType','channel');
    Session.set('horizontalMode',true);
}