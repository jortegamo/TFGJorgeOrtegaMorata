Template.header.helpers({
});

Template.header.events({
    'click .show-sidebar': function(e){
        $('#sidebar-wrapper').removeClass('unactive');
        $('#close-sidebar').addClass('active');
        switch($(e.currentTarget)[0].id){
            case 'show-menu':
                Session.set('currentSidebarTab','menuTab');
                break;
            case 'show-notifications':
                Session.set('currentSidebarTab','notificationsTab');
                break;
            case 'show-chats':
                Session.set('currentSidebarTab','chatsTab');
                break;
        }
    }
});