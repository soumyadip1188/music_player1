const Dragdealer = require('dragdealer').Dragdealer;
const playerWrapper = document.getElementById('playerId');
const audioPlayer = document.getElementById('audio-player');
const searchBtn = document.getElementById('search-btn');
const listenSpotifyBtn = document.getElementById('listen-spotify');
const audioEl = document.getElementById('audio');
const imageEl = document.getElementById('cover-art');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const resultsWrapper = document.getElementById('search-results');
const progressWrapper = audioPlayer.querySelector(".progress-wrapper");
const progressBar = audioPlayer.querySelector(".progress");
const volume = document.getElementById('volume');
const volumeHandle = document.getElementById('handle');
const volumeColor = document.getElementById('vol_col');
const volumeIcon = document.getElementById('vol-icon');
let progressWidth;
let token;

fetch("https://blooming-reef-63913.herokuapp.com/api/token")
    .then(response => response.json())
    .then(data => token = data.token);

let currentSong = 0;
let songs = [];

const search = async () => {
    songs = [];
    resultsWrapper.innerHTML = null;
    const query = document.getElementById('search').value;
    const API = `https://api.spotify.com/v1/search?q=${query}&type=track`;
    await fetch(API, {
        headers: {
            'authorization': 'Bearer ' + token
        }})
            .then(response => response.json())
            .then(data => songs = data.tracks.items);
    console.log(songs);
    insertSongData();
    renderSongList();
    document.getElementById('blur').style.backgroundImage = `url(${songs[currentSong].album.images[0].url})`;
}

const renderSongList = () => {
    songs.forEach(song => {
        const content = `<div class="song"> 
                            <p id="${song.id}"> ${song.name}, ${song.artists[0].name} </p>
                        </song>`;
        resultsWrapper.innerHTML += content;
    });
    resultsWrapper.addEventListener('click', (e) => findIndex(e));
}

const findIndex = (e) => {
    const resultChildren = Array.from(resultsWrapper.children);
    const index = resultChildren.indexOf(e.target.parentElement);
    currentSong = index;
    insertSongData();
    document.getElementById('blur').style.backgroundImage = `url(${songs[currentSong].album.images[0].url})`;
}

// document.querySelectorAll('.song').forEach(song => {
//     song.addEventListener('click', document.getElementById('blur')
//     .style.backgroundImage = `url(${songs[currentSong].album.images[0].url})`)
// })

const insertSongData = () => {
    audioEl.src = songs[currentSong].preview_url;
    audioEl.src == 'https://jespergustafsson.com/music-player/null' ? 
    playerWrapper.classList.add('no-preview') :
    playerWrapper.classList.remove('no-preview');
    listenSpotifyBtn.addEventListener('click', () => {
        window.open(songs[currentSong].external_urls.spotify);
    });
    imageEl.src = songs[currentSong].album.images[1].url;
    title.innerHTML = songs[currentSong].name;
    artist.innerHTML = songs[currentSong].artists[0].name;
}

searchBtn.addEventListener('click', search);
document.getElementById('play').classList.add('play');
const playPause = () => {
    if (audioEl.paused) {
        audioEl.play();
        document.getElementById('play').classList.remove('play');
    } else {
        audioEl.pause();
        document.getElementById('play').classList.add('play');
    }
}

setInterval(() => {
    progressWidth = progressBar.style.width = audioEl.currentTime / audioEl.duration * 100 + "%";
},500);

document.getElementById('play').addEventListener('click', playPause);


const scrub = (e) => {
    let rect = e.target.getBoundingClientRect()
    let x = e.clientX - rect.left;
    let percentOfTotalWidth = x / progressWrapper.clientWidth * 100;

    progressBar.style.width = percentOfTotalWidth + '%';
    audioEl.currentTime = percentOfTotalWidth / audioEl.duration * 9;
}

progressWrapper.addEventListener('click', scrub);

const showVolume = () => {
    console.log(volumeDragdealer.options);
    volume.classList.toggle('show');
}

volumeIcon.addEventListener('click', showVolume);

const volumeDragdealer = new Dragdealer(volume, {
    disabled: false,
    horizontal: false,
    vertical: true,
    y: 0,
    steps: 5,
    snap: true,
    animationCallback: function(y) {
       let audioVolume = parseFloat(volumeHandle.style.transform.slice(11,12) / 10);

      switch (audioVolume) {
        case 0:
          audioEl.volume = 0.9
          volumeColor.style.height = '95px'
          break;
      
        case 0.2:
          audioEl.volume = 0.6
          volumeColor.style.height = '65px'
          break;

        case 0.4:
          audioEl.volume = 0.4
          volumeColor.style.height = '45px'
          break;
        
        case 0.6:
          audioEl.volume = 0.2
          volumeColor.style.height = '25px'
          break;
        
        case 0.8:
          audioEl.volume = 0
          volumeColor.style.height = '0px'
          break;
      }
    }
});




