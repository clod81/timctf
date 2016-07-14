class CreateTransactions < ActiveRecord::Migration[5.0]
  def change
    create_table :transactions do |t|
      t.integer :user_id
      t.integer :to_user_id
      t.integer :amount
      t.boolean :approved
      t.timestamps null: false
    end
  end
end
