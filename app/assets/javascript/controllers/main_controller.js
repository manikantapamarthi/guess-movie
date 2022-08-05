import { Controller } from "@hotwired/stimulus"
import { movieNames } from "./movies_list_controller"
import { composeSquares,countDownTimer } from "./share_controller"

export const stats = {
  gamesPlayed: 0,
  gamesWon: 0
}

export const SITE_URL = "cheppuko.herokuapp.com"
export default class extends Controller {
  static targets = ["skip", 
                    "buttoncount", 
                    "movie", 
                    "movieguess", 
                    "skipbutton", 
                    "title", 
                    "nextmovie",
                    "squares",
                    "searchfield",
                    "moviename",
                    "socialIcons"]


  connect(){
    console.log(`Made with ♥ RubyOnRails`)
    document.addEventListener("autocomplete.change", this.autocomplete.bind(this))

    let checkStats = localStorage.hasOwnProperty("stats")
    
    if (!checkStats) {
      localStorage.setItem("stats", JSON.stringify(stats));
    }

    this.getWinParcent()
    // setting movie name on page load, afterthat removed from dom
    if (this.titleTarget) {
      this.movieName = this.titleTarget.dataset.movie
      this.day = this.titleTarget.dataset.day
    }
    this.resetLocalStorage(this.day)
    localStorage.setItem("day", this.day)
    this.titleTarget.remove()
    // getting movieid
    this.movie = this.movieTarget && this.movieTarget.dataset.movieid

    this.getGameStatus();

    let buttons = localStorage.getItem("buttons")
    this.count = buttons ? buttons : 1

    let movieGuess = localStorage.getItem("currentMovieGuess") ? localStorage.getItem("currentMovieGuess").split(",").filter(item => item) : ""
  
    if (buttons > 1){
      for(let i = 0; i < buttons; i++){
        this.skipTarget.innerHTML += `<a data-button=${i + 1}
                                      href=/movies/get_frame?b=${i + 1}&format=turbo_stream
                                   data-turbo-frame=movie_${this.movie}
                                    > 
                                      ${i + 1}
                                    </a>`
      }
    } else {
      this.skipTarget.innerHTML += `<a data-button=${this.count}
                                    href=/movies/get_frame?b=${1}&format=turbo_stream
                                    data-turbo-frame=movie_${this.movie}
                                  >
                                    ${this.count}
                                  </a>`
      localStorage.setItem("buttons", 1)
    }
    
    let gameStatus = localStorage.getItem("gameStatus")

    if(movieGuess.length === 5 && gameStatus=== "failed") {
      this.skipbuttonTarget && this.removeSkipButton();
      this.searchfieldTarget && this.searchfieldTarget.remove();
      this.addMovieName()
    }

    if(movieGuess.length >= 1){
      this.movieguessTarget.dataset.mguess = this.getcurrentMovieGuess()
      // this.addSkipped(movieGuess.length);
    }
    if(gameStatus === "completed") {
      this.skipbuttonTarget && this.removeSkipButton();
      this.searchfieldTarget && this.searchfieldTarget.remove();
    }

    if(["failed", "completed"].includes(gameStatus)){
      countDownTimer(this.nextmovieTarget)
      this.addSocialIcons()
    }

    if(movieGuess){
      this.addMovieNameButton(movieGuess);
      this.addRedGreenSqures(movieGuess)
    }
    this.newautocomplete()
  }
  
  getGameStatus(){
    let gameStatus = localStorage.getItem("gameStatus")
    if(["completed", "failed"].includes(gameStatus)) {
      localStorage.setItem("gameStatus", gameStatus)
    }else{
      localStorage.setItem("gameStatus", "running")
    }
  }

  getcurrentMovieGuess(){
    return localStorage.getItem("currentMovieGuess")
  }
  
