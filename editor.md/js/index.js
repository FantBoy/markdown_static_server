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
    
    //GetHistoryDrafts(0);
    var indexMarkdownEditor;
    
    $.get('./blog_default.md', function(md){
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

    $('#site_type').bind('change', function(){
    	GetHistoryDrafts();
    });
    
    $('#article_type').bind('change', function(){
        GetHistoryDrafts();
    });    
    
    $("#up-md-btn").bind('click', function(){
 	PostArticle(0);
    });
    
    $("#upandrelease-md-btn").bind('click', function(){
	PostArticle(1);
    });

    $("#history_draft").bind('change', function(){
    	var articel_index = $("#history_draft").get(0).selectedIndex;
        if(0 != articel_index)
	{
            var article_name = $("#history_draft").val();
            $.get(article_name, function(md){
                indexMarkdownEditor.setMarkdown(md);
            });
	}
    });    

    function PostArticle(post_type)
    {
                var site_type_index = $("#site_type").get(0).selectedIndex;
                var article_type_index = $("#article_type").get(0).selectedIndex;
		var articel_index = $("#history_draft").get(0).selectedIndex;
                if(0 == site_type_index || 0 == article_type_index)
                {
		    alert("please select site_type and article_type!");
                }
		else if(0 == articel_index && 2 != article_type_index)
		{
		    alert("new article must post to draft_type!");
		}
		else
		{
        		console.log(site_type_index);                
			var site_type = $("#site_type").val();
			var article_type = $("#article_type").val();
			var article_name = $("#history_draft").val();
			if(0 == articel_index)
			{
			    article_name = '';
			}
                        var md_data = indexMarkdownEditor.getMarkdown();
        		$.post("http://bearboyxu.cn:3000/upload/postmd?type=addmd",
        		    {
        			site_type: site_type,
				article_type: article_type,
				article_name: article_name,
				post_type: post_type, // 0 upload, 1 upload and release
        			md_data: md_data
        		    },
        		    function(data,status){
        			alert("数据：" + data + "\n状态：" + status);
          		});
		}
    }
   
    function GetHistoryDrafts()
    {

	$('#history_draft').children().remove();
        var article_type_index = $("#article_type").get(0).selectedIndex;
        var site_type_index = $("#site_type").get(0).selectedIndex;

        if(0 == site_type_index || 0 == article_type_index)
        {
            $('#history_draft').append('<option>新建草稿</option>');
            $("#history_draft").get(0).selectedIndex = 0;
        }
        else
        {
            $('#history_draft').append('<option>新建草稿</option>');
            var site_type = $("#site_type").val();
            var article_type = $("#article_type").val();

            var url = "http://bearboyxu.cn:3000/upload/gethistorydrafts?site_type=" + site_type + "&article_type=" + article_type; 
    	    $.get(url, function(data, status){
	    	//alert(data['drafts']);
	    	//$("#select_id").append("<option value='Value'>Text</option>"); 
	    	res_data = JSON.parse(data);
                $.each(res_data['articles'], function( index, val ){
	   	    $("#history_draft").append("<option value='" + val + "'>" + val + "</option>");	
	    	});


	    });
   	}
        if(1 == site_type_index)
	    ReloadMD('blog_default.md');
        else if(2 == site_type_index)
	    ReloadMD('wiki_default.md');
    }
    
    function ReloadMD(filename)
    {
        $.get(filename, function(md){
            indexMarkdownEditor.setMarkdown(md);
        });
    }
});
