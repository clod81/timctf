class ChangeUserBalanceToBlob < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :balance, :blob
  end
end
