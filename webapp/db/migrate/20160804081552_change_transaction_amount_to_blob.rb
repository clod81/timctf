class ChangeTransactionAmountToBlob < ActiveRecord::Migration[5.0]
  def change
    change_column :transactions, :amount, :blob
  end
end
