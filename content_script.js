var styleElement = document.createElement('style');
let cachedTerms = [];
const elementsWithTextContentToSearch = "a, p, h1, h2, h3, h4, h5, h6";
const containerElements = "span, div, li, th, td, dt, dd";


let isTextBlockingEnabled = true

// Check if text blocking should be enabled
if (isTextBlockingEnabled) {
  // Every time a page is loaded, check our spoil terms and block,
  // after making sure settings allow blocking on this page.
  chrome.storage.sync.get(null, (result) => {
    // Don't manipulate the page if blocking is snoozed
    if (result.isSnoozeOn && !isSnoozeTimeUp(result.timeToUnsnooze)) {
      return;
    }
    // Don't manipulate the page if the user hasn't entered any terms
    if (!result.spoilerterms) {
      return;
    }

    enableMutationObserver();
    cachedTerms = result.spoilerterms;
    blockSpoilerContent(document, result.spoilerterms, "***");


  });
}

function blockSpoilerContent(rootNode, spoilerTerms, blockText) {
  // Search innerHTML elements first
  let nodes = rootNode.querySelectorAll(elementsWithTextContentToSearch)
  replacenodesWithMatchingText(nodes, spoilerTerms, blockText);

  // Now find any container elements that have just text inside them
  nodes = findContainersWithTextInside(rootNode);
  if (nodes && nodes.length !== 0) {
    replacenodesWithMatchingText(nodes, spoilerTerms, blockText);
  }
}

// function pluralize(word) {
//   if (word.endsWith('s')) {
//       return word + 'es'; // Example: word ends with "s" -> cats -> cates
//   } else {
//       return word + 's'; // Example: word doesn't end with "s" -> cat -> cats
//   }
// }

// function replacenodesWithMatchingText(nodes, spoilerTerms, replaceString) {
//   nodes = Array.from(nodes);
//   nodes.reverse();
//   for (const node of nodes) {
//       for (const spoilerTerm of spoilerTerms) {
//           if (compareForSpoiler(node, spoilerTerm)) {
//               if (!node.parentNode || node.parentNode.nodeName === "BODY") {
//                   // ignore top-most node in DOM to avoid stomping entire DOM
//                   // see issue #16 for more info
//                   continue;
//               }
//               const originalText = node.textContent;
//               const spoilerVariations = [spoilerTerm, pluralize(spoilerTerm)];
//               const spoilerRegex = new RegExp(`\\b(?:${spoilerVariations.join('|')})\\b`, "ig");
//               const newText = originalText.replace(spoilerRegex, replaceString);
//               if (originalText !== newText) {
//                   node.className += " hidden-spoiler";
//                   node.innerHTML = newText;
//                   blurNearestChildrenImages(node);
//               }
//           }
//       }
//   }
// }
function pluralize(word) {
  if (word.endsWith('s')) {
    return word + 'es'; // Example: word ends with "s" -> cats -> cates
  } else {
    return word + 's'; // Example: word doesn't end with "s" -> cat -> cats
  }
}

function compareForSpoiler(node, spoilerTerm) {
  // Implement your logic for comparing node's content with spoilerTerm
  // This function should return true if the content matches, false otherwise
  // Example:
  return node.textContent.toLowerCase().includes(spoilerTerm.toLowerCase());
}

function blurNearestChildrenImages(node) {
  // Implement your logic for blurring nearest children images
  // This function should apply blur effect to images within the given node
  // Example:
  const images = node.querySelectorAll('img');
  images.forEach(image => {
    image.style.filter = 'blur(100px)';
  });
}

function checkIfWordsMatchHyphenated(node, spoilerTerm) {
  const words = spoilerTerm.split(' ');
  const hyphenatedTerm = words.join('-');
  
  if (compareForSpoiler(node, hyphenatedTerm)) {
    return hyphenatedTerm;
  }
  
  return null;
}

