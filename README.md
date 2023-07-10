# Irish Rail Tracker ([irishrailtracker.web.app](https://irishrailtracker.web.app/))
## Introduction
A  webapp which tracks the current locations of Irish Rail trains and plots them on a live map, built with Vue.js, Bootstrap and Firebase. 
Live train data is periodically fetched from the official Irish Rail Developer REST API, and stored in the Firestore database. This data is fetched by the webapp client from the Firestore database upon page load and periodically after that. The data is plotted on a map using OpenLayers as the backend and OpenStreetMap as the source of the tile images. 

Additional features include:
- Train icons are coloured according to punctuality - red for late, green for on-time/early, and black for not-yet-running/terminated.
- A robust & intuitive filtering system which allows the user to easily filter which trains are displayed on the map.
- A powerful search system which allows the user to display only the trains which match the searched for string on the map using keywords and phrases such as "Galway", "departed dublin connolly", or "Late" for example. 
- An Insights page which graphs current train data such as the number of currently running trains, the proportion of DARTs to Mainline Trains, the proportion of late trains to on-time trains, and more.
- An accounts system which allows a user to save their filtering preferences to their account, and have these preferences be automatically applied on any device on which the account is signed in.
- A live message ticker at the bottom of the page displaying the most recent public announcements from each train.
- Optional plotting of each train station on the map, which can also be filtered via searching and the aforementioned filtering system.

## Setup
### Local Emulation
#### Prerequisites
- Java 11 or greater
- `npm`

#### Setup
1. Run `npm install` in the root directory of the project (`traintracker/`). Note that this may require root privileges on certain operating systems (i.e., to be ran with `sudo`). 
2. Run `npm install` in the `traintracker/functions/` directory. 
4. Start the Firebase emulator, which is needed to emulate the Firebase functions locally. Note that the Firebase emulator will occupy the focus of your terminal while it is running, so you will either need to keep it in its own dedicated terminal window or fork it into the background by appending `&` to the following command:
```bash
firebase emulators:start
```  
7. Wait until the until the emulator says that it is ready before starting the web app using the following command:
```bash
npm run dev
```
8. A `localhost` or `127.0.0` link will appear in your terminal, navigatee to this link in a web browser to view & interact with the web app.  

#### Shutdown
1. To kill the `npm` process (the webapp itself) you can simply send an interrupt signal by hitting `CTRL + C` in terminal in which it is running. 
2. To kill the Firebase emulator process, you can again just simply send an interrupt signal by hitting `CTRL + C` in the terminal in which it is running **in the foreground**. Note that if you have forked the process to the background in a terminal, you will have to run the command `fg` to bring it to the foreground before hitting `CTRL + C` to kill the process.

## Testing
### Vue.js Unit Tests
There are a series of Vue.js unit tests which are automatically ran with Github Actions when a pull request is made or when a branch is merged into `main`. Optionally, they can be ran locally via the following command:
```bash
npm run test:unit
```

### Firebase Integration Tests
There are also a series of Firebase integration tests which are automatically ran with Github Actions when a pull request is made or when a branch is merged into `main`. Optionally, they can be ran locally via the following command in the `traintacker/functions/` directory:
```bash
cd functions && npm run test
```

## Manual Firebase Deployment
The webapp is automatically deployed to Firebase via Github Actions automatically when a branch is merged into `main`, provided that it successfully passed the Vue.js unit & Firebase integration tests. It can also be manually deployed with the following command ran in the `traintracker/` directory, **but this is not to be done without explicit approval of each of the project owners**. You will need the appropriate Firebase authentication tokens to do this.
```shell
npm run build && firebase deploy
```

## Links
Deployed Site: [irishrailtracker.web.app](https://irishrailtracker.web.app/) 

Jira: [trainenthusiasts.atlassian.net](https://trainenthusiasts.atlassian.net/jira/software/projects/TE/boards/1)

GitHub: [github.com/0hAodha/traintracker](https://github.com/0hAodha/traintracker)
