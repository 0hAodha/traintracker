# Running Build & Deploying it to Firebase
`npm run build && firebase deploy`

# Running Firebase Tests
`cd functions && npm run test`

# Running Locally
1. Ensure you have Java 11 or greater installed. 
2. Run `npm install` in the traintracker directory. 
3. Run `npm install` in the functions directory. 
4. Start the emulator (needed to emulate the functions locally) `firebase emulators:start &` (the `&` forks it into the background). 
5. Run `npm run dev`
You will need to click the "Populate Database" and "Fetch Data" buttons to get data into your local version of the webapp. 

To kill the npm process do `CTRL + C` in your terminal. 
To kill the firebase emulators run `fg` to bring the process to the foreground, then do `CTRL + C`

# Links 
Deployed site: [irishrailtracker.web.app](https://irishrailtracker.web.app/) 

Jira: [trainenthusiasts.atlassian.net](https://trainenthusiasts.atlassian.net/jira/software/projects/TE/boards/1)

Github: [github.com/0hAodha/traintracker](https://github.com/0hAodha/traintracker)