function replacenodesWithMatchingText(nodes, spoilerTerms, replaceString) {
  nodes = Array.from(nodes);
  nodes.reverse();
  for (const node of nodes) {
    for (const spoilerTerm of spoilerTerms) {
      const matchedTerm = checkIfWordsMatchHyphenated(node, spoilerTerm);
      if (matchedTerm) {
        if (!node.parentNode || node.parentNode.nodeName === "BODY") {
          // ignore top-most node in DOM to avoid stomping entire DOM
          // see issue #16 for more info
          continue;
        }
        const originalText = node.textContent;
        const spoilerVariations = [
          matchedTerm,
          pluralize(matchedTerm),
          ...matchedTerm.split(' ')
        ];
        const spoilerRegex = new RegExp(`\\b(?:${spoilerVariations.join('|')})\\b`, "ig");
        const newText = originalText.replace(spoilerRegex, replaceString);
        if (originalText !== newText) {
          node.className += " hidden-spoiler";
          node.innerHTML = newText;
          blurNearestChildrenImages(node);
        }
      }
    }
  }
}



function compareForSpoiler(nodeToCheck, spoilerTerm) {
  const regex = new RegExp(spoilerTerm, "i");
  return regex.test(nodeToCheck.textContent);
}

function blurNearestChildrenImages(nodeToCheck) {
  // Traverse up a level and look for images, keep going until either
  // an image is found or the top of the DOM is reached.
  // This has a known side effect of blurring ALL images on the page
  // if an early spoiler is found, but ideally will catch the nearest images
  let nextParent = nodeToCheck;
  let childImages;
  const maxIterations = 3;
  let iterationCount = 0;
  do {
    nextParent = nextParent.parentNode;
    if (nextParent && nextParent.nodeName !== "BODY") {
      childImages = nextParent.parentNode.querySelectorAll('img');
    }
    iterationCount++;
  } while (nextParent && childImages.length === 0 && iterationCount < maxIterations)

  // Now blur all of those images found under the parent node
  if (childImages && childImages.length > 0) {
    for (const image of childImages) {
      image.className += " blacked-out";
    }
  }
}

function findContainersWithTextInside(targetNode) {
  const containerNodes = targetNode.querySelectorAll(containerElements);
  const emptyNodes = [];
  for (const containerNode of containerNodes) {
    const containerChildren = containerNode.childNodes;
    for (const containerChild of containerChildren) {
      if (containerChild.textContent) {
        emptyNodes.push(containerChild.parentNode);
      }
    }
  }
  return emptyNodes;
}

function applyBlurCSSToMatchingImages(nodes, spoilerTerms) {
  for (const node of nodes) {
    for (const spoilerTerm of spoilerTerms) {
      const regex = new RegExp(spoilerTerm, "i");
      if (regex.test(node.title) || regex.test(node.alt ||
        regex.test(node.src) || regex.test(node.name))) {
        node.className += " blurred";
        node.parentNode.style.overflow = "hidden";
      }
    }
  }
}

function enableMutationObserver() {
  // Detecting changed content using Mutation Observers
  //
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver?redirectlocale=en-US&redirectslug=DOM%2FMutationObserver
  // https://hacks.mozilla.org/2012/05/dom-mutationobserver-reacting-to-dom-changes-without-killing-browser-performance/
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  const observer = new MutationObserver((mutations, observer) => {
    // fired when a mutation occurs
    // console.log(mutations, observer);
    for (const mutation of mutations) {
      blockSpoilerContent(mutation.target, cachedTerms, "***");
    }
  });

  // configuration of the observer:
  const config = { attributes: true, subtree: true }
  // turn on the observer...unfortunately we target the entire document
  observer.observe(document, config);
  // disconnecting likely won't work since we need to continuously watch
  // observer.disconnect();
}




 
// reciving a message from the popup 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  console.log(sender);

  // Send a response asynchronously
  sendResponse("hello from the other sideeeee i'm backgrounddd");
});






