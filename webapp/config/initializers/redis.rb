module Webapp
  def self.redis
    # @redis ||= ::Redis.new(host: Settings.redis.host, port: Settings.redis.port)
    @redis ||= ::Redis.new(
      host: 'localhost',
      port: '6379',
      reconnect_attempts: 3,
      connect_timeout: 3
    )
  end
end
