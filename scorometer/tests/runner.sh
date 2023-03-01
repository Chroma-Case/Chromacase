#!/bin/sh

TESTS_DONE=0
TESTS_SUCCESS=0

function test {
  cat $1/input | python3 ../main.py &> /tmp/scorometer_res
  TESTS_DONE=$((TESTS_DONE + 1))
  if ! diff $1/output /tmp/scorometer_res &>/dev/null; then
    echo "$t failed, do runner.sh $t for more info"
  else
    TESTS_SUCCESS=$((TESTS_SUCCESS + 1))
  fi
}

if [ -z "$1" ];
then
  for t in */; do
    test $t
  done
  echo "$TESTS_SUCCESS succeeded"
  echo "$TESTS_DONE done"
else
  cat $1/input | python3 ../main.py &> /tmp/scorometer_res
  cho "=========== CURRENT OUTPUT ==========="
  cat /tmp/scorometer_res
  echo "======================================"
  echo "=========== EXPECTED OUTPUT =========="
  cat $1/output
  echo "======================================"
  echo "=============== DIFF ================="
  diff --side-by-side /tmp/scorometer_res $1/output
  echo "======================================"
  e
fi;

