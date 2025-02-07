console.log("Let's write some JS");

let song = []; // To store song links
let song_title = []; // To store song titles
let now_playing = null; // Track current audio
let currentIndex = -1; // Track index of the playing song
let isShuffle = false;
let isRepeat = false;

// Fetch songs from GitHub repository
async function getsongs() {
    let response = await fetch("https://api.github.com/repos/Ayush8620/Spotify-Clone/contents/Songs");
    let data = await response.json();

    data.forEach(file => {
        if (file.name.endsWith(".m4a")) {
            song.push(file.download_url); // Get direct download link
            let title = decodeURIComponent(file.name.replace(".m4a", ""));
            song_title.push(title);
        }
    });
}

// Create song cards dynamically
async function cardmaking() {
    await getsongs();
    let container = document.getElementById("card-contanner");

    song.forEach((element, index) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <button type="button" id="card-play-${index}" class="card-play"><img src="/SVG/play.svg" alt=""></button>
            <button type="button" id="card-pause-${index}" class="card-play"><img src="/SVG/pause.svg" alt=""></button>
            <img src="https://i.scdn.co/image/ab67616d00001e021d1cc2e40d533d7bcebf5dae" alt="" height="200px">
            <h2>${song_title[index]}</h2>
            <p>Sidhu Moose Wala</p>
        `;
        container.appendChild(card);

        document.getElementById(`card-pause-${index}`).style.display = "none";

        document.getElementById(`card-play-${index}`).addEventListener("click", () => playSong(index));
        document.getElementById(`card-pause-${index}`).addEventListener("click", pauseSong);
    });

    setupAudio();
}

// Create a single audio object to prevent multiple instances
let audio = new Audio();

// Play song by index
function playSong(index) {
    if (currentIndex !== -1) stopCurrentSong();

    currentIndex = index;
    audio.src = song[index];
    audio.play();

    now_playing = audio;
    updateUI(index, true);
    localStorage.setItem("lastPlayedIndex", index);
}

// Pause the currently playing song
function pauseSong() {
    if (now_playing) {
        now_playing.pause();
        updateUI(currentIndex, false);
    }
}

// Stop current song
function stopCurrentSong() {
    if (now_playing) {
        now_playing.pause();
        now_playing.currentTime = 0;
        updateUI(currentIndex, false);
    }
}

// Update UI (Play/Pause buttons)
function updateUI(index, isPlaying) {
    if (index !== -1) {
        document.getElementById(`card-play-${index}`).style.display = isPlaying ? "none" : "block";
        document.getElementById(`card-pause-${index}`).style.display = isPlaying ? "block" : "none";
    }
}

// Play next song
function playNext() {
    let nextIndex = isShuffle ? Math.floor(Math.random() * song.length) : currentIndex + 1;

    if (nextIndex >= song.length) {
        if (isRepeat) nextIndex = 0;
        else return console.log("No more songs.");
    }

    playSong(nextIndex);
}

// Play previous song
function playPrevious() {
    let prevIndex = isShuffle ? Math.floor(Math.random() * song.length) : currentIndex - 1;

    if (prevIndex < 0) return console.log("No previous song.");
    playSong(prevIndex);
}

// Toggle shuffle
function toggleShuffle() {
    isShuffle = !isShuffle;
    console.log(`Shuffle: ${isShuffle}`);
}

// Toggle repeat
function toggleRepeat() {
    isRepeat = !isRepeat;
    console.log(`Repeat: ${isRepeat}`);
}

// Set up audio events (Seekbar & Volume)
function setupAudio() {
    let seekBar = document.getElementById("seekBar");
    let volumeBar = document.getElementById("vol-seekBar");
    let timeDisplay = document.getElementById("time");
    let durationDisplay = document.getElementById("duration");

    // Update seekbar and time
    audio.addEventListener("timeupdate", () => {
        let progress = (audio.currentTime / audio.duration) * 100;
        seekBar.value = progress;

        let min = Math.floor(audio.currentTime / 60);
        let sec = Math.floor(audio.currentTime % 60);
        timeDisplay.innerText = `${min}:${sec.toString().padStart(2, '0')}`;
    });

    // Seek when user interacts
    seekBar.addEventListener("input", () => {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    });

    // Set volume
    volumeBar.addEventListener("input", () => {
        audio.volume = volumeBar.value;
    });

    // Auto-play next song when current ends
    audio.addEventListener("ended", playNext);

    // Load last played song
    let lastIndex = localStorage.getItem("lastPlayedIndex");
    if (lastIndex) playSong(parseInt(lastIndex));
}

// Attach event listeners
document.getElementById("play_next").addEventListener("click", playNext);
document.getElementById("play_previous").addEventListener("click", playPrevious);
document.getElementById("shuffle").addEventListener("click", toggleShuffle);
document.getElementById("repeat").addEventListener("click", toggleRepeat);

cardmaking();
