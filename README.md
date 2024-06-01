# Bitespeed Backend Task: Identity Reconciliation
Hey there, this is my submission for the Bitespeed Backend task. You can test it here:

```https://user-identity-chain.onrender.com/identity```

Sending a post request with { email, phoneNumber } will return the response as specified in the task.

Some points:
- I have not implemented input sanitation, assuming all the emails/phone numbers received on the server are properly formatted.
- In the case where two primary contacts are supposed to be merged, I have taken the incoming request as a new user. As should happen in real world scenario. As in:
  - Let's say two users exist user1 (e1,p1) and user2 (e2,p2). These are currently primary contacts
  - If another request comes with e1,p2. This will be treated as a new user and now user1 is primary (because this was created earlier), whereas user3 has (e1,p2). User2 and User3 will now be marked as secondary.

- Have tested this for all scenarios mentioned in the doc.

Looking forward to hearing from the team!
