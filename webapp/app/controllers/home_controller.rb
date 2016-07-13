class HomeController < ApplicationController

  before_action :authenticate_user!, except: :index
  before_action :check_initial_balance, only: :create

  def index
  end

  # start - get balance - one off background operation...
  def create
    current_user.delay.init_balance
    # create an easy race condition...
    sleep 0.3
    current_user.update(balance_initialised: true)
    flash[:notice] = "Please wait for balance to be set in ehterum..."
    redirect_to root_path
  end

  private

  def check_initial_balance
    if current_user.balance.zero?
      return true
    end
    flash[:error] = "You already initialised your balance"
    redirect_to root_path
    false
  end

end
