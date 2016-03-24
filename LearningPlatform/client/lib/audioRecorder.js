AudioRecorder = function(){
    var r = /([^&=]+)=?([^&]*)/g;
    var params = {};
    var recorder;
    var audioStream;
    var currentTime = 0;
    var interval;
    var $timer;

    this.initialize = function(){

        function d(s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        }

        var match, search = window.location.search;
        while (match = r.exec(search.substring(1)))
            params[d(match[1])] = d(match[2]);

        window.params = params;

        navigator.getUserMedia  = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
    };
    this.startRecording = function(callback){

        var audioConstraints = {
            audio: true,
            video: false
        };
        if (!this.recorder){
            navigator.getUserMedia(audioConstraints,
                function(stream){
                    audioStream = stream;
                    recorder = window.RecordRTC(stream,{
                        type: 'audio',
                        bufferSize: typeof params.bufferSize == 'undefined' ? 16384 : params.bufferSize,
                        sampleRate: typeof params.sampleRate == 'undefined' ? 44100 : params.sampleRate,
                        leftChannel: params.leftChannel || false,
                        disableLogs: params.disableLogs || false
                    });
                    recorder.startRecording();
                    callback();
                },
                function(err){
                    console.log('getUserMedia ERROR: ' + err.reason);
                }
            );
        }else{
            audioStream.start();
            recorder.startRecording();
            callback();
        }
    };

    this.startProgress = function(timerElem){
        $timer = timerElem;
        this.loop();
    };

    this.loop = function(){
        var d = new Date(currentTime * 1000);
        var minuto = (d.getMinutes()<=9)?"0"+d.getMinutes():d.getMinutes();
        var segundo = (d.getSeconds()<=9)?"0"+d.getSeconds():d.getSeconds();
        if (currentTime == 3600){
            $('#stop-button').click();
        }else{
            $timer.text(minuto + ':' + segundo);
            currentTime ++;
            interval = window.setInterval(this.loop,1000); //se ejecutara cada seg.
        }

    };

    this.getCurrentTime = function(){
        return currentTime * 1000;
    };

    this.stopProgress = function(){
        currentTime = 0;
        $timer.text(currentTime);
        window.clearInterval(interval);
    };

    this.stopRecording = function(reactiveVar, callback){
        this.stopProgress();
        if(recorder){
            recorder.stopRecording(function(){
                reactiveVar.set(recorder.blob);
                audioStream.stop();
                (callback)? callback() : null;
            });
        }
    };
};