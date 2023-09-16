
window.addEventListener("beforeunload", () => {
    chrome.storage.sync.set({ setting1: false }, () => {
      console.log("Checkbox state reset to false on page reload");
    });
  });
  chrome.runtime.onMessage.addListener((message,sender)=>{
    if (message.from === "settings" && message.query === "inject_side_bar"){
  // inject the timer page 
  let mainDiv =  document.createElement("div")
  mainDiv.setAttribute("id","MindCuecontainer")
  mainDiv.innerHTML=`
  <div id="mySidebar" class="Msidebar">
  <div id = "backArrow">
      <a href="#"><span id="MindCueMaterial-icons">
        arrow_circle_right
      </span></a>
  </div>
  
  <div id="MainCont">
  <div id="cover"> 
  </div>
    <div id="mainform">
          <div id="BrowsingHeader">
            <h2>Browsing <p>in Session</p></h2>
          </div>
    <div id="Timerbox">
        <h2 id="Timer">
        Time Remaining
        </h2>
        <div id="app">
        </div>
      </div>
    </div>
        <div>
        <div id="pickTab">
  
      </div>
        <div id="modifyTimer">
        <button class="ModifyButtons" id= "pauseButton" type="submit">Pause</button>
         </div>
  </div>
  
  <div id="main">
    <h2</h2>
  </div>
  
  `
  // append to dom
  document.body.appendChild(mainDiv)
  
  // the cover image //
  // const CoverDiv = document.getElementById("cover")
  // let CoverImage = document.createElement("img")
  // let CoverImageURL = chrome.runtime.getURL("./images/coverBackground.png")
  
  // CoverImage.src = CoverImageURL
  
  // CoverDiv.appendChild(CoverImage)
  
  
  var mini = true;
  
  let icon = document.getElementById("mySidebar")
  icon.addEventListener("mouseover",toggleMySideBar)
  icon.addEventListener("mouseout",toggleMySideBar)
  
  function toggleMySideBar() {
    if (mini) {
      console.log("opening sidebar");
      document.getElementById("mySidebar").style.width = "380px";
      mini = false;
    } else {
      console.log("closing sidebar");
      document.getElementById("mySidebar").style.width = "85px";
      mini = true;
    }
    
  }
  let startrecordingdiv = document.getElementById("pickTab")
  startrecordingdiv.innerHTML= `
  
  <button id="toggleButton">Pick a Tab</button>
  
  `
  let isRecording = false; // Add this variable to track recording state
  const toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("click", () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });
  

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
  //  startTimer()
  
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
  pauseButton.addEventListener("click", pauseTimer);
  stopButton.addEventListener("click", stopTimer);
  
  let isPaused = false;
  
  function pauseTimer() {
    if (isPaused) {
      // Resume timer
      startTimer();
      isPaused = false;
      pauseButton.textContent = "Pause";
    } else {
      // Pause timer
      clearInterval(timerInterval);
      isPaused = true;
      pauseButton.textContent = "Resume";
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
  
  // Content Script
  
  // Function to start screen recording
  let stream;
  let recorder;
  const chunks = [];

// Function to start screen recording
async function startRecording() {
  try {
    // Start the timer
    startTimer();

    stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      // Combine all the recorded chunks into a single blob
      const blob = new Blob(chunks, { type: "video/webm" });

      // Create a video element to preview the recording
      const videoElement = document.createElement('video');
      videoElement.controls = true;
      document.body.appendChild(videoElement);
      videoElement.src = URL.createObjectURL(blob);

      console.log("Recording stopped.");
      toggleButton.textContent = "Pick a Tab"; // Update button text
      isRecording = false; // Update recording state
    };

    recorder.start();
    isRecording = true;

    console.log("Recording started.");
    toggleButton.textContent = "Stop Recording"; // Update button text
  } catch (error) {
    console.error("Error starting recording:", error);
  }
}
// ...

// Function to stop screen recording
function stopRecording() {
    if (isRecording) {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      isRecording = false;
      console.log("Recording stopped.");
      toggleButton.textContent = "Pick a Tab"; // Update button text
      
      // Stop and reset the timer
      stopTimer();
      
      // Save the video
      saveVideo();
    }
  }
  
  // Function to save the video
  function saveVideo() {
    // Combine all the recorded chunks into a single blob
    const blob = new Blob(chunks, { type: "video/webm" });
  
    // Create a video element to preview the recording
    const videoElement = document.createElement('video');
    videoElement.controls = true;
    document.body.appendChild(videoElement);
    videoElement.src = URL.createObjectURL(blob);
  
    console.log("Video saved.");
  }
  

    }
  })
  
  

  
  let cachedTerms = [];
  const elementsWithTextContentToSearch = "a, p, h1, h2, h3, h4, h5, h6";
  const containerElements = "span, div, li, th, td, dt, dd";
  
  // Check if text blocking should be enabled
  if (true) {
    // Every time a page is loaded, check our spoil terms and block,
    // after making sure settings allow blocking on this page.
    chrome.storage.sync.get(null, (result) => {
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