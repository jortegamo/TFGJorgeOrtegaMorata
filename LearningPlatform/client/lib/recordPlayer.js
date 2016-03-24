RecordPlayer = function(){

//VARIABLES
    var $audio,
        $progress,
        $seeker,
        $playedProgress,
        $timer,
        $touchScreenWrapper,
        $playerActionsWrapper,
        intervalAudio,
        duration,
        editorManager,
        ended;

//FUNCTIONS
    function getCurrentTime(){
        var d = new Date($audio.currentTime());
        return {
            min: (d.getMinutes() > 9)? '' + d.getMinutes(): '0' + d.getMinutes(),
            sec: (d.getSeconds() > 9)? '' + d.getSeconds(): '0' + d.getSeconds()
        };
    };

    function updatePlayer(){
        var current = getCurrentTime();
        $timer.text(current.min + ':' + current.sec);
        $seeker.width($progress.width());
        var progressVal = ($audio.currentTime() * 100) / duration;
        $progress.val(progressVal);
        $playedProgress.width(($progress.width() * progressVal)/100 + 1);
        if(Session.get('playing')) editorManager.update($audio.currentTime());
    }
    function changeStatePlayer(){
        ($touchScreenWrapper.hasClass('active'))? $touchScreenWrapper.removeClass('active') : $touchScreenWrapper.addClass('active');
        ($playerActionsWrapper.hasClass('active'))? $playerActionsWrapper.removeClass('active') : $playerActionsWrapper.addClass('active');
    }

//METHODS

    //INITIALIZATION

    this.initialize = function($elements,editorPlayer){
        $audio = $elements.stream;
        $progress = $elements.progress;
        $seeker = $elements.seeker;
        $playedProgress = $elements.playedProgress;
        $timer = $elements.timer;
        $touchScreenWrapper = $elements.touchScreenWrapper;
        $playerActionsWrapper = $elements.playerActionsWrapper;
        Session.set('playing',false);
        Session.set('ended',false);
        Session.set('audioVolume','normal');
        $audio.volume = 0.4;
        duration = $elements.duration;
        editorManager = editorPlayer;
        var RCP = this;
        $audio.on('finish',function(){
            RCP.ended();
        });
        $audio.on('created',function(){
            $audio.seek(0);
            console.log('created audio');
        });
        ended = false;
    };

    //MAIN METHODS
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
        Session.set('ended',false);
        $audio.play();
        if (!intervalAudio){
            intervalAudio = window.setInterval(updatePlayer,20);
        }
        ended = false;
    };

    this.pause = function(){
        changeStatePlayer();
        Session.set('playing',false);
        $audio.pause();
    };

    this.seek = function(){
        $audio.seek(($seeker.val() * duration)/100);
        updatePlayer();
        editorManager.seek($audio.currentTime());
    };

    this.ended = function(){
        $touchScreenWrapper.removeClass('active');
        $playerActionsWrapper.addClass('active');
        window.clearInterval(intervalAudio);
        editorManager.seek(0);
        intervalAudio = null;
        Session.set('playing',false);
        Session.set('ended',true);
        $timer.text('00:00');
        $playedProgress.width(0);
        $progress.val(0);
        ended = true;
    };

    this.getState = function(){
        var state = {
            docs: editorManager.getDocs(ended),
            docActual: editorManager.getDocActual(),
            currentTime: Math.round($audio.currentTime())
        };
        return state;
    };

    this.destroy = function(){
        $audio.pause();
        $audio = null;
        window.clearInterval(intervalAudio);
    };

};