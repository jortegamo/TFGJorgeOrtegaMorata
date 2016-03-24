var editor = "";
var date;
var recorder;
var currentAudio;
var docsManagerRecorder;

/**
 * DocsManagerRecorder: Organize all functions with docs.
 * @constructor
 */
var DocsManagerRecorder = function(){
    var startDocsValue = [];
    var docs, docsRC;
    var functions;

    //constructor para documentos.
    var Doc = function(title,mode,theme,value){
        this.title = title;
        this.mode = (mode) ?  "ace/mode/" + mode : "ace/mode/javascript";
        this.theme = (theme)? "ace/theme/" + theme : "ace/theme/twilight";
        this.value = value || "";
    };
    var copyDocs = function(array1,array2){
        _(array1).each(function (doc) {
            array2.push(new Doc(doc.title, doc.mode.split('/')[2], doc.theme.split('/')[2], doc.value));
        });
        return array2;
    };

    this.initialize = function(startDocsVal){
        //hago una copia para despues almacenar los iniciales.
        if(startDocsVal.length) startDocsValue = copyDocs(startDocsVal,[]);
        docs = new ReactiveVar(startDocsVal);
        docsRC = new ReactiveVar([]);
        functions = [];
    };

    this.createDoc = function(title,mode,theme,value){
        var nDoc = new Doc(title,mode,theme,value);
        var ObjectDocs = (Session.get('recording'))? docsRC : docs;
        var array = ObjectDocs.get();
        array.push(nDoc);
        ObjectDocs.set(array);
    };
    this.copyDocsFromCollection = function(){
        var arrayDocsCollection = Documents.find({}).fetch();
        var array = [];
        _(arrayDocsCollection).each(function(elem){
           array.push(
             new Doc(elem.doc.title,
                elem.doc.mode.split('/')[2],
                elem.doc.theme.split('/')[2],
                elem.doc.value)
           );
        });
        return array;
    };
    this.copyDocsToRecording = function(){
        var arrayDocs = copyDocs(docs.get(),docsRC.get());
        docsRC.set(arrayDocs);
    };

    this.getDocs = function(){
        return (Session.get('recording'))? docsRC : docs;
    };

    this.getDocsCount = function(){
        return docsRC.get().length;
    };

    this.getFunctions = function(){
        return functions;
    };

    this.saveDocs = function(record_id){
        Meteor.call('insertDocs',docs.get(),record_id,true,function(err){
            if(err) console.log('insertDocs ERROR: ' + err.reason);
        });
        Meteor.call('insertDocs',docsRC.get(),record_id,false,function(err){
            if(err) console.log('insertDocsRC ERROR: ' + err.reason);
        });
    };

    this.updateDoc = function(titlePrev,newTitle,mode,theme){
        var objDocs = (Session.get('recording'))? docsRC: docs;
        var docsArray = objDocs.get();
        _(docsArray).each(function(doc){
            if(doc.title == titlePrev){
                doc.title = newTitle;
                doc.mode = "ace/mode/" + mode;
                doc.theme = "ace/theme/" + theme;
            }
        });
        objDocs.set(docsArray);
    };

    this.saveValue = function(title,value){
        var objDocs = (Session.get('recording'))? docsRC : docs;
        var arrayDocs = objDocs.get();
        _(arrayDocs).each(function (doc) {
            if(doc.title == title) doc.value = value;
        });
        objDocs.set(arrayDocs);
    };

    this.insertFunctions = function(arrayFunctions){
        _(arrayFunctions).each(function(func){functions.push(func);});
    };

    this.reset = function(){
        docs.set(startDocsValue);
        docsRC.set([]);
        functions = [];
    }
};



/**
 * UPLOAD PANEL
 */
Template.uploadPanel.helpers({
    uploaded: function(){
        return Session.get('uploaded');
    }
});

Template.uploadPanel.events({
    'click button': function(){}
});

Template.uploadPanel.created = function(){
    Session.set('uploaded',false);
};

Template.uploadPanel.destroyed = function(){
    Session.set('uploaded',null);
};
//DOCUMENTOS


/**
 * DOCENTRY
 */
Template.docEntry.helpers({
    shortTitle: function(title,max){
        return ellipsis(title,max);
    },
    optionTag: function(option){
        return option.split('/')[2];
    }
});

