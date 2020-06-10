
var closeMenu = function(param){
					if(param != 1) $('.logo').fadeIn('slow');
					$('.layout-body').animate({"left": "0"}, '500').removeClass('shifted');
						$('#drop-menu').fadeOut(500);
//					$('.layout-body').animate({"z-index": "6", "opacity":"1"}, '500').removeClass('shifted');
					$('#header-fixed').animate({"left": "0"}, '500').removeClass('shifted');
					return false;
				}
				
var openMenu = function(param)
{
	$('.layout-body').animate({"left": "-300px"}, '500').addClass('shifted');
	$('#drop-menu').fadeIn(500);
//	$('.layout-body').animate({"z-index": "-1", "opacity":"0.5"}, '500').addClass('shifted');
	$('#header-fixed').animate({"left": "-300px"}, '500').removeClass('shifted');
}


function refreshGif(element){
	var $el = $(element);
	//if(! $.browser.webkit){
		refreshGifByElement($el);
	//}
}

function refreshGifByElement($el){
	var gifSource = $el.attr('src'); //get the source in the var
	var questionInd = gifSource.indexOf('?');
	var url = gifSource;
	
	if(questionInd>0){
		url = gifSource.substring(0, gifSource.indexOf('?'));	
	}
	
	url = url + '?refresh=' + new Date().getTime();
    $el.attr('src', url);
}

function refreshAllGifs(){
	var cachedGifs=$("img[src$='.gif']");
	
	$.each(cachedGifs, function(key, element){
				refreshGif(element);
			});			
}


function refreshGifCoupleWithDelay(gif1, gif2, delay){
			 refreshGifByElement(gif1);
			 setTimeout(function(){
					refreshGifByElement(gif2);
			 }, delay);
}

