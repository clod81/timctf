module Tasks
  class ProcessContracts

    class << self

      def run
        from_redis = Webapp.redis.get("webapp:operations")
        if from_redis != nil && from_redis != ''
          Webapp.redis.set("webapp:operations", '[]')
          parsed = JSON.parse(from_redis)
          parsed.each do |contract|
            Transaction.create(user_id: contract['from_id'].to_i, to_user_id: contract['to_id'].to_i, amount: contract['amount'].to_i)
          end
        end
      end

    end

  end
end