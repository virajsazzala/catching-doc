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

### Tech stack
- NodeJS + TypeScript + Express + Prisma w/ PostgreSQL