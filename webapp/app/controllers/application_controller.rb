class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :set_socket_token

  private

  def set_socket_token
    if user_signed_in?
      @uuid = UUID.new.generate
      Webapp.redis.setex("webapp:#{current_user.id}", 3600, @uuid)
      Webapp.redis.setex("webapp:#{@uuid}", 3600, current_user.id)
    end
  end
end
