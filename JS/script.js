console.log('lets write some js');

let song = [] // to store song links
let song_title = [] // to store title of song

async function getsongs() {
    let urls = await fetch("https://api.github.com/repos/Ayush8620/Spotify-Clone/contents/Songs") //getting song data from URL
    let response = await urls.text() // coverting data into txt file which is in html document format 
    let div = document.createElement("div") // to extrate song links we create div in which we 
    div.innerHTML = response // paste the html doc 
    let ancher_tag = div.getElementsByTagName("a") //extracting requred detail from responce which is index.html file in text format, It will return a HTML collection

    for (let index = 0; index < ancher_tag.length; index++) {
        const element = ancher_tag[index];
        if (element.href.endsWith("m4a")) { //filter the anchor tag which have song links only
            song.push(element.href) //push song links(href) into song array
        }
    }
}

async function cardmaking() {
    await getsongs()

    let index = 0
    song.forEach(element => { // getting song links from song array one by one
        title = element.replace("https://api.github.com/repos/Ayush8620/Spotify-Clone/contents/Songs", "") //filter the title from the links, remove prefex
        title = title.replace(".m4a", "") //filter the title from the links, remove extention
        title = decodeURIComponent(title); // replace %20 with space from title

        song_title.push(title)

        //making cards
        // writing some HTML
        let card = `<div class="card">
        <button type="button" id="card-play-${index}" class="card-play"><img src="/SVG/play.svg" alt=""></button>
        <button type="button" id="card-pause-${index}" class="card-play"><img src="/SVG/pause_24dp_FILL0_wght400_GRAD0_opsz24.svg" alt=""></button>
        <img src="https://i.scdn.co/image/ab67616d00001e021d1cc2e40d533d7bcebf5dae" alt="" height="200px" id = "img-phone">
        <h2>${title}</h2>
        <p>Sidhu Moose Wala</p>
        </div>`
        // Add HTML into card contanner
        document.getElementById("card-contanner").innerHTML = document.getElementById("card-contanner").innerHTML + card
        // making pause btn display none
        document.getElementById(`card-pause-${index}`).style.display = "none"

        index++
    })


    all_cards = []

    now_playing = [] //to store playing song
    //to play song
    for (let i = 0; i < song.length; i++) {

        let card_on_play =
            `<div>
            <img src="https://i.scdn.co/image/ab67616d00001e021d1cc2e40d533d7bcebf5dae" alt="" height="42px">
        </div>
        <div>
            <h2>${song_title[i]}</h2>
            <p>Sidhu Moose Wala</p>
        </div>`

        all_cards.push(card_on_play)


        document.getElementById(`card-play-${i}`).addEventListener("click", () => {
            audio = new Audio(song[i])
            // console.log(audio);


            if (now_playing.length == 0) {
                audio.play()
                now_playing.push(audio, i)
                document.getElementById(`card-play-${i}`).style.display = "none"
                document.getElementById(`card-pause-${i}`).style.display = "block"
                document.getElementById("left-footer").innerHTML = document.getElementById("left-footer").innerHTML + all_cards[i]
                document.getElementById("play_button").style.display = "none"
                document.getElementById("pause_button").style.display = "block"
            }
            else {
                //pause old song 
                audio_pause = now_playing[0]
                audio_pause.pause()
                document.getElementById(`card-play-${now_playing[1]}`).style.display = "block"
                document.getElementById(`card-pause-${now_playing[1]}`).style.display = "none"
                document.getElementById("left-footer").innerHTML = ""


                //and play new song
                now_playing.splice(0, now_playing.length)
                audio.play()
                now_playing.push(audio, i)
                document.getElementById(`card-play-${i}`).style.display = "none"
                document.getElementById(`card-pause-${i}`).style.display = "block"
                document.getElementById("left-footer").innerHTML = document.getElementById("left-footer").innerHTML + all_cards[i]
                document.getElementById("play_button").style.display = "none"
                document.getElementById("pause_button").style.display = "block"
            }
        })

        //to pause song
        document.getElementById(`card-pause-${i}`).addEventListener("click", () => {
            audio.pause()
            now_playing.splice(0, now_playing.length)
            document.getElementById(`card-play-${i}`).style.display = "block"
            document.getElementById(`card-pause-${i}`).style.display = "none"
            document.getElementById("left-footer").innerHTML = ""
            document.getElementById("play_button").style.display = "block"
            document.getElementById("pause_button").style.display = "none"
        })

        document.getElementById("play_next").addEventListener("click", play_next)
        document.getElementById("play_previous").addEventListener("click", play_previous)

        index++
    };


    //now playing play pause button
    document.getElementById("play_button").addEventListener("click", () => {
        if (now_playing.length == 0) {
            console.log('error1');
        }
        else {
            audio_running = now_playing[0]
            audio_running.play()
            document.getElementById("play_button").style.display = "none"
            document.getElementById("pause_button").style.display = "block"
        }
    })
    document.getElementById("pause_button").addEventListener("click", () => {
        audio_running = now_playing[0]
        audio_running.pause()
        document.getElementById("play_button").style.display = "block"
        document.getElementById("pause_button").style.display = "none"

    });


    //next
    async function play_next() {
        if (now_playing.length === 0) {
            console.log('No song is playing.');
            return;
        }

        if (now_playing[1] < song.length - 1) {
            try {
                now_playing[0].pause();  // Pause the current song

                let new_number = now_playing[1] + 1;
                audio = new Audio(song[new_number]);

                await audio.play();  // Wait for the new song to start playing

                // Update UI
                document.getElementById("left-footer").innerHTML = all_cards[new_number];
                document.getElementById(`card-play-${now_playing[1]}`).style.display = "block";
                document.getElementById(`card-pause-${now_playing[1]}`).style.display = "none";

                // Update now_playing array
                now_playing = [audio, new_number];

                document.getElementById("play_button").style.display = "none";
                document.getElementById("pause_button").style.display = "block";
                document.getElementById(`card-play-${new_number}`).style.display = "none";
                document.getElementById(`card-pause-${new_number}`).style.display = "block";
            } catch (error) {
                console.error('Error playing the next song:', error);
            }
        } else {
            console.log('No more songs in the queue.');
            document.getElementById("play_button").style.display = "block";
            document.getElementById("pause_button").style.display = "none";
        }
    }

    async function play_previous() {
        if (now_playing.length === 0) {
            console.log('No song is playing.');
            return;
        }

        if (now_playing[1] > 0) {
            try {
                now_playing[0].pause();  // Pause the current song

                let new_number = now_playing[1] - 1;
                audio = new Audio(song[new_number]);

                await audio.play();  // Wait for the previous song to start playing

                // Update UI
                document.getElementById("left-footer").innerHTML = all_cards[new_number];
                document.getElementById(`card-play-${now_playing[1]}`).style.display = "block";
                document.getElementById(`card-pause-${now_playing[1]}`).style.display = "none";

                // Update now_playing array
                now_playing = [audio, new_number];

                document.getElementById("play_button").style.display = "none";
                document.getElementById("pause_button").style.display = "block";
                document.getElementById(`card-play-${new_number}`).style.display = "none";
                document.getElementById(`card-pause-${new_number}`).style.display = "block";
            } catch (error) {
                console.error('Error playing the previous song:', error);
            }
        } else {
            console.log('No previous song available.');
        }
    }


    function updateAudioTime(audio) {
        const currentTime = audio.currentTime;
        const min = Math.floor(currentTime / 60);
        const sec = Math.floor(currentTime % 60);

        let formattedTime = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
        document.getElementById("time").innerText = formattedTime;

        let duration = audio.duration; // Total duration in seconds
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60);

        // Formatting to MM:SS
        let formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Displaying on the page
        document.getElementById("duration").innerText = formattedDuration;

        //seekbar
        // Update seekBar as the audio plays
        audio.addEventListener('timeupdate', () => {
            const progress = (audio.currentTime / audio.duration) * 100;
            document.getElementById('seekBar').value = progress;
        });

        // Seek when the user interacts with the seekBar
        seekBar.addEventListener('input', () => {
            const seekTime = (seekBar.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        });

        // Reset button and seekBar when audio ends
        audio.addEventListener('ended', play_next);

        // Set the initial volume
        audio.volume = document.getElementById('vol-seekBar').value;

        const volumeBar = document.getElementById('vol-seekBar');
        const volMuteIcon = document.getElementById('volno');
        const volUpIcon = document.getElementById('volup');

        // Update volume when volume bar changes
        volumeBar.addEventListener('input', () => {
            audio.volume = volumeBar.value;

            if (audio.volume == 0) {
                volMuteIcon.style.display = "block";  // Show mute icon
                volUpIcon.style.display = "none";     // Hide volume-up icon
            } else {
                volMuteIcon.style.display = "none";   // Hide mute icon
                volUpIcon.style.display = "block";    // Show volume-up icon
            }
        });

        // Toggle mute/unmute when clicking the icons
        volUpIcon.addEventListener('click', () => {
            audio.volume = 0;  // Set to default volume level
            volumeBar.value = 0;
            volMuteIcon.style.display = "block";
            volUpIcon.style.display = "none";
        });

        volMuteIcon.addEventListener('click', () => {
            audio.volume = 0.8;
            volumeBar.value = 0.8;
            volMuteIcon.style.display = "none";
            volUpIcon.style.display = "block";
        });

    }

    // Use this inside a setInterval to keep updating the time
    setInterval(() => {
        if (now_playing.length > 0) {
            updateAudioTime(now_playing[0]); // Assumes `now_playing[0]` is your current Audio object
        }
    }, 1000);



}

cardmaking()
