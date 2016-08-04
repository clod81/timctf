#!/bin/sh

bundle exec rake webapp:balances:process;
bundle exec rake webapp:contracts:process;
sleep 15;
