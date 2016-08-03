class HomeController < ApplicationController

  before_action :authenticate_user!,    except: :index
  before_action :check_initial_balance, only: :create
  before_action :load_transactions,     except: :create

  def index
  end

  def create
    if request.xhr?
      render nothing: true
      return
    end
    current_user.update(balance_initialised: true)
    current_user.init_eth_account
    flash[:notice] = "Please wait at least one minute before start using the system, for user to be created in ethereum..."
    redirect_to root_path
  end

  private

  def check_initial_balance
    unless current_user.balance_initialised
      return true
    end
    flash[:error] = "You already initialised your user"
    redirect_to root_path
    false
  end

end
