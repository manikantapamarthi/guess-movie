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