  skip(){
    const maxCount = 5
    if (this.count < maxCount){
      this.increment()
      this.addButton(this.count)
    }
    localStorage.setItem("buttons", this.count)
    
    let movieGuess = localStorage.getItem("currentMovieGuess") ? localStorage.getItem("currentMovieGuess") + "skipped," : "skipped,"
  
    localStorage.setItem("currentMovieGuess", movieGuess)
    
    let mguess = localStorage.getItem("currentMovieGuess") ? localStorage.getItem("currentMovieGuess").split(",").filter(item => item) : ["skipped"]
    
    if(mguess.length === maxCount){
      this.skipbuttonTarget && this.removeSkipButton();
      this.searchfieldTarget && this.searchfieldTarget.remove();
      localStorage.setItem("gameStatus", "failed");
      this.updateGamesPlayed();
      this.addMovieName();
      this.addSocialIcons();
      countDownTimer(this.nextmovieTarget);
      this.getWinParcent()
      // this.stats()
    } else {
      this.squaresTarget.innerHTML += `<span class="square red"></span>`
      this.addSkipbutton();
      let button = localStorage.getItem("buttons")
      this.clickOnNextGuess(button);
    }  
  }
  // search field autocomplete event
  newautocomplete(){
    const autoCompleteJS = new autoComplete({
      selector: "#autoComplete",
      placeHolder: "Search for Movie",
      data: {
        src: movieNames,
        cache: true
      },
      resultItem: {
        highlight: true
      },
      events: {
        input: {
          selection: (event) => {
            const selection = event.detail.selection.value;
            autoCompleteJS.input.value = selection;
            this.autocomplete(event);
          }
        }
      }
    })
  }

  autocomplete(e) {
    let movieMatch = e.detail.selection.value.toLowerCase() === this.movieName.toLowerCase()

    let color = movieMatch ? "success" : "danger"
    let icon = movieMatch ? "check" : "x"

    let movieMatchHtml = `<div class='wm-guess ${movieMatch ? "border-green" : "border-red"}'>
      <span class="text-${color} fas fa-${icon}"></span>
      <span class="text-${color} skipped-text">${e.detail.selection.value ? e.detail.selection.value : this.movieName }</span>
    </div>`

    this.movieguessTarget.dataset.mguess += `${e.detail.selection.value},`
    let currentMovieGuess = localStorage.getItem("currentMovieGuess") ? (localStorage.getItem("currentMovieGuess") + `${e.detail.selection.value},`) : `${e.detail.selection.value},`

    let cmg = currentMovieGuess.split(",").filter(item => item)
    
    if(cmg.length <= 5){
      localStorage.setItem("currentMovieGuess", currentMovieGuess)
    }

    let numberButtons = localStorage.getItem("buttons")
    
    let buttonCount = parseInt(numberButtons) + 1
      
    if(movieMatch){
      this.movieguessTarget.innerHTML += movieMatchHtml
      localStorage.setItem("gameStatus", "completed")
      this.skipbuttonTarget && this.removeSkipButton();
      this.searchfieldTarget.remove();
      localStorage.setItem("buttons", 5)
      this.addNumbersButton();
      this.squaresTarget.innerHTML += `<span class="square green"></span>`
      this.movienameTarget.innerHTML = `<p>You got it - The answer was <span class="lawngreen">${this.movieName}</span></p>`
      countDownTimer(this.nextmovieTarget);
      this.addSocialIcons();
      this.stats()
    } else {
      this.increment()
      this.movieguessTarget.innerHTML += movieMatchHtml
      this.squaresTarget.innerHTML += `<span class="square red"></span>`
      this.assingButtonNumber(buttonCount);
      this.addNumbersButton();
      this.clickOnNextGuess(buttonCount);
      this.removeSearchSkip(cmg);
    }
  }

  assingButtonNumber(buttonCount){
    if(buttonCount <= 5){
      localStorage.setItem("buttons", buttonCount)
    }
  }

  clickOnNextGuess(button) {
    let btn = button.toString();
    document.querySelector(`[data-button="${btn}"]`).click()
  }

  removeSearchSkip(cmg){
    if(cmg.length === 5){
      localStorage.setItem("gameStatus", "failed")
      this.skipbuttonTarget && this.removeSkipButton()
      this.searchfieldTarget && this.searchfieldTarget.remove();
      this.addMovieName()
      this.addSocialIcons()
    }
  }

  addRedGreenSqures(movieGuess){
    movieGuess.forEach(e => {
      let movieMatch = e.toLowerCase() === this.movieName.toLowerCase()
      movieMatch ?
        (this.squaresTarget.innerHTML += `<span class="square green"></span>`) :
        (this.squaresTarget.innerHTML += `<span class="square red"></span>`)
    });
  }

  addNumbersButton(){
    let buttons = localStorage.getItem("buttons")
    this.skipTarget.innerHTML = ""
    for(let i = 0; i < buttons; i++){
      this.skipTarget.innerHTML += `<a data-button=${i + 1}
                                    href=/movies/get_frame?b=${i + 1}&format=turbo_stream
                                data-turbo-frame=movie_${this.movie}
                                  > 
                                    ${i + 1}
                                  </a>`
    }
  }
  
