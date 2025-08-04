#!/bin/bash

API_URL="http://localhost:3000"

# parse args
while getopts "u:" opt; do
  case $opt in
    u) API_URL="$OPTARG" ;;
    *) echo "Usage: $0 [-u api_url]" && exit 1 ;;
  esac
done


echo "running api tests..."

echo "Create contact for george"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "919191"}'
echo

echo "create contact for biff"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "biffsucks@hillvalley.edu", "phoneNumber": "717171"}'
echo

echo "caught relation george email + biff phone"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "717171"}'
echo

echo "email exists, new phone no"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "555555"}'
echo

echo "phone no exists, new email"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "martymcfly@hillvalley.edu", "phoneNumber": "919191"}'
echo

echo "exact match (no new row created)"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "919191"}'
echo

echo "new contact (no relation)"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@hillvalley.edu", "phoneNumber": "888888"}'
echo

