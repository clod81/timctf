Rails.application.routes.draw do
  devise_for :users

  post 'home/create', to: 'home#create', as: 'home_create'

  root 'home#index'
end
