// screen size test용
// var box = document.createElement("div");
// var txt = document.createTextNode("size:");
// var span = document.createElement("span");
// box.className="screensize";
// span.className="size";
// box.appendChild(txt);
// box.appendChild(span);
// document.body.appendChild(box);
// $(function(){
// 	var dd = ()=>{$(".size").text(window.innerWidth)}
// 	dd(); $(window).resize(dd);
// })
// test용 end
var getTextLength = function(str) {
	var len = 0;
	for (var i = 0; i < str.length; i++) {
		if (escape(str.charAt(i)).length == 6) len++;
		len++;
	}
	return len;
}
function validateUI(val,obj,text){
	var result = JSON.parse(val);
	obj.parent().removeClass('fail pass');
	if(result)
		obj.parent().addClass("pass").find("p").text(text);
	else
		obj.parent().addClass("fail").find("p").text(text);
}	
var popps = [], serialNum=0; // for 팝업 스크롤 객체 
function openPop(pop){
	var	popup = $("#"+pop);
	if(!popup.hasClass('popup2')){
		var dim = document.querySelector('.dim');
		if($('.dim').length==0) {
			dim= document.createElement("div");
			dim.className="dim";
			dim.onclick=function(){
				$(".popup,.dim").fadeOut();
				document.body.removeChild(dim);
				if($("body").hasClass("openpop"))
					$("body").removeClass("openpop");
			};
			document.body.appendChild(dim);
		}
		if(!popup.hasClass('popup3')){
			var w = (popup.width()/2);
			var h = (popup.height()/2);
			popup.css({
				marginTop:"-"+h +"px",
				marginLeft:"-"+w +"px"
			}).fadeIn();
		}
		else popup.fadeIn();
		$("body").addClass("openpop");
	}else{
		$(".popup").hide();
		if($('.dim').length>0) 
			document.body.removeChild(document.querySelector('.dim'));
		$(".popup2:not(#"+pop+")").each(function(){
			if($(this).is(':visible')) $(this).hide();
		});
		popup.fadeIn();
		$("body").addClass("openpop2");
		$(document).scrollTop(0);
	}
	
	if($(".popup.popup-slide").is(':visible')){
		var swiper = new Swiper('.pop-slide-wrap', {
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			}
		});
	}
	
}
function closePop(pop){
	var	popup = $("#"+pop);
	popup.fadeOut();
	var isPopup = false;
	$(".popup:not(#"+pop+")").each(function(){
		if($(this).is(':visible')){
			isPopup = true;
			return false;
		}
	});
	if(popup.hasClass('popup2')) $(".popup2").hide();
	$(".popup2:not(#"+pop+")").each(function(){
		if($(this).is(':visible')){
			isPopup = true;
			if($('.dim').length>0) 
				document.body.removeChild(document.querySelector('.dim'));
			if($("body").hasClass("openpop"))
				$("body").removeClass("openpop");
			return false;
		}
	});
	if(!isPopup) {
		if($('.dim').length>0) 
			document.body.removeChild(document.querySelector('.dim'));
		if($("body").hasClass("openpop"))
			$("body").removeClass("openpop");
		if($("body").hasClass("openpop2"))
			$("body").removeClass("openpop2");
	}
}
$(function () {
	$('.btn-nav').click(function(){
		$('body').addClass('open');
	});
	$('.btn-nav-close').click(function(){
		$('body').removeClass('open');
	});
	$('.gnb_wrapper .mask').click(function(){
		$('body').removeClass('open');
	});
	$('.btn-top').click(function(){
		$(document).scrollTop(0);
	});
	$("header .inner_wrapper .gnb > li:has(ul)").hover(function(){
		$("header").toggleClass("open");
	});
	$(".popup .btn-close,.popup2 .btn-close").click(function(){
		var popup = $(this).parent().parent().attr('id');
		closePop(popup);
	});
	$(".popup-phone .input-box input").keyup(function(){
		var val = $(this).val();
		if( val.length > 9) $(".popup-phone").has($(this)).find(".btn").prop("disabled",false);
	});
	$(".allchk").click(function(){
		var val = $(this).find('input').is(":checked");
		var name = $(this).find('input').attr('name');
		if(val) $("input[name="+name+"]").prop("checked",false);
		else $("input[name="+name+"]").prop("checked",true);
	});
	$(".chk-box:not(.allchk,.text)").click(function(){
		var val = $(this).find('input').is(":checked");
		var name = $(this).find('input').attr('name');
		if(!val) $(".allchk input[name="+name+"]").prop("checked",false);
	});	
	$(".input-box input,.textarea-box textarea").each(function(){
		var val = $(this).val();
		if( val== "" || val == null) $(this).prev().show();
		else $(this).prev().hide();
	}).focus(function(){
		if($(this).is('[readonly]')) return false;
		 $(this).prev().hide();
	}).blur(function(){
		if($(this).is('[readonly]')) return false;
		var val = $(this).val();
		if( val== "" || val == null) $(this).prev().show();
		else $(this).prev().hide();
	});
	var isEvent = false;
	$(".input-box.counter input,.textarea-box textarea").each(function(){
		var val = $(this).val();
		$(this).next().find(".byte").text(getTextLength(val));
	}).on('keydown',function(){
		if(isEvent)return;
		isEvent = true;
		var $this = $(this);
		var val = $this.val();
		var counter = $this.next().find(".byte");
		var limit = counter.data('limit');

		var num = getTextLength(val);
			if(limit != undefined) {
				if(num > limit) {
					var len = 0, limitLen = 0;
					for (var i = 0; i < val.length; i++) {
						if (escape(val.charAt(i)).length == 6) len++;
						len++;
						if(len <= limit) limitLen++;
					}
					setTimeout(function(){
						$this.val(val.substr(0,limitLen));
					},200);
					num = limit;
					alert('최대 '+limit+'byte의 글자까지 사용 가능 합니다.');
				}
			}	
			counter.text(num);
		setTimeout(function(){
			isEvent = false;
		},200);
	});
	$(".tab li a").click(function(){
		$(".tab li").removeClass("on");
	
		$(this).parent().addClass("on");
		var index= $(".tab li").index($(this).parent());
		 if($(this).has(".radio-box")){
			$(".tab li a").find(".radio-box input").prop("checked",false);
			 $(this).find(".radio-box input").prop("checked",true);
		 }
		 if($(".tab-con").eq(index) != null)
			 $(".tab-con").hide().eq(index).show();
	});
	// 동적 탭 슬라이딩
	var tabmenu = null;
	if(tabmenu == null) {
		tabmenu= new Swiper('.tabslide',{
			slidesPerView:'auto',
			navigation: false,
			pagination: false,
		});
		$('.tabslide').find('li').each(function(i){
			if($(this).hasClass('on')) tabmenu.slideTo(i)
		});
	}else if( tabmenu != null){
		tabmenu.destroy(true);
		tabmenu =null;
	}

	// 210114 추가 및 수정 start
	//별 
	$(".starBox").each(function(){
		var child = $(this).find('span'),
			childval = $(this).find('input').val();
		switch(childval){
			case '0.5': child.attr('class','ico ico-star half'); break;
			case '1': child.attr('class','ico ico-star n1'); break;
			case '1.5': child.attr('class','ico ico-star n1 half'); break;
			case '2': child.attr('class','ico ico-star n2'); break;
			case '2.5': child.attr('class','ico ico-star n2 half'); break;
			case '3': child.attr('class','ico ico-star n3'); break;
			case '3.5': child.attr('class','ico ico-star n3 half'); break;
			case '4': child.attr('class','ico ico-star n4'); break;
			case '4.5': child.attr('class','ico ico-star n4 half'); break;
			case '5': child.attr('class','ico ico-star n5'); break;
		}
	});
	$(".starBox").on('click dragend',function(e){
		var width = $(this).width();
		var step = $(this).width()/5;
		var pos = e.clientX - $(this).offset().left;
		var rule = step*0.3;
		var child = $(this).find('span');
		var childval = $(this).find('input');
		if(childval.val().length > 0) child.attr('class','');
		if(pos > 0 && pos <= step){
			if(pos<=rule) {
				child.attr('class','ico ico-star half');
				childval.val('0.5');
			}
			else {
				child.attr('class','ico ico-star n1');
				childval.val('1');
			}
		}else if(pos > 0 && pos <= (step*2)){
			pos -= step
			if(pos<=rule) {
				child.attr('class','ico ico-star n1 half');
				childval.val('1.5');
			}
			else{
				child.attr('class','ico ico-star n2');
				childval.val('2');
			}
		}else if(pos > 0 && pos <= (step*3)){
			pos -= (step*2);
			if(pos<=rule) {
				child.attr('class','ico ico-star n2 half');
				childval.val('2.5');
			}
			else {
				child.attr('class','ico ico-star n3');
				childval.val('3');
			}
		}else if(pos > 0 && pos <= (step*4)){
			pos -= (step*3);
			if(pos<=rule) {
				child.attr('class','ico ico-star n3 half');
				childval.val('3.5');
			}
			else {
				child.attr('class','ico ico-star n4');
				childval.val('4');
			}
		}else if(pos > 0 && pos <= width){
			pos -= (step*4);
			if(pos<=rule) {
				child.attr('class','ico ico-star n4 half');
				childval.val('4.5');
			}
			else{
				child.attr('class','ico ico-star n5');
				childval.val('5');
			}
		}
	});
	// 210114 추가 및 수정 end
	// selectbox ui
	$('.select-box').each(function(){
		var box = $(this).find('select');
		var val = box.val();
		var opt = box.find('option:selected').val();
		var txt = box.find('option:selected').text();
		if(val==opt){
			if(box.find('option:selected').data('percent') != undefined) 
				txt = '<span>['+box.find('option:selected').data('percent')+'%]</span>'+box.find('option:selected').data('name')
			$(this).addClass('on').find('label').html(txt);
		}		
	});
	$('.select-box select').change(function(){		
		var txt = $(this).find('option:selected').text();
		if($(this).find('option:selected').data('percent') != undefined) 
			txt = '<span>['+$(this).find('option:selected').data('percent')+'%]</span>'+$(this).find('option:selected').data('name');
		$(this).parent().addClass('on').find('label').html(txt);
	});
	function finishTop(){
		//var totalHeight = $('footer').offset().top - $(window).height();
		var height = $(window).height();
		var sc = $(window).scrollTop();
		if(sc > 1 ) $('.btn-top-area .btn-top').fadeIn();
		else $('.btn-top-area .btn-top').fadeOut();
	}
	
	$(window).on('scroll', finishTop);
});