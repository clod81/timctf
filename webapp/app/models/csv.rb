class Csv

  class << self

    def import(current_user, csv)
      return nil if csv.blank?
      csv.force_encoding('UTF-8')
      # convert line-breaks to unix-style
      csv.gsub!(/\r\n/, "\n")
      csv.gsub!(/\r/, "\n")
      # remove line-breaks and commas in strings
      csv.gsub!(/"([^"]*)"/) { $1.gsub(/\n/, ' ').delete(',') }
      # if values are within double quote, get rid of double quote; for those ones, replace "," with nothing
      csv.gsub!(/"(.*?)"/){$1.delete(",")}


      csv = csv.split(/\n/)

      # Rails.logger.debug csv.inspect

      headers = csv[0].split(",")

      # Rails.logger.debug headers.inspect

      csv.each_with_index do |line, index|
        next if index == 0
        line = line.split(",")
        t = Transaction.new
        t.amount = line[headers.index("amount")].to_i
        t.to_user_id = line[headers.index("to_user_id")].to_i
        if headers.include?("user_id") # someone found the issue!
          t.user_id = line[headers.index("user_id")].to_i
        else
          t.user_id = current_user.id
        end
        t.save
      end

    end

  end

end
