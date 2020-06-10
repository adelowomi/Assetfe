/**
 * Created by micah on 10/26/13.
 */
$(function(){
    /*------  Team, Progressbar Animations ------*/
    function percent(parent, elName,  amount) {
        var selector =  '.graph-' + elName + ' > .progress-bar > .progress';
        var $el = parent.find(selector).next('span');
        $el.text(amount + '%');
    };

    function animateDetails(parent, vals, callback){
        var path = parent;

        path.find('.graph-cofee > .progress-bar > .progress').animate({width: vals[0]-vals[0] *.25+'%'}, 400, animateGraphWatch);

        function animateGraphWatch(){
            path.find('.graph-watch > .progress-bar > .progress').animate({width: vals[1]-vals[1]*.25+'%'}, 400, animateGraphTalk);
            percent(path, 'watch', vals[1]);
        };

        function animateGraphTalk(){
            path.find('.graph-talk > .progress-bar > .progress').animate({width: vals[2]-vals[2]*.25+'%'}, 400, animateGraphWritten);
            percent(path, 'talk', vals[2]);
        };

        function animateGraphWritten(){
            path.find('.graph-written > .progress-bar > .progress').animate({width: vals[3]-vals[3] *.25+'%'}, 400, callback);
            percent(path, 'written', vals[3]);
        };

        percent(path, 'cofee', vals[0]);
    }

    var off = $(window).height() - $('.developer').height();

    $('#ken').waypoint(function() {
        var path1 = $(this).find('.details');

        var v = [100,50,40,100];
        animateDetails(path1,v);
    }, {offset: off});

    $('#tibor').waypoint(function() {
        var path1 = $(this).find('.details');

        var v = [100,70,40,30];
        animateDetails(path1,v);
    }, {offset: off});

    $('#tricia').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [70,100,100,80];

        animateDetails(path1,v);
    }, {offset: off});

    $('#nikola').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [100,70,80,100];

        animateDetails(path1,v);
    }, {offset: off});

    $('#chris').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [100,50,90,100];

        animateDetails(path1,v);
    }, {offset: off});

    $('#nick').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [90,50,80,100];

        animateDetails(path1,v);
    }, {offset: off});

    $('#mike').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [40,60,100,30];

        animateDetails(path1,v);
    }, {offset: off});

    $('#alex').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [80,50,100,100];

        animateDetails(path1,v);
    }, {offset: off});


    $('#carlos').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [70,100,65,80];

        animateDetails(path1,v);
    }, {offset: off});

    $('#pedro').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [100,90,50,100];

        animateDetails(path1,v);
    }, {offset: off});

    $('#bappi').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [90,80,75,100];

        animateDetails(path1,v);
    }, {offset: off});

    $('#boro').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [100,100,80,60];

        animateDetails(path1,v);
    }, {offset: off});
    
    $('#platon').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [70,100,100,40];

        animateDetails(path1,v);
    }, {offset: off});

    $('#stevan').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [70,100,60,100];

        animateDetails(path1,v);
    }, {offset: off});

    $('#austen').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [90,100,50,100];

        animateDetails(path1,v);
    }, {offset: off});

    $('#micah').waypoint(function() {
        var path1 = $(this).find('.details');
        var v = [60,30,100,100];

        animateDetails(path1,v);
    }, {offset: off});


});