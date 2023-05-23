#!/bin/bash

EMPTY_DB=$(curl localhost:3000/song/1 -s | jq '.statusCode == 404')
if [[ $EMPTY_DB == "true" ]]; then
  curl localhost:3000/song -X POST --data '{"name": "SCORO_TEST", "difficulties": {}, "midiPath": "/musics/SCORO_TEST/SCORO_TEST.midi", "musicXmlPath": "/musics/SCORO_TEST/SCORO_TEST.mxl"}' -H "Content-Type: application/json" &> /dev/null
fi

TESTS_DONE=0
TESTS_SUCCESS=0
TESTS_FAILED=0

function test {
  cat $1/input | BACK_URL="http://localhost:3000" MUSICS_FOLDER="../../musics/" python3 ../main.py 1> /tmp/scorometer_res 2> /tmp/scorometer_log
  TESTS_DONE=$((TESTS_DONE + 1))
  if [ -n "$SCOROMETER_AUTOFIX" ]; then
    cat /tmp/scorometer_res > $1/output
  fi
  if ! diff $1/output /tmp/scorometer_res &>/dev/null; then

    echo "=========== CURRENT OUTPUT ==========="
    cat /tmp/scorometer_res
    echo "======================================"
    echo "=========== EXPECTED OUTPUT =========="
    cat $1/output
    echo "======================================"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  else
    TESTS_SUCCESS=$((TESTS_SUCCESS + 1))
  fi
}

if [ -z "$1" ];
then
  for t in */; do
    test $t
  done
  exit $TESTS_FAILED
else
  cat $1/input | BACK_URL="http://localhost:3000" MUSICS_FOLDER="../../musics/" python3 ../main.py 1> /tmp/scorometer_res 2> /tmp/scorometer_log
  echo "=========== CURRENT OUTPUT ==========="
  cat /tmp/scorometer_res
  echo "======================================"
  echo "=========== EXPECTED OUTPUT =========="
  cat $1/output
  echo "======================================"
  echo "=============== DIFF ================="
  diff --side-by-side -q /tmp/scorometer_res $1/output
  RET=$?
  echo "======================================"
  exit $RET
fi;

