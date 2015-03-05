Template.postSubmit.rendered = function(){
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");

    $('#config-editor-button').popover({
    	content: "hola",
    	trigger: "click",
    	placement: "right"
    });

    $('#multmedia-config').popover({
    	content: "panel para configurar el micro y la cam",
    	trigger: "click",
    	placement: "top"
    });

    $('#help-button').popover({
    	content: "panel que muestra la ayuda",
    	trigger: "click",
    	placement: "right"
    });
}