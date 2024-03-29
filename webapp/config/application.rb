require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Webapp
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # disabled secure headers, who bloody needs them...
    config.action_dispatch.default_headers.clear

    # config.active_job.queue_adapter = :sidekiq
    config.active_job.queue_name_prefix = "#{Rails.env}:carbonz:"
  end
end
