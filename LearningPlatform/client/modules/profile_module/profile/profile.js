
var messages;

Template.profile.helpers({
    username: function(){
        var user = Meteor.users.findOne(Session.get('currentProfileId'));
        return (user)? user.username : '';
    },
    isOwner: function(){
        return Meteor.userId() === Session.get('currentProfileId');
    },
    created: function(){
        return smartDate(Meteor.users.findOne(Session.get('currentProfileId')).createdAt);
    },
    isMyContact: function(){
        return Relations.findOne({users: Meteor.userId()});
    },
    sectionActive: function(){
        //reactive selection
        if (this.section){
            var tabId = this.section.split('T')[0];
            if (!$('#' + tabId).hasClass('active')){
                $('.section').removeClass('active');
                $('#' + tabId).addClass('active');
            }
        }
        return this.section;
    },
    avatar: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).avatar;
    },
    banner: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).banner;
    },
    description: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).description;
    },
    tabNamesArray: function(){
        return [{template: 'channelsTabContent', name: 'channels', icon: 'fa-desktop', initialActive: true},
                {template: 'teamsTabContent',    name: 'teams', icon: 'fa-users'},
                {template: 'lessonsTabContent',  name: 'lessons', icon: 'fa-book'},
                {template: 'recordsTabContent',  name: 'records', icon: 'fa-film'},
                {template: 'conversationsTabContent', name: 'conversations', icon: 'fa-envelope-o', ownerOnly: true, isOwner: Session.get('currentProfileId') === Meteor.userId()},
                {template: 'contactsTabContent', name: 'contacts', icon: 'fa-user'}];
    }
});

Template.profile.events({
    'click #edit-profile': function(){
        Router.go('profileEdit',{_id: Session.get('currentProfileId')})
    },
    'click .profile-img': function(){
        Router.go('profile',{_id: Session.get('currentProfileId')});
    },
    'click #add-contact': function(){
        var processInitiated = function(){
            return Requests.findOne({$or: [{'applicant.id': Meteor.userId()},{'requested.id': Meteor.userId()}]});
        };

        if (!processInitiated()){
            var request = {
                createAt: new Date(),
                applicant:{id: Meteor.userId(),deleted: false},
                requested: {id: Session.get('currentProfileId'), deleted: false},
                message: "Hey, I'm using DuckFlight! add me to your contacts!",
                status: 'pending'
            };
            Meteor.call('insertRequest',request,function(err,res){
                if(err) console.log('error');
                if(res) console.log(res);
            });
        }

    },
    'click #remove-contact': function(){
        Meteor.call('removeContact',Session.get('currentProfileId'));
    },
    'click #send-message': function(){
        Router.go('conversationSubmit',{user: Session.get('currentProfileId')});
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
    Session.set('horizontalMode',true);
    Session.set('currentProfileId',this.data.user_id);
};

Template.profile.rendered = function(){
    Session.set('resultTemplate','contactResult');
};

Template.profile.destroyed = function(){
    Session.set('currentProfileId', null);
    Session.set('horizontalMode', false);
};


Template.navbarBanner.helpers({
    capitalize: function(s){
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
});

Template.navbarBanner.events({
    'click .section': function(e){
        $('.section').removeClass('active');
        $('#' + this.name).addClass('active');
        Session.set('currentSection',this.template);
        $('#list').click();
    }
});

Template.navbarBanner.rendered = function(){
    var tab;
    if(Session.get('currentSection')){
        tab = _(this.data.tabs).find(function(t){ return t.template === Session.get('currentSection'); });
    }else{
        tab = _(this.data.tabs).find(function(t){ return t.initialActive == true;});
    }
    $('#' + tab.name).click();
};

Template.navbarBanner.destroyed = function(){
    Session.set('currentSection', null);
};

Template.channelsTabContent.helpers({
    hasItems: function() {
        return Channels.find({}).count();
    },
    listMode: function(){
        return Session.get('horizontalMode');
    },
    channels: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Channels.find({author: this.user_id},{sort: {createdAt: -1}});
                break;
            case 'populars':
                return Channels.find({author: this.user_id},{sort: {votes_count: -1}});
                break;
        }
    }
});

Template.channelsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('channel',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'recent-filter':
                Session.set('currentFilter','recents');
                break;
            case 'popular-filter':
                Session.set('currentFilter','populars');
                break;
        }
    }
});

Template.channelsTabContent.rendered = function(){
    $('#recent-filter').click();
};


Template.recordsTabContent.helpers({
    listMode: function(){
        return Session.get('horizontalMode');
    },
    records: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Records.find({author: this.user_id},{sort: {createdAt: -1}});
                break;
            case 'populars':
                return Records.find({author: this.user_id},{sort: {votes: -1}});
                break;
        }
    }
});

