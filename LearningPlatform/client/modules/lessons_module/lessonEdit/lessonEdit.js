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
    var lessonObject = {
        img: this.data.img || '/lessonDefault.png',
        description: this.data.description,
        imgDefault: '/lessonDefault.png',
        tagsAllow: this.data.tagsAllow || true,
        tags: (this.data.tags) ? this.data.tags : []
    };
    Session.set('userObject',lessonObject);
};

Template.lessonEdit.destroyed = function(){
    Session.set('userObject',null);
    Session.set('tagsChoosen',null);
};