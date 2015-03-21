//variable global para el elemento ACE.editor.
editor = "";
var docs = [];

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
                editor.setTheme("ace/theme/" + this.text);
                var titleAct = Session.get("titleAct");
                var doc = _(docs).find(function(doc){return doc.title == titleAct;});
                if(doc) doc.theme = "ace/theme/" + this.text; //cambio el theme
            });
        });

        $("#modes").click(function(){
            $(".mode").click(function(){
                editor.getSession().setMode("ace/mode/" + this.text);
                var titleAct = Session.get("titleAct");
                var doc = _(docs).find(function(doc){return doc.title == titleAct;});
                if(doc) doc.mode = "ace/mode/" + this.text; //cambio el mode
            })
        });
    },

    'click #record-button': function(){
        if (Session.get("recording")){
            Session.set("recording",false);
            //play();
        }else{
            if(docs.length != 0){ //si no hay algun documento creado es imposible grabar.
                SC.record({
                    start: function(){
                        console.log("comienzo la grabacion");
                        Session.set("recording", true);
                    },
                    progress: function(ms, avgPeak){
                        console.log(ms);
                        $("#timer").text(SC.Helper.millisecondsToHMS(ms));
                    }
                });
                /*date = new Date();
                date2 = date;*/
            }else{
                $('#addDoc').popover({
                    content: '<p>Sorry, create a new doc to start Recording!</p>',
                    html: true,
                    trigger: "click",
                    placement: "right"
                });
                $('#addDoc').popover('show');
                $('#title-doc-input').click(function(){
                    $('#addDoc').popover('destroy');
                });
            }
        }
    },

    'click #stop-button': function(){
        Session.set("stop",true);
        Session.set("recording",false);
        SC.recordStop();
        SC.recordPlay({});
    },

    'click #discard': function(){ //dejo todo en estado inicial.
        Session.set("stop",false);
        editor.setValue("");
        editor.setTheme("ace/theme/twilight");
        editor.getSession().setMode("ace/mode/javascript");
        docs = [];
        $("#docs-editor").html("");
        Session.set("titleAct","");
    },

    'click #save': function(){
        Session.set("stop",false);
        SC.connect(function(){
                SC.recordUpload({
                    track: {
                        title: "prueba recording",
                        sharing: "private"
                    }
                });
        });
    },

    'click #addDoc': function(){
        var title = $('#title-doc-input').val();
        $('#title-doc-input').val(""); //lo dejo vacio.
        if (title != "" && !_(docs).find(function(doc){return doc.title == title;})){
            if (docs.length == 0){
                $("#docs-editor").html("");
            }
            var doc = new Doc(title);
            docs.push(doc);
            //ahora creo el div y lo añado a la lista de documentos.
            var doc_elem = '<div class="doc-elem"><p><img class="sheetcode" src="sheetcode.png"/><span class="doc-title">' + title + '</span></p></div>';
            $('#docs-editor').append(doc_elem);
        }else{ //creare un popup con el texto del error señalando al input.
            $('#title-doc-input').popover({
                content: '<p>Sorry, docs must have a title and must be uniq!</p>',
                html: true,
                trigger: "click",
                placement: "bottom"
            });
            $('#title-doc-input').popover('show');
            $('#title-doc-input').click(function(){
                $('#title-doc-input').popover('destroy');
            });
        }
    },
    //revisar los avlores almacenados cambian.
    'click .doc-elem': function(e){
        var titleAct = Session.get("titleAct");
        var title = $(e.target).find('.doc-title').text();
        var doc = "";
        if (titleAct && titleAct != title){
            var docAct = _(docs).find(function(doc){return doc.title == titleAct});
            docAct.value = editor.getValue(); //actualizo el valor del documento.
            doc = _(docs).find(function(doc){return doc.title == title});
        }else{
            if (!titleAct) doc = _(docs).find(function(doc){return doc.title == title});
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
    }

};

Template.postSubmit.rendered = function(){
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setShowPrintMargin(false);

    /*editor2 = ace.edit("editor2");
    editor2.setTheme("ace/theme/twilight");
    editor2.getSession().setMode("ace/mode/javascript");
    editor2.setReadOnly(true);
    //vamos a probar los eventos del editor y tratamos de reproducirlos en el segundo editor.
    //eventos
    functions = [];
    editor.getSession().on('change', function(e) {
        
        switch (e.data.action){
            case "removeText":
                var rmRange = e.data.range;
                var doc = editor2.getSession().getDocument();
                doc.remove(rmRange);
                functions.push({
                    time: new Date() - date,
                    interval: new Date() -date2,
                    toDo: (function(){
                        return function(editor){
                            editor.getSession().getDocument().remove(rmRange);
                        };
                    }())
                });
                date2 = new Date();
                break;
            case "insertText":
                editor2.insert(e.data.text);
                functions.push({
                    time: new Date() - date,
                    interval: new Date() -date2,
                    toDo: (function(){
                        return function(editor){
                            editor.insert(e.data.text);
                        };
                    }())
                });
                date2 = new Date();
                break;
            case "removeLines":
                var rmRange = e.data.range;
                var doc = editor2.getSession().getDocument();
                doc.remove(rmRange);
                functions.push({
                    time: new Date() - date,
                    interval: new Date() -date2,
                    toDo: (function(){
                        return function(editor){
                            editor.getSession().getDocument().remove(rmRange);
                        };
                    }())
                });
                date2 = new Date();
                break;
        } 
    });

    editor.getSession().selection.on('changeSelection', function(e) {
        var selection = editor.getSession().selection;
        var selection2 = editor2.getSession().selection;
        
        if(selection.isEmpty()){
            selection2.clearSelection();
            /*functions.push({
                time: new Date() - date,
                interval: new Date() -date2,
                toDo: (function(){
                    return function(editor){
                        editor.getSession().selection.clearSelection();
                    };
                }())
            });
        }else{
            var range = selection.getRange();
            selection2.setRange(range);
            /*functions.push({
                time: new Date() - date,
                interval: new Date() -date2,
                toDo: (function(){
                    return function(editor){
                        editor.getSession().selection.setRange(range);
                    };
                }())
            });
        }
        //date2 = new Date();
    });

    editor.getSession().selection.on('changeCursor',function(e){
        var pos = editor.getCursorPosition();
        editor2.moveCursorToPosition(pos);
        functions.push({
            time: new Date() - date,
            interval: new Date() -date2,
            toDo: (function(){
                return function(editor){
                    editor.moveCursorToPosition(pos);
                }
            }())
        });
        date2 = new Date();
    });*/
    




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


