Template.channel.helpers({
    isNotOwner: function(){
        return Meteor.userId() !== this.author; //needs a change here!!
    },
    isOwner: function(){
        return Meteor.userId() === this.author;
    },
})