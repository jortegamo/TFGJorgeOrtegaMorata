//variable global para el elemento ACE.editor.
editor = "";
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
            });
        });

        $("#modes").click(function(){
            $(".mode").click(function(){
                editor.getSession().setMode("ace/mode/" + this.text);
            })
        });
    },

    'click #record-button': function(){
        if (Session.get("recording")){
            Session.set("recording",false);
            play();
        }else{
            console.log("comienzo la grabacion");
            Session.set("recording", true);
            date = new Date();
            date2 = date;
        }
    }

};

Template.postSubmit.rendered = function(){
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");

    editor2 = ace.edit("editor2");
    editor2.setTheme("ace/theme/twilight");
    editor2.getSession().setMode("ace/mode/javascript");
    //editor2.setReadOnly(true);
    editor2.focus();
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
            functions.push({
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
            functions.push({
                time: new Date() - date,
                interval: new Date() -date2,
                toDo: (function(){
                    return function(editor){
                        editor.getSession().selection.setRange(range);
                    };
                }())
            });
        }
        date2 = new Date();
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
    });
    












    //variables de sesión para establecer la configuración multimedia.
    Session.set("cam-enabled",false);
    Session.set("mic-enabled",true);
    Session.set("recording",false);
    //generamos los popovers Bootstrap para que muestren los paneles de configuración.
    //panel configuración editor
    $('#config-editor-button').popover({
        content: Blaze.toHTML(Template.configEditor),
        html: true,
        title: "Editor Options",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
        trigger: "click",
        placement: "right"
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
        placement: "right"
    });

};

//funcion que relaiza la reproduccion de la grabacion en el editor.
var play = function(){
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
}


