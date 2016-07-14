class TransactionsController < ApplicationController

  before_action :authenticate_user!
  before_action :load_transaction,  only: :destroy
  before_action :load_transactions, only: :create

  def index
    redirect_to root_path
  end

  def create
    @transaction = Transaction.new(transaction_params)
    @transaction.user_id = current_user.id
    if @transaction.save
      flash[:notice] = "The transaction has been created correctly. It won't be confirmed until Ethereum says so"
    end
    render template: 'home/index'
  end

  def destroy
    if @transaction.approved?
      flash[:error] = "The transaction has already been approved, you cannot delete it"
    else
      @transaction.destroy
      flash[:notice] = "The transaction has been reversed correctly"
    end
    redirect_to root_path
  end

  def csv
    # TODO
    redirect_to root_path
  end

  private

  def transaction_params
    params.fetch(:transaction, {}).permit(:to_user_id, :amount)
  end

  def load_transaction
    if @transaction = current_user.transactions.where(id: params[:id]).first
      return true
    end
    if request.xhr?
      render nothing: true
    else
      redirect_to root_path
    end
    false
  end

  def load_transactions
    if user_signed_in?
      @sent_transactions     = current_user.transactions.order("id desc")
      @received_transactions = current_user.received_transactions.order("id desc")
    end
  end

end
