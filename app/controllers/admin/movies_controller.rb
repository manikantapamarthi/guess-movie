class Admin::MoviesController < ApplicationController
  
  def new
    @movie = Movie.new
  end

  def index
    @movies = Movie.all
  end

  def create
    @movie = Movie.new(movie_params)
    if @movie.save
      redirect_to admin_movies_path
    else
      render 'new'
    end
  end

  private
  def movie_params
    params.require(:movie).permit(:hardest, :harder, :hard, :easy, :easiest, :title)
  end
end
