Rails.application.routes.draw do
  devise_for :users

  post 'home/create', to: 'home#create', as: 'home_create'

  resources :transactions, only: [:index, :create, :destroy] do
    post :csv
  end

  root 'home#index'
end
