Template.header.helpers({

});

Template.header.events({
    'click #show-sidebar': function(){
        $('#sidebar-wrapper').removeClass('unactive');
        $('#close-sidebar').addClass('active');
    }
});