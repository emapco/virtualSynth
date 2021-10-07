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
document.getElementById('applyFilter1').addEventListener('click',
  function () {
    openFilterTab('1');
});
document.getElementById('applyFilter2').addEventListener('click',
  function () {
    openFilterTab('2');
});

function openFilterTab(oscStr) {
  let otherOscStr = (oscStr === '1') ? '2' : '1';
  let selectedTabDiv = document.getElementById("oscFilter" + oscStr);
  let otherTabDiv = document.getElementById("oscFilter" + otherOscStr);
  let selectedTabButton = document.getElementById("applyFilter" + oscStr);
  let otherTabButton = document.getElementById("applyFilter" + otherOscStr);
  selectedTabDiv.style.display = 'flex';
  otherTabDiv.style.display = 'none';
  selectedTabButton.className = 'active';
  otherTabButton.className = '';
}

/************************
* AUDIO SECTION
 ************************/
// Synthesize audio code block
let context = new (window.AudioContext || window.webkitAudioContext)();
function playNote(frequency) {
  // initialize variables needed to create a oscillator
  let gainVal = Number(document.getElementById('oscGain').value);
  let filterOn = document.getElementById('filterOn1').checked
  let filterFrequency = Number(document.getElementById('filterCutoff1').value);
  let filterGain = Number(document.getElementById('filterGain1').value);
  let filterQ = Number(document.getElementById('filterQ1').value);
  let filterType = null;
  let filterElements = document.getElementsByName('filter1');
  filterElements.forEach( function (item) {
    if(item.checked) {
      filterType = item.value;
    }
  });
  let wave = null;
  let waveElements = document.getElementsByName('soundWave');
  waveElements.forEach( function (item) {
    if(item.checked) {
      wave = item.value;
    }
  });
  // create the first oscillator
  createOsc(frequency, wave, filterOn, filterType, filterFrequency,
    filterGain, filterQ, gainVal)

  // create the second oscillator if on
  if (document.getElementById('osc2On').checked) {
    // initialize variables for second oscillator
    gainVal = Number(document.getElementById('osc2Gain').value);
    filterOn = document.getElementById('filterOn2').checked
    let filterFrequency = Number(document.getElementById('filterCutoff2').value);
    let filterGain = Number(document.getElementById('filterGain2').value);
    let filterQ = Number(document.getElementById('filterQ2').value);
    let filterType = null;
    let filterElements = document.getElementsByName('filter2');
    filterElements.forEach( function (item) {
      if(item.checked) {
        filterType = item.value;
      }
    });
    wave = null;
    waveElements = document.getElementsByName('soundWave2');
    waveElements.forEach( function (item) {
      if(item.checked) {
        wave = item.value;
      }
    });
    // create the second oscillator
    createOsc(frequency, wave, filterOn, filterType, filterFrequency,
      filterGain, filterQ, gainVal)
  }
}

function createOsc(oscFrequency, wave, filterOn, filterType, filterFrequency,
                   filterGain, filterQ, gainVal) {
  let volume = context.createGain();
  let filter = context.createBiquadFilter();
  let osc = context.createOscillator();

  if (filterOn) {
    osc.connect(filter);
    filter.connect(volume);
    filter.type = filterType;
    filter.frequency.value = filterFrequency;
  } else {
    osc.connect(volume); // can't connect osc to gain if using filter.
    // set components' values
  }

  volume.connect(context.destination);
  osc.type = wave
  osc.frequency.value = oscFrequency;
  volume.gain.value = gainVal/100;
  volume.gain.exponentialRampToValueAtTime(0.00005, context.currentTime + 1);

  osc.start(0);
}

// set octave range code block
let octave = 0;
function changeOctave(value) {
  if (value === 1  && octave < 4) {
    octave++;
  } else if (value === -1 && octave > -3) {
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
