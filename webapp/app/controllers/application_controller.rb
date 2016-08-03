class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :set_socket_token

  private

  def set_socket_token
    if user_signed_in?
      @uuid = UUID.new.generate
      Webapp.redis.setex("user:notifier:#{current_user.id}", 3600, @uuid)
      Webapp.redis.setex("user:notifier:#{@uuid}", 3600, current_user.id)
    end
  end

  def load_transactions
    if user_signed_in?
      @sent_transactions     = current_user.transactions.order("id desc")
      @received_transactions = current_user.received_transactions.order("id desc")
      @all_user_balances     = User.all.select("email, balance").where("id != ?", current_user.id).load
    end
  end
end
