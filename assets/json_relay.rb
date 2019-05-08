require 'open-uri'


url = req['url']  # 'http://example.com/'

# file = open(url)
# puts file.read

open(url) do |file|
  puts file.read
end
