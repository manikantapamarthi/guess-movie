import { Controller } from "@hotwired/stimulus"

export const greenSquare = "🟩";

export const redSquare = "🟥";

export const graySquare = "⬛";

export const blueSquare = "🟦";

export default class extends Controller {

}


export const composeSquares = (movieguess, day, count, moviename, gameStatus) => {
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
