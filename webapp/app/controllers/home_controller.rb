class HomeController < ApplicationController

  before_action :authenticate_user!,    except: :index
  before_action :check_initial_balance, only: :create

  def index
  end

  # start - get balance - one off background operation...
  def create
    if request.xhr? # don't make it too easy
      redirect_to root_path
      return
    end
    current_user.delay.init_balance
    # create an easy race condizio...
    sleep 0.8
    current_user.update(balance_initialised: true)
    flash[:notice] = "Please wait for balance to be set in ehterum..."
    redirect_to root_path
  end

  private

  def check_initial_balance
    unless current_user.balance_initialised
      return true
    end
    flash[:error] = "You already initialised your balance"
    redirect_to root_path
    false
  end

end
