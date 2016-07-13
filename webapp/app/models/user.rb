class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable

  def init_balance
    # send request to etherum...
    self.balance = balance + 100000000 # race condizio
    self.save
  end
end
