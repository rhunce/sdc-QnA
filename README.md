# Atelier API
Complete API fit with Node.js server routes (using the Express framework) and MongoDB database preloaded with over 15m documents through the use of an ETL process and MongoDB's aggregation pipeline functionality. Routes can be queried through Postman (postman.com).
​
## Getting Started
​
(1) Fork the repo and clone it down to your computer.

(2) Open it in VS Code (or whatever IDE you use) like you normally would.

(3) To be able to make HTTP requests to the API in this repo, you must create and use a GitHub API Token. Here is how to obtain your Token:
- Go to: https://github.com/settings/tokens
- Click "Generate New Token"
- Given the Token a Description (e.g. "My token")
- Under Select Scopes, select the following:
  - read:org
  - user
  - read:user
  - user:email
  - user:follow
- Generate Token
  - Note that this token is only viewable once, at generation time. Make sure to copy it to a secure place.

(4) In the "env" directory of the repository, make a copy of the "config.sample.js" file and rename it to "config.js."

(5) In config.js, replace ' ' (next to the API_TOKEN key name) with your GitHub API Token (from step 3, above) as a string and make sure all changes up to this point are saved.

(6) In your terminal, from the root directory of the repository, run
​
```
npm install --force
```
(7) then run this to start your server
```
npm run start2
```

(8) In order to make HTTP requests, you can use Postman (postman.com). Here's how to use Postman with already constructed queries saved in a collection. The following instructions assume you have some familiarity using Postman.
  - Go to postman.com.
  - Click "Launch Postman" in the top-right corner of the screen.
  - Click the "Create New ->" link in the center of the screen.
  - Towards the right of the screen, click the down arrow just to the right of the "Create A Collection" tab. In the dropdown menu, click "Import".
  - Click on the "Link" tab.
  - Copy and past this url into the box:
  ```
  https://www.getpostman.com/collections/dd19d203e692c8088716
  ```
  - Click "Continue" button.
  - A file should come up with a name of "Atelier API". Click the "Import" button.
  - To the left of the Screen, click the "Collections" tab and you should now see just to the right of it the "Atelier API" collection, with a bunch of valid HTTP requests already written out.
  - Select various HTTP requests and click "Send" to send the request and observe the response. From here, you can even experiment with changing some of the preset parameters and see how the responses change.

  (9) Enjoy!