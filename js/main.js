const keys = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG",
  "KeyH", "KeyJ", "KeyK", "KeyW", "KeyE", "KeyT", "KeyY", "KeyU"];
const noteFrequencies = {  // frequencies starting with middle C
  'A': 261.626,
  'W': 277.183,
  'S': 293.665,
  'E': 311.127,
  'D': 329.628,
  'F': 349.228,
  'T': 369.994,
  'G': 391.995,
  'Y': 415.305,
  'H': 440.000,
  'U': 466.164,
  'J': 493.883,
  'K': 523.252
}

// listener for when a key is pressed
document.addEventListener("keypress", function(event) {
  if (keys.indexOf(event.code) === -1) {
    console.log("ERROR: invalid key pressed!");
  } else {
    let audio = document.createElement("AUDIO");
    animateKeyPress(event);
    playNote(noteFrequencies[event.key.toLocaleUpperCase()]);
  }
});

function animateKeyPress(event) {
  let key = document.getElementById(event.key.toLocaleUpperCase());
  key.style.backgroundColor = "gray";

  // listener for when the key is released
  document.addEventListener("keyup", function() {
    if (key.parentElement.classList.contains("white-keys")) {
      key.style.backgroundColor = "white"; // white key was released so set it back to white
    }
    else {
      key.style.backgroundColor = "black";
    }
  });
}

let context = new AudioContext();
let o = null;
let g = null;
function playNote(frequency) {
  o = context.createOscillator();
  g = context.createGain();
  o.type = 'sine';
  o.connect(g);
  o.frequency.value = frequency;
  g.connect(context.destination);
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
}


