require 'rubygems'
require 'bundler'
require 'dotenv'
Bundler.require

Dotenv.load

require './app.rb'
run Sinatra::Application
