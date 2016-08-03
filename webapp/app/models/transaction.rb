class Transaction < ActiveRecord::Base

  belongs_to :user
  belongs_to :credited_user, class_name: 'User', foreign_key: 'to_user_id'

  validates :user_id, :to_user_id, :amount, presence: true
  validates :amount, numericality: { only_integer: true, greater_than: 0 }
  validate :different_users
  validate :check_amounts

  after_commit :send_to_etherum

  # async function
  def delay_send_to_etherum(transaction_id)
    t = Transaction.where(id: transaction_id).first
    return unless t # been delete maybe = WTF...
    trans = {}
    trans['from']   = t.user.eth_address
    trans['to']     = t.credited_user.eth_address
    trans['amount'] = t.amount
    Webapp.redis.publish("eth:transaction", trans.to_json) # send info to node component
    # t.class.transaction do # balances are check every minute by a rake task job
    #   t.credited_user.balance += amount
    #   t.user.balance -= amount
    #   t.user.save
    #   t.credited_user.save
    #   t.update(approved: true)
    # end
  end

  private

  def send_to_etherum
    return if approved
    delay.delay_send_to_etherum(id)
  end

  def check_amounts
    if amount && user && user.balance < amount
      self.errors.add(:amount, "sender does not have enough balance to perform this transaction")
      return false
    end
  end

  def different_users
    if user_id == to_user_id
      self.errors.add(:to_user_id, "You cannot send credits to yourself")
    end
  end

end
