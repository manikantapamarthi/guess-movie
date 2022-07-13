import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["skip", "buttoncount", "movie", "movieguess"]

  connect(){
    this.movie = this.movieTarget.dataset.movie
    let buttons = localStorage.getItem("buttons")
    this.count = buttons ? buttons : 1 
    if (buttons){
      this.addSkipped(buttons)
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
                                 movies/get_frame
                                  >
                                    ${this.count}
                                  </a>`
      localStorage.setItem("buttons", 1)
    }
  }
  
  skip(){
    const maxCount = 5
    if (this.count < maxCount){
      this.increment()
      this.addButton(this.count)
      this.addSkipped()
    }
    localStorage.setItem("buttons", this.count)
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
    let skippedHtml = `<div class="wm-guess">
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

  increment(){
    this.count++
  }

  skipbutton(){
    this.skipTarget.innerHTML
  }

  buttonCount(){
    
  }

}