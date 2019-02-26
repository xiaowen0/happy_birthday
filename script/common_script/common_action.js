/**
 * common action
 * dependent on jQuery
 */

$(document).ready(function ()
{
    // set music control button action to toggle music play status
    $('#mainMusicControlButton').on('click', function ()
    {
        toggleMusic();
    });

    // button action to show layer
    $('.showLayer').on('click', function ()
    {
        var target = $(this).data('target');
        if (!target) {
            return;
        }

        $(target).fadeIn();
    });

    // close button for layer panel
    $('.layer .panel .close_button').on('click', function ()
    {
        var layer = $(this).parents('.layer');
        layer.fadeOut();
    });

    $('.dialog .dialog_header .close_button').on('click', function ()
    {
        var dialog = $(this).parents('.dialog');
        var layer = $('.layer');
        if (layer.length)
        {
            layer.fadeOut();
        }
        else
        {
            dialog.fadeOut();
        }
    });

    // backspace button action
    $('.backspaceButton').on('click', function ()
    {
        var inputGroup = $(this).parents('.inputGroup');
        var inputbox = inputGroup.find('.inputbox');
        var text = inputbox.val();
        if (text.length < 1) {
            // nothing to do
            return;
        }
        text = text.substr(0, text.length - 1);
        inputbox.val(text);
    });

    // set auto page down
    $('.autoPageDown').each(function ()
    {
        setAutoPageDown(this, 10);
    });

    // response element
    var responseHandle = (function()
    {
        $('.response').each(function ()
        {
            // reset height
            $(this).css('height', 'auto');

            // get width and ratio, calculate height
            var width = this.offsetWidth;
            var ratio = parseFloat($(this).data('ratio') || 0);
            var height = width * ratio;

            // set new height
            $(this).css('height', height + 'px');
        });
    });
    responseHandle();
    $(window).on('resize', responseHandle);

});
