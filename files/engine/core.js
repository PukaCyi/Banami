/** Cyth: Banami@Cyberdevil - grabbed from internal-cyth **/
class Trace {
  constructor() {
    this.tracertype = { warn: "Warning", note: "Notice" };
    this.color = { warn: "#ff0019", note: "#ffa600" };
  }

  trace(txt, ty, ...nono) {
    const pat = `color: ${this.color[ty]}; font-weight: bold; font-family: Consolas, monospace; font-size: 13px;`;

    if (nono.length > 0 || !(ty in this.tracertype)) {
      this.trace("An exception occurred while attempting to execute a trace command. Was the trace command written correctly?", "warn");
    } else if (ty === "warn") {
      console.error(`%c[ ${this.tracertype[ty]} ] %c${txt}`, pat, '');
    } else if (ty === "note") {
      console.warn(`%c[ ${this.tracertype[ty]} ] %c${txt}`, pat, '');      
    }
  }
}

engineLog = new Trace();
trace = engineLog.trace.bind(engineLog);
trace("Active.","note");

window.addEventListener('error', function(event) {
  var cause = event.message;
  var orgin = event.filename;
  var linum = event.lineno;
  var linno = event.colno;
  var error = event.error || new Error(cause);

  trace(`An exception has occurred during runtime\n${orgin}:${linum}: ${error}`,"warn");
  event.preventDefault(); 
  return true;
});

function hikki() {
  const hueh = new Audio("https://banami.nekoweb.org/files/sounds/bg.mp3");
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
        trace("Something went wrong while handling an action. - No error provided (lol get better.)", "warn");
      }
      return response.json();
    })
    .then((data) => {
      document.title = data.banamiTitle || "Banami | PukaCyi";

      const title = data.banamiTitle ? data.title : data.title;

      titleMain.innerHTML = title;
      textMain.innerHTML = parseText(data.text);

      if (banamiPfpStatus != false) {
        banamiPfp.remove();
        banamiPfpStatus = false;
        trace("banamiPfp removed from state", "note");
      } else {
        trace("Nothing present on state; Doing nothing..", "note");
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
      }

      backButton.style.display = "inline-block";

      currentPage = pageName;
    })
    .catch((error) => {
      trace(`An exception has occurred: ${error.message}`, "warn");
      titleMain.textContent = "Something went wrong...";
      textMain.innerHTML = "Don’t fret — let's give it another try! Please refresh the page, and if the problem still occurs, file a report at <a href='https://github.com/PukaCyi/Banami/issues'>Github</a>.";
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
