Template.startPage.helpers({
    tabNamesArray: function(){
        return [{template: 'homeTabContent',  name: 'home', icon: 'fa-home', initialActive: true},
            {template: 'searchTabContent', name: 'search', icon: 'fa-search'}];
    },
    sectionActive: function(){
        return Session.get('currentSection');
    },
    username: function(){
        return Meteor.users.findOne(Meteor.userId()).username;
    }
});

Template.startPage.events({
    'click .content-home-section button': function(e){
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
});

Template.startPage.rendered = function(){
}

Template.exploreSection.helpers({
    recommendedSections: function(){
        var sections =  [{icon: 'fa-desktop',title: 'Channels',listObject: {feed: Channels.find({}, {sort: {votes_count: -1}}), type: 'channel'}},
            {icon: 'fa-graduation-cap',title: 'Lessons',listObject: {feed: Lessons.find({}, {sort: {votes_count: -1}}),type: 'lesson'}},
            {icon: 'fa-film',title: 'Records',listObject: {feed: Records.find({}, {sort: {votes_count: -1}}),type: 'record'}}];
        return sections;
    },
    mostPopularSections: function(){
        var sections =  [{icon: 'fa-desktop',title: 'Channels',listObject: {feed: Channels.find({}, {sort: {votes_count: -1}}), type: 'channel'}},
            {icon: 'fa-graduation-cap',title: 'Lessons',listObject: {feed: Lessons.find({}, {sort: {votes_count: -1}}),type: 'lesson'}},
            {icon: 'fa-film',title: 'Records',listObject: {feed: Records.find({}, {sort: {votes_count: -1}}),type: 'record'}}];
        return sections;
    }
});
Template.exploreSection.events({
    'click section p button': function(){
        Router.go(this.title.toLowerCase());
    }
})
Template.listItemsDynamicFeed.helpers({
    feed: function(){
        return this.listObject.feed;
    },
    isType: function(type){
        return this.listObject.type === type;
    }
});

Template.listItemsDynamicFeed.rendered = function(){
    $('.owl-carousel').owlCarousel({
        margin: 10,
        responsive:{
            0:{items:1},
            600:{items:2},
            800:{items:3},
            1000:{items:3},
            1200:{items:4}
        }
    });
};

Template.listItemsDynamicFeed.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(e,template){
        Router.go(template.data.listObject.type,{_id: this._id});
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author});
    }
});
