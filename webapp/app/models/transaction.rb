class Transaction < ActiveRecord::Base

  belongs_to :user
  belongs_to :debited_user, class_name: 'User', foreign_key: 'to_user_id'

  validates :user_id, :to_user_id, :amount, presence: true
  validate :check_amounts

  after_save :send_to_etherum

  private

  def send_to_etherum
    delay.delay_send_to_etherum
  end

  def delay_send_to_etherum
    # TODO.... send to etherum
    # if etherum success
    user.balance += amount # no transaction?
    debited_user.balance -= amount
    user.save
    debited_user.save
    self.update(approved: true)
  end

  def check_amounts
    if amount && debited_user.balance < amount
      self.errors.add(:amount, "sender does not have enough balance to perform this transaction")
      return false
    end
  end

end
