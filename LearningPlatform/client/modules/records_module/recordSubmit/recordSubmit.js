//variable global para el elemento ACE.editor.
var editor = "";
//array de documentos antes de empezar a grabar.
var docs;
//array de documentos mientras grabamos.
var docsRC;
//array de funciones.
var functions = [];
//correspondera con el inicio de la grabación.
var date;
var recorder;
var currentAudio;

Template.uploadPanel.helpers({
    uploadProgressVal: function(){
        return Session.get('uploadProgressVal');
    },
    uploaded: function(){
        return Session.get('uploaded');
    }
});

Template.uploadPanel.events({
    'click button': function(){}
});

Template.uploadPanel.created = function(){
    Session.set('uploaded',false);
    Session.set('uploadProgressVal',0);
};

Template.uploadPanel.rendered = function(){
    var interval;
    var progressUploading = function(){
        var file = AudioRCData.findOne();
        if(file.uploadProgress()<100){
            Session.set('uploadProgressVal',file.uploadProgress());
            interval = window.setInterval(progressUploading(),500);
        }else{
            window.clearInterval(interval);
            interval = null;
            Session.set('uploaded',true);
        }
    };
    progressUploading();
};

Template.uploadPanel.destroyed = function(){
    Session.set('uploaded',null);
    Session.set('uploadProgressVal',null);
};
//DOCUMENTOS


//constructor para documentos.
var Doc = function(title,mode,theme,value){
    this.title = title;
    this.mode = (mode) ?  "ace/mode/" + mode : "ace/mode/javascript";
    this.theme = (theme)? "ace/theme/" + theme : "ace/theme/twilight";
    this.value = value || "";
};


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
        var objectDocs = (Session.get('recording'))? docsRC : docs;
        var arrayDocs = objectDocs.get();
        arrayDocs.forEach(function(doc){if (doc.title == Session.get('titleAct')) doc.value = editor.getValue();});
        objectDocs.set(arrayDocs);

        editor.focus();
        editor.setTheme(this.theme);
        editor.getSession().setMode(this.mode);
        editor.setValue(this.value);
        editor.getSession().selection.clearSelection();


        Session.set('titleAct',this.title);

        if (Session.get('recording')){ //si está grabando hay que mostrar los cambios de documentos.
            functions.push({
                time: new Date() - date,
                type: 'session',
                arg: this.title
            });
            functions.push({ //solo si se le aplica a un documento durante la grabacion
                time: new Date() - date,
                arg: this.mode,
                toDo: 'editor.getSession().setMode("ace/mode/" + arg)'
            });
            functions.push({ //solo si se le aplica a un documento durante la grabacion
                time: new Date() - date,
                arg: this.theme,
                toDo: 'editor.setTheme("ace/theme/" + arg)'
            });
        }
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
    $(this.firstNode).addClass('selected');
    if (!editor){
         editor = ace.edit("editor-recorder");
    }else{
        var objectDocs = (Session.get('recording'))? docsRC : docs;
        var arrayDocs = objectDocs.get();
        arrayDocs.forEach(function(doc){if (doc.title == Session.get('titleAct')) doc.value = editor.getValue();});
        objectDocs.set(arrayDocs);
    }

    editor.setValue('');
    editor.setTheme(this.data.theme);
    editor.getSession().setMode(this.data.mode);
    editor.setShowPrintMargin(false);

    Session.set('titleAct',this.data.title);

    if (Session.get('recording')){ //si está grabando hay que mostrar los cambios de documentos.
        functions.push({
            time: new Date() - date,
            type: 'session',
            arg: this.data.title
        });
        functions.push({ //solo si se le aplica a un documento durante la grabacion
            time: new Date - date,
            arg: this.data.mode,
            toDo: 'editor.getSession().setMode("ace/mode/" + arg)'
        });
        functions.push({ //solo si se le aplica a un documento durante la grabacion
            time: new Date - date,
            arg: this.data.theme,
            toDo: 'editor.setTheme("ace/theme/" + arg)'
        });
    }

};

//ACTIONS
Template.startRecord.helpers({
    notSelected: function(){return Session.get('titleAct') === '';}
});

