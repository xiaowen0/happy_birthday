/**
 * Created by wen on 2016/12/30.
 */

var request_user_play_audio = false;
var images_already = false;
var music_already = false;

function startPlayContent()
{
    // init article
    $('.article p').hide();
    $('.article').fadeIn();

    // play music
    playMusic();

    // display producer on 26s
    window.setTimeout(function()
    {
        $('.page_footer .producer').fadeIn();
    }, 13 * 1000);

    // play letter
    window.setTimeout(function(){
        playLetter($('.article .text_box')[0], 3200);
    }, 1400);
}

// init the music player
function init_music_player_status()
{
    // check audio
    var music_player_audio_control = $('#main_music_player .audio')[0];

    // check audio support
    if (typeof(music_player_audio_control.play) != 'function')  // not supported
    {
        var log_text = '非常抱歉：您当前使用的浏览器不能播放音乐，建议您使用谷歌浏览器或火狐浏览器打开该网页。';
        alert(log_text);
        console.log(log_text);
        return false;
    }

    // set audio icon event
    $('#main_music_player').on('click', function () {
        toggleMusic();
    });

    music_player_audio_control.onerror = (function () {
        var log_text = '非常抱歉：加载音乐失败,请尝试刷新页面或更换浏览器。';
        alert(log_text);
        console.log('audio trigger a error event.');
    });

    music_player_audio_control.onemptied = (function(){
        console.log('audio trigger a emptied event.');
    });

    // play music and letter
    music_player_audio_control.oncanplay = (function()
    {
        console.log('audio trigger a canplay event.');
        //$('.debug_info').append('<p>audio trigger a canplay event.</p>');
        music_already = true;

        // when images are already
        if (!request_user_play_audio && music_already && images_already)
        {
            // hide loading panel
            if ($('.loading_panel').is(':visible'))
            {
                $('.loading_panel').fadeOut();
            }

            // show continue play panel to request user play audio
            $('.continuePlayDialog').fadeIn();
        }
    });

    music_player_audio_control.onloadeddata = (function(){
        console.log('audio trigger a onloadeddata event.');
        //$('.debug_info').append('<p>audio trigger a onloadeddata event.</p>');
    });

    // button for continue play content
    $('.continuePlayDialog .button').on('click', function()
    {
        // authorized to play autio
        request_user_play_audio = true;

        // hide the continue play panel
        $('.continuePlayDialog').fadeOut();

        // start play content
        // 微信的一个 Bug， 触发 oncanplay 后仍然无法立刻播放
        // 需要先快速执行 play() 和 pause() 进行手动预加载，并延迟执行播放操作
        preloadMusic();
        if (isWeixin())
        {
            window.setTimeout(function(){
                startPlayContent();
            }, 3000);
        }
        else
        {
            startPlayContent();
        }

    });

    // start load media
    music_player_audio_control.load();

    return true;
}

$(document).ready(function ()
{
    var user_agent = navigator.userAgent;

    // define preload image
    var bg_image_url = 'image/bg_happy_birthday.jpg';

    $('.play_error_help_link').on('click', function(){
        $('.play_error_dialog').fadeIn();
    });

    // show loading panel
    $('.loading_panel').fadeIn("normal", "linear", function()
    {
        ImagePreloadHelper.preload([bg_image_url], function(){

            images_already = true;

            if (images_already && music_already)
            {
                // hide loading panel
                if ($('.loading_panel').is(':visible'))
                {
                    $('.loading_panel').fadeOut();
                }

                // show continue play panel to request user play audio
                $('.continuePlayDialog').fadeIn();
            }
        });
    });

    init_music_player_status();
});
