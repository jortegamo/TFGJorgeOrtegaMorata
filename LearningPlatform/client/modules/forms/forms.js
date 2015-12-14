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


//PROFILE EDIT//

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
    }
});

Template.formProfileEdit.rendered = function(){
    Session.set('tagsChoosen',Session.get('userObject').tags);
};


/*CONVERSATION SUBMIT FORM*/

Template.conversationSubmitForm.created = function(){
    Session.set('memberList',[]);
};

Template.conversationSubmitForm.destroyed = function(){
    Session.set('memberList',null);
};


/*INPUT MEMBER BOX*/
Template.inputMemberBox.helpers({
    members: function(){
        return Session.get('memberList');
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
        console.log('eeeyyy');
        var members = Session.get('memberList');
        members.push(Meteor.users.findOne(Meteor.userId()));
        Session.set('memberList',members);
    }
};


/*MEMBER RESULT*/
Template.memberResult.helpers({
    inMembers: function(){
        var members = Session.get('memberList');
        var self = this;
        return _(members).any(function(member){return member._id == self._id;});
    }
});

/*MEMBER*/
Template.member.helpers({
    isNotAuthor: function(){
        return this._id !== Meteor.userId();
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

Template.memberResult.events({
    'click .add-member-button': function(){
        console.log('click button');
        var members = Session.get('memberList');
        members.push(this);
        Session.set('memberList',members);
    }
});


/*INPUT MESSAGE BOX*/
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


//TAGS INPUT

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

Template.tagChoosen.events({
    'click .tag-choosen .remove-tag': function(){
        var self = this;
        var tagsChoosen = _(Session.get('tagsChoosen')).filter(function(tag){
            return tag.name !== self.name;
        });
        Session.set('tagsChoosen',tagsChoosen);



    }
})