let error = new Audio("https://banami.nekoweb.org/files/sounds/nope.mp3");
let enter = new Audio("https://banami.nekoweb.org/files/sounds/heal.mp3");
let hueh = new Audio("https://banami.nekoweb.org/files/sounds/bg.mp3");
hueh.loop = true;

/* def volumes after audios loaded */
enter.volume = 0.5;
error.volume = 0.5;
hueh.volume = 0.95;

class Trace {
  constructor() {
    this.tracertype = { warn: "Warning", note: "Notice" };
    this.color = { warn: "#ff0019", note: "#ffa600" };
  }

  trace(txt, ty, ...nono) {
    const pat = `color: ${this.color[ty]}; font-weight: bold; font-family: Consolas, monospace; font-size: 13px;`;

    if (nono.length > 0 || !(ty in this.tracertype)) {
      console.error(`%c[ ${this.tracertype.warn} ] %cAn error occurred while attempting to execute a trace command. Was the trace command written correctly?`, pat, '');
    } else if (ty === "warn") {
      console.error(`%c[ ${this.tracertype.warn} ] %c${txt}`, pat, '');
    } else if (ty === "note") {
      console.warn(`%c[ ${this.tracertype.note} ] %c${txt}`, pat, '');      
    }
  }
}

const engineLog = new Trace();
const trace = engineLog.trace.bind(engineLog);
/** For some reason, periods at the end of "org" still makes the site load - though that's broken so we'll redirect
 * user to actual site lolz **/
 
/** take notes: 
 * window.location.hostname = gives cur url
 * window.location.protocol = cur protocol (https more than likely) - used this to prevent accidental dos
 * currentPos = where the user was at (ex: /dev?urltext_598345928) | merge of hash, pathname, and search
**/

if (window.location.hostname !== "banami.nekoweb.org" || window.location.protocol !== "https:") {// do not remove location protocol, that will dos the site.
    currentPos = window.location.pathname + window.location.search + window.location.hash;
    
    trace("Invalid path, correcting\n\nUser was at:" + window.location.hostname + window.location.pathname + window.location.search + window.location.hash + "\nprotocol used: "+ window.location.protocol, "warn");
    window.location.href = "https://banami.nekoweb.org" + currentPos;
}

trace("Logger is running :).", "note");


window.addEventListener('error', function(event) {
  const cause = event.message;
  const orgin = event.filename;
  const linum = event.lineno;
  const linno = event.colno;
  const errorObj = event.error || new Error(cause);

  trace(`Exception occurred during runtime: \n${orgin}:${linum}: ${errorObj.stack}`, "warn");
  event.preventDefault(); 
  return true;
});

function hikki() {
  const playAudio = () => {
            try {
            hueh.play();
        } catch (error) {
            trace(`Can't play :(: ${error.message}`, "warn");
        }
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
    try {
        trace("Error play!", "note");
        error.play();
    } catch (error) {
        trace(`Can't play :(: ${error.message}`, "warn");
    }
    return;
  }

  const titleMain = document.getElementById("neko-title");
  const textMain = document.getElementById("neko-text");
  const html = document.documentElement; 
  const backButton = document.querySelector(".neko-back-button");
  const banamiPfp = document.getElementById("bana-img-pfp");

  const url = `https://banami.nekoweb.org/pages/${pageName}/index.json`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        trace("JSON error.", "warn");
        try {
            trace("Error play!", "note");
            error.play();
        } catch (error) {
            trace(`Can't play :(: ${error.message}`, "warn");
        }
        throw new Error("JSON fetch failed");
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
      // commenting these lines out to prevent console spam (yucky)
      // } else {
        // trace("Avatar isn't on state. Doing nothing.", "note");
      }

      if (data.banamiBackground !== undefined) {
        html.style.backgroundImage = `url(${data.banamiBackground})`;
        html.style.position = "fixed";
        html.style.top = "0";
        html.style.left = "0";
        html.style.width = "100%";
        html.style.height = "100%";
        html.style.backgroundRepeat = "no-repeat";
        html.style.backgroundSize = "cover";
        html.style.backgroundPosition = "center";
        html.style.zIndex = "-1";
      } else {
        html.style.backgroundImage = '';
        html.style.position = '';
        html.style.top = '';
        html.style.left = '';
        html.style.width = '';
        html.style.height = '';
        html.style.backgroundRepeat = '';
        html.style.backgroundSize = '';
        html.style.backgroundPosition = '';
        html.style.zIndex = '';
    }
    
    try {
        trace("Enter play!", "note");
        enter.play();
    } catch (error) {
        trace(`Can't play :(: ${error.message}`, "warn");
    }

      backButton.style.display = "inline-block";

      currentPage = pageName;
    })
    .catch((error) => {
        try {
            trace("Error play!", "note");
            error.play();
        } catch (error) {
            trace(`Can't play :(: ${error.message}`, "warn");
        }
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