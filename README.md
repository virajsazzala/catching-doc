# Catching Doc?
A submission for Bitespeed Backend Task: Identity Reconciliation. 

## What is this about?
It's a solution for the below problem statement (simplified): <br>
<br>
"Dr. Emmett Brown (doc) wants to build a time machine to return back to his time. To buy the parts, he's using different ids to stay under the radar. So, can we build a system that tracks and relates/links these accounts to provide better customer service experience for doc?"

### Approach
To solve this, we follow the below solution:
1. take input as a JSON of email, phone-no
2. query the existing db with input JSON
3. if similar record exists, oldest = primary, rest all = secondary
4. create a relation if it doesn't exist
5. update the linkedIds of the secondary records
6. return the tracked relation as response
7. (design choice) : instead of creation date for oldest account,\
   we can use primary key (id), as it's an incremental int in this schema & always unique.
### Tech stack
- NodeJS + TypeScript + Express + Prisma w/ PostgreSQL

## Usage

The API has been deployed on [render](https://render.com/). 

### Vars/Links
- URL: https://catching-doc-api.onrender.com
- Identify Endpoint (POST): https://catching-doc-api.onrender.com/identify 

### Note
- Execute `tests/test-runs.sh` to run a series of simple tests with curl
```sh
# in root of the project
chmod +x ./tests/test-runs.sh

# exec tests
./tests/test-runs.sh -u https://catching-doc-api.onrender.com
```

### Examples
```sh
# (call) create contact for george
curl -s -X POST https://catching-doc-api.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "919191"}' | jq

# (response)
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "george@hillvalley.edu"
    ],
    "phoneNumbers": [
      "919191"
    ],
    "secondaryContactIds": []
  }
}

# (call) create contact for biff
curl -s -X POST https://catching-doc-api.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "919191"}' | jq

# (response)
{
  "contact": {
    "primaryContactId": 2,
    "emails": [
      "biffsucks@hillvalley.edu"
    ],
    "phoneNumbers": [
      "717171"
    ],
    "secondaryContactIds": []
  }
}

# (call) create george w/ diff biff's number
curl -s -X POST https://catching-doc-api.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "717171"}' | jq

# (response)
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "george@hillvalley.edu",
      "biffsucks@hillvalley.edu"
    ],
    "phoneNumbers": [
      "919191",
      "717171"
    ],
    "secondaryContactIds": [
      2
    ]
  }
}
```
