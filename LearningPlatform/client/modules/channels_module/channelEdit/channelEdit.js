Template.channelEdit.events({
    'click #avatar-section .save': function(e){

        var img = '/ChannelImgDefault.jpg';

        function setImg (img){
            var obj = Session.get('userObject');
            obj.img = img;
            Session.set('userObject',obj);
            $('#avatar-section .discard').click();
        };

        var cbs = $('#avatar-section').find('.checkbox-item');
        var selected = _(cbs).filter(function(item){
            return $(item).hasClass('selected');
        });

        if (selected && $(selected).find('input').length){
            var input = $(selected).find('input');

            switch($(input).attr('type')) {
                case 'text':
                    setImg($(input).val());
                    break;
                case 'file':
                    if ($(input)[0].files) {
                        var file = $(input)[0].files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            setImg(reader.result);
                        };
                    }
                    break;
            }
        }else{
            setImg(img);
        }

    },

    'click #banner-section .save': function(e){
        var banner = '/ChannelBannerBG.jpg';

        function setBanner(banner){
            var obj = Session.get('userObject');
            obj.banner = banner;
            Session.set('userObject',obj);
            $('#banner-section .discard').click();
        }

        var cbs = $('#banner-section').find('.checkbox-item');
        var selected = _(cbs).filter(function(item){
            return $(item).hasClass('selected');
        });

        if (selected && $(selected).find('input').length){
            var input = $(selected).find('input');
            switch($(input).attr('type')) {
                case 'text':
                    setBanner($(input).val());
                    break;
                case 'file':
                    if ($(input)[0].files) {
                        var file = $(input)[0].files[0];
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            setBanner(reader.result);
                        };
                    }
                    break;
            }
        }else{
            setBanner (banner);
        }
    },

    'click #description-section .save': function(e){
        var obj = Session.get('userObject');
        obj.description = $('#description-section').find('textarea').val();
        Session.set('userObject',obj);
        $('#description-section .discard').click();
    },
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
})
Template.channelEdit.created = function(){
    Session.set('formType','formProfileEdit');
    var channelObject = {
        img: this.data.img || '/channel-img-default.jpg',
        banner: this.data.banner || '/channel-banner-bg.jpg',
        description: this.data.description
    };
    Session.set('userObject',channelObject);
};

Template.channelEdit.destroyed = function(){
    Session.set('userObject',null);
};