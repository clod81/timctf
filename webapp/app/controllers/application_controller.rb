class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action :set_socket_token

  private

  def set_socket_token
    if current_user
      @uuid = UUID.new.generate
      Webapp.redis.setex("webapp:#{current_user.id}", 3600, @uuid)
    end
  end
end
