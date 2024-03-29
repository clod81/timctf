class Transaction < ActiveRecord::Base

  belongs_to :user
  belongs_to :credited_user, class_name: 'User', foreign_key: 'to_user_id'

  validates :user_id, :to_user_id, :amount, presence: true
  validates :user, :credited_user, presence: { message: "The user does not exist" }
  validates :amount, numericality: { only_integer: true, greater_than: 0 }
  validate :different_users
  validate :check_amounts

  after_commit :send_to_etherum

  private

  def send_to_etherum
    trans = {
      from:   user.eth_address,
      to:     credited_user.eth_address,
      amount: amount.to_i
    }
    Webapp.redis.publish("eth:transaction", trans.to_json) # send info to node component
  end

  def check_amounts
    if amount && user && user.balance.to_i < amount.to_i
      self.errors.add(:amount, "You do not have enough credits in order to perform this transaction")
      return false
    end
  end

  def different_users
    if user_id == to_user_id
      self.errors.add(:to_user_id, "You cannot send credits to yourself")
    end
  end

end
