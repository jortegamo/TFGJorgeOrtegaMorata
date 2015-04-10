var widget;
var vol;
var RC;
var listPending = [];
var docs = [];
var docActual;
var editor;

var Doc = function(title){
    this.title = title;
    this.mode = "ace/mode/javascript"; //por defecto
    this.theme = "ace/theme/twilight"; //por defecto
    this.value = "";
}

Template.post.helpers({
	track: function(){
		return "https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F"+ this.track_id +"&show_artwork=false&show_comments=false"
	},
	notPlaying: function(){
		return !Session.get("playing");
	},
	title: function(){
		return this.title;
	},

	docAct: function(){
		return Session.get('titleAct');
	}
});

Template.post.events({
	'click #play-button': function(e){
		e.preventDefault();
		widget.play();
	},
	'click #up-volume': function(){
		widget.getVolume(function(volume){
			if (volume < 1) widget.setVolume(volume+0.05)
		});
	},
	'click #down-volume': function(){
		widget.getVolume(function(volume){
			if (volume > 0) widget.setVolume(volume-0.05)
		});
	},
	'click #mute-volume': function(){
		widget.getVolume(function(volume){
			if (vol){
				widget.setVolume(vol);
				vol = null;
			}else{
				widget.setVolume(0);
				vol = volume;
			}
		});
	},
	'click #help': function(){
		if (Session.get("playing")) widget.pause();
	}
})

Template.post.rendered = function(){

	console.log(this.data);
	Session.set("playing",false);
	Session.set("titleAct","");

	$("#player").hide();
	$("#player").fadeIn(1000);
	$('#myTab a').click(function (e){
  		e.preventDefault()
  		$(this).tab('show')
	});

	//inicializo el editor por defecto y en readOnly.
	editor = ace.edit("editor-player");
	editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setShowPrintMargin(false);
    editor.container.style.pointerEvents="none";
	editor.setOptions({
    	readOnly: true,
    	showFoldWidgets: false,
	});

    RC = this.data.RC; //lista de reproducción.
    console.log(RC);
    listPending = [];
    var docsStart = this.data.docsStart;

    _(docsStart).each(function(doc){ //copio los documentos.
    	var ndoc = new Doc (doc.title);
    	ndoc.theme = doc.theme;
    	ndoc.mode = doc.mode;
    	docs.push(ndoc);
    });

	var widgetIframe = document.getElementById('sc-widget'),
        
        newSoundUrl = 'http://api.soundcloud.com/tracks/13692671';
        widget      = SC.Widget(widgetIframe);

    widget.bind(SC.Widget.Events.READY, function() {

      widget.bind(SC.Widget.Events.FINISH, function() {
        Session.set("playing",false);
        $('#editor-player').addClass('notPlaying');
      });

	  widget.bind(SC.Widget.Events.PLAY,function(){
	  	Session.set("playing",true);
	  	$('#editor-player').removeClass('notPlaying');
	  });

	  widget.bind(SC.Widget.Events.PAUSE,function(){
	  	Session.set("playing",false);
	  	$('#editor-player').addClass('notPlaying');
	  });

	  widget.bind(SC.Widget.Events.PLAY_PROGRESS,function(){
	  	widget.getPosition(function(pos){
	  		//console.log(pos);
	  		playProgress(editor,pos);
	  	})
	  });

	  widget.bind(SC.Widget.Events.SEEK,function(){
	  	console.log("el usuario ha hecho seek");
	  	widget.getPosition(function(pos){
	  		seek(editor,pos);
	  	});
	  });

	  widget.bind(SC.Widget.Events.ERROR,function(){
	  	alert("ha abido un error al cargar el widget!")
	  });

    });

    function playProgress(pos){
		//esta es la funcion en la que ejecutare las funciones toDo almacenadas 
		//en la lista de reproduccion de eventos del editor
		//console.log("voy a ejecutar en el editor!");
		//en RC tengo la lista de reproducción.
		if(listPending.length == 0) listPending = RC; 

		//filtramos las funciones a aplicar al editor en la pos actual
		var listToDo = _(listPending).filter(function(e){
			return e.time <= pos + 1400;
		});

		//ejecutamos las funciones filtradas en el editor
		_(listToDo).each(function(e){
			if (e.arg){
				if (e.type){ //todas las funciones con un tipo definido llevan argumento.
					switch(e.type){
						case 'docs':
							var func = new Function('docs','arg',e.toDo); //crear un nuevo doc
							func(docs,e.arg);
							break;
						case 'session':
							var func = new Function('arg',e.toDo); //cambiar la session de titleAct.
							func(arg);
							break;
					}
				}else{
					var func = new Function('editor','arg',e.toDo);
					func(editor,e.arg);
				}
			}else{
				var func = new Function('editor',e.toDo);
				func(editor);
			}
		});

		//actualizamos la lista de funciones a aplicar borrando las que ya se han aplicado.
		listPending = _(listPending).difference(listToDo);
	}

	function seek(pos){
		//vaciamos el editor y lo dejamos en estado inicial.
		editor.setValue("");
		editor.setTheme("ace/theme/twilight");
	    editor.getSession().setMode("ace/mode/javascript");
	    listPending = []; //estado inicial.
	    docs = [];
	    
	    _(docsStart).each(function(doc){ //documentos en estado inicial.
    		var ndoc = new Doc (doc.title);
    		ndoc.theme = doc.theme;
    		ndoc.mode = doc.mode;
    		docs.push(ndoc);
    	});

	    playProgress (pos);
	}
};

Tracker.autorun(function(){ //tracker para aplicar cambios de tema y modo en el editor cuando se cambia de documento.
	var title = Session.get("titleAct");
	if (title){ //no ejecutará cuando la plantilla comienze a renderizarse.
		if (docActual){ //si ya existia un docActual.
			docActual.value = editor.getValue(); //guardo su estado antes de cambiar a otro.
		}
		docActual = _(docs).find(function(doc){return doc.title == title});
		editor.setValue(docActual.value);
		editor.getSession().setMode(docActual.mode);
		editor.setTheme(docActual.theme);
	}
});

/*
Nota: en el momento en el que cambia la sesion de title act ay que ejecutar lo mismo que en postSubmit.js cuando se selecciona un nuevo documento.
Nota: en el momento en el que el usuario hace seek deben reestablecerse los documentos al estado inicial. Esto es importante!!!
Nota: si el usuario no da al play y quiere crear una respuesta parte de los documentos en el estado final de la grabación.
Nota: si el usuario termina de ver la grabación y quiere crear respuesta es como si no hubiera dado al play y por tanto parte de 
los documentos en el estado final.
Nota: si el usuario pausa y quiere crear una respuesta parte de los documentos en el estado correspondiente a ese momento de la grabacion.
*/