/*----------- Object Rotation ------------*/
var refreshRotation;
function rotation (rotatedElement, speed) {
	var angle = 0;
	refreshRotation = setInterval(function(){
		angle+=3;
		jQuery(rotatedElement).rotate(angle);
	}, speed);
	
	return refreshRotation;
}

		
$(function(){

    hljs.configure({
        languages:['json','javascript']
    });
    hljs.initHighlighting();

		var browserHeight = $(window).height();
		var browserWidth = $(window).width();
		
		/*------------------- offsets  -----------------------*/
		var animationHeight1 = browserHeight - 200; 
		var animationHeight2 = browserHeight - 240; 
		var animationHeight3 = browserHeight - 300; 
		var animationHeight4 = browserHeight - 350; 
		
		
		/*---------------------------------------- PAGE HOME ----------------------------------------*/
			
			/*---------------------------  animation Feather and Screen ---------------------------*/
			var startAnimation1 = false;
			
			$('#homeAnimate1').waypoint(function() {
				if(!startAnimation1) {
					startAnimation1 = true;
					
					function animateFeatherRotate5(angleRotate){
						$("#animate-feather").rotate({animateTo:angleRotate, duration: 800});
					};
					
					function animateFeather4(){
						$("#animate-feather").animate({left: "-10px", top: "110px"}, 400, animateFeatherRotate5(-30));
					};
					
					function animateFeatherRotate3(angleRotate){
						$("#animate-feather").rotate({animateTo:angleRotate, duration: 500, callback:animateFeather4});
					};
					
					function animateFeather3(){
						$("#animate-feather").animate({left: "-50px", top: "85px"},400, animateFeatherRotate3(-10));
					};
					
					function animateFeatherRotate2(angleRotate){
						$("#animate-feather").rotate({animateTo:angleRotate, duration: 500,  callback:animateFeather3}); 
					};
					
					function animateFeather2(){
						$("#animate-feather").animate({left: "10px", top: "60px"}, 400);
						animateFeatherRotate2(-30);
					};
					
					function animateFeatherRotate1(angleRotate){
						$("#animate-feather").rotate({animateTo:angleRotate,  duration: 500, callback:animateFeather2});
					};
					
					function animateFeather1(){
						animateFeatherRotate1(-10);
						$("#animate-feather").animate({left: "-70px", top: "40px"}, 500);
					};
					
					$("#animate-feather").animate({left: '10px', top: "23px"}, 500, animateFeather1);
					$("#animate-feather").rotate({animateTo:-30, duration: 1000});
				}
				
				$("#iphon").animate({top: "40px"}, 2500);
				$("#screen").animate({right: "23px"}, 2500);
				$("#mobile").animate({bottom: "0"}, 2500);
			
			}, {offset: animationHeight1});
			
		/*---------------------------  animation Pulsar ----------------------------*/
			var startAnimation2 = false;
			var $pulsar = $(".animation-map > .pulsar");
			var interval;
			var animate = function () {
						$pulsar.fadeOut(200, function () {
								$pulsar.fadeIn(400);
						});
				}
			$('#homeAnimate2').waypoint(function() {				
				$('.animation-map').hover(function(){
					interval = setInterval(animate, 600);
				},
				function(){
					clearInterval(interval);
				});
				
				if(!startAnimation2) {
				
					startAnimation2 = true;
					function animateHande2(){
						$("#circle").animate({opacity: 0}, 500, animateHande2);
						$(".hand").animate({bottom: "40px"}, 500 );
						$pulsar.fadeIn('1000');
					};
					function animateHande1(){
						$("#circle").animate({opacity: 1}, 1000, animateHande2);
					};
					
					$('.hand').animate({bottom: "65px"}, 1000, animateHande1);
					
				}
			
			}, {offset: animationHeight1});
			
			$('#homeAnimate3').hover(function(){
				var element = $('#animation-arows');

				rotation(element, 20);
				
			}, function(){
				clearInterval(refreshRotation);
			});
			
		/*------------- Animation gif at page Home block "Our Technology" -------------*/
			var listGifAnimate = false;
				
				if(browserWidth>1000){
						$('#listGifAnimate > li.waypoint-trigger').waypoint(function() {
								var gif1 = $(this).find(".images > img");
								var gif2 = $(this).next("li").find(".images > img");
								refreshGifCoupleWithDelay(gif1, gif2, 1200);
							
						}, {offset: animationHeight1});
				}else{
						$('#listGifAnimate > li').waypoint(function() {
							if(!listGifAnimate){
								listGifAnimate = true;
								var gif1 = $(this).find(".images > img");
								refreshGifByElement(gif1);
							}
						}, {offset: animationHeight1});
				}
			
			
		/*----------- Page Home block "See How We Can Work With You" ------------*/
			$('.small-list > li').hover(function(){
				$(this).find('.images').find('.img-hover').fadeIn('slow');
				$(this).find('.images').find('.img').css('display','none');
				$(this).find('.description').css('display','none');
				$(this).find('.description-hover').fadeIn('slow');
			},function(){
				$(this).find('.images').find('.img').fadeIn('slow');
				$(this).find('.images').find('.img-hover').css('display','none');
				$(this).find('.description-hover').css('display','none');
				$(this).find('.description').fadeIn('slow');
				
			});
			
		/*-------------------------------------- Gallery Product Lines -------------------------------*/
			$('.gallery-holder').css('display', 'block');
			$('.gallery-products').jcarousel({ scroll: 1, wrap: 'both' });
			
		/*----------------------------------------------------------------------------------------------------*/
		
		/*------------------ Animation gif at page About block "Thanks"  -------------------*/
			var thankAnimation = false;
			$('#thanks').waypoint(function() {
				if(!thankAnimation) {
					thankAnimation = true;
					refreshGif('#thanks');
				}
			}, {offset: animationHeight3});
		
			$('.map').waypoint(function() {
				refreshGif('#map-gif');
			}, {offset:400});
			
		/*----------------------------------------------------------------------------------------------------*/
		
		/*------------------ Animation gif at page Features  -------------------*/
			
			var brainAnimation = false;
			$('#imgBrain-gif').waypoint(function() {
				console.log('refreshed gif')
				if(!brainAnimation) {
					brainAnimation = true;
					refreshGif('#imgBrain-gif');
				}
			}, {offset: animationHeight2});
			
			var mexicanGif = false;
			$('#mexican-gif').waypoint(function() {
					if(!mexicanGif) { 
						mexicanGif = true;
						refreshGif('#mexican-gif');
					}
			}, {offset: animationHeight2});
			
			var mobileAniation = false;
			$('#mobile-gif').waypoint(function() {
				if(!mobileAniation) { 
					mobileAniation = true;
					refreshGif('#mobile-gif');
				}
			}, {offset: animationHeight2});
			
			var usersAnimation = false;

			if(browserWidth>1000){
				$('.keep-users > li.waypoint-trigger').waypoint(function() {
					if(!usersAnimation) {
						usersAnimation = true;
						var gif1 = $(this).find(".image > img");
						var gif2 = $(this).next("li").find(".image > img");
						refreshGifCoupleWithDelay(gif1, gif2, 1200);
					}
				}, {offset: animationHeight4});
			}else{
				usersAnimation = true;
				$('.keep-users > li').waypoint(function() {
					if(!usersAnimation) {
						var gif1 = $(this).find(".image > img");
						refreshGifByElement(gif1);
					}
				
				}, {offset: animationHeight4});
			}
			
			
		/*-----------------------------------------------------------------------------------------*/
			
		/*--------------------------- Black Menu at top page --------------------------------------*/
			var docHeight = $(document).height() - 190;
			$('.drop-menu').css('height', docHeight);
			
			$('.btn-menu').click(
				function(){
						var shift = $('.layout-body').hasClass('shifted');
						var shiftFixedMenu = $('.layout-body').hasClass('shifted');
						if(!shift) {
							if(browserWidth<480){
								$('.logo').fadeOut('slow');
							}
							openMenu(1);
						} else {
							if(browserWidth<480){
								$('.logo').fadeIn('slow');
							}
							closeMenu(1);
						}
						return false;
				}
			);
			
			var isTriggered = false;
			
			$(window).scroll(function () {					
				var offset = $(this).scrollTop();
				var isOpened = $('.layout-body').hasClass('shifted');
				if ( offset > 500 && !isTriggered && isOpened) {
						isTriggered=true;
						$('#cross').trigger('click');
				}
				
				if(offset<50){
					isTriggered=false;
				}
				
				if ( offset > 600) {
						$('#header-fixed').slideDown('fast');						
						$('.logo').addClass('fixed');
						$('#drop-menu').addClass('fixed');
				}
				
				if(offset<600){
					$('#header-fixed').css('display', 'none');
					$('.logo').removeClass('fixed');
					$('#drop-menu').removeClass('fixed');
				}
				
			});
			

			$('#cross').click( function()
				{
				closeMenu();
				}
			);
			
			$('.drop-menu > ul > li > a').toggle(function() {
				$(this).next('ul').slideDown('slow');
				return false;
			}, function() {
					$(this).next('ul').slideUp('slow');
				return false;
			});
			/*----------------------------------------------------------------------------------------------------*/
			
			
			/*----------- Animation at the Page Pricing ------------*/
			
			var pieAnimationEnded = false;
			var canTriggerAnimation = false;
			
			function pieEnded(){
				pieAnimationEnded = true;
				triggerAnimation();
			};
			
			function triggerAnimation(){
				if(pieAnimationEnded && canTriggerAnimation){
					animate1();
				}
			}
			
			function animate6(){
				$("#animation6").animate( {opacity: "1"}, 400);
			};
			
			function animate5(){
					var animateOptions = browserWidth<769 ? {height: "50px"} : {height: "75px"};
				$("#animation5").animate(animateOptions, 400, animate6);
			};
			
			function animate4(){
				var animateOptions = browserWidth<769 ? {width: "50%"} : {height: "75px"};
				$("#animation4").animate(animateOptions, 400, animate5);
			};
			function animate3(){
				var animateOptions = browserWidth<769 ? {width: "65%"} : {height: "134px"};
				$("#animation3").animate(animateOptions, 400, animate4);
			};
			function animate2(){
				var animateOptions = browserWidth<769 ? {width: "80%"} : {height: "245px"};
				$("#animation2").animate(animateOptions, 400, animate3);
			};
			
			function animate1(){
				var animateOptions = browserWidth<769 ? {width: "90%"} : {height: "278px"};
				$("#animation1").animate(animateOptions, 400, animate2);
			};
			
			$().radial('.pie1', '.pie2', '.time span', pieEnded);
			
		$('#price-animate').waypoint(function() {
			canTriggerAnimation = true;
			
			triggerAnimation();
		}, {offset:100});
				
			
			
			
		/*----------------------------------------------------------------------------------------------------*/
	
				
		/*---------------------------  Drop down categories menu ------------------------------*/
			$('#categories').click(function(){
				var parent = $('#categories').parent();
				var opened = parent.hasClass('opened');
				var menu = $(this).next('ul');
				
					if(!opened) {
						parent.addClass('opened');
						menu.slideDown(300);
					} else {
						parent.removeClass('opened');
						menu.slideUp(300);
					}
					return false;
			});
			
			$(document).click(function(e){
				var parent = $('#categories').parent();
				var opened = parent.hasClass('opened');
				var menu = $('#categories').next('ul');
				
				if(opened) {
					menu.slideUp(300);
					parent.removeClass('opened');
				}
			});	
			
		/*----------------------------------------------------------------------------------------------------*/
		
		/*--------------------------- animation for  Team page ---------------------------------*/
		function percent(parent, elName,  amount) {
			var selector =  '.graph-' + elName + ' > .progress-bar > .progress';
			var $el = parent.find(selector).next('span');
			$el.text(amount + '%');
		};
		
		function animateDetails(parent, callback){
				var path = parent;
					
					function animateGraphWritten(){
						path.find('.graph-written > .progress-bar > .progress').animate({width: '42%'}, 400, callback);
						percent(path, 'written', 50);
					};
					
					function animateGraphTalk(){
						path.find('.graph-talk > .progress-bar > .progress').animate({width: '30%'}, 400, animateGraphWritten);
						percent(path, 'talk', 35);
					};
					
					function animateGraphWatch(){
						path.find('.graph-watch > .progress-bar > .progress').animate({width: '75%'}, 400, animateGraphTalk);
						percent(path, 'watch', 100);
					};
					
					path.find('.graph-cofee > .progress-bar > .progress').animate({width: '50%'}, 400, animateGraphWatch);
					percent(path, 'cofee', 60);
		}
		
		
		
		if(browserWidth>1000){
				$('#austen').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					var path2 = $('#micah').find('.box-container > .details');
					animateDetails(path1, function(){ 
									animateDetails(path2)});
				}, {offset: animationHeight3});
				
				$('#ken').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					var path2 = $('#tibor').find('.box-container > .details');
					animateDetails(path1, function(){ 
									animateDetails(path2)});
				}, {offset: animationHeight3});
				
				$('#tricia').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					var path2 = $('#nikola').find('.box-container > .details');
					animateDetails(path1, function(){ 
									animateDetails(path2)});
				}, {offset: animationHeight3});
				
				$('#dave').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					var path2 = $('#nick').find('.box-container > .details');
					animateDetails(path1, function(){ 
									animateDetails(path2)});
				}, {offset: animationHeight3});
				
				$('#mike').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					var path2 = $('#alex').find('.box-container > .details');
					animateDetails(path1, function(){ 
									animateDetails(path2)});
				}, {offset: animationHeight3});
				
				$('#carlos').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					var path2 = $('#bappi').find('.box-container > .details');
					animateDetails(path1, function(){ 
									animateDetails(path2)});
				}, {offset: animationHeight3});
				
				$('#kristy').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					var path2 = $('#pedro').find('.box-container > .details');
					animateDetails(path1, function(){ 
									animateDetails(path2)});
				}, {offset: animationHeight3});
				
				$('#boro').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
			}else{
			
				$('#austen').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#micah').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#ken').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#tibor').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#tricia').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#nikola').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#yaro').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#alena').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#mike').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#alex').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#carlos').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#bappi').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#kristy').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#pedro').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
				
				$('#boro').waypoint(function() {
					var path1 = $(this).find('.box-container > .details');
					animateDetails(path1);
				}, {offset: animationHeight3});
			}
			
			/*------- slide down form at the Home page------------*/
			$('.join-form').click(function(){
				$('#join-form').slideDown('slow');
				return false;
			});			
			$('#join-form > .container > .cross').click(function(){
				$('#join-form').slideUp('slow');
			});
			
			//rotating text on a home page
			$('#empower1').jSlots({time:10000, loops:3});
			$('#empower2').jSlots({time:10000, loops:3, isDebug:false});
		
	});	



