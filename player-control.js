// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: window.innerWidth * 0.20,
        videoId: 'M7lc1UVf-VE',
        modestbranding: 1,
        showinfo: 0,
        events: {
            'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
        }
    });
}

let video_url = "https://www.youtube.com/watch?v=Tlu1ZfYr6vA"
let video_duration = 0
let current_time;
let start_time = 0;
let end_time = 0;
let currentTimeField = document.getElementById("current_time")
let startTimeField = document.getElementById("start_time")
let endTimeField = document.getElementById("end_time")
let downloadCommandField = document.getElementById("download_command");
let urlField = document.getElementById("url_field");
let infoLabel = document.getElementById("info_label");
let formatOptions = "-f mp4";
let framerate = 30 //we will just asume cause i got no fucking clue how?!

function onPlayerReady(){
    // start always updating the current time
    update_info_clock = setInterval(updatePlayerInfo, 50);
    current_time = player.getCurrentTime();
    video_duration = player.getDuration();

    end_time = video_duration;
    endTimeField.value = formatTimeToString(end_time)
    setStart();
}

function updatePlayerInfo() {
    current_time = player.getCurrentTime();
    currentTimeField.value = formatTimeToString(current_time);
}

function formatTimeToString(time) {
    var date = new Date(null);
    date.setMilliseconds(time * 1000);
    return date.toISOString().substr(11, 12);
}


function getVideoIdFromUrl(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function loadVideo(){
    infoLabel.innerText = " "
    video_url = urlField.value;
    videoId = getVideoIdFromUrl(video_url);
    if (videoId !== false) {
        player.loadVideoById(videoId);
    } else if (urlField.value != "") {
        infoLabel.innerText = "Please enter a valid youtube url"
    }
}

function moveFrames(amount){
    player.seekTo(player.getCurrentTime() + amount/framerate)
}

function moveSeconds(amount){
    player.seekTo(player.getCurrentTime() + amount)
}

function setStart(){
    start_time = current_time;
    startTimeField.value = formatTimeToString(start_time);
}

function setEnd(){
    end_time = current_time;
    endTimeField.value = formatTimeToString(end_time)
}

function selectAudioOption(){
    if(document.getElementById('with_video_audio').checked) {
        formatOptions = "" // as the default is "bv*+ba/b";
    }else if(document.getElementById('only_video').checked) {
        formatOptions = ` -f "bv" `
    }else if(document.getElementById('only_audio').checked) {
        formatOptions = ` -xf "ba" `
    }
}

function downloadNow(){
    // Doesnt actually download yet, only gives the command
    downloadCommandField.value = `yt-dlp ${formatOptions} --download-sections "*${start_time.toFixed(3)}-${end_time.toFixed(3)}" --force-keyframes-at-cuts "${video_url}"`
}

function copyToClipboard(){
    downloadCommandField.select();
    downloadCommandField.setSelectionRange(0, 99999);
    document.execCommand('copy');
    // downloadCommandField.setSelectionRange(0,0)  // this doesnt give good feedback to the user
}

// Keys
document.addEventListener("keydown", onKeyDown);

function onKeyDown(event){
    switch (event.key) {
        case ',':
            moveFrames(-1);
            break;
        case '.':
            moveFrames(1);
            break;
        case ' ':
            event.preventDefault();
            if (player.getPlayerState() == 1)   player.pauseVideo();
            else    player.playVideo();
            break;
        case 'm':
            if (player.isMuted()) player.unMute();
            else player.mute();
            break;
        case "ArrowLeft":
            moveSeconds(-1);
            break;
        case "ArrowRight":
            moveSeconds(1);
            break;
        case 's':
            setStart();
            break;
        case 'e':
            setEnd();
            break;
        case '/':
            urlField.focus();
            break;
        default:
            console.log(event);
    }
}
