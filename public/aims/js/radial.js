(function( $ ){
			  $.fn.radial = function(pie1, pie2, tspan, callback) {
				var pie1=pie1||'.pie1';
				var pie2=pie2||'.pie2';
				
			  var i = 0;
			var count = 0;
			var MS = 0;
			var total = 300;
			d = 360;
			  
			var showTime = function(){
				total = total - 1;
				if(total==0){
					callback();
					clearInterval(s);		      					
				}else{
					if(total>0 && MS<70 && total%3==0){
						MS = MS + 1;
					};      
				};     
			  
				i = i + 0.6;
				count++;
				drawLoop(count, i);
			  
				i = i + 0.6;
				count++;
				drawLoop(count, i);
			  
				$(tspan).html(MS+'%');
			};
			  
			function start1(){  
				i = i + 0.6;
				count++;
				drawLoop(count, i);
			  
				i = i + 0.6;
				count++;
				drawLoop(count, i);
			};
			  
			function drawLoop(count, i){
				
				if(count<=300){
				  makeTick(pie2, i);      
				};
			  
				if(count>300 && count<410){
				  makeTick(pie1, i-180);
				}  
			}
			  
			function makeTick(pie, i){
				$(pie).css("transform","rotate(" + i + "deg)");
				$(pie).css("-ms-transform","rotate(" + i + "deg)");
				$(pie).css("-o-transform","rotate(" + i + "deg)");
				$(pie).css("-moz-transform","rotate(" + i + "deg)");
				$(pie).css("-webkit-transform","rotate(" + i + "deg)");
			} 
				var s = setInterval(showTime, 10);
				
			};
			})( jQuery );
