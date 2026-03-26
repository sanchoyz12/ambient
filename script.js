const tracks = [
    { title: 'AMC', src: 'AMC.mp3' },
    { title: 'AMG', src: 'AMG.mp3' },
    { title: 'AMK', src: 'AMK.mp3' },
    { title: 'AMO', src: 'AMO.mp3' },
    { title: 'AMR', src: 'AMR.mp3' }
];

let trackIndex = 0;
let isPlaying = false;

// DOM Elements
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('track-name');
const statusText = document.getElementById('playing-status');
const coverArt = document.getElementById('cover-art');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume');
const volumeIcon = document.getElementById('volume-icon');
const playlistEl = document.getElementById('playlist');

// Initialize Playlist
function initPlaylist() {
    playlistEl.innerHTML = '';
    tracks.forEach((track, index) => {
        const div = document.createElement('div');
        div.className = `playlist-item ${index === trackIndex ? 'active' : ''}`;
        div.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="playing-icon">
                <span></span><span></span><span></span>
            </div>
            <div class="track-info-list">
                <h4>${track.title}</h4>
            </div>
        `;
        div.addEventListener('click', () => {
            trackIndex = index;
            loadTrack(tracks[trackIndex]);
            playTrack();
        });
        playlistEl.appendChild(div);
    });
}

// Load track details
function loadTrack(track) {
    title.innerText = track.title;
    audio.src = track.src;
    
    // Update active class in playlist
    const items = playlistEl.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === trackIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Reset progress formatting
    progress.style.width = `0%`;
    currentTimeEl.innerText = '0:00';
    durationEl.innerText = '--:--';
}

// Play track
function playTrack() {
    isPlaying = true;
    playIcon.className = 'fa-solid fa-pause';
    coverArt.classList.add('playing');
    statusText.classList.add('show');
    statusText.innerText = 'Играет';
    audio.play();
}

// Pause track
function pauseTrack() {
    isPlaying = false;
    playIcon.className = 'fa-solid fa-play';
    coverArt.classList.remove('playing');
    statusText.innerText = 'Пауза';
    audio.pause();
}

// Previous song
function prevTrack() {
    trackIndex--;
    if (trackIndex < 0) {
        trackIndex = tracks.length - 1;
    }
    loadTrack(tracks[trackIndex]);
    if (isPlaying) playTrack();
}

// Next song
function nextTrack() {
    trackIndex++;
    if (trackIndex > tracks.length - 1) {
        trackIndex = 0;
    }
    loadTrack(tracks[trackIndex]);
    if (isPlaying) playTrack();
}

// Function to format time cleanly
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    if (sec < 10) {
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
}

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    if (isNaN(duration) || duration === 0) return;

    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    currentTimeEl.innerText = formatTime(currentTime);
    durationEl.innerText = formatTime(duration);
}

// Set progress bar on click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    if (isNaN(duration) || duration === 0) return;
    
    audio.currentTime = (clickX / width) * duration;
}

// Set volume functionality
function setVolume(e) {
    const vol = e.target.value;
    audio.volume = vol;
    
    if (vol > 0.5) {
        volumeIcon.className = 'fa-solid fa-volume-high';
    } else if (vol > 0) {
        volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
        volumeIcon.className = 'fa-solid fa-volume-xmark';
    }
}

// Event Listeners
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});

prevBtn.addEventListener('click', prevTrack);
nextBtn.addEventListener('click', nextTrack);

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);
volumeSlider.addEventListener('input', setVolume);
audio.addEventListener('ended', nextTrack);

audio.addEventListener('loadedmetadata', () => {
    durationEl.innerText = formatTime(audio.duration);
});

// Initialize on App Load
audio.volume = volumeSlider.value;
initPlaylist();
if (tracks.length > 0) {
    loadTrack(tracks[trackIndex]);
} else {
    title.innerText = "Выберите трек для начала";
}
