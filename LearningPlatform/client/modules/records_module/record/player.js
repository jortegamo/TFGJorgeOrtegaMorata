Template.player.helpers({
    playing: function(){
        return Session.get('playing');
    },
    isReply: function(){
        return this.record.isReply;
    },
    hVol:function(){
        return Session.get('audioVolume') === 'hight';
    },
    nVol: function(){
        return Session.get('audioVolume') === 'normal';
    },
    autoPlay: function(){
        return (!this.isReply) ? Sections.findOne({_id: this.section_id}).auto_play : false;
    },
    autoRepeat: function(){
        return (!this.isReply)? Sections.findOne({_id: this.section_id}).auto_repeat: false;
    },
    isEnded: function(){
        return Session.get('ended');
    },
    notPlayListEnded:function(){
        if (!this.isReply) {
            var section = Sections.findOne({_id: this.section_id});
            var records_section = Records.find({section_id: section._id});
            return section.auto_repeat && this.order <= records_section.count() -1 ||
                   !section.auto_repeat && this.order < records_section.count() -1;
        }
    },
    recordsPlayList: function(){
        return Records.find({section_id: this.section_id, isReply: false},{sort: {order: 1}});
    },
    records_count_PL: function(){
        return Records.find({section_id: this.section_id, isReply: false}).count();
    },
    section_title: function(){
        return Sections.findOne({_id: this.section_id}).title;
    },
    countDownData: function(){
        return {
            time: 15000,
            record: this
        }
    }
});

Template.player.events({
    'click #play': function(){
        this.recordPlayer.play();
    },
    'click #pause': function(){
        this.recordPlayer.pause();
    },
    'click #seeker': function(){
        this.recordPlayer.seek();
    },
    'click #volume': function(e){
        this.recordPlayer.setVolume($(e.target).val());
    },
    'click .cover': function(e) {
        this.recordPlayer.updateCover($(e.target));
    },
    'click #view-parent': function(){
        Router.go('channel',{_id: this.record.parent_id});
    },
    'click #browse-channel': function(){
        console.log(this);
        Router.go('channel', {_id: this.channel_id});
    },
    'click #browse-lesson': function(){
        Router.go('lesson', {_id: this.lesson_id});
    },
    'click #create-reply': function(){
        Session.set('dataRecordingObject',this.recordPlayer.getState());
        console.log(Session.get('dataRecordingObject'));
        var query = '';
        query += (this.record.channel_id)? 'channel=' + this.record.channel_id + '&' : '';
        query += (this.record.lesson_id)? 'lesson=' + this.record.lesson_id + '&' : '';
        query += (this.record.section_id)? 'section=' + this.record.section_id + '&' : '';
        query += 'parent=' + this.record._id;
        Router.go('recordSubmit',{},{query: query});
    },
    'click .nav-button-pl': function(e){
        var RecordsPLArray = Records.find({section_id: this.section_id,isReply: false},{sort: {order: 1}}).fetch();
        var currentIdx = parseInt(_(RecordsPLArray).find(function(elem){return elem._id == Session.get('currentRecordId');}).order);
        var index = 0;
        var section = Sections.findOne();
        switch($(e.currentTarget)[0].id){
            case 'bw':
                console.log('bw');
                index = (section.auto_repeat && this.order == 0)? RecordsPLArray.length -1 : currentIdx -1;
                break;
            case 'fw':
                console.log('fw');
                index = (section.auto_repeat && this.order == RecordsPLArray.length -1) ? 0 : currentIdx + 1;
                break;
            case 'fast-fw':
                console.log('ffw');
                index = RecordsPLArray.length -1;
                break;
        }
        console.log(index);
        if(index <= RecordsPLArray.length -1 || index >= 0){
            var record_id = _(RecordsPLArray).find(function(elem){return elem.order == index;})._id;
            Router.go('record',{_id: record_id});
        }
    },
    'click #auto-play-set input': function(e){
        console.log($(e.currentTarget).is(':checked'));
        Meteor.call('updateSectionPlayOption',this.section_id,'auto-play',$(e.currentTarget).is(':checked'));
    },
    'click #auto-repeat-set input': function(e){
        Meteor.call('updateSectionPlayOption',this.section_id,'auto-repeat',$(e.currentTarget).is(':checked'));
    }
});

