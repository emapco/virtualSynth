const keys = ["A", "S", "D", "F", "G",
  "H", "J", "K", "W", "E", "T", "Y", "U", "O", "L", "P", ";"];
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
  'K': 523.252,
  'O': 554.365,
  'L': 587.330,
  'P': 622.254,
  ';': 659.255
}

/************************
 * EventListener SECTION
 ************************/
// listener for when a key is pressed
document.addEventListener("keypress", function(event) {
  keyPressListener(event.key.toUpperCase(), "keypress");
});
// listener for when the key is released
document.addEventListener("keyup", function (event) {
  keyReleaseListener(event.key.toUpperCase());
});
document.addEventListener("keydown", function(event) {
  let code = event.code
  if (code === "ArrowUp") {
    changeOctave(1);
  } else if (code === "ArrowDown") {
    changeOctave(-1)
  }
});
document.getElementById("octave-up").addEventListener("click", function () {
  changeOctave(1);
});
document.getElementById("octave-down").addEventListener("click", function () {
  changeOctave(-1)
});
document.querySelectorAll("kbd").forEach(item => {
  item.addEventListener("click", function (event) {
    let key = event.target.id
    keyPressListener(key, "click")
  });
});

/************************
* AUDIO SECTION
 ************************/
// Synthesize audio code block
let context = new AudioContext();
let o = null;
let o2 = null;
let g = null;
let g2 = null;
let osc2_on = false;
let wave_type = 'sine'
let wave_type2 = 'sine'
function playNote(frequency) {
  o = context.createOscillator();
  g = context.createGain();
  o.type = wave_type;
  o.connect(g);
  o.frequency.value = frequency;
  g.connect(context.destination);
  o.start(0);
  g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
  if (osc2_on) {
    o2 = context.createOscillator();
    g2 = context.createGain();
    o2.type = wave_type2
    o2.connect(g2);
    o2.frequency.value = frequency;
    g2.connect(context.destination);
    o2.start(0)
    g2.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
  }
}

// set octave range code block
let octave = 0;
function changeOctave(value) {
  if (value === 1  && octave < 6) {
    octave++;
  } else if (value === -1 && octave > -4) {
    octave--;
  }
  console.log(octave)
  // update value in html
  if (octave === 0) {
    document.getElementById("octave-label").innerText = '-';
  } else {
    document.getElementById("octave-label").innerText = octave;
  }
}

function calculateFrequency(noteFrequency) {
  if (octave === 0) {
    return noteFrequency;
  }
  return Math.round(Math.pow(2, octave)*noteFrequency*1000)/1000
}

function updateWave(wave, op) {
  if (op === 1) {
    wave_type = wave;
  }
  else {
    wave_type2 = wave;
  }
}

function enableOsc2(value) {
  osc2_on = value;
}

/************************
 * Listener Functions
 ************************/
function keyPressListener(key, type) {
  if (key == null || keys.indexOf(key) === -1) {
  } else {
    animateKeyPress(key, type);
    playNote(calculateFrequency(noteFrequencies[key]));
  }
}

function keyReleaseListener(key) {
  if (key == null || keys.indexOf(key) === -1) return;
  let key_element = document.getElementById(key);
  if (key_element.parentElement.id === "white-keys") {
    key_element.style.backgroundColor = "white"; // white key was released so set it back to white
  }
  else {
    key_element.style.backgroundColor = "black";
  }
}

/************************
 * Other
 ************************/
function animateKeyPress(key, type) {
  let key_element = document.getElementById(key);
  key_element.style.backgroundColor = "gray";
  if (type === "click") {
    setTimeout(() => {keyReleaseListener(key)}, 100);
  }
}