Template.docEntry.events({

    'click .doc-item': function(e){
        $('.doc-item').removeClass('selected');
        $(e.currentTarget).addClass('selected');
        docsManagerRecorder.saveValue(Session.get('titleAct'),editor.getValue());
        if (Session.get('recording')){ //si está grabando hay que mostrar los cambios de documentos.
            docsManagerRecorder.insertFunctions([
                {
                    time: new Date() - date,
                    type: 'session',
                    arg: this.title
                }
            ]);
        }

        editor.focus();
        editor.setTheme(this.theme);
        editor.getSession().setMode(this.mode);
        editor.setValue(this.value);
        Session.set('titleAct',this.title);

        if ($(e.target).hasClass('config-doc')){
            Session.set('createDoc',false);
            Session.set('editDoc',this.title);
            var formDocEditor = $('.form-doc-editor').addClass('active');
            formDocEditor.find('[name="title"]').focus().val(this.title);

            var docItem = this;
            var optMode = _($('.lang')).find(function(option){return "ace/mode/" + $(option).text() == docItem.mode;});
            $('.lang').removeClass('active');
            $(optMode).addClass('active');

            var optTheme = _($('.theme')).find(function(option){return "ace/theme/" + $(option).text() == docItem.theme;});
            $('.theme').removeClass('active');
            $(optTheme).addClass('active');
        }else{
            var docForm = $('.form-doc-editor');
            docForm.find('[name="title"]').val('');
            docForm.find('.lang').removeClass('active');
            docForm.find('.theme').removeClass('active');
            docForm.removeClass('active');
            Session.set('editDoc','');
            Session.set('createDoc',false);
        }
    }
});


Template.docEntry.rendered = function(){
    $('.doc-item').removeClass('selected');
    $(this.firstNode).addClass('selected');

    if (!editor){
        console.log('no hay editor');
        editor = ace.edit("editor-recorder");
        editor.$blockScrolling = Infinity;
    }else{
        docsManagerRecorder.saveValue(Session.get('titleAct'),editor.getValue());
    }

    editor.setValue(this.data.value);
    editor.setTheme(this.data.theme);
    editor.getSession().setMode(this.data.mode);
    editor.setShowPrintMargin(false);

    Session.set('titleAct',this.data.title);

};

//ACTIONS
Template.startRecord.helpers({
    notSelected: function(){return Session.get('titleAct') === '';}
});

Template.recordProgressBar.rendered = function(){
    recorder.startProgress($('#timer'));
};

/**
 * RECORD SUBMIT
 */

Template.recordSubmit.helpers ({
    'recording': function(){ 
        return Session.get("recording"); 
    },
    'stop': function(){ 
        return Session.get("stop");
    },
    hasDocs: function(){
        return docsManagerRecorder.getDocs().get().length > 0 && !Session.get('stop');
    },
    createDoc: function(){
        return Session.get('createDoc');
    },
    editDoc: function(){
        return Session.get('editDoc');
    },
    documents: function(){
        return docsManagerRecorder.getDocs().get();
    },
    uploading: function(){
        return Session.get('uploading');
    }
});

