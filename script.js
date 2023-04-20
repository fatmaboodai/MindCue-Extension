
let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
player = new YT.Player('player', {
videoId: 'Mc4jAiJameA',
events: {
'onReady': onPlayerReady,
'onStateChange': onPlayerStateChange
}
});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
event.target.playVideo();
player.mute();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
let done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        setTimeout(pauseVideo, 5000);
        setTimeout(myalert, 5000)
        done = true;
        } }

function myalert() {
Swal.fire({
title: 'Wait a minute! The following scene may contain harmful material',
showDenyButton: true,
showCancelButton: false,
confirmButtonText: 'Skip',
denyButtonText: `Keep watching`,
}).then((result) => {
/* Read more about isConfirmed, isDenied below */
if (result.isConfirmed) {
    player.seekTo(x);
    player.playVideo();
    seekto+=30

} else if (result.isDenied) {

    player.playVideo();
}
})
}

function pauseVideo() {
//player.stopVideo();
player.pauseVideo();
}
