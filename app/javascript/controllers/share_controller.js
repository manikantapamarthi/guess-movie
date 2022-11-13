import { Controller } from "@hotwired/stimulus"

export const greenSquare = "✅";

export const redSquare = "🟥";

export const graySquare = "⬛";

export const blueSquare = "🟦";

export default class extends Controller {}

export const composeSquares = (movieguess, moviename) => {
  const buttons = 5
  let guess = movieguess.split(",").filter(item => item)
  let squares = "";
  for (let i = 0; i < buttons; i++) {
    if (guess[i] === moviename) {
      squares += greenSquare
    } else if ( guess[i] === undefined) {
      squares += graySquare
    } else {
      squares += redSquare
    }
  }
  return squares
}

export const countDownTimer = (nextmovie) => {
  setInterval(function() {
    var day = new Date()
    var hours = 24 - day.getHours();
    var min = 60 - day.getMinutes();
    if((min + '').length == 1){
      min = '0' + min;
    }
    var sec = 60 - day.getSeconds();
    if((sec + '').length == 1){
          sec = '0' + sec;
    };
     nextmovie.innerHTML = `<span>Next Movie in</span> <span>${hours}hrs : ${min}mins : ${sec}secs</span>` 
  }, 1000)
}

export const getConfetti = () => {
  var defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star'],
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
  };
  
  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star']
    });
  
    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle']
    });
  }
  
  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
}