	var currentSongNumber = 1;
	var willLoop = 0; // the state of willLoop variable is 0 i.e. it is turned off
	var willShuffle = 0; // will use this soon
	
		// Variables list
		var songs = [{
				'name': 'Badri Ki Dulhania (Title Track)',
				'artist': 'Neha Kakkar, Monali Thakur, Ikka Singh, Dev Negi',
				'album': 'Badrinath ki Dulhania',
				'duration': '2:56',
			   'fileName': 'song1.mp3',
			   'image': 'song1.jpg'
			},
			{
				'name': 'Humma Song',
				'artist': 'Badshah, Jubin Nautiyal, Shashaa Tirupati',
				'album': 'Ok Jaanu',
				'duration': '3:15',
				'fileName': 'song2.mp3',
				'image': 'song2.jpg'
			},
			{
				'name': 'Nashe Si Chadh Gayi',
				'artist': 'Arijit Singh',
				'album': 'Befikre',
				'duration': '2:34',
				'fileName': 'song3.mp3',
				'image': 'song3.jpg'
			},
			{
				'name': 'The Breakup Song',
				'artist': 'Nakash Aziz, Arijit Singh, Badshah, Jonita Gandhi',
				'album': 'Ae Dil Hai Mushkil',
				'duration': '2:29',
				'fileName': 'song4.mp3',
				'image': 'song4.jpg'
			}];
			
			var songNumber = 1;
			
	function fancyTimeFormat(time)
		{   
		// Hours, minutes and seconds
		var hrs = ~~(time / 3600);
		var mins = ~~((time % 3600) / 60);
		var secs = time % 60;

		// Output like "1:01" or "4:03:59" or "123:03:59"
		var ret = "";

		if (hrs > 0) {
			ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
		}

		ret += "" + mins + ":" + (secs < 10 ? "0" : "");
		ret += "" + secs;
		return ret;
	}
			
	// Function defined
	function toggleSong() {
		// Same code
		var song = document.querySelector('audio'); // Select the <audio> tag
		console.log(songNumber);
		if(song.paused == true) {
		console.log('Playing');
		$('.play-icon').removeClass('fa-play').addClass('fa-pause'); // This is known as 'chaining'
		song.play();
		// IsPlaying = true
		}
		else {
		console.log('Pausing');
		$('.play-icon').removeClass('fa-pause').addClass('fa-play');
		song.pause();
		// IsPlaying = false
		}
	}
	
	// we are passing in the whole song object to it as a parameter
	// Whenever the function is called, we want it to update the song
	function changeCurrentSongDetails(songObj) { 
		$('.current-song-image').attr('src','img/' + songObj.image) // This means we are using jQuery to select the element with class 'current-song-image'
		$('.current-song-name').text(songObj.name) // songObj.name means accessing the 'name' property of the object we got
		$('.current-song-album').text(songObj.album)
	}
	
	// function ko define  kar rahe hai uski current time ko update krne k liye
	function updateCurrentTime() {
		var song = document.querySelector('audio');
		var currentTime = Math.floor(song.currentTime); // Removes decimal values
		currentTime = fancyTimeFormat(currentTime); // Make the look good
		var duration = Math.floor(song.duration); // song.duration tells us how long is the song in seconds
		duration = fancyTimeFormat(duration)
		$('.time-elapsed').text(currentTime);
		$('.song-duration').text(duration);
	}
	
	// Is function ko use karke direct song ke end me pahuch jayenge
	function timeJump() {
    var song = document.querySelector('audio')
    song.currentTime = song.duration - 5;
 }
 
		// call our function now
		// changeCurrentSongDetails() functions gets the song Object SOMEHOW
		function addSongNameClickEvent(songObj,position) {
			var songName = songObj.fileName; // Line Added
		    var id= '#song' + position; // song
			$(id).click(function() {
				var audio = document.querySelector('audio');
				var currentSong = audio.src;
				if(songNumber != position) // weak equality, versus strong
				{
				
				audio.src = songName; // audio.src = songObj.name;
				songNumber = position; // Uploading songNumber with new value
				changeCurrentSongDetails(songObj); // Function call
				}
				toggleSong();
			});
		}
		
	// Whenever	the HTML document is loaded, only after that,	run his function
	window.onload = function() {

    
		changeCurrentSongDetails(songs[0]); // Calling our function for the first time
		updateCurrentTime(); // updateCurrentTime function is called
		setInterval(function() { // setInterval jitne milliseconds bolte ho, unte samay ke baad, baar baar jo function ke andar code hai usko run karta rehta hai
		updateCurrentTime();
		},1000);
		// Now at soon as our website is loaded, updateCurrentTime runs and then after every 1 second, setInterval makes it run again

 
       // Fetch from database- AJAX, Backend , Server se yeh information maangte hain

		for(var i =0; i < songs.length;i++) {
			var obj = songs[i];
			var name = '#song' + (i+1);
			var song = $(name);
			song.find('.song-name').text(obj.name);
			song.find('.song-artist').text(obj.artist);
			song.find('.song-album').text(obj.album);
			song.find('.song-length').text(obj.duration);
			addSongNameClickEvent(obj,i+1)//function call To pass the whole object, we'll just write this
	}
		$('#songs').DataTable({
        paging: false
    });
  }
  
  function randomExcluded(min, max, excluded) {
    var n = Math.floor(Math.random() * (max-min) + min);
    if (n >= excluded) n++;
    return n;

}
  
   $('audio').on('ended',function() { // This event is fired automatically whenever the song stops playing
    var audio = document.querySelector('audio');
    if (willShuffle == 1) {
        var nextSongNumber = randomExcluded(1,4,currentSongNumber); // Calling our function from Stackoverflow
        var nextSongObj = songs[nextSongNumber-1];
        audio.src = nextSongObj.fileName;
        toggleSong();
        changeCurrentSongDetails(nextSongObj);
        currentSongNumber = nextSongNumber;
    }
    else if(currentSongNumber < 4) { // Play the next song
        var nextSongObj = songs[currentSongNumber];
        audio.src = nextSongObj.fileName;
        toggleSong();
        changeCurrentSongDetails(nextSongObj);
        currentSongNumber = currentSongNumber + 1;
    }
    else if(willLoop == 1) { // Play the first song now
        var nextSongObj = songs[0];
		// songs[1] value = songNumber 2
		//  songs[0] value = songNumber 1
        audio.src = nextSongObj.fileName;
        toggleSong();
        changeCurrentSongDetails(nextSongObj);
        currentSongNumber =  1;
    }
    else {  // Stop Playing
        $('.play-icon').removeClass('fa-pause').addClass('fa-play');
        audio.currentTime = 0;
    }
	// The else if and else part only run if the if condition is false i.e. we are only the last song
 })
 
	// We denote jquery by $ sign
	// on click par run karega
    $('.welcome-screen button').on('click', function() {
        var name = $('#name-input').val();
        if (name.length > 2) {
            var message = "Welcome, " + name; // Welcome is called a string
            $('.main .user-name').text(message);
            $('.welcome-screen').addClass('hidden');
            $('.main').removeClass('hidden');
        } else {
            $('#name-input').addClass('error');
        }
    }); //Agar name ki length 2 se badi hai toh if ke andar ka code run karo varna else ke andar ka code run karo

		
		$('.fa-repeat').on('click',function() {
		$('.fa-repeat').toggleClass('disabled')
		willLoop = 1 - willLoop;
	});
	
		$('.fa-random').on('click',function() {
		$('.fa-random').toggleClass('disabled')
		willShuffle = 1 - willShuffle;
	});
	
    $('.play-icon').on('click', function() { // Select element with 'play-icon' class using jQuery
		//function is calling 
        toggleSong();
		
    });
	
   $('body').on('keypress',function(event) { // Instead of on 'click', we are using on 'keypress'
    var target = event.target;//tag information is being stored here
    if (event.keyCode == 32 && target.tagName !='INPUT') // keyCode is 32 i.e. spacebar
    {
        toggleSong();
    }
 });
			
			
	


	
	
 