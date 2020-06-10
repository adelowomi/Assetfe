TweakSkin = function () {
    //PageURLsIHaveAccessTo //mega-menu-container
    var sPageURL2 = "";
    sPageURL2 = window.location.hash.split('?');
    var AccessURLInterval = setInterval(function () {
        if (UserAccessMenusListed) {

            clearInterval(AccessURLInterval);
            if (!isInArray(sPageURL2[0], PageURLsIHaveAccessTo) && !isInArray(sPageURL2[0], PageExceptions)) {
                ThrowPageError('Access Denied!', 'Sorry, you do not have access to the page requested.');
            }
            else {

            }

        }
    }, 300);


    $('input:not(.ios-switch)').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%'
    });

    //--------CHOSEN ISSUES--------------
    setTimeout(function () {
        var config = {
            '.chosen-select': { display_selected_options: false },
            '.chosen-select-deselect': { allow_single_deselect: true },
            '.chosen-select-no-single': { disable_search_threshold: 10 },
            '.chosen-select-no-results': { no_results_text: 'Oops, nothing found!' },
            '.chosen-select-width': { width: "95%" }
        }
        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }
    }, 1000);
    //$('.my_select_box').trigger('chosen:updated');
    //--------END CHOSEN ISSUES--------------

    $('header.panel-heading').each(function () {
        $(this).css({ background: "url('images/minimize.png') no-repeat 99% 50%", 'background-size': '15px', cursor: 'pointer' });
        $(this).click(function () {
            if ($(this).hasClass('up')) {
                $(this).next('.panel-body').slideDown();
                $(this).removeClass('up');
            }
            else {
                $(this).next('.panel-body').slideUp();
                $(this).addClass('up');
            }
        });
    });

    //$('.wrapper').next('header.panel-heading').next('.panel-body').slideUp();
    //$('.wrapper').next('header.panel-heading').addClass('up');

    //-----------NUMERIC ONLY THINGS
    $(".numericonly").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
        $(this).css('text-align', 'right');

    });
    //-----------END NUMERIC ONLY THINGS
    jQuery('.datecontrol').datetimepicker({ timepicker: false, format: 'd/m/Y' });
    $('.timecontrol').timepicker();
    $('.spinner-control').spinner({ value: 1, min: 1, max: 999999 });
    CollapseSection('.initial-collapse');
    // IOS7 SWITCH
    $(".ios-switch").each(function () {
        mySwitch = new Switch(this);
    });
    $("html, body").animate({ scrollTop: 0 }, "slow");
}