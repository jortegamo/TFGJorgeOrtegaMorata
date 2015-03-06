Template.postSubmit.rendered = function(){
	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");

    //variables de sesión para establecer la configuración multimedia.
    Session.set("cam-enabled",false);
    Session.set("mic-enabled",true);

    $('#config-editor-button').popover({
    	content: Blaze.toHTML(Template.configEditor),
        html: true,
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
    	trigger: "click",
    	placement: "right"
    });

    $('#config-editor-button').click(function(){
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
    });

    

    $('#multmedia-config').popover({
    	content: Blaze.toHTML(Template.configMultimedia),
        html: true,
    	trigger: "click",
    	placement: "top"
    });

    $('#multmedia-config').click(function(){
        $("#micro-button").click(function(){
            if ($(this).hasClass('btn-success')){
                $(this).removeClass('btn-success').addClass('btn-danger');
                Session.set("mic-enabled",false);
            }else{
                $(this).removeClass('btn-danger').addClass('btn-success');
                Session.set("mic-enabled",true);
            }
        });

        $("#cam-button").click(function(){
            if ($(this).hasClass('btn-success')){
                $(this).removeClass('btn-success').addClass('btn-danger');
                Session.set("cam-enabled",false);
            }else{
                $(this).removeClass('btn-danger').addClass('btn-success');
                Session.set("cam-enabled",true);
            }
        });
    });

    $('#help-button').popover({
    	content: Blaze.toHTML(Template.heopInfoRecord),
    	html: true,
        trigger: "click",
    	placement: "right"
    });
}
