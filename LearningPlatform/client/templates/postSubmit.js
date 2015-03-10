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
    }

};

Template.postSubmit.rendered = function(){
	editor = ace.edit("editor");
	editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    //variables de sesión para establecer la configuración multimedia.
    Session.set("cam-enabled",false);
    Session.set("mic-enabled",true);

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