Template.recordsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('record',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'recent-filter':
                Session.set('currentFilter','recents');
                break;
            case 'popular-filter':
                Session.set('currentFilter','populars');
                break;
        }
    }
});

Template.recordsTabContent.rendered = function(){
    $('#recent-filter').click();
};

Template.teamsTabContent.helpers({
    listMode: function(){
        return Session.get('horizontalMode');
    },
    teams: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Teams.find({author: this.user_id},{sort: {createdAt: -1}});
                break;
            case 'populars':
                return Teams.find({author: this.user_id},{sort: {votes: -1}});
                break;
        }
    }
});

Template.teamsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('team',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'recent-filter':
                Session.set('currentFilter','recents');
                break;
            case 'popular-filter':
                Session.set('currentFilter','populars');
                break;
        }
    }
});

Template.teamsTabContent.rendered = function(){
    $('#recent-filter').click();
};

Template.lessonsTabContent.helpers({
    listMode: function(){
        return Session.get('horizontalMode');
    },
    lessons: function(){
        switch(Session.get('currentFilter')){
            case 'recents':
                return Lessons.find({author: this.user_id},{sort: {createdAt: -1}});
                break;
            case 'populars':
                return Lessons.find({author: this.user_id},{sort: {votes: -1}});
                break;
        }
    }
});

Template.lessonsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'recent-filter':
                Session.set('currentFilter','recents');
                break;
            case 'popular-filter':
                Session.set('currentFilter','populars');
                break;
        }
    }
});

Template.lessonsTabContent.rendered = function(){
    $('#recent-filter').click();
};

Template.conversationsTabContent.helpers({
   conversations: function(){
       return Conversations.find({},{sort: {last_modified: -1}});
   },
   conversationsCount: function(){
       return Conversations.find({}).count();
   }
});

Template.conversationItem.helpers({
    dateFrom: function(date){
        return smartDate(date);
    },
    status: function(){
        var me = _(this.members).filter(function(member){
            return member._id == Session.get('currentProfileId');
        });
        return me.status;
    },
    shortField: function(field,max){
        return ellipsis (field,max);
    },
    avatar: function(){
        var message = Messages.findOne({conversation_id: this._id},{sort: {createdAt: -1}});
        return Meteor.users.findOne(message.author).avatar;
    },
    username: function(){
        var message = Messages.findOne({conversation_id: this._id},{sort: {createdAt: -1}});
        return Meteor.users.findOne(message.author).username;
    },
    message: function(){
        return new Handlebars.SafeString(Messages.findOne({conversation_id: this._id},{sort: {createdAt: -1}}).message);
    }
});

Template.conversationItem.events({
    'click .reply-button': function(){
        Router.go('conversation',{_id: this._id});
    },
    'click img, click .author': function(){
        var authorId = Messages.findOne({conversation_id: this._id}).author;
        Router.go('profile',{_id: authorId});
    }
});

Template.contactsTabContent.helpers({
    showContacts: function(){
        return Session.get('currentFilter') === 'contacts';
    },
    isOwner: function(){
        return Session.get('currentProfileId') === Meteor.userId();
    }
});

Template.contactsTabContent.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'contacts-filter':
                Session.set('currentFilter','contacts');
                break;
            case 'requests-filter':
                Session.set('currentFilter','requests');
                break;
        }
    }
});

Template.contactsTabContent.rendered = function(){
    $('#contacts-filter').click();

};

Template.contactsList.helpers({
    contacts: function(){
        return Relations.find({},{sort: {createAt: -1}});
    }
});

Template.contactItem.helpers({
    dateFrom: function(date){
        return smartDate(date);
    },
    shortField: function(field,max){
        return ellipsis (field,max);
    },
    userStatus: function(){
        var contact = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return (Meteor.users.findOne(contact[0]).status.online)? 'online' : 'outline';
    },
    isOwner: function(){
        return Session.get('currentProfileId') === Meteor.userId();
    },
    avatar: function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return Meteor.users.findOne(contactId[0]).avatar;
    },
    username: function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return Meteor.users.findOne(contactId[0]).username;
    },
    description: function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        return Meteor.users.findOne(contactId[0]).description;
    }
});

Template.contactItem.events({
    'click .avatar, click .author': function(){
        var contactId = _(this.users).filter(function(item){return item !== Session.get('currentProfileId')});
        Session.set('currentProfileId',contactId[0]);
        Session.set('currentSection','channelsTabContent');
        Router.go('profile',{_id: contactId[0]});
    }
});


Template.requestSentList.helpers({
    requests: function(){
        return Requests.find({$and: [{'applicant.id': Session.get('currentProfileId')}, {'applicant.deleted': false}]},{sort: {createAt: -1}});
    },
    sent_count: function(){
        return Requests.find({$and: [{'applicant.id': Session.get('currentProfileId')}, {'applicant.deleted': false}]}).count();
    }
});

