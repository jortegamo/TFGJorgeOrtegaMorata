Template.formAwesome.helpers({
    formType: function(){
        return Session.get('formType');
    }
});

Template.formAwesome.events({
    'click .form-field label': function(event){
        var input = $(event.currentTarget).parent().children('input');
        input.focus();
    },

    'blur input, blur textarea': function(event){
        var input = $(event.currentTarget);
        if (input.val() === ''){
            var label = input.parent().children('label');
            label.removeClass('active');
            input.removeClass('active');
        }
    },

    'focus input, focus textarea': function(event){
        var input = $(event.currentTarget);
        var label = input.parent().children('label');
        label.addClass('active');
        input.addClass('active');
    }
});

Template.formDoc.events({
    'click .form-field label': function(event){
        var input = $(event.currentTarget).parent().children('input');
        input.focus();
    },

    'blur input': function(event){
        var input = $(event.currentTarget);
        if (input.val() === ''){
            var label = input.parent().children('label');
            label.removeClass('active');
            input.removeClass('active');
        }
    },

    'focus input': function(event){
        var input = $(event.currentTarget);
        var label = input.parent().children('label');
        label.addClass('active');
        input.addClass('active');
    }
});


/**
 * FORM PROFILE EDIT
 */

Template.formProfileEdit.helpers({
    avatar: function(){
        return Session.get('userObject').avatar || Session.get('userObject').img;
    },
    banner: function(){
        return Session.get('userObject').banner;
    },
    description: function(){
        return Session.get('userObject').description;
    },
    tagsAllow: function(){
        return Session.get('userObject').tagsAllow;
    },
    tags: function(){
        return (Session.get('userObject').tags)? Session.get('userObject').tags : [];
    },
    sectionConfigAllow: function(){
        return Session.get('userObject').sectionConfigAllow;
    },
    sections: function(){
        return (Session.get('userObject').sections)? Session.get('userObject').sections : [];
    },
    subject: function(){
        return Session.get('userObject').subject;
    },
    editConversation: function(){
        return Session.get('userObject').editConversation;
    },
    leaderName: function(){
        return (Session.get('userObject').leader)? Meteor.users.findOne(Session.get('userObject').leader).username : null;
    },
    leaderAvatar: function(){
        return (Session.get('userObject').leader)? Meteor.users.findOne(Session.get('userObject').leader).avatar : null;
    },
    isLeader: function(){
        return (this.author)? Meteor.userId() == this.author : false || (this.user_id)? Meteor.userId() == this.user_id : null;
    }
});

