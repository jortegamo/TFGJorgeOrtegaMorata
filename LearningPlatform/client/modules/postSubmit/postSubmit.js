//variable global para el elemento ACE.editor.
editor = "";
//array de documentos antes de empezar a grabar.
var docs = [];

//array de documentos mientras grabamos.
var docsRC = [];

//array de funciones.
var functions = [];

//correspondera con el inicio de la grabación.
var date;

//constructor para documentos.
var Doc = function(title){
    this.title = title;
    this.mode = "ace/mode/javascript"; //por defecto
    this.theme = "ace/theme/twilight"; //por defecto
    this.value = "";
}

Template.postSubmit.helpers ({

    'recording': function(){ 
        return Session.get("recording"); 
    },

    'stop': function(){ 
        return Session.get("stop");
    }
});

Template.postSubmit.events = {
    
    'click #multmedia-config': function(){
        $("#micro-button").click(function(){
            if ($(this).hasClass('btn-success')){
                $(this).removeClass('btn-success').addClass('btn-danger');
                //disabled micro
                Session.set("mic-enabled",false);
            }else{
                //enabled micro
                $(this).removeClass('btn-danger').addClass('btn-success');
                Session.set("mic-enabled",true);
            }
        });

        $("#cam-button").click(function(){
            if ($(this).hasClass('btn-success')){
                $(this).removeClass('btn-success').addClass('btn-danger');
                //disabled cam
                Session.set("cam-enabled",false);
            }else{
                $(this).removeClass('btn-danger').addClass('btn-success');
                //enabled cam
                Session.set("cam-enabled",true);
            }
        });
    },
    
    'click #config-editor-button': function(){
        $("#themes").click(function(){
            $(".theme").click(function(){
                var arrayDocs = (Session.get('recording')) ? docsRC : docs;
                editor.setTheme("ace/theme/" + this.text);
                var titleAct = Session.get("titleAct");
                var doc = _(arrayDocs).find(function(doc){return doc.title == titleAct;});
                if(doc){
                    doc.theme = "ace/theme/" + this.text; //cambio el theme
                    if(Session.get('recording')){
                        functions.push({ //solo si se le aplica a un documento durante la grabacion
                            time: new Date - date,
                            arg: this.text,
                            toDo: 'editor.setTheme("ace/theme/" + arg)'
                        });
                    }
                }
            });
        });

        $("#modes").click(function(){
            $(".mode").click(function(){
                var arrayDocs = (Session.get('recording')) ? docsRC : docs;
                editor.getSession().setMode("ace/mode/" + this.text);
                var titleAct = Session.get("titleAct");
                var doc = _(arrayDocs).find(function(doc){return doc.title == titleAct;});
                if(doc){
                    doc.mode = "ace/mode/" + this.text; //cambio el mode
                    if(Session.get('recording')){
                        functions.push({ //solo si se le aplica a un documento durante la grabacion
                            time: new Date - date,
                            arg: this.text,
                            toDo: 'editor.getSession().setMode("ace/mode/" + arg)'
                        });
                    }
                }
            })
        });
    },

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

    'submit form': function(e){
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
                        author: (Meteor.userId())? Meteor.users.findOne(Meteor.userId).username : 'unknown',
                        createdAt: new Date(),
                        docs_count: docs.length,
                        votes: 0,
                        comments_count: 0,
                        replies_count: 0,
                        RC: functions //aqui almaceno la lista de funciones para la reproducción.
                    }
                    
                    Meteor.call('insertRecord',record,function(err,result){
                        if(err){
                            console.log("error al guardar el record");
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
    },

    'click #addDoc': function(){
        var title = $('#title-doc-input').val();
        $('#title-doc-input').val(""); //lo dejo vacio.
        var arrayDocs = (Session.get('recording')) ? docsRC : docs; //actualizo un array u otro dependiendo.

        if (title != "" && !_(arrayDocs).find(function(doc){return doc.title == title;})){
            var doc = new Doc(title);
            arrayDocs.push(doc);
            //ahora creo el div y lo añado a la lista de documentos.
            var doc_elem = '<div class="doc-elem"><p><img class="sheetcode" src="sheetcode.png"/><span class="doc-title">' + title + '</span></p></div>';
            $('#docs-editor').append(doc_elem);

            //si estoy grabando y creo un nuevo documento.
            if (Session.get('recording')){
                functions.push({
                    time: new Date() - date,
                    arg: title,
                    type: 'docs', //indica el objeto sobre el que se va a aplicar la funcion.(1er arg).
                    toDo: 'docs.push(new Doc(arg))'
                });
            }

        }else{ //creare un popup con el texto del error señalando al input.
            $('#title-doc-input').popover({
                content: '<p>Sorry, docs must have a title and must be uniq!</p>',
                html: true,
                placement: "bottom",
                trigger: 'click'
            });
            $('#title-doc-input').popover('show');
            $('#title-doc-input').click(function(){$('#title-doc-input').popover('destroy')});
        }
    },
    //revisar los valores almacenados cambian.
    'click .doc-elem': function(e){
        var titleAct = Session.get("titleAct");
        var title = $(e.target).find('.doc-title').text();
        var doc = "";
        var arrayDocs = (Session.get('recording')) ? docsRC : docs; //actualizo un array u otro dependiendo.
        if (titleAct && titleAct != title){
            var docAct = _(arrayDocs).find(function(doc){return doc.title == titleAct});
            docAct.value = editor.getValue(); //actualizo el valor del documento.
            doc = _(arrayDocs).find(function(doc){return doc.title == title});
        }else{
            if (!titleAct) doc = _(arrayDocs).find(function(doc){return doc.title == title});
        }
        if(doc){ 
            //si hay que cambiar de documento ya sea porque no habia ninguno seleccionado 
            //o porque la seleccion cambia.
            editor.setValue(doc.value);
            editor.setTheme(doc.theme);
            editor.getSession().setMode(doc.mode);
        }

        
        var actives = $("#docs-editor").find(".active"); //deselecciono.
        _(actives).each(function(a){$(a).removeClass("active")}); //selecciono el correspondiente.
        $(e.currentTarget).addClass("active");

        editor.focus();
        editor.getSession().selection.clearSelection();

        Session.set("titleAct",title); //cambio el documento actual en la session.

        if (Session.get('recording')){ //si está grabando hay que mostrar los cambios de documentos.
            functions.push({
                time: new Date() - date,
                type: 'session',
                arg: title
            });
        }

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

        editor.getSession().on('change', function(e) {
            switch (e.data.action){
            case "removeText":
                var rmRange = e.data.range;
                /*var doc = editor2.getSession().getDocument();
                doc.remove(rmRange);*/
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
                doc.remove(rmRange);*/
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
});

Template.postSubmit.rendered = function(){
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setShowPrintMargin(false);
    functions = []; //inicializo la lista de funciones. (necesario global para poder guardar en el objeto RC).
    /*editor2 = ace.edit("editor2");
    editor2.setTheme("ace/theme/twilight");
    editor2.getSession().setMode("ace/mode/javascript");
    editor2.setReadOnly(true);
    //vamos a probar los eventos del editor y tratamos de reproducirlos en el segundo editor.
    //eventos*/
    
    //variables de sesión para establecer la configuración multimedia.
    Session.set("cam-enabled",false);
    Session.set("mic-enabled",true);
    Session.set("recording",false);
    Session.set("stop",false);
    Session.set("recording",false);
    Session.set("titleAct","");
    //generamos los popovers Bootstrap para que muestren los paneles de configuración.
    //panel configuración editor
    $('#config-editor-button').popover({
        content: Blaze.toHTML(Template.configEditor),
        html: true,
        title: "Editor Options",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        trigger: "click",
        placement: "left"
    });

    //panel configuracion multimedia
    $('#multmedia-config').popover({
        content: Blaze.toHTML(Template.configMultimedia),
        html: true,
        trigger: "click",
        placement: "top"
    });

    //panel ayuda
    $('#help-button').popover({
        content: Blaze.toHTML(Template.heopInfoRecord),
        html: true,
        trigger: "click",
        placement: "left"
    });
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
