module ApplicationHelper
  
  def number_to_carbonz_weight(amount)
    case
    when amount == 0
      "zero"
    when amount >= 1000000000000
      "%.3f tonnes CO<sub>2</sub>e" % (amount / 1000000000000.0)
    when amount >= 1000000000
      "%.3f kilograms CO<sub>2</sub>e" % (amount / 1000000000.0)
    when amount >= 1000000
      "%.3f grams CO<sub>2</sub>e" % (amount / 1000000.0)
    when amount >= 1000
      "%.3f milligrams CO<sub>2</sub>e" % (amount / 1000.0)
    else
      "%d micrograms CO<sub>2</sub>e" % amount
    end
  end

end
