/**
 * @author  Kevin
 */

var request_user_play_audio = false;
var images_already = false;
var music_already = false;

if (typeof(ImagePreloadHelper) === 'undefined')
{
    var ImagePreloadHelper = new Object();
    (function(helper)
    {
        helper.count = 0;
        helper.loaded = 0;
        helper.list = [];
        helper.image_list = [];
        helper.callback = (function(){;});

        helper.preload = (function(list, callback)
        {
            for (var i=0; i<list.length; i++)
            {
                // save image url to list
                this.list.push(list[i]);
                this.count++;

                // create a image object to load url
                var image_item = new Image();
                image_item.onload = (function(){
                    ImagePreloadHelper.imageLoadedCallback(this);
                });
                image_item.src = list[i];

                // save image to list
                this.image_list.push(image_item);
            }

            // set callback function
            if (typeof(callback) == "function")
            {
                this.callback = callback;
            }
        });

        helper.imageLoadedCallback = (function(image)
        {
            this.loaded++;
            if (this.loaded == this.count)
            {
                this.callback();
            }
        });

    })(ImagePreloadHelper);
}

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

function playArticle()
{
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
}

function onContinuePlay()
{
    // authorized to play autio
    request_user_play_audio = true;

    // hide the continue play panel
    $('.continuePlayDialog').fadeOut();

    // start play content
    // 微信的一个 Bug， 触发 oncanplay 后仍然无法立刻播放
    // 需要先快速执行 play() 和 pause() 进行手动预加载，并延迟执行播放操作
    preloadMusic();

    playArticle();
}

// init the music player
function init_music_player_status()
{
    // check audio
    var music_player_audio_control = getElement('mainAudioController');

    // check audio support
    if (typeof(music_player_audio_control.play) != 'function')  // not supported
    {
        var log_text = '非常抱歉：您当前使用的浏览器不能播放音乐，建议您使用谷歌浏览器或火狐浏览器打开该网页。';
        alert(log_text);
        console.log(log_text);
        return false;
    }

    // set audio icon event
    // $('#mainAudioController').on('click', function () {
    //     toggleMusic();
    // });

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
            // $('.continuePlayDialog').fadeIn();
        }
    });

    music_player_audio_control.onloadeddata = (function(){
        console.log('audio trigger a onloadeddata event.');
        //$('.debug_info').append('<p>audio trigger a onloadeddata event.</p>');
    });

    // start load media
    music_player_audio_control.load();

    return true;
}

/**
 * preload music
 */
function preloadMusic()
{
    var audioControl = getElement('mainAudioController');
    audioControl.play();
    audioControl.pause();
}

/**
 * load blessing text
 * @param  Function  callback
 */
function loadBlessingText(callback)
{
    // load blessing text
    var blessingTextFile = '';
    var who_to_who = getUrlParam('who_to_who') || '';
    if (who_to_who)
    {
        blessingTextFile = 'blessing/' + who_to_who + '.txt';
    }
    else
    {
        blessingTextFile = 'blessing.txt';
    }

    $.ajax(blessingTextFile, {
        success : function (result){
            var lines = result.split("\n");
            for (var i=0; i<lines.length; i++)
            {
                if (lines[i] === '')
                {
                    continue;
                }
                $('.article .blessingText').append('<p><span class="textBg">' + lines[i] + '</span></p>');
            }

            if (callback)
            {
                callback();
            }
        },
        error : function (){
            alert('祝福语加载失败，请检查文件路径是否正确，或是否已合并到主分支。');
        }
    });
}

/*
 * step:
 * 1. preload music
 * 2. show loading panel
 * 3. preload background image
 * 4. load blessing text
 */
$(document).ready(function ()
{
    log('init music player');
    init_music_player_status();

    // show loading panel
    log('show loading panel');
    $('.loading_panel').fadeIn("normal", "linear", function()
    {
        log('preload image');
        // define preload image
        var bg_image_url = 'image/bg_happy_birthday.jpg';

        ImagePreloadHelper.preload([bg_image_url], function(){

            log('preload image finished.');
            images_already = true;

            log('load blessing text');
            loadBlessingText(function(){

                log('load blessing text finished.');

                // hide loading panel
                log('hide loading panel');
                if ($('.loading_panel').is(':visible'))
                {
                    $('.loading_panel').fadeOut();
                }

                // try to play music, smartphone's browser maybe prevent auto play music.
                // 注意：安卓和苹果手机自带浏览器禁止未经用户允许自动播放音频（禁止在非时间中调用 play 方法）
                // note: Android and iOS browser not allow autoplay audio
                log('try to play music.');
                var status = playMusic();
                if (!status)
                {
                    // show continue play panel to request user play audio
                    log('play music fail, show continue play dialog.');
                    $('.continuePlayDialog').fadeIn();
                }
                else
                {
                    log('music already played.');

                    log('play the article.');
                    playArticle();
                }

            });

            // if (images_already && music_already)
            // {
            //
            // }
        });

    });
});

