class AccountGiveBalanceJob < ApplicationJob
  queue_as :urgent

  def perform(*users)
    
  end
end