Template.recordSubmit.events = {

    'click #add-document': function() {
        if (!Session.get('stop')){
            Session.set('editDoc','');
            Session.set('createDoc',true); //creating no editing
            var docForm = $('.form-doc-editor');
            docForm.addClass('active');
            docForm.find('[name="title"]').val('').blur();
            docForm.find('.lang').removeClass('active');
            docForm.find('.theme').removeClass('active');
        }
    },

    'click .lang': function(e){
        $('.lang').removeClass('active');
        $(e.currentTarget).addClass('active');
    },

    'click .theme': function(e){
        $('.theme').removeClass('active');
        $(e.currentTarget).addClass('active');
    },

    'submit .form-editor': function(e){
        e.preventDefault();
        var title = $(e.target).find('[name="title"]').val();
        var mode = $(e.target).find('.lang.active').text();
        var theme = $(e.target).find('.theme.active').text();

        if (Session.get('createDoc')){
            docsManagerRecorder.createDoc(title,mode,theme);

            if (Session.get('recording')){
                docsManagerRecorder.insertFunctions([
                    {
                        time: new Date() - date,
                        type: 'newDoc',
                        arg: [title,mode,theme]
                    },
                    {
                        time: new Date() - date,
                        type: 'session',
                        arg: title
                    }
                ]);
            }
        }else{
            docsManagerRecorder.updateDoc(Session.get('editDoc'),title,mode,theme);
            editor.setTheme("ace/theme/" + theme);
            editor.getSession().setMode("ace/mode/" + mode);

            if(Session.get('recording')){
                docsManagerRecorder.insertFunctions([
                    {
                        time: new Date() - date,
                        type: 'editDoc',
                        arg: [Session.get('editDoc'),title,mode,theme]
                    },
                    { //solo si se le aplica a un documento durante la grabacion
                        time: new Date() - date,
                        type: 'mode',
                        arg: mode,
                        toDo: 'editor.getSession().setMode("ace/mode/" + arg)'
                    },
                    { //solo si se le aplica a un documento durante la grabacion
                        time: new Date() - date,
                        type: 'theme',
                        arg: theme,
                        toDo: 'editor.setTheme("ace/theme/" + arg)'
                    }
                ]);
            }
        }

        var docForm = $('.form-doc-editor');
        docForm.find('[name="title"]').val('');
        docForm.find('.lang').removeClass('active');
        docForm.find('.theme').removeClass('active');
        docForm.removeClass('active');
        Session.set('editDoc','');
    },

    'click #cancel': function(){
        var docForm = $('.form-doc-editor');
        docForm.find('[name="title"]').val('');
        docForm.find('.lang').removeClass('active');
        docForm.find('.theme').removeClass('active');
        docForm.removeClass('active');
        Session.set('editDoc','');
        Session.set('createDoc',false);
    },

    'click #record-button': function(){
        var title = Session.get('titleAct');

        if(docsManagerRecorder.getDocs().get().length > 0 && title) { //recording is not able when there's not any document created!!

            docsManagerRecorder.saveValue(title, editor.getValue());
            docsManagerRecorder.copyDocsToRecording();
            docsManagerRecorder.insertFunctions([{
                time: new Date() - new Date(), //se ejecutará la primera.
                type: 'session',
                arg: title
            }]);

            recorder.startRecording(function(){
                Session.set('recording',true);
            });
        }
    },

    'click #stop-button': function(){
        //updating doc when recording process is finished!
        Session.set('audioDuration', recorder.getCurrentTime());
        console.log(Session.get('audioDuration'));
        docsManagerRecorder.saveValue(Session.get('titleAct'),editor.getValue());
        Session.set("stop",true);
        Session.set("recording",false);
        $('.doc-item').removeClass('selected');
        $('#editor-recorder').removeClass('active');
        recorder.stopRecording(currentAudio,function(){console.log('stop recording success!');});
        Session.set('formType','saveRecordForm');
    },

    'click #discard-record': function(){ //dejo todo en estado inicial.
        Session.set("stop",false);
        Session.set('formType','formDoc');
        editor = '';
        docsManagerRecorder.reset();
        Session.set("titleAct","");
    },

    'submit #saveForm': function(e){
        //aqui compongo el objeto grabacion y lo guardo en la base de datos.
        //el titulo no tiene porqué ser unico.
        //pero debe de tener un título.
        e.preventDefault();
        console.log(docsManagerRecorder.getFunctions());
        success = true;
        var title = $(e.target).find("[name=title]").val();
        if (!title ){
            success = false;
            $("#inputTitle").addClass("has-error");
            $("#inputTitle").append('<p class="errormsg">Record must have a title!</p>');
        }else{
            $("#inputTitle").removeClass("has-error");
            $(".errormsg").remove();
        }
        var description = $(e.target).find("[name=description]").val();

        if (success){ //solo si se ha guardado correctamente. (solo depende del titulo).
            $('#savePanel').modal('hide');
            console.log('voy a upload');
            var record = {
                title: title,
                description: description,
                tags: Session.get('tagsChoosen'),
                author: Meteor.userId(),
                img: '/recordImgDefault.png',
                createdAt: new Date(),
                docs_count: docsManagerRecorder.getDocsCount(),
                comments_count: 0,
                votes_count: 0,
                replies_count: 0,
                ready: false,
                duration: Session.get('audioDuration'),
                RC: docsManagerRecorder.getFunctions() //aqui almaceno la lista de funciones para la reproducción.
            };
            //Setting Navigation params!!
            if(this.lesson_id){
                record.lesson_id = this.lesson_id;
                record.section_id = this.section_id;
                record.order = parseInt(this.order);
            }
            if(this.channel_id) record.channel_id = this.channel_id;

            if (this.parent_id){
                record.parent_id = this.parent_id;
                record.isReply = true;
                record.timeMark = this.dataRecordObject.currentTime;
            }else{
                record.isReply = false;
            }

            Session.set('uploading',true);
            SC.connect().then(function(){
                var upload = SC.upload({
                    file: currentAudio.get(), // a Blob of your WAV, MP3...
                    title: record.title
                });

                upload.then(function(track){
                    console.log(track.uri);
                    record.track = {
                        id: track.id,
                        link: track.uri
                    };

                    Meteor.call('insertRecord',record,function(err,res){
                        if(err){
                            console.log(err.reason);
                        }
                        if(res){
                            docsManagerRecorder.saveDocs(res._id);
                            console.log('voy a guardar los documentos');

                            Session.set('uploaded',true);
                        }
                    });
                });
            });







            /*Meteor.call('insertRecord',record,function(err,result){
             if(err){
             console.log("error");
             }
             if (result){
             console.log('recordObjectId: ' + result._id);
             console.log('voy a guardar los documentos');
             Meteor.call('insertDocs',docs.get(),result._id,true,function(err){
             if(err) console.log('insertDocs ERROR: ' + err.reason);
             });
             Meteor.call('insertDocs',docsRC.get(),result._id,false,function(err){
             if(err) console.log('insertDocsRC ERROR: ' + err.reason);
             });



             AudioRCData.insert(currentAudio.get(),function(err,fileObj){
             if(err)console.log('insertAudioRCData ERROR: ' + err.reason);
             if (fileObj) {
             console.log('voy a guardar el audioRecording!');
             Meteor.call('insertAudioRecording',{
             audioData_id: fileObj._id,
             record_id: result._id
             },function(err){
             if (err){
             console.log('insertAudioRecording ERROR: ' + err.reason);
             }else{
             console.log('cambio de plantilla');
             Session.set('uploading',true);
             }
             $('#discard').click();
             });
             }
             });
             }
             });*/

        }
    },

};



