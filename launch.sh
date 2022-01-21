#!/usr/bin/zsh

sudo python main.py $1 &!
sleep 3.5
./tester.py $1 $2
