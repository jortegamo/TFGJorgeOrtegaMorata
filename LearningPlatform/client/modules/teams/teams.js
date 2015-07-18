Template.teams.helpers({
    pageTitle: function(){
        var title = 'Teams';
        return (title.length > 27) ? title.slice(0,27) + '...' : title;
    }
});

Template.teams.events({
    'click .display-option': function(e){
        var elem = e.currentTarget;
        $('.display-option').removeClass('active');
        $(elem).addClass('active');
    },
    'click .filter': function(e){
        var elem = e.currentTarget;
        $('.filter').removeClass('active');
        $(elem).addClass('active');
    }
})