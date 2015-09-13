Template.lessons.helpers({
    pageTitle: function(){
        var title = 'Lessons';
        return (title.length > 27) ? title.slice(0,27) + '...' : title;
    },
    lessons: function(){
        return Lessons.find({},{sort: {createdAt: -1}});
    },
    listMode: function(){
        return Session.get('horizontalMode');
    }
});

Template.lessons.events({
    'click .image-hover i, click .card-title': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
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
    },
    'click .filter': function(e){
        var elem = e.currentTarget;
        $('.filter').removeClass('active');
        $(elem).addClass('active');
    },
    'click .button-circle': function(){
        Router.go('lessonSubmit');
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author});
    }
});

Template.lessons.rendered = function(){
    Session.set('horizontalMode',true);
    $('.button-circle').tooltip({placement: 'bottom', title: 'create a new Lesson'});
};

Template.lessons.created = function(){
    Session.set('search', null);
}

Template.lessonItemHorizontal.helpers({
    shortDescription: function(description,max){
        return ellipsis(description,max);
    },
    dateFrom: function(d) {
        return smartDate(d);
    },
    authorName: function(){
        return Meteor.users.findOne(this.author).username;
    }
});

Template.lessonItemHorizontal.rendered = function(){
    $('.sections-count').tooltip({placement: 'bottom', title: 'sections'});
    $('.comments-count').tooltip({placement: 'top', title: 'comments'});
    $('.votes-count').tooltip({placement: 'bottom', title: 'votes'});
    $('.subscriptions-count').tooltip({placement: 'top', title: 'subscriptions'});
};

Template.lessonItemVertical.helpers({
    dateFrom: function(d){
        return smartDate(d);
    },
    authorName: function(){
        return Meteor.users.findOne(this.author).username;
    }
});

Template.lessonItemVertical.rendered = function(){
    $('.sections-count').tooltip({placement: 'bottom', title: 'sections'});
    $('.comments-count').tooltip({placement: 'top', title: 'comments'});
    $('.votes-count').tooltip({placement: 'bottom', title: 'votes'});
    $('.subscriptions-count').tooltip({placement: 'top', title: 'subscriptions'});
}