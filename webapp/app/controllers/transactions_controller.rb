class TransactionsController < ApplicationController

  before_action :authenticate_user!
  before_action :load_transaction, only: :destroy

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
  end

  private

  def transaction_params
    params.fetch(:transaction, {}).permit(:to_user_id, :amount)
  end

  def load_transaction
    if @transaction = Transaction.where(id: params[:id], user_id: current_user.id).first
      return true
    end
    if request.xhr?
      render nothing: true
    else
      redirect_to root_path
    end
    false
  end

end
