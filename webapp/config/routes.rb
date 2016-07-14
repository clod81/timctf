Rails.application.routes.draw do
  devise_for :users

  post 'home/create', to: 'home#create', as: 'home_create'

  resources :transactions, only: [:index, :create, :destroy] do
    collection do
      post :csv
    end
  end

  root 'home#index'
end