Template.formProfileEdit.events({
    'click .edit-button': function(event){
        var section = $(event.currentTarget).parent().parent();
        $(section).children('.edited-block').addClass('hide');
        $(section).children('.edit-block').addClass('active');
        if ($(section).attr('id') == 'description-section'){
            var desc = Session.get('userObject').description;
            $(section).find('textarea').val(desc || '');
        }
    },

    'click .action-button.discard': function(event){
        var checkboxes = $(event.currentTarget).parent().parent().find('.checkbox-item');
        _(checkboxes).each(function(elem){
            $(elem).removeClass('selected');
            $(elem).find('label i').removeClass('fa-chevron-circle-down').addClass('fa-circle-o');
            $(elem).find('input').attr('disabled',true).val('');
        });
        var section = $(event.currentTarget).parent().parent().parent();
        $(section).children('.edit-block').removeClass('active');
        $(section).children('.edited-block').removeClass('hide');
    },

    'click .checkbox-item label': function(e){
        var checkboxes = $(e.currentTarget).parent().parent().find('.checkbox-item');
        _(checkboxes).each(function(elem){
            $(elem).removeClass('selected');
            $(elem).find('label i').removeClass('fa-chevron-circle-down').addClass('fa-circle-o');
            $(elem).find('input').attr('disabled',true).val('');
        });
        $(e.currentTarget).parent().addClass('selected');
        $(e.currentTarget).find('i').removeClass('fa-circle-o');
        $(e.currentTarget).find('i').addClass('fa-chevron-circle-down');
        $(e.currentTarget).parent().find('input').attr('disabled',false).focus();
    },
    'click #avatar-section .save': function(){

        var img = Session.get('userObject').imgDefault;

        function setImg (img){
            var obj = Session.get('userObject');
            obj.img = img;
            Session.set('userObject',obj);
            $('#avatar-section .discard').click();
        };

        var cbs = $('#avatar-section').find('.checkbox-item');
        var selected = _(cbs).filter(function(item){
            return $(item).hasClass('selected');
        });

        if (selected && $(selected).find('input').length){
            var input = $(selected).find('input');

            switch($(input).attr('type')) {
                case 'text':
                    setImg($(input).val());
                    break;
                case 'file':
                    if ($(input)[0].files) {
                        var file = $(input)[0].files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            setImg(reader.result);
                        };
                    }
                    break;
            }
        }else{
            setImg(img);
        }

    },

    'click #banner-section .save': function(){
        var banner = Session.get('userObject').bannerDefault;

        function setBanner(banner){
            var obj = Session.get('userObject');
            obj.banner = banner;
            Session.set('userObject',obj);
            $('#banner-section .discard').click();
        }

        var cbs = $('#banner-section').find('.checkbox-item');
        var selected = _(cbs).filter(function(item){
            return $(item).hasClass('selected');
        });

        if (selected && $(selected).find('input').length){
            var input = $(selected).find('input');
            switch($(input).attr('type')) {
                case 'text':
                    setBanner($(input).val());
                    break;
                case 'file':
                    if ($(input)[0].files) {
                        var file = $(input)[0].files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            setBanner(reader.result);
                        };
                    }
                    break;
            }
        }else{
            setBanner (banner);
        }
    },

    'click #description-section .save': function(){
        var obj = Session.get('userObject');
        obj.description = $('#description-section').find('textarea').val();
        Session.set('userObject',obj);
        $('#description-section .discard').click();
    },
    'click #tags-section .save': function(){
        var obj = Session.get('userObject');
        obj.tags = Session.get('tagsChoosen');
        Session.set('userObject',obj);
        $('#tags-section .discard').click();
    },
    'click #tags-section .discard': function(){
        Session.set('tagsChoosen',Session.get('userObject').tags);
    },

    'click #sections-config-section .save': function(){
        var obj = Session.get('userObject');
        obj.sections = Session.get('sectionsArray');
        Session.set('userObject',obj);
        $('#sections-config-section .discard').click();
    },

    'click #sections-config-section .discard': function(){
        Session.set('sectionsArray',Session.get('userObject').sections);
    },

    'click #subject-section .save': function(){
        var obj = Session.get('userObject');
        obj.subject = $('#subject-section input').val();
        Session.set('userObject',obj);
        $('#subject-section .discard').click();
    },

    'click #leader-section .save': function(){
        var obj = Session.get('userObject');
        obj.leader = Session.get('leaderChoosen');
        Session.set('userObject',obj);
        $('#leader-section .discard').click();
    },

    'click #members-section .save': function(){
        var obj = Session.get('userObject');
        obj.members = Session.get('memberList');
        Session.set('userObject',obj);
        $('#members-section .discard').click();
    }
});


Template.formProfileEdit.rendered = function(){
    console.log(this.data);
    var sections = Session.get('userObject').sections;
    var tags = Session.get('userObject').tags;
    var members = Session.get('userObject').members;
    (tags)? Session.set('tagsChoosen', tags) : null;
    (sections) ? Session.set('sectionsArray', sections) : null;
    (members) ? Session.set('memberList', members) : null;
};

/**
 * changeOrderSections
 */

Template.changeOrderSections.helpers({
    sections: function() {
        return Session.get('sectionsArray');
    }
});

Template.sectionItemEdit.helpers({
    isNotFirst: function(){
        return this.order > 0;
    },
    isNotLast: function(){
        return this.order < Session.get('sectionsArray').length -1;
    }
});

Template.sectionItemEdit.events({
    'click .action': function(e){
        var sectionsArray = Session.get('sectionsArray');
        var $button = $(e.currentTarget);
        var currentOrder = this.order;
        var inc = ($button.hasClass('up')) ? -1 : 1;
        sectionsArray[currentOrder].order = currentOrder + inc;
        sectionsArray[currentOrder + inc].order = currentOrder;
        Session.set('sectionsArray',_(sectionsArray).sortBy('order'));
    }
});


/**
 * CONVERSATION SUBMIT FORM
 */

Template.conversationSubmitForm.created = function(){
    Session.set('memberList',[]);
};

Template.conversationSubmitForm.destroyed = function(){
    Session.set('memberList',null);
};


