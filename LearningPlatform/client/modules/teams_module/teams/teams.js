Template.teams.helpers({
    pageTitle: function(){
        var title = 'Teams';
        return (title.length > 27) ? title.slice(0,27) + '...' : title;
    },
    teams: function(){
        return Teams.find({},{sort: {createdAt: -1}});
    },
    listMode: function(){
        return Session.get('horizontalMode');
    }
});

Template.teams.events({
    'click .display-option': function(e){
        var elem = e.currentTarget;
        $('.display-option').removeClass('active');
        $(elem).addClass('active');
        if (elem.id == 'list'){
            Session.set('horizontalMode',true);
        }else{
            Session.set('horizontalMode',false);
        }
    },
    'click .filter': function(e){
        var elem = e.currentTarget;
        $('.filter').removeClass('active');
        $(elem).addClass('active');
    },
    'click .button-circle': function(){
        Router.go('teamSubmit');
    }
});

Template.teams.rendered = function(){
    Session.set('horizontalMode',true);
    $('.button-circle').tooltip({placement: 'bottom', title: 'create a new Team'});
};

Template.teams.created = function(){
    Session.set('search', null);
}

Template.teamItemHorizontal.helpers({
    shortDescription: function(description,max){
        return ellipsis(description,max);
    },
    dateFrom: function(d) {
        return smartDate(d);
    },
    authorName: function(){
        return Meteor.users.findOne(this.author).username;
    }
});

Template.teamItemHorizontal.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(){
        Router.go('team',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author});
    }
});

Template.teamItemHorizontal.rendered = function(){
    $('.projects-count').tooltip({placement: 'bottom', title: 'projects'});
    $('.users-count').tooltip({placement: 'top', title: 'users'});
    $('.votes-count').tooltip({placement: 'bottom', title: 'votes'});
};

Template.teamItemVertical.helpers({
    dateFrom: function(d){
        return smartDate(d);
    },
    authorName: function(){
        return Meteor.users.findOne(this.author).username;
    }
});

Template.teamItemVertical.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(){
        Router.go('team',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author});
    }
});

Template.teamItemVertical.rendered = function() {
    $('.projects-count').tooltip({placement: 'bottom', title: 'projects'});
    $('.users-count').tooltip({placement: 'top', title: 'users'});
    $('.votes-count').tooltip({placement: 'bottom', title: 'votes'});
};