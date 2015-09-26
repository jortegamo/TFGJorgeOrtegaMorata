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

Template.profileEdit.rendered = function(){

};