/**
 * INPUT MEMBER BOX
 */

Template.inputMemberBox.helpers({
    members: function(){
        return Session.get('memberList');
    },
    editMembersAllow: function(){
        return (Router.current().route.getName() == 'conversationEdit')?
        Conversations.findOne(Router.current().params._id).author == Meteor.userId() : true;
    }
});

Template.inputMemberBox.events ({
    'click button.add-member': function(e){
        if($(e.currentTarget).find('i').hasClass('fa-times')){
            $('.auto-complete-wrapper').find('input').val('');
            Session.set('activeSearch',false);
            $('.auto-complete-wrapper').fadeOut();
            $(e.currentTarget).find('i').removeClass('fa-times');
            $(e.currentTarget).find('i').addClass('fa-plus');
        }else{
            $('.auto-complete-wrapper').fadeIn();
            $(e.currentTarget).find('i').removeClass('fa-plus');
            $(e.currentTarget).find('i').addClass('fa-times');
        }
    },
    'click button.edit-members':function(e){
        if($(e.currentTarget).find('i').hasClass('fa-check')){
            $('.delete-member-button').removeClass('active');
            $(e.currentTarget).find('i').removeClass('fa-check');
            $(e.currentTarget).find('i').addClass('fa-pencil');
        }else{
            $('.delete-member-button').addClass('active');
            $(e.currentTarget).find('i').removeClass('fa-pencil');
            $(e.currentTarget).find('i').addClass('fa-check');
        }
    }
});

Template.inputMemberBox.rendered = function(){
    $('.auto-complete-wrapper').hide();
    Session.set('resultTemplate','memberResult');
    if(this.data.storageDynamic === 'true'){
        var members = Session.get('memberList');
        members.push(Meteor.users.findOne(Meteor.userId()));
        if(Session.get('userToSend')){
            members.push(Meteor.users.findOne(Session.get('userToSend')));
        }
        Session.set('memberList',members);
    }
};


/**
 * MEMBER RESULT
 */
Template.memberResult.helpers({
    inMembers: function(){
        var members = Session.get('memberList');
        var self = this;
        return _(members).any(function(member){return member._id == self._id;});
    }
});

Template.memberResult.events({
    'click .add-member-button': function(){
        var members = Session.get('memberList');
        members.push(this);
        Session.set('memberList',members);
    }
});

/**
 * MEMBER
 */
Template.member.helpers({
    isPossibleToDelete: function(){
        var isNotUserToSend = true;
        if(Session.get('userToSend')){
           isNotUserToSend = this._id != Session.get('userToSend');
        }
        return this._id !== Meteor.userId() && isNotUserToSend;
    },
    avatar: function(){
        return Meteor.users.findOne(this._id).avatar;
    },
    username: function(){
        return Meteor.users.findOne(this._id).username;
    }
});

Template.member.events({
    'click .delete-member-button': function(){
        var members = Session.get('memberList');
        var self = this;
        members = _(members).filter(function(member){
            return member._id != self._id;
        });
        Session.set('memberList',members);
    }
});


/**
 * CHOOSE LEADER BOX
 */
Template.chooseLeaderBox.helpers({
    members: function(){
        return Session.get('memberList');
    }
});
Template.chooseLeaderBox.rendered = function(){
    Session.set('leaderChoosen',Session.get('userObject').leader);
};
Template.chooseLeaderBox.destroyed = function(){
    Session.set('leaderChoosen',null);
};

/**
 * MEMBER TO CHOOSE
 */
Template.memberToChoose.helpers({
    avatar: function(){
        return Meteor.users.findOne(this._id).avatar;
    },
    username: function(){
        return Meteor.users.findOne(this._id).username;
    },
    active: function(){
        return (this._id == Session.get('leaderChoosen'))? 'active' : '';
    }
});

Template.memberToChoose.events({
    'click .member-to-choose': function(e){
        Session.set('leaderChoosen',this._id);
    }
});

Template.memberList.helpers({
    members: function(){
        return Session.get('memberList');
    }
})

/**
 * INPUT MESSAGE BOX
 */
Template.inputMessageBox.helpers({
    avatar: function(){
        return Meteor.users.findOne(Meteor.userId()).avatar;
    }
});

