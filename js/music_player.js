/**
 * music player
 * depend jQuery 1.12+
 * Created by wen on 2016/12/24.
 * 注意：安卓和苹果手机自带浏览器禁止未经用户允许自动播放音频（禁止在非时间中调用 play 方法）
 * note: Android and iOS browser not allow autoplay audio
 */

/**
 * play the music
 */
function playMusic()
{
    $('#main_music_player').removeClass('stopped');
    $('#main_music_player .audio')[0].play();
}

/**
 * pause the music
 */
function pauseMusic()
{
    $('#main_music_player').addClass('stopped');
    $('#main_music_player .audio')[0].pause();
}

/**
 * toggle the music with play and pause
 */
function toggleMusic()
{
    var music_player = $('#main_music_player .audio')[0];
    if (music_player.paused)
    {
        playMusic();
    }
    else
    {
        pauseMusic();
    }
}

function preloadMusic()
{
    var main_music_player_audio_control = $('#main_music_player .audio')[0];
    main_music_player_audio_control.play();
    main_music_player_audio_control.pause();
}

