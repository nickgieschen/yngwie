let settings = {
  randomize: true,
  interval: 1500,
  delayForTab: 0,
  repeat: true,
  speedChange: 500
};

let commands = {
  "pause": () => pause(),
  "continue": () => cont(),
  "slow down": () => slowDown(),
  "speed up": () => speedUp()
};

let runner = null;
let tests = ["C", "F", "G", "D"];
let nextIndex = 0;
let displayTestTimeout;

function nextTest() {
// todo randomize
  let test = tests[nextIndex];
  nextIndex++;
  if (nextIndex === tests.length) {
    nextIndex = 0;
    if (!settings.repeat) {
      console.log("not repeating");
      clearInterval(runner);
    }
  }
  return test;
}

function pause() {
  clearTimeout(displayTestTimeout);
  displayStatusMessage("Pausing...")
}

function cont() {
  displayTest()
  displayStatusMessage("Continuing...")
}

function slowDown() {
  settings.interval += settings.speedChange;
  displayStatusMessage(`Slowing to ${settings.interval} ms...`)
}

function speedUp() {
  let newInterval = settings.interval - settings.speedChange;
  if (newInterval > 0) {
    settings.interval = newInterval;
    displayStatusMessage(`Speeding up to ${settings.interval} ms...`)
  } else {
    displayStatusMessage("Can't speed up any more.")
  }
}

function displayStatusMessage(message) {
  let span = document.createElement("span");
  span.innerText = message;
  let statusMessageEl = document.getElementById("statusMessage");
  statusMessageEl.innerHTML = "";
  statusMessageEl.appendChild(span);
  window.setTimeout(() => span.classList.toggle("fade"), 1500)
}

function displayTest() {
  console.log("starting");
  let test = nextTest();
  document.getElementById("test").innerText = test;
  setTimeout(() => jtab.render(document.getElementById("tab"), test), settings.delayForTab);
  displayTestTimeout = setTimeout(displayTest, settings.interval)
}

function processCommand(commandText) {
  console.log(commandText);
  let command = commands[commandText];
  if (command) {
    command();
  }
}

function startVoiceCommands() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function (event) {

      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          processCommand(event.results[i][0].transcript.trim().toLowerCase());
        }
      }
    };

    recognition.onerror = function (e) {
      recognition.stop();
    }

  }
}

function populateSidebar() {
  Object.keys(commands).forEach(command => {
    let li = document.createElement("li");
    li.innerText = command;
    document.getElementById("voiceCommands").append(li)
  });

  Object.keys(settings).forEach(key => {
    let li = document.createElement("li");
    li.innerText = `${key}: ${settings[key]}`;
    document.getElementById("settings").append(li)
  });
}

document.addEventListener("DOMContentLoaded", function (event) {
  displayTest();
  populateSidebar();
  startVoiceCommands()
});

