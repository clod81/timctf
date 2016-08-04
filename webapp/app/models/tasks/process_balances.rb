module Tasks
  class ProcessBalances # pool balances from ethereum

    class << self

      def run
        User.all.to_a.each do |u|
          from_redis = Webapp.redis.get("eth:account:#{u.eth_address}")
          if from_redis != nil && from_redis != ''
            balance = from_redis.to_i
            if u.balance.to_i != balance
              u.update(balance: balance)
            end
          end
        end
      end

    end

  end
end
