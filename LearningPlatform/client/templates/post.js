var widget;
var vol;
var RC; //lista de reproduccion.
listPending = []; //lista de funciones pendientes.
docs = []; //array en el que se van a ir actualizando los documentos.
docActual = ""; //titulo del documento actual.
var editor; 
docsStart = []; //documentos en el estado inicial (antes de comenzar la grabacion).

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
		return Session.get('docAct');
	},
	docs_count: function(){
		return this.docs_count;
	},
	arrowDetails: function(){
		return (Session.get('shownDetails')) ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down';
	},
	isReply: function(){
		return this.reply;
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
	},
	'click #showDetails': function(){
		if (Session.get('shownDetails')){
			$('.post-details').hide();
		}else{
			$('.post-details').show();
		}
		Session.set('shownDetails',!Session.get('shownDetails'));
	},
	'click #like': function(){
		Records.update(this._id,{$inc: {votes: 1}});
	},
	'click #dislike': function(){
		Records.update(this._id,{$inc: {votes: -1}});
	},
	'click #publish-comment': function(){
		console.log('he hecho publish');
		var message = $('#input-comment').val();
		$('#input-comment').val("");
	}
})

Template.post.rendered = function(){
	//me subscribo a los documentos de este record.

	console.log(this.data);
	Session.set("playing",false);
	Session.set('finish',false);
	Session.set("docAct","");
	Session.set('sownDetails',false);

	$('.post-details').hide();
	$("#player").hide();
	$("#player").fadeIn(1000);
	$('#myTab a').click(function (e){
  		e.preventDefault()
  		$(this).tab('show')
	});
	$('#votes-count').tooltip({
		placement: 'bottom',
		title: 'votes'
	});

	$('#files-count').tooltip({
		placement: 'left',
		title: 'documents'
	});

	$('#like').tooltip({
		placement: 'left',
		title: 'like'
	});

	$('#dislike').tooltip({
		placement: 'bottom',
		title: 'dislike'
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
    	showGutter: false
	});
	editor.autoIndent = false;


    RC = this.data.RC; //lista de reproducción.
    console.log(RC);
    listPending = RC;
    docsStart = DocumentsByRC.find({start: true}).fetch();

    _(docsStart).each(function(elem){ //copio los documentos.
    	var ndoc = new Doc (elem.doc.title);
    	ndoc.theme = elem.doc.theme;
    	ndoc.mode = elem.doc.mode;
    	ndoc.value = elem.doc.value;
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
	  	if (Session.get('finish')) Session.set('finish',false);
	  });

	  widget.bind(SC.Widget.Events.PAUSE,function(){
	  	Session.set("playing",false);
	  	$('#editor-player').addClass('notPlaying');
	  });

	  widget.bind(SC.Widget.Events.PLAY_PROGRESS,function(){
	  	widget.getPosition(function(pos){
	  		playProgress(pos);
	  	})
	  });

	  widget.bind(SC.Widget.Events.FINISH,function(){
	  	console.log('se ha terminado la reproduccion');
	  	Session.set('finish',true);
	  	seek();
	  })

	  widget.bind(SC.Widget.Events.SEEK,function(){
	  	console.log("el usuario ha hecho seek");
	  	widget.pause();
	  	widget.getPosition(function(pos){
	  		seek(pos);
	  	});
	  });

	  widget.bind(SC.Widget.Events.ERROR,function(){
	  	alert("ha abido un error al cargar el widget!")
	  });

    });

    function playProgress(pos){
		//esta es la funcion en la que ejecutare las funciones toDo almacenadas 
		//en la lista de reproduccion de eventos del editor
		console.log("voy a ejecutar en el editor!");

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
							console.log('cambio el documento');
							Session.set('docAct',e.arg); //cambiar la session de docAct.
							//no ejecutará cuando la plantilla comienze a renderizarse.
							if (docActual){ //si ya existia un docActual.
								docActual.value = editor.getValue(); //guardo su estado antes de cambiar a otro.
							}
							docActual = _(docs).find(function(doc){return doc.title == e.arg});
							console.log(docActual);
							editor.setValue(docActual.value);
							editor.getSession().setMode(docActual.mode);
							editor.setTheme(docActual.theme);
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
	    listPending = RC; //estado inicial.
	    docs = [];
	    docActual = "";
	  	Session.set('docAct',"");

	  	_(docsStart).each(function(elem){ //copio los documentos.
    		var ndoc = new Doc (elem.doc.title);
    		ndoc.theme = elem.doc.theme;
    		ndoc.mode = elem.doc.mode;
    		ndoc.value = elem.doc.value;
    		docs.push(ndoc);
    	});

	  	if (!Session.get('finish')){
	    	playProgress (pos);
	    }
	}
};

/*
Nota: en el momento en el que cambia la sesion de title act ay que ejecutar lo mismo que en postSubmit.js cuando se selecciona un nuevo documento.
Nota: en el momento en el que el usuario hace seek deben reestablecerse los documentos al estado inicial. Esto es importante!!!
Nota: si el usuario no da al play y quiere crear una respuesta parte de los documentos en el estado final de la grabación.
Nota: si el usuario termina de ver la grabación y quiere crear respuesta es como si no hubiera dado al play y por tanto parte de 
los documentos en el estado final.
Nota: si el usuario pausa y quiere crear una respuesta parte de los documentos en el estado correspondiente a ese momento de la grabacion.
*/
