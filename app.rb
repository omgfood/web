require 'sinatra'

get '/' do
  erb :index
end

# Will mostly be fetched by AJAX
# Eg; GET /barcode_search?id=5018357009916
get '/barcode_search' do
  # Return format is JSON
  content_type :json

  # Setup Tesco API
  t = Tesco::Groceries.new(ENV['TESCO_DEVELOPER_KEY'], ENV['TESCO_APP_KEY'])
  t.endpoint = 'https://secure.techfortesco.com/tescolabsapi/restservice.aspx'

  # API request for detailed info about the product associated with the barcode
  barcode_id = params[:id]
  t.api_request(
    'productsearch',
    searchtext: barcode_id,
    EXTENDEDINFO: 'Y'
  )['Products'][0].to_json
end
