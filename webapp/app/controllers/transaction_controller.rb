class TransactionController < ApplicationController

  before_action :authenticate_user!

  def create
  end

  # start - get balance - one off background operation...
  def create
    if request.xhr? # don't make it too easy
      render nothing: true
      return
    end

  end
  
end
