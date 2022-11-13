class Admin::MoviesController < ApplicationController

  before_action :set_movie, only: [:show, :destroy, :publish, :edit, :update]
  def new
    @movie = Movie.new
  end

  def index
    @movies = Movie.order(day: :desc).last(7)
  end

  def show
  end

  def create
    @movie = Movie.new(movie_params)
    mve ||= Movie.count > 0 ? Movie.last.day : nil
    if mve.present?
      @movie.day = mve + 1
    else
      @movie.day = (Date.today - Movie::START_DATE).to_i
    end
    @movie.movie_uniq_id = Time.now.to_formatted_s(:number)
    if @movie.save
      redirect_to admin_movies_path
    else
      render 'new'
    end
  end

  def edit
    
  end

  def update
    @movie.update(movie_params)
    redirect_to admin_movie_path(params[:id])
  end
  

  def destroy
    @movie.destroy
    redirect_to admin_movies_path
  end

  def publish
    @movie.update(publish: true)
    redirect_to admin_movie_path(params[:id]) 
  end

  private
  def set_movie
    @movie = Movie.find(params[:id])
  end

  def movie_params
    params.require(:movie).permit(:hardest, :harder, :hard, :easy, :easiest, :title, :contributor, :day)
  end
end
