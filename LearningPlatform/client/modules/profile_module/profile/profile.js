
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
                {template: 'conversationsTabContent', name: 'Conversations', icon: 'fa-envelope-o', ownerOnly: true, isOwner: Session.get('currentProfileId') === Meteor.userId()},
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
        console.log('nos vamos a la pagina de crear mensaje');
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
    messages = [];


    var mes1 = {
        author: 'GrexRob',
        createdAt: new Date(),
        subject: 'Create a new Team',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Praesent malesuada leo nisi, eget vehicula augue auctor faucibus. Nam ' +
        'dictum eros nec arcu fermentum ornare. Nunc commodo fermentum aliquet. Vivamus dapibus, ' +
        'diam et sagittis suscipit, tortor velit accumsan nulla, et aliquam nunc ipsum et ex. ',
        avatar: "https://avatars0.githubusercontent.com/u/842692?v=3&s=460",
        state: 'responded',
        replies_count: 0,
        users_count: 5
    };
    var mes2 = {
        author: 'PHeras',
        createdAt: new Date(),
        subject: 'Vacances',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Praesent malesuada leo nisi, eget vehicula augue auctor faucibus. Nam ' +
        'dictum eros nec arcu fermentum ornare. Nunc commodo fermentum aliquet. Vivamus dapibus, ' +
        'diam et sagittis suscipit, tortor velit accumsan nulla, et aliquam nunc ipsum et ex. ',
        avatar: "http://gsyc.es/~grex/concurso/21/images/pedrodelasheras.jpg",
        state: 'pending',
        replies_count: 29,
        users_count: 2
    };
    var mes3 = {
        author: 'JBarahona',
        createdAt: new Date(),
        subject: 'ñalksdjfñalksjdfñalksdjñflaksjdfñlkasjdfñlaksjdfñlkasjdfñlaksdj',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Praesent malesuada leo nisi, eget vehicula augue auctor faucibus. Nam ' +
        'dictum eros nec arcu fermentum ornare. Nunc commodo fermentum aliquet. Vivamus dapibus, ' +
        'diam et sagittis suscipit, tortor velit accumsan nulla, et aliquam nunc ipsum et ex. ',
        avatar: 'https://media.licdn.com/mpr/mpr/shrinknp_400_400/p/1/000/029/1d4/0bc075a.jpg',
        state: 'viewed',
        replies_count: 14,
        users_count: 4
    };
    messages.push(mes1);
    messages.push(mes2);
    messages.push(mes3);
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
       return messages;
   }
});

Template.conversationsTabContent.events({
    'click .filter': function(e){
        switch(e.currentTarget.id){
            case 'receiver-filter':
                Session.set('currentFilter','receiver');
                break;
            case 'sender-filter':
                Session.set('currentFilter','sender');
                break;
        }
    }
});

Template.conversationsTabContent.rendered = function(){
    $('#receiver-filter').click();
};

Template.conversationItem.helpers({
    dateFrom: function(date){
        return smartDate(date);
    },
    status: function(){
        return this.state;
    },
    shortField: function(field,max){
        return ellipsis (field,max);
    }
});

Template.conversationItem.events({
    'click .reply-button': function(){
        console.log("go to message's converation");
    },
    'click img, click .author': function(){
        console.log('go profile message author');
    }
});

Template.conversationItem.rendered = function(){
    $('.replies_counter').tooltip({placement: 'top', title: 'replies'});
    $('.users_counter').tooltip({placement: 'bottom', title: 'members'});
};

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
        return Relations.find();
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
        return Requests.find({$and: [{'applicant.id': Session.get('currentProfileId')}, {'applicant.deleted': false}]});
    },
    sent_count: function(){
        return Requests.find({$and: [{'applicant.id': Session.get('currentProfileId')}, {'applicant.deleted': false}]}).count();
    }
});

Template.requestReceivedList.helpers({
    requests: function(){
        return Requests.find({$and: [{'requested.id': Session.get('currentProfileId')}, {'requested.deleted': false}]});
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
    'click #eraser-search': function(){
        Session.set('activeSearch',false);
        Session.set('searching',false);
        $('input').val('');
    }
});

Template.autoCompleteContacts.rendered = function(){
    Session.set('searching',false);
    Session.set('activeSearch',false);
    Session.set('hasResults',false);
    Session.set('searchValue',null);

    var self = this;

    self.autorun(function(){

        if (Session.get('searchValue')){
            if(self.data.feedDynamic){
                Meteor.subscribe('usersBySearch',Session.get('searchValue'),
                    function(){
                        if (!Meteor.users.find({username: new RegExp(Session.get('searchValue'))}).count()){
                            Session.set('hasResults',false);
                        }else{
                            Session.set('hasResults',true);
                        }
                        Session.set('searching',false);
                    }
                );
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