  addButton(count){
    this.skipTarget.innerHTML += `<a data-button=${count} 
                                    href=/movies/get_frame?b=${count}&format=turbo_stream
                                    data-turbo-frame=movie_${this.movie}
                                  >
                                  ${count}
                                </a>`
  }

  addSkipped(){
    let skippedHtml = `<div class="wm-guess" style="border: 1px solid red; border-left-width: 5px;">
        <span class="text-danger fas fa-x"></span>
        <span class="text-danger skipped-text">Skipped</span>
      </div>`
      this.movieguessTarget.innerHTML += skippedHtml
    // if(buttons) {
    //   for(let i = 0; i < buttons; i++){
    //     this.movieguessTarget.innerHTML += skippedHtml
    //   }
    // } 
    // else {
    //   this.movieguessTarget.innerHTML += skippedHtml
    // }
  }

  addSkipbutton(){
    this.movieguessTarget.innerHTML += `<div class="wm-guess" style="border: 1px solid red; border-left-width: 5px;">
                                          <span class="text-danger fas fa-x"></span>
                                          <span class="text-danger skipped-text">Skipped</span>
                                        </div>`
  }

  addMovieNameButton(movieGuess){
    movieGuess.forEach(e => {
      this.movieNameSkipbutton(e)
    });
  }

  addMovieName(){
    this.movienameTarget.innerHTML = `<p>The answer was <span class="lawngreen">${this.movieName}</span></p>`
  }

  movieNameSkipbutton(e){
    let movieMatch = e.toLowerCase() === this.movieName.toLowerCase()

    let color = movieMatch ? "success" : "danger"
    let icon = movieMatch ? "check" : "x"

    let movieMatchHtml = `<div class='wm-guess ${movieMatch ? "border-green" : "border-red"}'>
      <span class="text-${color} fas fa-${icon}"></span>
      <span class="text-${color} skipped-text">${e}</span>
    </div>`
    this.movieguessTarget.innerHTML += movieMatchHtml
  }

  movieGuesstarget(){
    return this.movieguessTarget.dataset.mguess
  }

  removeEmptyValue(){
    return this.movieguessTarget.dataset.mguess.split(",").filter(item => item)
  }

  increment(){
    this.count++
  }

  skipbutton(){
    this.skipTarget.innerHTML
  }

  removeSkipButton() {
    this.skipbuttonTarget && this.skipbuttonTarget.remove()
  }

  resetLocalStorage(day){
    let localDate = localStorage.getItem("day")
    if (localDate !== day) {
      localStorage.setItem("gameStatus", "running")
      localStorage.setItem("currentMovieGuess", "")
      localStorage.setItem("buttons", 1)
    }
  }

  addSocialIcons(){
    this.socialIconsTarget.innerHTML = `<img data-action="click->main#tshare" src="/assets/twitter.png">`
  }

  tshare(){
    let url = encodeURI(window.location)
    let text = encodeURIComponent(`\nCheppuko Day ${this.day}: ${this.count}/5 \n`)
    let movieGuess = localStorage.getItem("currentMovieGuess")
    let squares = composeSquares(movieGuess, this.movieName);
    let tag = encodeURIComponent(`\n #cheppuko`)
    window.open("https://twitter.com/intent/tweet?text="+url+text+squares+tag)
  }
 
  updateGamesPlayed(){
    stats["gamesPlayed"] += 1
    localStorage.setItem("stats",  JSON.stringify(stats))
  }
  
  stats() {
    stats["gamesPlayed"] += 1
    stats["gamesWon"] += 1
    localStorage.setItem("stats",  JSON.stringify(stats))
    let winParcentage = (stats["gamesPlayed"] / stats["gamesWon"]) * 100
    document.getElementById("percent").innerHTML = winParcentage
    document.getElementById("played-stat").innerHTML = stats["gamesPlayed"]
    document.getElementById("won-stat").innerHTML = stats["gamesWon"]
  }
  getWinParcent(){
    let stats = JSON.parse(localStorage.getItem("stats"))
    
    let winParcentage = (stats.gamesPlayed / stats.gamesWon) * 100
    document.getElementById("percent").innerHTML = winParcentage
    document.getElementById("played-stat").innerHTML = stats.gamesPlayed
    document.getElementById("won-stat").innerHTML = stats.gamesWon
  }

}