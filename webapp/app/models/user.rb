class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  # eth app address: 0xd9f5634ca7c211d0ea17e5e8b9df2de261db1524
  # keystore: {"address":"0f12ea1a029dfea2c5ddfeeb6e8f072e692bd048","crypto":{"cipher":"aes-128-ctr","ciphertext":"56e3e039fcd4616b307b3f60c2eff1bba109eee0ac02f6605661fd998c9609a2","cipherparams":{"iv":"a0bcccb42dc8f8266dfc8a846b3b40e0"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"851c29f496bbd72653767c4250dbc2dcedd62c0f616062614a5976f99cc0fb54"},"mac":"cb9f87d5766f8736d17f96e8f3ab3e70ab57345e21e52994956a3fa8010c5f45"},"id":"993bfe29-03e8-4953-bfee-b89acb362958","version":3}

  has_many :transactions
  has_many :approved_transactions, -> { where("approved = true") }, class_name: 'Transaction', foreign_key: 'user_id'
  has_many :received_transactions, class_name: 'Transaction', foreign_key: 'to_user_id'
  has_many :approved_received_transactions, -> { where("approved = true") }, class_name: 'Transaction', foreign_key: 'to_user_id'

  def init_eth_account
    return unless eth_address.blank?
    self.eth_address = "0x" + (`yes '' | geth account new`).to_s.match(/{(.*?)}/)[0].gsub('{', '').gsub('}', '')
    self.save
    Webapp.redis.publish('eth:create:account', eth_address) # send to node part to create eth account, send ether in order to be able to create transactions
  end
end
