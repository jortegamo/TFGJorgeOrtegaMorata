Template.lessons.helpers({
    lessons: function(){
        switch(Session.get('filter-active')) {
            case 'recent-filter':
                return Lessons.find({}, {sort: {createdAt: -1}});
            case 'popular-filter':
                return Lessons.find({}, {sort: {votes_count: -1}});
            case 'search-filter':
                return [];
        }
    },
    listMode: function(){
        return Session.get('horizontalMode');
    },
    searching: function(){
        return Session.get('filter-active') == 'search-filter';
    }
});

Template.lessons.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(){
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
        Session.set('filter-active',$(elem)[0].id);
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
    Session.set('filter-active', 'recent-filter');
};

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

Template.lessonItemHorizontal.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author});
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
    },
    ellipsis: function(s,max){
        return ellipsis(s,max);
    }
});

Template.lessonItemVertical.events({
    'click .image-hover i, click .card-title, click .image-hover, click img': function(){
        Router.go('lesson',{_id: this._id}); //voy a la pagina principal del record.
    },
    'click .card-author': function(){
        Router.go('profile',{_id: this.author});
    }
});

Template.lessonItemVertical.rendered = function(){
    $('.sections-count').tooltip({placement: 'bottom', title: 'sections'});
    $('.comments-count').tooltip({placement: 'top', title: 'comments'});
    $('.votes-count').tooltip({placement: 'bottom', title: 'votes'});
    $('.subscriptions-count').tooltip({placement: 'top', title: 'subscriptions'});
};


//SMART SEARCH

Template.smartSearch.helpers({
    searching: function(){
        return Session.get('searching');
    },
    choosingTagFilter: function(){
        return Session.get('choosingTagFilter');
    }
});
Template.smartSearch.events({
    'focus #input-search': function(){
        Session.set('searching',true);
    },
    'blur #input-search': function(){
        Session.set('searching',false);
    },
    'keydown #input-search': function(e){
        switch(e.keyCode){
            case 187:
                if(!Session.get('choosingTagFilter')){
                    Session.set('choosingTagFilter',true);
                    Session.set('searching',false);
                }
                break;
            case 8:
                if(Session.get('choosingTagFilter')){
                    Session.set('choosingTagFilter',false);
                    Session.set('searching',true);
                }
                break;
            case 13:
                Session.set('choosingTagFilter',false);
                Session.set('searching',false);
                //procesar entrada
                break;
        }
    },

    'click #eraser-button': function(){
        $('#input-search').html('');
        Session.set('searching',false);
        Session.set('choosingTagFilter',false);
    },
    'click .search-filter':function(e){
        Session.set('choosingTagFilter',false);
        $('#input-search').focus();
    }
});

Template.smartSearch.rendered = function(){
    Session.set('searchParams',{});
    Session.set('searching',false);
    Session.set('choosingTagFilter',false);
};