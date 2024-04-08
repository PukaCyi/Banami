/** stealing from internal-cyth **/
const trace = function(txt, ty, ...nono) {
  const ver = { warn: "Warning", info: "Notice" };
  const hex = { warn: "#ff0019", info: "#ffa600" };
  const pat = `color: ${hex[ty]}; font-weight: bold; font-family: "Omori"; font-size: 13px;`;

  if (nono.length > 0 || !(ty in ver)) {
    trace("An exception has occurred while attempting to run a command.", "warn");
  } else {
    console.log(`%c[ ${ver[ty]} ] %c${txt}`, pat, '');
  }
};

window.onerror = function(errorMsg, url, lineNumber) {
  trace(`An internal failure has occurred while attempting to perform an operation. Error: "${errorMsg}" ${url}:${lineNumber}`, "warn");
};

let currentPage = "";
let banamiPfpStatus = true;

function nekoPage(pageName) {
  if (currentPage === pageName) {
    trace("Already on the same page", "info");
    return;
  }

  const titleMain = document.getElementById("neko-title");
  const textMain = document.getElementById("neko-text");
  const body = document.querySelector("body");
  const backButton = document.querySelector(".neko-back-button");
  const banamiPfp = document.getElementById("bana-img-pfp")
  
  const url = `https://banami.nekoweb.org/pages/${pageName}/index.json`;
    
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        trace("Something went wrong. (how fucking helpful lmao, you on your own for this)", "warn");
      }
      return response.json();
    })
    .then((data) => {
      document.title = data.banamiTitle || "whisper town | in-dev";

      const title = data.banamiTitle ? data.title : data.title;

      titleMain.innerHTML = title;
      textMain.innerHTML = parseText(data.text);
      
      if (banamiPfpStatus != false) {
            banamiPfp.remove();
            banamiPfpStatus = false;
            trace("pfp removed", "info");
      } else {
          trace("pfp dead lol, doing nothing.","info");
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
      titleMain.textContent = "Womp womp";
      textMain.textContent =
        "Looks like you just tried making Orange Joe.... guess you didn't like it";
    });

  if (currentPage != "dni") {
    body.style.backgroundIMage = "none";
  }
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

function hikki() {
  const hueh = new Audio("https://banami.nekoweb.org/files/sounds/bg.mp3");
  const playAudio = () => {
    hueh.play().then(() => {});
  };

  hueh.addEventListener("ended", () => {
    hueh.currentTime = 0;
    playAudio();
    trace("hikki", "info");
  });

  document.body.addEventListener("click", playAudio, { once: true });
}
