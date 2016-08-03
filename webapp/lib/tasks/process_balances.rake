namespace :webapp do
  namespace :balances do

    desc "Process balances from etherem"
    task :process => :environment do
      puts "processing balances"
      Tasks::ProcessBalances.run
    end

  end
end
