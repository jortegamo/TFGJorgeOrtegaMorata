//effects will be fixed by subscribe to the user one. (in router.js)

Template.profile.helpers({
    username: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).username;
    },
    isNotOwner: function(){
        return Meteor.user()._id !== Session.get('currentProfileId'); //needs a change here!!
    },
    isOwner: function(){
        return Meteor.user()._id === Session.get('currentProfileId');
    },
    created: function(){
        return smartDate(Meteor.users.findOne(Session.get('currentProfileId')).createdAt);
    }
});

Template.profile.events({
    'click .profile-img': function(){
        Router.go('profile',{_id: Session.get('currentProfileId')});
    },
    'click .section': function(e){
        var elem = e.currentTarget;
        $('.section').removeClass('active');
        $(elem).addClass('active');
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

Template.profile.created = function(){
    Session.set('currentProfileId', this.data._id);
};