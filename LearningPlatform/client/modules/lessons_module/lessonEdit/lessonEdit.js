Template.lessonEdit.events({
    'submit form': function(e){
        e.preventDefault();
        var channel_id = this._id;
        Meteor.call('lessonUpdate',this._id,Session.get('userObject'),function(err,res){
            if(res){
                Router.go('lesson',{_id: channel_id});
            }
            if (err){
                console.log('error: ' + err);
            }
        });
    }
});

Template.lessonEdit.created = function(){
    Session.set('formType','formProfileEdit');
    var arraySections = [];

    _(Sections.find({lesson_id: this.data._id},{sort: {order: 1}}).fetch()).each(function(section){
        arraySections.push({_id: section._id, title: section.title, order: section.order});
    });

    var lessonObject = {
        img: this.data.img || '/lessonDefault.png',
        description: this.data.description,
        imgDefault: '/lessonDefault.png',
        tagsAllow: this.data.tagsAllow || true,
        tags: (this.data.tags) ? this.data.tags : [],
        sectionConfigAllow: true,
        sections: arraySections
    };
    Session.set('userObject',lessonObject);
};

Template.lessonEdit.destroyed = function(){
    Session.set('userObject',null);
    Session.set('tagsChoosen',null);
    Session.set('sections',null);
};