import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
  static targets = ["skip", 
                    "buttoncount", 
                    "movie", 
                    "movieguess", 
                    "skipbutton", 
                    "title", 
                    "nextmovie",
                    "squares",
                    "searchfield"]


  connect(){
    document.addEventListener("autocomplete.change", this.autocomplete.bind(this))
    // setting movie name on page load, afterthat removed from dom
    this.movieName = this.titleTarget.dataset.movie
    this.titleTarget.remove()
    // getting movieid
    this.movie = this.movieTarget.dataset.movieid

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
    }

    if(movieGuess.length >= 1){
      this.movieguessTarget.dataset.mguess = this.getcurrentMovieGuess()
      // this.addSkipped(movieGuess.length);
    }
    if(gameStatus === "completed") {
      this.skipbuttonTarget && this.removeSkipButton();
      this.searchfieldTarget && this.searchfieldTarget.remove();
      movieGuess && this.addMovieNameButton(movieGuess);
    }

    if(["failed", "completed"].includes(gameStatus)){
      this.countDownTimer(this.nextmovieTarget)
    }

    this.addRedGreenSqures(movieGuess)
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
    // setting currentmovie guess value
    let mguess = this.movieguessTarget.dataset.mguess ?  this.movieguessTarget.dataset.mguess.split(",").filter(item => item) : this.movieguessTarget.dataset.mguess += "skipped,"

    if(mguess.length == maxCount){
      this.removeSkipButton()
      localStorage.setItem("gameStatus", "failed")
    } else {
      let currentGuess = this.movieguessTarget.dataset.mguess += "skipped,"
      localStorage.setItem("currentMovieGuess", currentGuess)
      this.addSkipbutton()
    }  
  }
  // search field autocomplete event
  autocomplete(e) {
    let movieMatch = e.detail.value.toLowerCase() === this.movieName.toLowerCase()

    let color = movieMatch ? "success" : "danger"
    let icon = movieMatch ? "check" : "x"

    let movieMatchHtml = `<div class='wm-guess ${movieMatch ? "border-green" : "border-red"}'>
      <span class="text-${color} fas fa-${icon}"></span>
      <span class="text-${color} skipped-text">${e.detail.value ? e.detail.value : this.movieName }</span>
    </div>`

    this.movieguessTarget.dataset.mguess += e.detail.value
    let currentMovieGuess = localStorage.getItem("currentMovieGuess") ? (localStorage.getItem("currentMovieGuess") + `${e.detail.value},`) : `${e.detail.value},`

    let cmg = currentMovieGuess.split(",").filter(item => item)
    if(cmg.length < 5){
      localStorage.setItem("currentMovieGuess", currentMovieGuess)
    }

    if(movieMatch){
      this.movieguessTarget.innerHTML += movieMatchHtml
      localStorage.setItem("gameStatus", "completed")
      this.removeSkipButton()
      this.searchfieldTarget.remove();
      localStorage.setItem("buttons", 5)
      this.addNumbersButton()
      this.squaresTarget.innerHTML += `<span class="square green"></span>`
    }else {
      this.movieguessTarget.innerHTML += movieMatchHtml
      this.squaresTarget.innerHTML += `<span class="square red"></span>`
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

  addSkipped(buttons){
    let skippedHtml = `<div class="wm-guess" style="border: 1px solid red; border-left-width: 5px;">
        <span class="text-danger fas fa-x"></span>
        <span class="text-danger skipped-text">Skipped</span>
      </div>`
      
    if(buttons) {
      for(let i = 0; i < buttons; i++){
        this.movieguessTarget.innerHTML += skippedHtml
      }
    } 
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
    this.skipbuttonTarget.remove()
  }

  countDownTimer(nextmovie){
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

  socialIconsLinks(){
    let url = window.location
    `<a class="twitter-share-button"
    href="https://twitter.com/intent/tweet?text=${url}">
    Tweet</a>`
  }
}