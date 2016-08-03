class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  # eth app address: 0xd9f5634ca7c211d0ea17e5e8b9df2de261db1524

  has_many :transactions
  has_many :approved_transactions, -> { where("approved = true") }, class_name: 'Transaction', foreign_key: 'user_id'
  has_many :received_transactions, class_name: 'Transaction', foreign_key: 'to_user_id'
  has_many :approved_received_transactions, -> { where("approved = true") }, class_name: 'Transaction', foreign_key: 'to_user_id'

  def init_eth_account
    return unless eth_address.blank?
    self.eth_address = "0x" + (`yes '' | geth account new`).to_s.match(/{(.*?)}/)[0].gsub('{', '').gsub('}', '')
    self.save
  end
end
