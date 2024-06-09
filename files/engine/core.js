error = new Audio("https://banami.nekoweb.org/files/sounds/nope.mp3");
error.volume = 0.5;

enter = new Audio("https://banami.nekoweb.org/files/sounds/heal.mp3");
enter.volume = 0.5;

hueh = new Audio("https://banami.nekoweb.org/files/sounds/bg.mp3");

class Trace {
  constructor() {
    this.tracertype = { warn: "Warning", note: "Notice" };
    this.color = { warn: "#ff0019", note: "#ffa600" };
  }

  trace(txt, ty, ...nono) {
    const pat = `color: ${this.color[ty]}; font-weight: bold; font-family: Consolas, monospace; font-size: 13px;`;

    if (nono.length > 0 || !(ty in this.tracertype)) {
      this.trace("An error occurred while attempting to execute a trace command. Was the trace command written correctly?", "warn");
    } else if (ty === "warn") {
      console.error(`%c[ ${this.tracertype[ty]} ] %c${txt}`, pat, '');
    } else if (ty === "note") {
      console.warn(`%c[ ${this.tracertype[ty]} ] %c${txt}`, pat, '');      
    }
  }
}

const engineLog = new Trace();
const trace = engineLog.trace.bind(engineLog);
trace("Trace logger is active.", "warn");

window.addEventListener('error', function(event) {
  const cause = event.message;
  const orgin = event.filename;
  const linum = event.lineno;
  const linno = event.colno;
  const error = event.error || new Error(cause);

  trace(`An error occurred during runtime\n${orgin}:${linum}: ${error}`,"warn");
  event.preventDefault(); 
  return true;
});

function hikki() {
  const playAudio = () => {
    hueh.play().then(() => { });
  };

  hueh.addEventListener("ended", () => {
    hueh.currentTime = 0;
    playAudio();
    trace("hikki", "note");
  });

  document.body.addEventListener("click", playAudio, { once: true });
}

let currentPage = "";
let banamiPfpStatus = true;

function nekoPage(pageName) {

  if (currentPage === pageName) {
    trace("Already on the same page", "note");
    error.play();
    trace("Error play!", "note");
    return;
  }

  const titleMain = document.getElementById("neko-title");
  const textMain = document.getElementById("neko-text");
  const body = document.body;
  const backButton = document.querySelector(".neko-back-button");
  const banamiPfp = document.getElementById("bana-img-pfp");

  const url = `https://banami.nekoweb.org/pages/${pageName}/index.json`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        trace("JSON error.", "warn");
        error.play();
        trace("Error play!", "note");
      }
      return response.json();
    })
    .then((data) => {
      document.title = data.banamiTitle || "Banami | PukaCyi";

      const title = data.banamiTitle ? data.title : data.title;

      titleMain.innerHTML = title;
      textMain.innerHTML = parseText(data.text);

      if (banamiPfpStatus !== false) {
        banamiPfp.remove();
        banamiPfpStatus = false;
        trace("Removed avatar from state", "note");
      } else {
        trace("Avatar isn't on state. Doing nothing.", "note");
      }
    
    if (data.banamiBackground !== undefined) {
      body.style.backgroundImage = `url(${data.banamiBackground})`;
      body.style.position = "fixed";
      body.style.top = "0";
      body.style.left = "0";
      body.style.width = "100%";
      body.style.height = "100%";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center";
      body.style.zIndex = "-1";
    } else {
      body.style.backgroundImage = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.width = '';
      body.style.height = '';
      body.style.backgroundRepeat = '';
      body.style.backgroundSize = '';
      body.style.backgroundPosition = '';
      body.style.zIndex = '';
    }


      
      trace("Enter play!", "note");
      enter.play();

      backButton.style.display = "inline-block";

      currentPage = pageName;
    })
    .catch((error) => {
      trace(`An error occurred: ${error.message}`, "warn");
      error.play();
      trace("Error play!", "note");
      titleMain.textContent = "Whoops!";
      textMain.innerHTML = "Don’t fret — let's give it another try! Please refresh the page, and if the problem presists, file a report at <a href='https://github.com/PukaCyi/Banami/issues'>Github</a>.";
    });
}

function parseText(text) {
  text = text.replace(/<br>/g, "<br/>");

  text = text.replace(/<span(.*?)>(.*?)<\/span>/g, function (match, p1, p2) {
    let styles = "";
    if (p1.trim() !== "") {
      styleMatches = p1.match(/style=['"](.*?)['"]/);
      if (styleMatches && styleMatches.length > 1) {
        styles = styleMatches[1];
      }
    }
    return `<span style="${styles}">${p2}</span>`;
  });
  return text;
}
