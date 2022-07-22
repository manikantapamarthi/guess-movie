import { Controller } from "@hotwired/stimulus"


export default class extends Controller {
  static targets = ["skip", "buttoncount", "movie", "movieguess", "skipbutton", "title"]

  connect(){
    document.addEventListener("autocomplete.change", this.autocomplete.bind(this))
    this.movieName = this.titleTarget.dataset.movie
    this.titleTarget.remove()
    this.movie = this.movieTarget.dataset.movie
    let buttons = localStorage.getItem("buttons")
    this.count = buttons ? buttons : 1
    let movieGuess = this.getcurrentMovieGuess() ? this.getcurrentMovieGuess().split(",").filter(item => item) : ""

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

    if(movieGuess.length === 5) {
      this.removeSkipButton();
    }
    if(movieGuess.length > 1){
      this.movieguessTarget.dataset.mguess = this.getcurrentMovieGuess()
      this.addSkipped(movieGuess.length);
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
      this.addSkipped()
    }
    localStorage.setItem("buttons", this.count)
    // setting currentmovie guess value
    let mguess = this.movieGuesstarget() ?  this.removeEmptyValue() : ""
    if(mguess.length === maxCount){
      this.removeSkipButton()
    } else {
      let currentGuess = this.movieguessTarget.dataset.mguess += "skipped,"
      localStorage.setItem("currentMovieGuess", currentGuess)
    }  
  }
  // search field autocomplete event
  autocomplete(e) {
    let movieMatchHtml = `<div class="wm-guess" style="border: 1px solid green;">
      <span class="text-success fas fa-check"></span>
      <span class="text-success skipped-text">${this.movieName}</span>
    </div>`

    let movieMatch = e.detail.value.toLowerCase() === this.movieName.toLowerCase()
    if(movieMatch){
      this.movieguessTarget.innerHTML += movieMatchHtml 
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
    let skippedHtml = `<div class="wm-guess" style="border: 1px solid red;">
        <span class="text-danger fas fa-x"></span>
        <span class="text-danger skipped-text">Skipped</span>
      </div>`

    if(buttons) {
      for(let i = 0; i < buttons; i++){
        this.movieguessTarget.innerHTML += skippedHtml
      }
    } else {
      this.movieguessTarget.innerHTML += skippedHtml
    }
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

}