chrome.runtime.onMessage.addListener((message,sender)=>{

  if (message.from === "settings" && message.query === "inject_side_bar"){

// inject the timer page 
// my container
const container = document.createElement("div")
container.setAttribute("id","container")



// the cover image //
const CoverDiv = document.createElement("div")
CoverDiv.setAttribute("class","cover")
let CoverImage = document.createElement("img")
let CoverImageURL = chrome.runtime.getURL("./images/coverBackground.png")

CoverImage.src = CoverImageURL

CoverDiv.appendChild(CoverImage)

// append it to main container
container.appendChild(CoverDiv)

////////////////////////////


// the back arrow //
const BackArrow = document.createElement("div")
BackArrow.setAttribute("id","backArrow")
// here we will make it minimize the tab for later

////////////////////////////



// the mainform div//
const MainDiv = document.createElement("div")
MainDiv.setAttribute("id","mainform")




// the Header div
const HeaderDiv = document.createElement("div")
HeaderDiv.setAttribute("id","Header")


const BreakH2 = document.createElement("h2")
BreakH2.setAttribute("id","h2")
BreakH2.innerHTML="Break"

const InSessionPar = document.createElement("p")
InSessionPar.innerHTML=" in Session"


// appending the elements to the div
BreakH2.appendChild(InSessionPar)

HeaderDiv.appendChild(BreakH2)

MainDiv.appendChild(HeaderDiv)


// append it to main container
container.appendChild(MainDiv)



////////////////////////////


//box div

const BoxDiv = document.createElement("div")
BoxDiv.setAttribute("id","box")

// time remaining text
const TimeRemaining = document.createElement("h2")
TimeRemaining.setAttribute("id","h2")
TimeRemaining.innerHTML="Time Remaining"
// app div
const AppDiv = document.createElement("div")
AppDiv.setAttribute("id","app")

BoxDiv.appendChild(TimeRemaining)
BoxDiv.appendChild(AppDiv)

// append it to main container
container.appendChild(BoxDiv)


////////////////////////////



// timer controller 
const ModifyTimer = document.createElement("div")
ModifyTimer.setAttribute("id","modifyTimer")
const PauseBut = document.createElement("button")
PauseBut.innerHTML = "Pause"
PauseBut.setAttribute("class","ModifyButtons")

const stopBut = document.createElement("button")
stopBut.innerHTML = "Stop"
stopBut.setAttribute("class","ModifyButtons")


ModifyTimer.appendChild(PauseBut)
ModifyTimer.appendChild(stopBut)


// append to main container

container.appendChild(ModifyTimer)


// append to dom
document.body.appendChild(container)


// timerrr

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const TIME_LIMIT = 600; // 1 hour and 1 minute in seconds
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
  TIME_LIMIT
)}</span>

</div>
`;


// TIMER LOGIC
startTimer();

function onTimesUp() {
  clearInterval(timerInterval);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTime(
      timeLeft
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}


function formatTime(time) {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return formattedTime;
}


function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction;
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} ${FULL_DASH_ARRAY}`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

// Add event listeners to the buttons
PauseBut.addEventListener("click", pauseTimer);
stopBut.addEventListener("click", stopTimer);

let isPaused = false;

function pauseTimer() {
  if (isPaused) {
    // Resume timer
    startTimer();
    isPaused = false;
    PauseBut.textContent = "Pause";
  } else {
    // Pause timer
    clearInterval(timerInterval);
    isPaused = true;
    PauseBut.textContent = "Resume";
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timePassed = 0;
  timeLeft = TIME_LIMIT;
  setCircleDasharray();
  setRemainingPathColor(timeLeft);
  document.getElementById("base-timer-label").innerHTML = formatTime(
    timeLeft
  );
  isPaused = false;
}


////////////////

  }
})




// const container = document.createElement("div")
// // container.setAttribute("id","container")



// container.innerHTML= `
// <div id="mySidebar" class="sidebar" >
// <span class="material-icons">
// arrow_circle_right
// </span>
// </div>
// `

// document.body.appendChild(container)


// var mini = true;

// function toggleSidebar() {
//   if (mini) {
//     console.log("opening sidebar");
//     document.getElementById("mySidebar").style.width = "250px";
//     document.getElementById("main").style.marginLeft = "250px";
//     mini = false;
//   } else {
//     console.log("closing sidebar");
//     document.getElementById("mySidebar").style.width = "85px";
//     document.getElementById("main").style.marginLeft = "85px";
//     mini = true;
//   }
// }

// let icon = document.getElementById("mySidebar")
// let main = document.getElementById("main")
// icon.addEventListener("mouseover" , toggleSidebar)
// main.addEventListener("mouseover" , toggleSidebar)

// icon.addEventListener("mouseout" , toggleSidebar)
// main.addEventListener("mouseout" , toggleSidebar)