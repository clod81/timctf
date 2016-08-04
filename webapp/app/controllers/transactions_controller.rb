class TransactionsController < ApplicationController

  before_action :authenticate_user!
  before_action :load_transactions, only: [:create, :external]

  def index
    redirect_to root_path
  end

  def create
    @transaction = Transaction.new(transaction_params)
    @transaction.user_id = current_user.id
    if @transaction.save
      flash[:notice] = "The transaction has been created. It won't be confirmed until Ethereum says so. If everything went ok, your balance should reflect the new transaction in a few moments."
    end
    render template: 'home/index'
  end

  def csv
    if params[:csv].present?
      begin
        Csv.import(current_user, params[:csv].open.read.strip)
        flash[:notice] = "File is being processed"
      rescue
        flash[:error] = "Something went wrong, please try again and make sure the CSV file matches the required format"
      end
    end
    redirect_to root_path
  end

  def external
    addr   = params[:address]
    amount = params[:amount] || -1
    if addr.blank? || amount.to_i <= 0
      flash[:error] = "You need to specify a valid Ethereum address and amount"
    else
      trans = {
        from:   current_user.eth_address,
        to:     addr,
        amount: amount.to_i
      }
      Webapp.redis.publish("eth:transaction", trans.to_json) # send info to node component to do real transaction
    end
    render template: 'home/index'
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

end
