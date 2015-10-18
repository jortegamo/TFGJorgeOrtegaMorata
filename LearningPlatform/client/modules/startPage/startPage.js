Template.startPage.helpers({
    tabNamesArray: function(){
        return [{template: 'homeTabContent',  name: 'home', icon: 'fa-home', initialActive: true},
            {template: 'exploreTabContent', name: 'explore', icon: 'fa-compass'}];
    },
    sectionActive: function(){
        return Session.get('currentSection');
    },
    username: function(){
        return Meteor.users.findOne(Meteor.userId()).username;
    }
});

Template.startPage.events({
    'click button': function(e){
        $button = $(e.currentTarget);
        $i = $button.find('i');
        if($i.hasClass('fa-angle-down')){
            $i.removeClass('fa-angle-down');
            $i.addClass('fa-angle-up');
        }else{
            $i.removeClass('fa-angle-up');
            $i.addClass('fa-angle-down');
        }
    }
})