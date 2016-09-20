namespace :webapp do
  namespace :balances do

    desc "Process balances from etherem"
    task :process => :environment do
      while true do
        puts "processing balances"
        Tasks::ProcessBalances.run
        sleep 15
      end
    end

  end
end
