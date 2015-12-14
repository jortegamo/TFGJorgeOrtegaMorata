RecordPlayer = function(){

//VARIABLES
    var $audio,
        $progress,
        $seeker,
        $playedProgress,
        $timer,
        $touchScreenWrapper,
        $playerActionsWrapper,
        editor,
        recordObject,
        intervalAudio,
        intervalEditor,
        initialDocs,
        dynamicDocs;

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
    function updateEditor(){

    }
    function changeStatePlayer(){
        ($touchScreenWrapper.hasClass('active'))? $touchScreenWrapper.removeClass('active') : $touchScreenWrapper.addClass('active');
        ($playerActionsWrapper.hasClass('active'))? $playerActionsWrapper.removeClass('active') : $playerActionsWrapper.addClass('active');
    }

//METHODS

    //INITIALIZATION
    function initializeEditor(id){
        editor = ace.edit(id);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setShowPrintMargin(false);
        $('.ace_gutter').css('z-index','0');
    }


    this.initialize = function($elements,record_id,editorId,docs){
        $audio = $elements.audioElem;
        $audio.onloadeddata = function() {
            alert("Browser has loaded the current frame");
        };
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
        initialDocs = docs;
        dynamicDocs = [];
        initializeEditor(editorId);
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
        $audio.play();
        if (!intervalAudio){
            intervalAudio = window.setInterval(updatePlayer,100);
        }
        intervalEditor = window.setInterval(updateEditor,100);
    };

    this.pause = function(){
        changeStatePlayer();
        Session.set('playing',false);
        $audio.pause();
        window.clearInterval(intervalEditor);
    };

    this.seek = function(){
        $audio.currentTime = ($seeker.val() * $audio.duration)/100;
        updatePlayer();
        updateEditor();
    };

    this.ended = function(){
        $touchScreenWrapper.removeClass('active');
        $playerActionsWrapper.addClass('active');
        window.clearInterval(intervalAudio);
        intervalAudio = null;
        window.clearInterval(intervalEditor);
        intervalEditor = null;
        Session.set('playing',false);
        $timer.text('00:00');
        $playedProgress.width(0);
        $progress.val(0);
    };

    this.destroy = function(){
        window.clearInterval(intervalAudio);
        window.clearInterval(intervalEditor);
    };

};