Template.lesson.helpers({
    username: function(){
        return Meteor.users.findOne(this.author).username;
    },
    avatar: function(){
        return Meteor.users.findOne(this.author).avatar;
    },
    dateFrom: function(date){
        return smartDate(date);
    },
    isNotOwner: function(){
        return this.author !== Meteor.userId();
    },
    userEnrolled: function(){
        return UsersEnrolled.findOne({user_id: Meteor.userId()});
    },
    sectionActive: function(){
        return Session.get('currentSection');
    },
    tabNamesArray: function(){
        return [{template: 'sectionsTabContent', name: 'sections', icon: 'fa-bookmark', initialActive: true},
                {template: 'usersTabContent',    name: 'users', icon: 'fa-users'},
                {template: 'settingsTabContent',  name: 'settings', icon: 'fa-cogs',ownerOnly: true, isOwner: this.author === Meteor.userId()}];
    }
});

Template.lesson.events({
    'click .creator-box .avatar, click .creator-box .author': function(){
        Session.set('currentProfileId',this.author);
        Router.go('profile',{_id: this.author});
    },
    'click .enrol-button': function(e){
        Meteor.call('insertUserEnrolledLesson',this._id,Meteor.userId(),function(err,res){
            if(err) console.log('insertUserEnrolledLesson ERROR: ' + err.reason);
            if(res) console.log(res);
        });
    },
    'focus .form-section input': function(){
        $('.form-section').addClass('active');
    },
    'blur .form-section input': function(e){
        $('.form-section').removeClass('active');
    },
    'click .filter': function(e){
        var elem = e.currentTarget;
        $('.filter').removeClass('active');
        $(elem).addClass('active');
    },
    'submit form': function(e){
        e.preventDefault();
        var sectionTitle = $(e.currentTarget).find('input').val();
        var section = {
            title: sectionTitle,
            order: Sections.find().count(),
            lesson_id: this._id,
            createdAt: new Date(),
            records_count: 0
        };
        Meteor.call('insertSection',section,function(err,res){
            if(err) console.log('insertSection ERROR: ' + err.reason);
            if(res) console.log(res);
        });
        $(e.currentTarget).find('input').val('');
        $(e.currentTarget).find('input').blur();
    }
});

Template.lesson.rendered = function(){
    Session.set('author',this.data.author);
    $('#sections-count').tooltip({placement: 'left', title: 'sections'});
    $('#comments-count').tooltip({placement: 'bottom', title: 'comments'});
    $('#votes-count').tooltip({placement: 'bottom', title: 'votes'});
    $('#users-count').tooltip({placement: 'right', title: 'users'});
};


//sectionsTab
Template.sectionsTabContent.helpers({
    isOwner: function(){
        return Router.current().data().author === Meteor.userId();
    },
    sections: function(){
        return  Sections.find({},{sort: {order: 1}});
    },
    userEnrolled: function(){
        return this.author == Meteor.userId() || UsersEnrolledLesson.findOne({user_id: Meteor.userId()});
    }
});

Template.sectionsTabContent.events({
    'click #sections-filter': function(){
        Session.set('currentFilter','sections-filter');
    }

});

Template.sectionsTabContent.rendered = function(){
    $('#sections-filter').click();
};


//usersTab
Template.usersTabContent.helpers({
    users: function(){
        return UsersEnrolled.find();
    }
});

Template.usersTabContent.events({
    'click #sections-filter': function(){
        Session.set('currentFilter','users-filter');
    }
});

Template.usersTabContent.rendered = function(){
    $('#users-filter').click();
};


//settingsTab
Template.settingsTabContent.helpers({
    settings: function(){
        return [];
    }
});

Template.settingsTabContent.events({
    'click #settings-filter': function(){
        Session.set('currentFilter','settings-filter');
    }
});

Template.settingsTabContent.rendered = function(){
    $('#settings-filter').click();
};

//Items

Template.userItem.helpers({
    username: function(){
        return Meteor.users.findOne(this.user_id).username;
    },
    avatar: function(){
        return Meteor.users.findOne(this.user_id).avatar;
    }
});

Template.userItem.events({
    'click .userItem .avatar, click .userItem .username': function(){
        Session.set('currentProfileId',this.user_id);
        Session.set('currentSection','channelsTabContent');
        Router.go('profile',{_id: this.user_id});
    }
});

Template.sectionItem.helpers({
    isOwner: function(){
        return Router.current().data().author === Meteor.userId();
    },
    tracks: function(){
        var tracks = [];
        t1 = {
            title: 'functions'
        };
        t2 = {
            title: 'objects'
        };
        t3 = {
            title: 'hierarchy'
        };
        t4 = {
            title: 'variables'
        };
        tracks.push(t1);
        tracks.push(t2);
        tracks.push(t3);
        tracks.push(t4);
        return tracks;
    }
});

Template.sectionItem.events({
    'click .index': function(e,template){
        if($(template.find('.sectionItem')).hasClass('active')){
            $(template.find('.sectionItem')).removeClass('active')
        }else{
            $(template.find('.sectionItem')).addClass('active')
        }
    }
})
Template.sectionItem.rendered = function(template){
    $('.delete-section').tooltip({placement: 'top', title: 'delete'});
    $('.config-section').tooltip({placement: 'top',title: 'settings'});
    $('.counter-tracks').tooltip({placement: 'top',title: 'tracks'});
}