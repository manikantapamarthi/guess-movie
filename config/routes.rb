Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "movies#index"
  resources :movies do 
    get 'get_frame', on: :collection
  end
  namespace :admin do 
    resources :movies
  end
end
