class AddTransactionIndex < ActiveRecord::Migration[5.0]
  def change
    add_index :transactions, :user_id
    add_index :transactions, :to_user_id
  end
end
