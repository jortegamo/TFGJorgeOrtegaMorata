var audio;
var interval;
var updatePlayer = function(){
	var d = new Date(audio.currentTime * 1000);
	var min = (d.getMinutes() > 9)? '' + d.getMinutes(): '0' + d.getMinutes();
	var sec = (d.getSeconds() > 9)? '' + d.getSeconds(): '0' + d.getSeconds();
	$('#timer').text(min + ':' + sec);
	$('#seeker').width($('#progress').width());
	var progressVal = 100 * audio.currentTime / audio.duration;
	$('#progress').val(progressVal);
	$('#played-bar').width(($('#progress').width() * progressVal)/100 + 1);
};

Template.record.helpers({
	authorAvatar: function(){
		return Meteor.users.findOne(this.author).avatar;
	},
	username: function(){
		return Meteor.users.findOne(this.author).username;
	},
	dateFrom: function(d){
		return smartDate(d);
	},
	tabNamesArray: function(){
		return [{template: 'commentsTabContent', name: 'comments', icon: 'fa-comments', initialActive: true},
			{template: 'repliesTabContent',    name: 'replies', icon: 'fa-reply'},
			{template: 'relatedTabContent', name: 'related', icon: 'fa-tags'}];
	},
	playing: function(){
		return Session.get('playing');
	},
	hVol:function(){
		return Session.get('audioVolume') === 'hight';
	},
	nVol: function(){
		return Session.get('audioVolume') === 'normal';
	},
	sectionActive: function(){
		return Session.get('currentSection');
	}

});

Template.record.events({
	'click #play': function(){
		$('.touch').addClass('active');
		$('.player-actions').removeClass('active');
		Session.set('playing',true);
		audio.play();
		interval = window.setInterval(updatePlayer,100);
	},
	'click #pause': function(){
		$('.touch').removeClass('active');
		$('.player-actions').addClass('active');
		Session.set('playing',false);
		audio.pause();
	},
	'ended audio': function(){
		$('.touch').removeClass('active');
		$('.player-actions').addClass('active');
		Session.set('playing',false);
		$('#timer').text('00:00');
		$('#progress').val(0);
		$('#played-bar').width(0);
	},
	'click #seeker': function(e){
		audio.currentTime = ($(e.target).val() * audio.duration)/100;
		updatePlayer();
	},
	'click #volume': function(e){
		audio.volume = $(e.target).val()/10;
		if(audio.volume > 0.5){
			Session.set('audioVolume','hight');
		}else if(audio.volume == 0){
			Session.set('audioVolume','mute');
		}else{
			Session.set('audioVolume','normal');
		}
	},

	'click .cover': function(e){
		if($('.touch').hasClass('active')){
			$('.touch').removeClass('active');
			$('#pause').click();
		}else{
			$('.touch').addClass('active');
			$('#play').click();
		}
		$(e.target).find('button').addClass('active');
		window.setTimeout(function(){
			$(e.target).find('button').removeClass('active');
		},500);
	},

	'submit form': function(e){
		e.preventDefault();
		var text = $(e.currentTarget).find('textarea').val();
		if (text){
			var comment = {
				createdAt: new Date(),
				author: Meteor.userId(),
				text: text,
				contextId: this._id,
				replies_count: 0,
				isReply: false
			};
			Meteor.call('insertComment',comment);
			Meteor.call('incrementRecordComment',this._id);
			$(e.currentTarget).find('textarea').val('');
		}
	},
});

Template.record.rendered = function(){
	Session.set('playing',false);
	Session.set('audioVolume','normal');
	audio = document.getElementsByTagName('audio')[0];
	audio.volume = 0.4;
	$('#docs_counter').tooltip({placement: 'left',title: 'docs'});
	$('#comments_counter').tooltip({placement: 'bottom',title: 'comments'});
	$('#votes_counter').tooltip({placement: 'bottom',title: 'votes'});
	$('#replies_counter').tooltip({placement: 'right',title: 'replies'});
};

Template.record.destroyed = function(){
	window.clearInterval(interval);
}

































/*var widget;
var vol;
RC = []; //lista de reproduccion.
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
};

Template.record.helpers({
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

Template.record.events({
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
	'click #title-post .like': function(){
		Records.update(this._id,{$inc: {votes: 1}});
	},
	'click #title-post .dislike': function(){
		Records.update(this._id,{$inc: {votes: -1}});
	},
	'click #publish-comment': function(){
		console.log('he hecho publish');
		var message = $('#input-comment').val();
		$('#input-comment').val(""); //restablezco el valor.
		console.log(this._id);
		if (message != ""){ //si no es nulo lo almaceno.
			var comment = {
				author: Meteor.user().username,
				message: message,
				createAt: new Date(),
				record: this._id,
				replies_count: 0,
				votes: 0
			};
			Records.update(this._id,{$inc: {comments_count: 1}});
			Meteor.call('insertComment',comment,function(err){
				if(err){
					console.log(err.reason);
				}
			});
		}
	}
})

Template.record.rendered = function(){

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

	$('.like').tooltip({
		placement: 'left',
		title: 'like'
	});

	$('.dislike').tooltip({
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
    	showGutter: false,
	});
	


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

Template.commentsList.helpers({
	comments: function(){
		return Comments.find({reply: {$exists: false}},{sort: {createAt: -1}}); //solo los que no son respuesta a otros comentarios.
	}
});
/*
Nota: en el momento en el que cambia la sesion de title act ay que ejecutar lo mismo que en recordSubmit.js cuando se selecciona un nuevo documento.
Nota: en el momento en el que el usuario hace seek deben reestablecerse los documentos al estado inicial. Esto es importante!!!
Nota: si el usuario no da al play y quiere crear una respuesta parte de los documentos en el estado final de la grabación.
Nota: si el usuario termina de ver la grabación y quiere crear respuesta es como si no hubiera dado al play y por tanto parte de 
los documentos en el estado final.
Nota: si el usuario pausa y quiere crear una respuesta parte de los documentos en el estado correspondiente a ese momento de la grabacion.
*/