Template.recordSubmit.created = function(){
    //if this record will be recorder with docs from another record.
    var arrayDocs = [];
    currentAudio = new ReactiveVar();
    docsManagerRecorder = new DocsManagerRecorder();

    if (this.data.parent_id && !this.data.dataRecordObject){
        console.log('es un reply pero no estan los documentos');
        arrayDocs = docsManagerRecorder.copyDocsFromCollection();
    }else{
        console.log('es un reply y si estan los documentos o no es un reply');
        console.log(this.data.dataRecordObject);
        arrayDocs = (this.data.dataRecordObject)? this.data.dataRecordObject.docs : [];
    };

    docsManagerRecorder.initialize(arrayDocs);
};

Template.recordSubmit.rendered = function(){
    console.log(this.data);
    /*window.onbeforeunload = function(){
       return 'perderás el acceso a los documentos iniciales';
    };*/
    $.getScript("https://webrtcexperiment-webrtc.netdna-ssl.com/RecordRTC.js",function(){
        recorder = new AudioRecorder();
        recorder.initialize();
    });
    SC.initialize({
        client_id: '9f2574ebd5266f995dca197f71cba11b',
        redirect_uri: 'http://localhost:3000/redirect.html',
        oauth_token: '1-172665-142059135-cd9567b1cb50c'
    });
    //variables de sesion.
    Session.set('formType','formDoc');
    Session.set("recording",false);
    Session.set("stop",false);
    Session.set("titleAct","");
    Session.set("createDoc",false);
    Session.set("editDoc",'');
    Session.set('uploading',false);
    Session.set('audioDuration','');
};

Template.recordSubmit.destroyed = function(){
    recorder = null;
    editor = null;
    Session.set('dataRecordingObject',null);
    Session.set('audioDuration',null);
};

/**
 * TRACKER
 */
Tracker.autorun(function(){
    if(Session.get('recording')){
        console.log("esta grabando y voy a crear los eventos del editor");
        date = new Date(); //actualizo la fecha de inicio de grabación.
        console.log("he actualizado la fecha de inicio");

        //situamos el inicio de la reproduccion con el documento seleccionado al inicio de la grabación.


        //eventos del editor

        editor.getSession().on('change', function(e) {
            switch (e.action) {
                case "remove":
                    console.log('remove case');
                    var rmRange = {
                        start: e.start,
                        end: e.end
                    };
                    docsManagerRecorder.insertFunctions([
                        {
                            time: new Date() - date,
                            arg: rmRange,
                            toDo: 'editor.getSession().getDocument().remove(arg);'
                        }
                    ]);
                    break;
                case "insert":
                    docsManagerRecorder.insertFunctions([
                        {
                            time: new Date() - date,
                            arg: {start: e.start, lines: e.lines},
                            toDo: 'editor.getSession().getDocument().insertMergedLines(arg.start, arg.lines)'
                        }
                    ]);
                    break;
            }
        });

        editor.getSession().selection.on('changeSelection', function(e) {
            var selection = editor.getSession().selection;

            if(!selection.isEmpty()){
                var range = selection.getRange();
                docsManagerRecorder.insertFunctions([
                    {
                        time: new Date() - date,
                        arg: range,
                        toDo: 'editor.getSession().selection.setSelectionRange(arg);'
                    }
                ]);
            }else{
                docsManagerRecorder.insertFunctions([
                    {
                        time: new Date() - date,
                        toDo: 'editor.getSession().selection.clearSelection();'
                    }
                ])
            }
        });

        editor.getSession().selection.on('changeCursor',function(e){
            docsManagerRecorder.insertFunctions([
                {
                    time: new Date() - date,
                    arg: editor.getSession().selection.getCursor(),
                    toDo: 'editor.getSession().selection.moveCursorToPosition(arg);'
                }
            ]);
        });
    }
});