Template.recordProgressBar.rendered = function(){
    recorder.startProgress($('#timer'));
};

//SUBMIT TEMPLATE
Template.recordSubmit.helpers ({
    'recording': function(){ 
        return Session.get("recording"); 
    },
    'stop': function(){ 
        return Session.get("stop");
    },
    hasDocs: function(){
        return docs.get().length > 0 && !Session.get('stop');
    },
    createDoc: function(){
        return Session.get('createDoc');
    },
    editDoc: function(){
        return Session.get('editDoc');
    },
    documents: function(){
        return (Session.get('recording'))? docsRC.get() : docs.get();
    },
    uploading: function(){
        return Session.get('uploading');
    }
});

Template.recordSubmit.events = {

    'click #record-button': function(){
        var title = Session.get('titleAct');

        if(docs.length != 0 && title) { //si no hay algun documento creado es imposible grabar.
            //esto es importante puesto que el valor de un documento solo se actualiza
            //al cambiar a otro.si hay algun documento seleccionado actualizo su valor antes de grabar.
            var arrayDocs = docs.get();
           _(arrayDocs).each(function (doc) {
               if(doc.title == title) doc.value = editor.getValue();
            });

            docs.set(arrayDocs); //actualizo los docs iniciales

            arrayDocs = docsRC.get();
            _(docs.get()).each(function (doc) { //copio los documentos.
                arrayDocs.push(new Doc(doc.title, doc.mode.split('/')[2], doc.theme.split('/')[2], doc.value));
            });
            docsRC.set(arrayDocs); //actualizo docsRC

            console.log('he creado la primera funcion');
            functions.push({
                time: new Date() - new Date(), //se ejecutará la primera.
                type: 'session',
                arg: title
            });

            recorder.startRecording(function(){
                Session.set('recording',true);
            });
        }
    },

    'click #stop-button': function(){
        Session.set("stop",true);
        Session.set("recording",false);
        $('.doc-item').removeClass('selected');
        $('#editor-recorder').removeClass('active');
        recorder.stopRecording(currentAudio,function(){console.log('stop recording success!');})
        Session.set('formType','saveRecordForm');
        //comprobamos que los documentos se han almacenado correctamente.
        console.log(docs);
        console.log(docsRC);
        console.log(functions);
        console.log(currentAudio.get());
    },

    'click #discard-record': function(){ //dejo todo en estado inicial.
        Session.set("stop",false);
        Session.set('formType','formDoc');
        editor = '';
        docs.set([]);
        docsRC.set([]);
        Session.set("titleAct","");
    },

    'submit #saveForm': function(e){
        //aqui compongo el objeto grabacion y lo guardo en la base de datos.
        //el titulo no tiene porqué ser unico.
        //pero debe de tener un título.
        e.preventDefault();
        console.log(functions);
        console.log(docs);
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
                docs_count: docsRC.get().length,
                comments_count: 0,
                votes_count: 0,
                replies_count: 0,
                ready: false,
                RC: functions //aqui almaceno la lista de funciones para la reproducción.
            };

            Meteor.call('insertRecord',record,function(err,result){
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
            });

        }
    },

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
        var docsObj = (Session.get('recording'))? docsRC : docs;
        var docsArray =  docsObj.get();

        if (Session.get('createDoc')){
            var doc = new Doc(title,mode,theme);
            $('.doc-item').removeClass('selected');
            docsArray.push(doc);

            //si estoy grabando y creo un nuevo documento.
            if (Session.get('recording')){
                functions.push({
                    time: new Date() - date,
                    arg: title,
                    type: 'docs', //indica el objeto sobre el que se va a aplicar la funcion.(1er arg).
                    toDo: 'docs.push(new Doc(arg))'
                });
            }
        }else{
            _(docsArray).each(function(doc){
                if(doc.title == Session.get('editDoc')){
                    doc.title = title;
                    doc.mode = "ace/mode/" + mode;
                    doc.theme = "ace/theme/" + theme;
                }
            });
            editor.setTheme("ace/theme/" + theme);
            editor.getSession().setMode("ace/mode/" + mode);

            if(Session.get('recording')){
                //otra para el titulo.
                functions.push({ //solo si se le aplica a un documento durante la grabacion
                    time: new Date() - date,
                    arg: mode,
                    toDo: 'editor.getSession().setMode("ace/mode/" + arg)'
                });
                functions.push({ //solo si se le aplica a un documento durante la grabacion
                    time: new Date() - date,
                    arg: theme,
                    toDo: 'editor.setTheme("ace/theme/" + arg)'
                });
            }
        }

        docsObj.set(docsArray);

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
    }

};

