class MoviesController < ApplicationController
  include MoviesNamesHelper

  def index
    @movie = Movie.last
    @image = @movie&.hardest
  end

  def get_frame
    movie = Movie.last

    image = {"1" => movie.hardest, 
              "2" => movie.harder, 
              "3" => movie.hard, 
              "4" => movie.easy, 
              "5" => movie.easiest}
              
    @image = image[params["b"]]          
    
    respond_to do |format|
      format.turbo_stream do 
        render turbo_stream: turbo_stream.replace(movie, partial: "movies/image", locals: {image: @image, movie: movie})
      end
      format.html
    end
  end

  def search_movie
    @movie_names = movie_names.select{|m| m.downcase.include? "#{params["q"]}".downcase}
    render layout: false
  end
end
