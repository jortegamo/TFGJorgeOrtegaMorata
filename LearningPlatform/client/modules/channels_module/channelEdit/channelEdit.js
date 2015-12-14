Template.channelEdit.events({
    'submit form': function(e){
        e.preventDefault();
        var channel_id = this._id;
        Meteor.call('channelUpdate',this._id,Session.get('userObject'),function(err,res){
            if(res){
                Router.go('channel',{_id: channel_id});
            }
            if (err){
                console.log('error: ' + err);
            }
        });
    }
});

Template.channelEdit.created = function(){
    Session.set('formType','formProfileEdit');
    var channelObject = {
        img: this.data.img || '/channelImgDefault.jpg',
        banner: this.data.banner || '/channelBannerBg.jpg',
        description: this.data.description,
        imgDefault: '/channelImgDefault.jpg',
        bannerDefault: '/channelBannerBg.jpg',
        tagsAllow: this.data.tagsAllow || true,
        tags: (this.data.tags) ? this.data.tags : []
    };
    Session.set('userObject',channelObject);
};

Template.channelEdit.destroyed = function(){
    Session.set('userObject',null);
    Session.set('tagsChoosen',null);
};