class AddTimestampsToTransactions < ActiveRecord::Migration[5.0]
  def change
    add_column :transactions, :created_at, :datetime
    add_column :transactions, :updated_at, :datetime
  end
end
