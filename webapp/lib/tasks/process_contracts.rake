namespace :webapp do
  namespace :contracts do

    desc "Process contracts that are in redis queue"
    task :process => :environment do
      while true do
        puts "processing contracts"
        Tasks::ProcessContracts.run
        sleep 15
      end
    end

  end
end