Template.inputMessageBox.events({
    'click #emoticons-target': function(){
        $('#link-panel').fadeOut();
        $('#emoticons-panel').fadeIn();
    },
    'click #emoticons-panel img.emoji':function(e){
        var emojiCode = $(e.target).attr('alt');
        $('#message-input').html($('#message-input').html() + Emoji.convert(emojiCode));
    },
    'click #link-target': function(){
        $('#emoticons-panel').fadeOut();
        $('#link-panel').fadeIn();
    },
    'click .close-panel': function(e){
        var $target = $(e.currentTarget);

        switch($target.attr('id')){
            case 'close-emoticons':
                $('#emoticons-panel').fadeOut();
                break;
            case 'close-link':
                $('#link-panel').fadeOut();
                break;
        }
    },
    'focus #message-input': function(){
        $('.popover-panel').fadeOut();
        $('.link-panel').fadeOut();
    },
    'submit #link-input': function(e){
        e.preventDefault();
        var link = $(e.target).find('[name=link]').val();
        $(e.target).find('[name=link]').val('');
        $('#message-input').focus();
        $('#message-input').html($('#message-input').html() + '<a href="http://' + link + '">' + ellipsis(link,20) + '</a>');
    },
    'click #message-input a': function(e){
        window.open($(e.target).attr('href'));
    }
});

Template.inputMessageBox.rendered = function(){
    $('.popover-panel').hide();
};


/**
 * TAGS INPUT
 */

Template.tagsInput.helpers({
    tagsFounded: function(){
        return Tags.find({name: new RegExp(Session.get('searchValue'))});
    },
    tagsChoosen: function(){
        return Session.get('tagsChoosen');
    },
    hasTags: function(){
        return (Session.get('tagsChoosen'))? Session.get('tagsChoosen').length > 0 : false;
    },
    founded: function(){
        return Session.get('founded');
    },
    searching: function(){
        return Session.get('searching');
    }
});

Template.tagsInput.events({
    'keyup input': function(e){
        if ($(e.target).val() != ""){
            Session.set('searching',e.keyCode !== 16);
            Session.set('searchValue',$(e.target).val());
        }else{
            Session.set('searchValue',null);
        }
    },
    'click #eraser-button': function(){
        $('input').val('');
        Session.set('searchValue',null);
    },
    'click #add-tag': function(){
        var nameTag = Session.get('searchValue');
        var tagsChoosen = Session.get('tagsChoosen');
        if (!_(tagsChoosen).any(function(tag){return tag.name == nameTag})) {
            tagsChoosen.push({name: nameTag});
            Session.set('tagsChoosen', tagsChoosen);
        }
        $('input').val('');
        Session.set('searchValue',null);
    }
});

Template.tagsInput.rendered = function(){
    Session.set('searching',false);
    Session.set('founded',false);
    Session.set('searchValue',null);
    var tagsChoosen = Session.get('tagsChoosen');
    Session.set('tagsChoosen',(tagsChoosen)? tagsChoosen : []);

    var resultsDecisor = function(){
        Session.set('founded', Tags.find().count() > 0);
        Session.set('searching',false);
    };
    var self = this;
    self.autorun(function(){
        if(Session.get('searchValue')) {
            Meteor.subscribe('tagsBySearch', Session.get('searchValue'), resultsDecisor());
        }
    })
};

Template.tagsInput.destroyed = function(){
    Session.set('searching',null);
    Session.set('founded',null);
    Session.set('searchValue',null);
    Session.set('tagsChosen',null);
};

/**
 * TAG RESULT
 */
Template.tagResult.helpers({
    choosen: function(){
        var self = this;
        return (_(Session.get('tagsChoosen')).any(function(tag){return tag.name == self.name;}))? 'choosen' : '';
    }
});

Template.tagResult.events({
    'click .tag': function(){
        var self = this;
        if (!_(Session.get('tagsChoosen')).any(function(tag){return tag.name == self.name})){
            var tagsChoosen = Session.get('tagsChoosen');
            tagsChoosen.push({name: this.name});
            Session.set('tagsChoosen',tagsChoosen);
        }
    }
});

/**
 * TAG CHOOSEN
 */
Template.tagChoosen.events({
    'click .tag-choosen .remove-tag': function(){
        var self = this;
        var tagsChoosen = _(Session.get('tagsChoosen')).filter(function(tag){
            return tag.name !== self.name;
        });
        Session.set('tagsChoosen',tagsChoosen);



    }
});