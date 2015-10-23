var conversationMembers;

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
    }
});


Template.conversationSubmitForm.helpers({
    members: function(){
        return conversationMembers.get();
    }
});

Template.conversationSubmitForm.events({
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
Template.conversationSubmitForm.created = function(){
    conversationMembers = new ReactiveVar([]);
    var members = conversationMembers.get();
    members.push(Meteor.users.findOne(Meteor.userId()));
    conversationMembers.set(members);
};
Template.conversationSubmitForm.rendered = function(){
    $('.auto-complete-wrapper').hide();
    Session.set('resultTemplate','memberResult');
};

Template.memberResult.helpers({
    inMembers: function(){
        var members = conversationMembers.get();
        var self = this;
        return _(members).any(function(member){return member._id == self._id;});
    }
});

Template.member.helpers({
    isNotAuthor: function(){return this._id !== Meteor.userId();}
});

Template.member.events({
    'click .delete-member-button': function(){
        var members = conversationMembers.get();
        members.splice(members.indexOf(this),1);
        conversationMembers.set(members);
    }
})
Template.member.rendered = function(){
    $(this.firstNode).tooltip({placement: 'bottom',title: this.data.username});
};

Template.memberResult.events({
    'click .add-member-button': function(){
        console.log('click button');
        var members = conversationMembers.get();
        members.push(this);
        conversationMembers.set(members);
    }
});

Template.inputMessageBox.helpers({
    avatar: function(){
        return Meteor.users.findOne(Meteor.userId()).avatar;
    }
});

Template.inputMessageBox.events({
    'click #emoticons-target': function(){
        $('#emoticons-panel').fadeIn();
    },
    'click #link-target': function(){
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
    'focus textarea': function(){
        $('.popover-panel').fadeOut();
    }
});

Template.inputMessageBox.rendered = function(){
    $('.popover-panel').hide();
}