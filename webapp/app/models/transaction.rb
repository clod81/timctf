class Transaction < ActiveRecord::Base

  belongs_to :user
  belongs_to :debited_user, class_name: 'User', foreign_key: 'to_user_id'

  validates :user_id, :to_user_id, :amount, presence: true
  validate :different_users
  validate :check_amounts

  after_commit :send_to_etherum

  # async function
  def delay_send_to_etherum(transaction_id)
    t = Transaction.where(id: transaction_id).first
    return unless t # been delete maybe...
    # TODO.... send to etherum
    # if etherum success
    t.class.transaction do
      t.user.balance += amount
      t.debited_user.balance -= amount
      t.user.save
      t.debited_user.save
      t.update(approved: true)
    end
  end

  private

  def send_to_etherum
    return if approved
    delay.delay_send_to_etherum(id)
  end

  def check_amounts
    if amount && debited_user && debited_user.balance < amount
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
