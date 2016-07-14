class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  has_many :transactions
  has_many :approved_transactions, -> { where("approved = true") }, class_name: 'Transaction', foreign_key: 'user_id'
  has_many :received_transactions, class_name: 'Transaction', foreign_key: 'to_user_id'
  has_many :approved_received_transactions, -> { where("approved = true") }, class_name: 'Transaction', foreign_key: 'to_user_id'

  def init_balance
    # send request to etherum...
    self.balance = balance + 100000000 # race condizio
    self.save
  end
end
