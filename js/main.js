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
window.addEventListener('load', function () {
  openFilterTab('1');
});
// listener for when a key is pressed
document.addEventListener("keypress", function(event) {
  keyPressListener(event.key.toUpperCase(), "keypress");
});
// listener for when the key is released
document.addEventListener("keyup", function (event) {
  keyReleaseListener(event.key.toUpperCase());
});
document.getElementById("octave-up1").addEventListener("click", function () {
  changeOctave(1, 1);
});
document.getElementById("octave-down1").addEventListener("click", function () {
  changeOctave(-1, 1);
});
document.getElementById("octave-up2").addEventListener("click", function () {
  changeOctave(1, 2);
});
document.getElementById("octave-down2").addEventListener("click", function () {
  changeOctave(-1, 2);
});
document.querySelectorAll("kbd").forEach(item => {
  item.addEventListener("click", function (event) {
    let key = event.target.id
    keyPressListener(key, "click")
  });
});
document.getElementById('applyFilterButton1').addEventListener('click',
  function () {
    openFilterTab('1');
});
document.getElementById('applyFilterButton2').addEventListener('click',
  function () {
    openFilterTab('2');
});

/************************
* AUDIO SECTION
 ************************/
let context = new (window.AudioContext || window.webkitAudioContext)();
function playNote(baseFrequency) {
  // initialize variables needed to create a oscillator
  for (let i = 1; i < 3; i++) {
    if (document.getElementById('oscOn' + i).checked) {
      let actualFrequency = calculateFrequency(baseFrequency, i-1);
      // main osc settings
      let wave = $('#oscWave' + i).val();
      let gainVal = Number(document.getElementById('oscGain' + i).value);
      // filter settings
      let filterOn = document.getElementById('filterOn' + i).checked;
      let filterType = $("#filter" + i).val();
      let filterGain = Number(document.getElementById('filterGain' + i).value);
      let filterFrequency = scaleLog(Number(document.getElementById(
        'filterCutoff' + i).value), 10, 20000);
      let filterQ = Number(document.getElementById(
        'filterQ' + i).value);
      // create the oscillator
      createOsc(actualFrequency, wave, filterOn, filterType, filterFrequency,
        filterGain, filterQ, gainVal);
    }
  }
}

function createOsc(oscFrequency, wave, filterOn, filterType, filterFrequency,
                   filterGain, filterQ, gainVal) {
  let volume = context.createGain();
  let filter = context.createBiquadFilter();
  let osc = context.createOscillator();

  // connect filter nodes if enabled
  if (filterOn) {
    osc.connect(filter);
    filter.connect(volume);
    filter.type = filterType;
    filter.frequency.value = filterFrequency;
  } else {
    osc.connect(volume); // can't connect osc to gain if using filter.
  }

  // connect remainder of nodes
  volume.connect(context.destination);
  osc.type = wave;
  osc.frequency.value = oscFrequency;
  volume.gain.value = gainVal/100;
  volume.gain.setTargetAtTime(0, context.currentTime, .1);
  // start oscillator
  osc.start(0);
  osc.stop(context.currentTime + 2.5);
}

// set octave range code block
let octaves = [0, 0];
function changeOctave(value, oscNum) {
  let index = (oscNum === 1) ? 0 : 1;
  if (value === 1  && octaves[index] < 4) {
    octaves[index]++;
  } else if (value === -1 && octaves[index] > -3) {
    octaves[index]--;
  }

  // update the labels text in html
  if (octaves[index] === 0) {
    document.getElementById("octave-label" + oscNum).innerText = '-';
  } else {
    document.getElementById("octave-label"+ oscNum).innerText = octaves[index];
  }
}

function calculateFrequency(noteFrequency, index) {
  if (octaves[index] === 0) {
    return noteFrequency;
  }
  return Math.round(Math.pow(2, octaves[index])*noteFrequency*1000)/1000
}


/************************
 * Listener Functions
 ************************/
function keyPressListener(key, type) {
  if (key == null || keys.indexOf(key) === -1) {
  } else {
    animateKeyPress(key, type);
    playNote(noteFrequencies[key]);
  }
}

function keyReleaseListener(key) {
  if (key == null || keys.indexOf(key) === -1) return;
  let key_element = document.getElementById(key);
  key_element.style.backgroundColor = (key_element.parentElement.id === "white-keys-container")
    ? "white" : "rgb(33, 37, 41)";
}

/************************
 * Other
 ************************/
function animateKeyPress(key, type) {
  let key_element = document.getElementById(key);
  key_element.style.backgroundColor = "gray";
  if (type === "click") {
    setTimeout(() => {keyReleaseListener(key)}, 10);
  }
}

function scaleLog(number, min, max) {
  let oldMin = 1;
  let oldMax = 100;
  let newMin = Math.log(min);
  let newMax = Math.log(max);
  let factor = (newMax-newMin) / (oldMax - oldMin);
  return Math.exp(newMin + factor*(number-oldMin));
}

function openFilterTab(oscStr) {
  let otherOscStr = (oscStr === '1') ? '2' : '1';
  let selectedTabDiv = document.getElementById("oscFilterTab" + oscStr);
  let otherTabDiv = document.getElementById("oscFilterTab" + otherOscStr);
  //let selectedTabButton = document.getElementById("applyFilterButton" + oscStr);
  //let otherTabButton = document.getElementById("applyFilterButton" + otherOscStr);
  selectedTabDiv.style.display = "flex";
  otherTabDiv.style.display = "none";
  //selectedTabButton.className += " active";
  //otherTabButton.className.replace("active", "");
}
