#!/bin/bash

API_URL="http://localhost:3000"

echo "resetting db..."
npx prisma migrate reset --force > /dev/null

echo "running api tests..."
echo

echo "Create contact for george"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "919191"}' | jq
echo

echo "create contact for biff"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "biffsucks@hillvalley.edu", "phoneNumber": "717171"}' | jq
echo

echo "caught relation george email + biff phone"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "717171"}' | jq
echo

echo "email exists, new phone no"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "555555"}' | jq
echo

echo "phone no exists, new email"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "martymcfly@hillvalley.edu", "phoneNumber": "919191"}' | jq
echo

echo "exact match (no new row created)"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "919191"}' | jq
echo

echo "new contact (no relation)"
curl -s -X POST $API_URL/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "doc@hillvalley.edu", "phoneNumber": "888888"}' | jq
echo