Template.player.rendered = function(){
    var recordPlayer = this.data.recordPlayer;
    var editorPlayerManager = this.data.editorPlayerManager;
    var track_id = this.data.record.track.id;
    if (this.data.record.lesson_id && !this.data.record.isReply){
        Session.set('currentRecordId',this.data.record._id);
    }

    //params to recordPlayer
    var $elements = {
        playButton: $('#play'),
        pauseButton: $('#pause'),
        progress: $('#progress'),
        seeker: $('#seeker'),
        playedProgress: $('#played-bar'),
        timer: $('#timer'),
        touchScreenWrapper: $('.touch'),
        playerActionsWrapper: $('.player-actions')
    };

    //params to editorPlayer
    var editorParams = {
        id: 'editor',
        RC: this.data.record.RC,
        startDocs: Documents.find({start: true},{params: {doc: 1}}).fetch(),
        finishDocs: Documents.find({start: false},{params: {doc: 1}}).fetch(),
    };


    //SoundCloud initialization
    SC.initialize({
        client_id: '9f2574ebd5266f995dca197f71cba11b',
        redirect_uri: 'http://localhost:3000/redirect.html',
        oauth_token: '1-172665-142059135-cd9567b1cb50c'
    });

    //SoundCloud connect process.
    SC.connect().then(function(){
        SC.stream('/tracks/' + track_id).then(function(s){
            console.log(s);
            $elements.stream = s;
            $elements.duration = s.options.duration;
            editorPlayerManager.initialize(editorParams);
            recordPlayer.initialize($elements,editorPlayerManager);
            recordPlayer.play();
        }).catch(function(error){
            console.log(error);
        });
    });

};

Template.player.destroyed = function(){
    this.data.recordPlayer.destroy();
    Session.set('currentRecordId',null);
};

Template.recordItemPlayList.helpers({
    active: function(){
        return (Session.get('currentRecordId') == this._id)? 'active': '';
    }
});

Template.recordItemPlayList.events({
    'click .record-item-play-list': function(){
        Router.go('record',{_id: this._id});
    }
});

Template.countDown.helpers({
    timeOut: function(){
        return Session.get('timeOut');
    }
});

Template.countDown.events({
    'click #cancel-auto-play': function(){
        Session.set('ended',false);
        this.countDownManager.abort();
    },
    'click #next': function(){
        var RecordsPLArray = Records.find({section_id: this.objectCountDown.record.section_id,isReply: false},{sort: {order: 1}}).fetch();
        console.log(RecordsPLArray);
        var section = Sections.findOne();
        var currentIdx = parseInt(this.objectCountDown.record.order)
        var index = (section.auto_repeat &&  currentIdx == RecordsPLArray.length -1) ? 0 : currentIdx + 1;

        if(index <= RecordsPLArray.length -1 || index >= 0){
            var record_id = _(RecordsPLArray).find(function(elem){return elem.order == index;})._id;
            Router.go('record',{_id: record_id});
        }
    }
});

Template.countDown.rendered = function(){
    var CountDownObject = function(){
        var interval,
            record,
            currentTime;
        this.initialize = function(object){
            interval = null;
            currentTime = object.time;
            record = object.record;
            console.log(currentTime);
        };
        this.start = function(){
            Session.set('timeOut',currentTime/1000);
            interval = window.setInterval(this.loop,1000);
        };
        this.loop = function(){
            console.log(currentTime);
            if(currentTime/1000 == 0){
                window.clearInterval(interval);
                console.log('ya ha terminado me voy al record');
                $('#next').click();
            }else{
                currentTime = currentTime - 1000;
                Session.set('timeOut',currentTime/1000);
            }
        };
        this.abort = function(){
            window.clearInterval(interval);
            Session.set('ended',false);
        };
    };
    Session.set('timeOut',null);
    this.data.countDownManager = new CountDownObject();
    this.data.countDownManager.initialize(this.data.objectCountDown);
    this.data.countDownManager.start();
};

Template.countDown.destroyed = function(){
    Session.set('timeOut',null);
    this.data.countDownManager.abort();
};