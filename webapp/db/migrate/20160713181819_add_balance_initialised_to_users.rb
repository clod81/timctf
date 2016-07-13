class AddBalanceInitialisedToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :balance_initialised, :boolean
  end
end