Template.requestReceivedList.helpers({
    requests: function(){
        return Requests.find({$and: [{'requested.id': Session.get('currentProfileId')}, {'requested.deleted': false}]},{sort: {createAt: -1}});
    },
    received_count: function(){
        return Requests.find({$and: [{'requested.id': Session.get('currentProfileId')}, {'requested.deleted': false}]}).count();
    }
});

Template.requestItem.helpers({
    dateFrom: function(date){
        return smartDate(date);
    },
    shortField: function(field,max){
        return ellipsis (field,max);
    },
    toMe: function(){
        return this.requested.id == Session.get('currentProfileId');
    },
    pending: function(){
        return this.status == 'pending';
    },
    refused: function(){
        return this.status == 'refused';
    },
    accepted: function(){
        return this.status == 'accepted';
    },
    avatar:function(){
        if (this.requested.id === Session.get('currentProfileId')){
            return Meteor.users.findOne(this.applicant.id).avatar;
        }else{
            return Meteor.users.findOne(this.requested.id).avatar;
        }
    },
    username: function(){
        if (this.requested.id === Session.get('currentProfileId')){
            return Meteor.users.findOne(this.applicant.id).username;
        }else{
            return Meteor.users.findOne(this.requested.id).username;
        }
    },
    isSent: function(){
        return this.applicant.id === Session.get('currentProfileId');
    },
    avatarApplicant: function(){
        return Meteor.users.findOne(Session.get('currentProfileId')).avatar;
    }
});

Template.requestItem.events({
    'click .action-button': function(e){
        if (this.status == 'pending'){
            switch(e.currentTarget.id){
                case 'accept':
                    Meteor.call('acceptRequest',this);
                    break;
                case 'refuse':
                    Meteor.call('refuseRequest',this);
                    break;
            }
        }else{
            switch(e.currentTarget.id){
                case 'ok':
                    Meteor.call('checkRequest',this,Meteor.userId());
                    break;
                case 'resend':
                    Meteor.call('resendRequest',this);
                    break;
            }
        }
    },
    'click .avatar, click .username': function(){
       if (this.applicant.id === Session.get('currentProfileId')){
           Router.go('profile',{_id: this.requested.id});
       }else{
           Router.go('profile',{_id: this.applicant.id});
       }
    }
});

//AutocompleteContacts

Template.autoCompleteContacts.helpers({
    searching: function(){
        return Session.get('searching');
    },
    activeSearch: function(){
        return Session.get('activeSearch');
    },
    hasResults: function(){
        return Session.get('hasResults');
    },
    results: function(){
        return Meteor.users.find({username: new RegExp(Session.get('searchValue'))});
    },
    resultTemplate: function(){
        return Session.get('resultTemplate');
    }
});

Template.autoCompleteContacts.events({
    'keyup input': function(e){
        Session.set('activeSearch',true);
        if ($(e.target).val() != ""){
            if (e.keyCode !== 16){Session.set('searching',true);}
            Session.set('searchValue',$(e.target).val());
        }else{
            Session.set('searchValue',null);
        }
    },
    'click #eraser-search': function(e){
        e.preventDefault();
        Session.set('activeSearch',false);
        Session.set('searching',false);
        $('#auto-complete-input').val('');
    }
});

Template.autoCompleteContacts.rendered = function(){
    Session.set('searching',false);
    Session.set('activeSearch',false);
    Session.set('hasResults',false);
    Session.set('searchValue',null);

    var self = this;
    var resultsDecisor = function(){
        Session.set('hasResults',Meteor.users.find({username: new RegExp(Session.get('searchValue'))}).count() > 0);
        Session.set('searching',false);
    };
    self.autorun(function(){

        if (Session.get('searchValue')){
            if(self.data.feedDynamic != 'false'){
                Meteor.subscribe('usersBySearch',Session.get('searchValue'), resultsDecisor);
            }else{
                resultsDecisor();
            }
        }else{
            Session.set('searching',false);
            Session.set('activeSearch',false);
        }
    })
};

Template.contactResult.helpers({
    inContacts: function(){
        return Relations.find({users: this._id}).count();
    },
    sent: function(){
        return Requests.find({'applicant.id': Session.get('currentProfileId'), 'requested.id': this._id}).count();
    },
    received: function(){
        return Requests.find({'applicant.id': this._id, 'requested.id': Session.get('currentProfileId')}).count();
    }
});

Template.contactResult.events({
    'click button': function(){
        var request = {
            createAt: new Date(),
            applicant:{id: Session.get('currentProfileId'),deleted: false},
            requested: {id: this._id, deleted: false},
            message: "Hey, I'm using DuckFlight! add me to your contacts!",
            status: 'pending'
        };
        Meteor.call('insertRequest',request,function(err,res){
            if(err) console.log('error');
            if(res){

            }
        });
    }
})




