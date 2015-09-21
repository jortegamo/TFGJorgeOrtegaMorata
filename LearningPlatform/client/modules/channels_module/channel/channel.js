Template.channel.helpers({
    isOwner: function(){
        return Meteor.userId() === this.author;
    },
    tabNamesArray: function(){
        return [{template: 'recordsTabContent',  name: 'records', icon: 'fa-film', initialActive: true},
                {template: 'commentsTabContent', name: 'comments', icon: 'fa-comments'}];
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
    }
});