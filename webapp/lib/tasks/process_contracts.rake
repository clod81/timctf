namespace :webapp do
  namespace :contracts do

    desc "Process contracts that are in redis queue"
    task :process => :environment do
      puts "processing contracts"
      Tasks::ProcessContracts.run
    end

  end
end
