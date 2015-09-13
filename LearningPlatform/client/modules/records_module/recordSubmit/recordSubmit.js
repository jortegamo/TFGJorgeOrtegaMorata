//variable global para el elemento ACE.editor.
editor = "";
//array de documentos antes de empezar a grabar.
var docs;

//array de documentos mientras grabamos.
var docsRC;

//array de funciones.
var functions = [];

//correspondera con el inicio de la grabación.
var date;

//constructor para documentos.
var Doc = function(title,mode,theme){
    this.title = title;
    this.mode = (mode) ?  "ace/mode/" + mode : "ace/mode/javascript";
    this.theme = (theme)? "ace/theme/" + theme : "ace/theme/twilight";
    this.value = ""; //por defecto;
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
        var arrayDocs = docs.get();
        arrayDocs.forEach(function(doc){if (doc.title == Session.get('titleAct')) doc.value = editor.getValue();});
        docs.set(arrayDocs);

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
                time: new Date - date,
                arg: this.mode,
                toDo: 'editor.getSession().setMode("ace/mode/" + arg)'
            });
            functions.push({ //solo si se le aplica a un documento durante la grabacion
                time: new Date - date,
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
        var arrayDocs = docs.get();
        arrayDocs.forEach(function(doc){if (doc.title == Session.get('titleAct')) doc.value = editor.getValue();});
        docs.set(arrayDocs);
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

Template.recordSubmit.helpers ({
    'recording': function(){ 
        return Session.get("recording"); 
    },
    'stop': function(){ 
        return Session.get("stop");
    },
    hasDocs: function(){
        return docs.get().length > 0;
    },
    createDoc: function(){
        return Session.get('createDoc');
    },
    editDoc: function(){
        return Session.get('editDoc');
    },
    documents: function(){
        return (Session.get('recording'))? docsRC.get() : docs.get();
    }
});

Template.recordSubmit.events = {

    'click #record-button': function(){
        if (Session.get("recording")){
            Session.set("recording",false);
        }else{
            if(docs.length != 0){ //si no hay algun documento creado es imposible grabar.
                var title = Session.get('titleAct');
                //esto es importante puesto que el valor de un documento solo se actualiza 
                //al cambiar a otro.
                if (title){ //si hay algun documento seleccionado actualizo su valor antes de grabar.
                    var docAct = _(docs).find(function(doc){return doc.title == title;});
                    docAct.value = editor.getValue();

                    _(docs).each(function(doc){ //copio los documentos.
                        var ndoc = new Doc (doc.title);
                        ndoc.theme = doc.theme;
                        ndoc.mode = doc.mode;
                        docsRC.push(ndoc);
                    });
                    console.log('he creado la primera funcion');
                    functions.push({
                        time: new Date() - new Date(), //se ejecutará la primera.
                        type: 'session',
                        arg: title
                    });

                    console.log(docs);
                    console.log(docsRC);

                    SC.record({ //solo se permite grabar si tienes un documento seleccionado.
                        start: function(){
                            console.log("comienzo la grabacion");
                            Session.set("recording", true);
                        },
                        progress: function(ms, avgPeak){
                            $("#timer").text(SC.Helper.millisecondsToHMS(ms));
                        }
                    });

                }else{
                    $('#docs-editor').popover({
                        content: '<p>Sorry, you must select a document to start Recording!</p>',
                        html: true,
                        placement: "top",
                        trigger: 'click',
                    });
                    $('#docs-editor').popover('show');
                    $('#docs-editor').click(function(){ $('#docs-editor').popover('destroy')});
                }
                
            }else{
                console.log('he entrado en la cond correcta');
                $('#addDoc').popover({
                    content: '<p>Sorry, create a new doc to start Recording!</p>',
                    html: true,
                    placement: "right",
                    trigger: 'click'
                });
                $('#addDoc').popover('show');
                $('#title-doc-input').click(function(){$('#addDoc').popover('destroy')});
            }
        }
    },

    'click #stop-button': function(){
        Session.set("stop",true);
        Session.set("recording",false);
        SC.recordStop();
        //comprobamos que los documentos se han almacenado correctamente.
        console.log(docs);
        console.log(docsRC);
    },

    'click #discard': function(){ //dejo todo en estado inicial.
        Session.set("stop",false);
        editor.setValue("");
        editor.setTheme("ace/theme/twilight");
        editor.getSession().setMode("ace/mode/javascript");
        docs = [];
        docsRC = [];
        $("#docs-editor").html("");
        Session.set("titleAct","");
    },

    /*'submit form': function(e){
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
            

            SC.connect(function(){ //upload para soundcloud.
                SC.recordUpload({
                    track: {
                        title: title,
                        sharing: "public"
                    }
                },function(track){
                    console.log(track);
                    var record = {
                        title: title,
                        description: description,
                        track_id: track.id,
                        author: Meteor.userId(),
                        createdAt: new Date(),
                        docs_count: docs.length,
                        comments_count: 0,
                        votes_count: 0,
                        replies_count: 0,
                        RC: functions //aqui almaceno la lista de funciones para la reproducción.
                    }
                    
                    Meteor.call('insertRecord',record,function(err,result){
                        if(err){
                            console.log("error");
                        }
                        if (result){
                            console.log('voy a guardar los documentos');
                            Meteor.call('insertDocs',docs,result._id,true,function(err){
                                if(err) console.log(err);
                            });
                            Meteor.call('insertDocs',docsRC,result._id,false,function(err){
                                if(err) console.log(err);
                                $('#discard').click(); //para dejar todo como estaba
                            });
                        }
                    });
                    
                });
            });
        }
    },*/

    'click #add-document': function() {
        Session.set('editDoc','');
        Session.set('createDoc',true); //creating no editing
        var docForm = $('.form-doc-editor');
        docForm.addClass('active');
        docForm.find('[name="title"]').val('').blur();
        docForm.find('.lang').removeClass('active');
        docForm.find('.theme').removeClass('active');
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
                    time: new Date - date,
                    arg: mode,
                    toDo: 'editor.getSession().setMode("ace/mode/" + arg)'
                });
                functions.push({ //solo si se le aplica a un documento durante la grabacion
                    time: new Date - date,
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
/*Tracker.autorun(function(){
    if(Session.get('recording')){
        console.log("esta grabando y voy a crear los eventos del editor");
        date = new Date(); //actualizo la fecha de inicio de grabación.
        console.log("he actualizado la fecha de inicio");

        //situamos el inicio de la reproduccion con el documento seleccionado al inicio de la grabación.


        //eventos del editor

        editor.getSession().on('change', function(e) {
            switch (e.data.action){
            case "removeText":
                var rmRange = e.data.range;
                /*var doc = editor2.getSession().getDocument();
                doc.remove(rmRange);
                functions.push({
                    time: new Date() - date,
                    arg: rmRange,
                    toDo: 'editor.getSession().getDocument().remove(arg);'
                });
                break;
            case "insertText":
                console.log(e.data);
                functions.push({
                    time: new Date() - date,
                    arg: e.data.text,
                    toDo: 'editor.insert(arg);'
                });
                break;
            case "removeLines":
                var rmRange = e.data.range;
                /*var doc = editor2.getSession().getDocument();
                doc.remove(rmRange);
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
            //var selection2 = editor2.getSession().selection;

            if(selection.isEmpty()){
                //selection2.clearSelection();
                functions.push({
                    time: new Date() - date,
                    arg: null,
                    toDo: 'editor.getSession().selection.clearSelection();'
                });
            }else{
                var range = selection.getRange();
                //selection2.setRange(range);
                functions.push({
                    time: new Date() - date,
                    arg: range,
                    toDo: 'editor.getSession().selection.setRange(arg);'
                });
            }
        });

        editor.getSession().selection.on('changeCursor',function(e){
            var pos = editor.getCursorPosition();
            //editor2.moveCursorToPosition(pos);
            functions.push({
                time: new Date() - date,
                arg: pos,
                toDo: 'editor.moveCursorToPosition(arg);'
            });
        });
    } //--</if>
});*/

Template.recordSubmit.created = function(){
    docs = new ReactiveVar([]);
    docsRC = new ReactiveVar([]);
};

Template.recordSubmit.rendered = function(){
    functions = []; //inicializo la lista de funciones. (necesario global para poder guardar en el objeto RC).
    docs.set([]);
    docsRC.set([]);
    //variables de sesion.
    Session.set('formType','formDoc');
    Session.set("recording",false);
    Session.set("stop",false);
    Session.set("recording",false);
    Session.set("titleAct","");
    Session.set("hasDocs",true);
    Session.set("createDoc",false);
    Session.set("editDoc",'');
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