$(function(){
	$("#comingSoonModal .btn-green").on("click",function(){
		var val = $('#comingSoonModal input').val();
		if(val){
			$.post("https://docs.google.com/a/breakoutcommerce.com/forms/d/1FaJHSYjUkkWv7sWEL45I1yqW7MEdGq_LXeWNukgf9nU/formResponse",
				{"entry.1863854019":val},function(){});
		}
		$("#comingSoonModal").modal('hide');
	});
	
	$("#comingSoonProductsModal .btn-green").on("click",function(){
		var val = $('.coming-modal h4').val();
		if(val){
			$.post("https://docs.google.com/a/breakoutcommerce.com/forms/d/1FaJHSYjUkkWv7sWEL45I1yqW7MEdGq_LXeWNukgf9nU/formResponse",
				{"entry.1863854019":val},function(){});
		}
		$("#comingSoonProductsModal").modal('hide');
	});

	$("#partnerFormSubmit").on("click",function(e){
		e.preventDefault();
		var f = $("#partnerForm").serializeArray();
		var v={};
		f.forEach(function(i){ v[i.name]=i.value;});

		if($("#emailInput").val()){
			$.post("https://docs.google.com/a/breakoutcommerce.com/forms/d/1lqTwR5vMIolypewUHc9nJzFoQbD__vNjVnAUbLoF7Q4/formResponse",
				v,function(){});
			$('#join-form').slideUp('slow');
			$('.our-partners').html("<span><i>Thanks!</i></span>");
		}

	});

	$("#contactFormSubmit").on("click",function(e){
		e.preventDefault();

		var f = $("#contactForm").serializeArray();
		var v={};
		f.forEach(function(i){ v[i.name]=i.value;});

		if($("#emailInput").val()){
			$.post("https://docs.google.com/a/breakoutcommerce.com/forms/d/10jDinCn_qa101rG6gsMWccwQ6lre3e4zY9pv_JO2HHU/formResponse",
				v,function(){});
			$("#contactForm").slideUp();
			$("#contactForm").parent().append("<p><strong>Thanks!</strong></p>");
		}

	});


    /**
     * product listing
     *
     */

    var plist = $('.list-products');
    if(plist.length){
        var products = '';

            $.getJSON('https://api.print.io/api/v/1/source/api/products/?countryCode=US&recipeid=f255af6f-9614-4fe2-aa8b-1b77b936d9d6',function(d){
                d.Products.forEach(function(p){
                   var o = {
                       name: p.Name
                       },
                       im = {};

                    if(p.Images){
                        for(var i=0;i< p.Images.length;i++){
                            im = p.Images[i];
                            if(im.ImageTypes[0]==="AppGrid"){
                                o.img = im.Url;
                                break;
                            }
                        }
                    }

                    if(o.img){
                        products+="<div class='product'><a href='#'><img src='"+ o.img+"' /><span><h4>"+ o.name+"</h4> </span></a> </div>"
                    }
                });
                plist.html(products);
            })
    }

    /**
     * test out api methods
     */

    $('.code-example').on('click',function(e){
        e.preventDefault();
        var $t = $(this);
        var prev = $t.prev();
        var next = $t.next();
        if(next.is('.response')){
            next.slideUp();
        }
        if(prev.is('.js-api-get')){
            $.getJSON(prev.text(),function(d){
               var res = JSON.stringify(d,null,'  ');
               if(!next.is('.response')){
                var c = $('<code />').text(res);
                $('<pre />').addClass('response').append(c).insertAfter($t);
               } else {
                next.find('code').html();
                next.find('code').text(res);

               }
                hljs.highlightBlock($t.next().find('code')[0]);
                $t.next().slideDown('slow');
            });
        }


    });


});