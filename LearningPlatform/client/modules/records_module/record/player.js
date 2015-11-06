Template.player.helpers({
    playing: function(){
        return Session.get('playing');
    },
    hVol:function(){
        return Session.get('audioVolume') === 'hight';
    },
    nVol: function(){
        return Session.get('audioVolume') === 'normal';
    }
});

Template.player.events({
    'click #play': function(){
        this.recordPlayer.play();
    },
    'click #pause': function(){
        this.recordPlayer.pause();
    },
    'ended audio': function(){
        this.recordPlayer.ended();
    },
    'click #seeker': function(e){
        this.recordPlayer.seek();
    },
    'click #volume': function(e){
        this.recordPlayer.setVolume($(e.target).val());
    },
    'click .cover': function(e) {
        this.recordPlayer.updateCover($(e.target));
    }
});


Template.player.rendered = function(){
    var $elements = {
        audioElem: document.getElementsByTagName('audio')[0],
        playButton: $('#play'),
        pauseButton: $('#pause'),
        progress: $('#progress'),
        seeker: $('#seeker'),
        playedProgress: $('#played-bar'),
        timer: $('#timer'),
        touchScreenWrapper: $('.touch'),
        playerActionsWrapper: $('.player-actions')
    };
    this.data.recordPlayer.initialize($elements,Session.get('currentRecordId'));
};

Template.player.destroyed = function(){
    this.data.recordPlayer.destroy();
};