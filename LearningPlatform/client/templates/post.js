var widget;
var vol;
Template.post.helpers({
	track: function(){
		return "https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F"+ 197361868 +"&show_artwork=false&show_comments=false"
	},
	notPlaying: function(){
		return !Session.get("playing");
	},
	title: function(){
		return "Titulo del post"
	}
});

Template.post.events({
	'click #play-button': function(e){
		e.preventDefault();
		widget.play();
	},
	'click #editor-player': function(e){
		(Session.get("playing"))? widget.pause() : widget.play(); 
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
	Session.set("playing",false);
	$("#player").hide();
	$("#player").fadeIn(1000);
	$('#myTab a').click(function (e) {
  		e.preventDefault()
  		$(this).tab('show')
	});
	editor = ace.edit("editor-player");
	editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setShowPrintMargin(false);
    editor.setReadOnly(true)

	var widgetIframe = document.getElementById('sc-widget'),
        
        newSoundUrl = 'http://api.soundcloud.com/tracks/13692671';
        widget      = SC.Widget(widgetIframe);
        //197361868
    widget.bind(SC.Widget.Events.READY, function() {
      // load new widget
      /*console.log("hola");
      widget.load(newSoundUrl, {
          show_artwork: false
      });*/
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
	  })
    });
}
