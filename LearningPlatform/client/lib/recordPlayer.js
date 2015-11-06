RecordPlayer = function(){
    //VARIABLES
    var $audio,
        $progress,
        $seeker,
        $playedProgress,
        $timer,
        $touchScreenWrapper,
        $playerActionsWrapper,
        recordObject,
        interval;

    //FUNCTIONS
    function updatePlayer(){
        var d = new Date($audio.currentTime * 1000);
        var min = (d.getMinutes() > 9)? '' + d.getMinutes(): '0' + d.getMinutes();
        var sec = (d.getSeconds() > 9)? '' + d.getSeconds(): '0' + d.getSeconds();
        $timer.text(min + ':' + sec);
        $seeker.width($progress.width());
        var progressVal = 100 * $audio.currentTime / $audio.duration;
        $progress.val(progressVal);
        $playedProgress.width(($progress.width() * progressVal)/100 + 1);
    }

    function changeStatePlayer(){
        ($touchScreenWrapper.hasClass('active'))? $touchScreenWrapper.removeClass('active') : $touchScreenWrapper.addClass('active');
        ($playerActionsWrapper.hasClass('active'))? $playerActionsWrapper.removeClass('active') : $playerActionsWrapper.addClass('active');
    }

    //METHODS
    this.initialize = function($elements,record_id){
        $audio = $elements.audioElem;
        $progress = $elements.progress;
        $seeker = $elements.seeker;
        $playedProgress = $elements.playedProgress;
        $timer = $elements.timer;
        $touchScreenWrapper = $elements.touchScreenWrapper;
        $playerActionsWrapper = $elements.playerActionsWrapper;
        recordObject = Records.findOne(record_id);
        Session.set('playing',false);
        Session.set('audioVolume','normal');
        $audio.volume = 0.4;
    };

    this.setVolume = function(level){
        var newVol= level/10;
        if(newVol > 0.5){
            Session.set('audioVolume','hight');
        }else if(newVol == 0){
            Session.set('audioVolume','mute');
        }else{
            Session.set('audioVolume','normal');
        }
        $audio.volume = newVol;
    };

    this.updateCover = function($cover){
        ($touchScreenWrapper.hasClass('active')) ? this.pause() : this.play();

        $cover.find('button').addClass('active');
        window.setTimeout(function(){
            $cover.find('button').removeClass('active');
        },500);
    };

    this.play = function(){
        changeStatePlayer();
        Session.set('playing',true);
        $audio.play();
        interval = window.setInterval(updatePlayer,100);
    };

    this.pause = function(){
        changeStatePlayer();
        Session.set('playing',false);
        $audio.pause();
    };

    this.seek = function(){
        $audio.currentTime = ($seeker.val() * $audio.duration)/100;
        updatePlayer();
    };

    this.ended = function(){
        $touchScreenWrapper.removeClass('active');
        $playerActionsWrapper.addClass('active');
        Session.set('playing',false);
        $timer.text('00:00');
        $progress.val(0);
        $playedProgress.width(0);
        window.clearInterval(interval);
    };

    this.destroy = function(){
        window.clearInterval(interval);
    };

};