class MoviesController < ApplicationController
  
  def index
    @movie = Movie.last
    @image = @movie&.hardest
  end

  def get_frame
    movie = Movie.last
    
    @image = case params["b"]
    when "5"
      movie.easiest
    when "4"
      movie.easy
    when "3"
      movie.hard
    when "2"
      movie.harder
    when "1"
      movie.hardest
    end
    respond_to do |format|
      format.turbo_stream do 
        render turbo_stream: turbo_stream.replace(movie, partial: "movies/image", locals: {image: @image, movie: movie})
      end
      format.html
    end
  end
end



#do |format|
 #       render turbo_stream: turbo_stream.replace(@movie.id, partial:"movies/image", locals: {pic: @image})
  #    end 