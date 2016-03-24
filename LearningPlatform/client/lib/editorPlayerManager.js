editor = {};

EditorPlayerManager = function(){
    //VARIABLES
    var docs,
        startDocs,
        finishDocs,
        listPending,
        docActual,
        RC;

    var Doc = function(title,mode,theme,value){
        this.title = title;
        this.mode = mode || "ace/mode/javascript"; //por defecto
        this.theme = theme ||"ace/theme/twilight"; //por defecto
        this.value = value || "";
    };

    //INITIALIZATION
    function initializeDynamicDocs (){
        docs = [];
        docActual = '';
        Session.set('docAct',"");
        _(startDocs).each(function(elem){
            docs.push(
                new Doc (elem.doc.title,
                    elem.doc.mode,
                    elem.doc.theme,
                    elem.doc.value)
            );
        });
    }
    function defaultEditorSettings (){
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
        editor.setShowPrintMargin(false);
        editor.$blockScrolling = Infinity;
        editor.setValue('');
        $('.ace_gutter').css('z-index','0');
    }
    function initEditor(id){
        editor = ace.edit(id);
        defaultEditorSettings();
    }

    this.initialize = function(params){
        startDocs = params.startDocs;
        finishDocs = params.finishDocs;
        initializeDynamicDocs();
        initEditor(params.id);
        RC = params.RC;
        listPending = RC;
        Session.set('docAct','');
    };
    this.getDocs = function(ended){
        var documents = docs;
        if(docActual){ //actualizo el valor del documento actual.
            docActual.value = editor.getValue();
        }
        if (ended){
            documents = [];
            _(finishDocs).each(function(elem){
               documents.push(
                   new Doc(elem.doc.title,
                           elem.doc.mode,
                           elem.doc.theme,
                           elem.doc.value
                        ));
            });
        }
        return documents;
    };
    this.getDocActual = function(){
        return docActual;
    };
    //start method from a playTime.
    this.update = function(pos){
        //esta es la funcion en la que ejecutare las funciones toDo almacenadas
        //en la lista de reproduccion de eventos del editor
        //filtramos las funciones a aplicar al editor en la pos actual
        var listToDo = (pos)? _(listPending).filter(function(e){return e.time <= parseInt(pos) + 1400;}) : [];
        //ejecutamos las funciones filtradas en el editor
        _(listToDo).each(function(e){
            if (e.type){
                switch(e.type){
                    case 'newDoc':
                        docs.push(new Doc(e.arg[0], 'ace/mode/' + e.arg[1], 'ace/theme/' + e.arg[2]));
                        break;
                    case 'editDoc':
                        _(docs).each(function(doc){
                            if(doc.title == e.arg[0]){
                                doc.title = e.arg[1];
                                doc.mode = "ace/mode/" + e.arg[2];
                                doc.theme = "ace/theme/" + e.arg[3];
                            }
                        });
                        editor.getSession().setMode('ace/mode/' + e.arg[2]);
                        editor.setTheme('ace/theme/' + e.arg[3]);
                        break;
                    case 'session':
                        //no ejecutará cuando la plantilla comienze a renderizarse.
                        if (docActual){ //si ya existia un docActual.
                            docActual.value = editor.getValue(); //guardo su estado antes de cambiar a otro.
                        }
                        docActual = _(docs).find(function(doc){return doc.title == e.arg});
                        Session.set('docAct',docActual); //cambiar la session de docAct.
                        editor.setValue(docActual.value);
                        editor.getSession().setMode(docActual.mode);
                        editor.setTheme(docActual.theme);
                        break;
                }
            }else{
                var func = new Function('editor','arg',e.toDo);
                func(editor, e.arg);
            }
        });

        //actualizamos la lista de funciones a aplicar borrando las que ya se han aplicado.
        listPending = _(listPending).difference(listToDo);
    };

    //method to execute tasks.
    this.seek = function(pos){
        //vaciamos el editor y lo dejamos en estado inicial.
        defaultEditorSettings();
        listPending = RC; //estado inicial.
        initializeDynamicDocs();
        this.update (pos);
    };
};