//en el momento en el que empieza a grabar se establecen los eventos sobre el editor.
Tracker.autorun(function(){
    if(Session.get('recording')){
        console.log("esta grabando y voy a crear los eventos del editor");
        date = new Date(); //actualizo la fecha de inicio de grabación.
        console.log("he actualizado la fecha de inicio");

        //situamos el inicio de la reproduccion con el documento seleccionado al inicio de la grabación.


        //eventos del editor

        editor.on('change', function(e) {
            switch (e.action){
            case "removeText":
                var rmRange = e.range;
                functions.push({
                    time: new Date() - date,
                    arg: rmRange,
                    toDo: 'editor.getSession().getDocument().remove(arg);'
                });
                break;
            case "insertText":
                functions.push({
                    time: new Date() - date,
                    arg: e.text,
                    toDo: 'editor.insert(arg);'
                });
                break;
            case "removeLines":
                var rmRange = e.range;
                functions.push({
                    time: new Date() - date,
                    arg: rmRange,
                    toDo: 'editor.getSession().getDocument().remove(arg);'
                });
                break;
            }
        });

        editor.getSession().selection.on('changeSelection', function(e) {
            var selection = editor.getSession().selection;

            if(selection.isEmpty()){
                functions.push({
                    time: new Date() - date,
                    arg: null,
                    toDo: 'editor.getSession().selection.clearSelection();'
                });
            }else{
                var range = selection.getRange();
                functions.push({
                    time: new Date() - date,
                    arg: range,
                    toDo: 'editor.getSession().selection.setRange(arg);'
                });
            }
        });

        editor.getSession().selection.on('changeCursor',function(e){
            var pos = editor.getCursorPosition();
            functions.push({
                time: new Date() - date,
                arg: pos,
                toDo: 'editor.moveCursorToPosition(arg);'
            });
        });
    } //--</if>
});

Template.recordSubmit.created = function(){
    docs = new ReactiveVar([]);
    docsRC = new ReactiveVar([]);
    currentAudio = new ReactiveVar();
};

Template.recordSubmit.rendered = function(){
    $.getScript("https://webrtcexperiment-webrtc.netdna-ssl.com/RecordRTC.js",function(){
        recorder = new AudioRecorder();
        recorder.initialize();
    });
    functions = []; //inicializo la lista de funciones. (necesario global para poder guardar en el objeto RC).
    docs.set([]);
    docsRC.set([]);
    //variables de sesion.
    Session.set('formType','formDoc');
    Session.set("recording",false);
    Session.set("stop",false);
    Session.set("titleAct","");
    Session.set("createDoc",false);
    Session.set("editDoc",'');
    Session.set('uploading',false);
};

Template.recordSubmit.destroyed = function(){
    recorder = null;
};

//funcion que relaiza la reproduccion de la grabacion en el editor.
/*var play = function(){
    console.log("he llamado a play");
    editor2.setValue("");
    console.log("he reseteado el editor2");
    var times = [];
    _(functions).each(function(elem){
        times.push(elem.time);
    })
    times = _(times).uniq();
    console.log("uniq times: ");
    console.log(times);
    var reproduction = [];
    _(times).each(function(time){
        var elems = _(functions).filter(function(elem){return elem.time == time;});
        console.log(elems);
        reproduction.push(elems);
    });
    console.log("reproduction");
    console.log(reproduction);
    _(reproduction).each(function(elems){
            _(elems).each(function(elem){
                elem.toDo(editor2);
            });
    });
    console.log("he terminado la reproduccion");
}*/
