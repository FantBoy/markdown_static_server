$(function() {
        
    $('a[href*=#]').bind(editormd.mouseOrTouch("click", "touchend"), function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
            location.hostname == this.hostname) 
        {
            var hash = this.hash;
            var target = $(hash);
            target = target.length && target || $('[name=' + hash.slice(1) + ']');

            if (target.length) {
                var offsetTop = target.offset().top;
                $('html,body').animate({scrollTop: offsetTop}, 800);

                return false;
            }
        }
    });

    $('a').click(function() {
        $(this).blur();
    }); 
    
    var goToTop = $("#go-to-top");
    
    $(window).scroll(function(){
        var top = $(this).scrollTop();
        
        if (top > 180) {
            goToTop.fadeIn();
        } else {
            goToTop.fadeOut();
        }
    });
    
    GetHistoryDrafts();
    var indexMarkdownEditor;
    
    $.get('./index.md', function(md){
        indexMarkdownEditor = editormd("index-editormd", {
            height           : 820,
            autoHeight : true,
            markdown         : md,
            tex              : true,
            tocm             : true,
            emoji            : true,
            taskList         : true,
            codeFold         : true,
            searchReplace    : true,
            htmlDecode       : "style,script,iframe",
            flowChart        : true,
            sequenceDiagram  : true,
            onfullscreen : function() {
                this.editor.css("border-radius", 0).css("z-index", 120);
            },
            onfullscreenExit : function() {
                this.editor.css({
                    zIndex : 10,
                    border : "none",
                    "border-radius" : "5px"
                });
                
                this.resize();
            }
        });
    });
    
    $("#get-md-btn").bind('click', function(){
                var site_type_index = $("#site_type").get(0).selectedIndex;
                var article_type_index = $("#article_type").get(0).selectedIndex;
                if(0 == site_type_index || 0 == article_type_index)
                {
		    alert("please select site_type and article_type!");
                }
		else
		{
        		console.log(site_type_index);                
			var site_type = $("#site_type").val();
			var article_type = $("#article_type").val();
                        var md_data = indexMarkdownEditor.getMarkdown();
        		$.post("http://bearboyxu.cn:3000/upload/postmd?type=addmd",
        		    {
        			site_type: site_type,
				article_type: article_type,
        			md_data: md_data
        		    },
        		    function(data,status){
        			alert("数据：" + data + "\n状态：" + status);
          		});
		}
            });

    function GetHistoryDrafts(){
        
    	$.get("http://bearboyxu.cn:3000/upload/gethistorydrafts", function(data, status){
		//alert(data['drafts']);
		//$("#select_id").append("<option value='Value'>Text</option>"); 
		res_data = JSON.parse(data);
		console.log(res_data['drafts']);
                $.each(res_data['drafts']['BLOG'], function( index, val ){
			var text = "[BLOG] " + val;
			$("#history_draft").append("<option value='" + val + "'>" + text + "</option>");	
		});

                $.each(res_data['drafts']['WIKI'], function( index, val ){
			var text = "[WIKI] " + val;
			$("#history_draft").append("<option value='" + val + "'>" + text + "</option>");	
		});

	});
    }
});
