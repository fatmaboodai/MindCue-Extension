let timeLeft = 60;
let timer = document.getElementById('timeLeft');

function isTimeLeft() {
  return timeLeft > -1;
}

function runTimer(timerElement) {
	const timerCircle = timerElement.querySelector('svg > circle + circle');
	timerElement.classList.add('animatable');
	timerCircle.style.strokeDashoffset = 1;
    
	let countdownTimer = setInterval(function(){
		if(isTimeLeft()){
			const timeRemaining = timeLeft--;
			const normalizedTime = (60 - timeRemaining) / 60;
      // for clockwise animation
      // const normalizedTime = (timeRemaining - 60) / 60;
			timerCircle.style.strokeDashoffset = normalizedTime;
      timer.innerHTML = timeRemaining;
		} else {
			clearInterval(countdownTimer);
			timerElement.classList.remove('animatable');
		}  
	}, 1000);
}

runTimer(document.querySelector('.timer'));