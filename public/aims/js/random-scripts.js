$(function(){

    //launch the widget when you wannnnt
    $('.js-launch-widget').on('click',function(e){
        e.preventDefault();
        PIO.open({
            recipeId:"f255af6f-9614-4fe2-aa8b-1b77b936d9d6",
            url:"https://api.print.io/widget/"
        });
    });


    // this is so f-ing evil ;)
    $('.code-example').on('click',function(e){

        e.preventDefault();
        var text = $(this).prev().children().text();
        eval(text);
    });

    //content easing in and out
    $('.js-content-selector').on('click',function(e){
        e.preventDefault();
        var $t = $(this);
        var $n = $($t.attr('data-content'));
        var $a = $('.js-content-active');
        if($a.is($t.attr('data-content')))
            return;
        $t.parent().siblings().removeClass('active');
        $t.parent().addClass('active');
        if($n.length){
            $a.removeClass('js-content-active').hide();
            $n.show().addClass('animated fadeInDown js-content-active');
            setTimeout(function(){
                $a.removeClass('animated fadeInDown');
                $n.removeClass('animated fadeInDown');
            },1000);
        }

    });

//    $('.js-hide-disqus').on('click',function(){
//        $('#disqus').hide();
//    })
//
//    $('.js-show-disqus').on('click',function(){
//        $('#disqus').show();
//    })
});


