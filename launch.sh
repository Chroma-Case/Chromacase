#!/usr/bin/zsh

sudo python3 main.py $1 &!
sleep 3.5
./tester.py $1 $2
