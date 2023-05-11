# birdWatcher

The journal application for bird enthusiasts allows users to keep track of their bird sightings, view their recent sightings with access to detailed information about the birds, and discover new sightings made by other bird watchers in their area.

When the user first opens the application, they are greeted with a login page. If the user doesn't have an account, they can click the "Sign up" button instead of entering their email and password. This will navigate them to a sign-up form, where they must enter an email, password, and password confirmation (repeating the password input). There is error handling in place in the case of an already used email, a wrong email format, not matching passwords, or unsecure passwords. When the user clicks "Sign up," they will navigate to the home screen.

The home screen presents an introduction briefly describing the application's functionality, a tab navigation bar at the bottom of the screen, and a header that shows the birdWatcher logo and a logout button, as well as the current screen name. To add their own bird sighting, users can click on the "Add Sighting" button. This will bring them to a form where they can search for birds by their features or name and select the bird from a fetched list. In the list, they also have the option to view the bird's information by clicking on the right-hand side of the list. After selecting the bird, the user can add the date, location, and a comment. Luckily for the user, the date, time, and location are automatically entered, but they are free to modify them. Once they submit the form, their sighting will be added to the personal history screen, and they will be navigated back to the home screen.

With the help of the navigation bar at the bottom of the screen, they can go to the history screen, which has a list of the user's previous bird sightings. Each sighting is displayed on a card that shows the name, scientific name, date and time of sighting, location, and comment. Users can either delete the bird sighting, share it with other birdwatchers, view images, or view detailed bird information on `eBird.org`.

Lastly, the user can use the navigation bar to go to the "New Sightings" screen, which displays a fetched list of recent bird sightings (up to 30 days ago) of birds seen at locations within a radius of up to 50 kilometers of the user's location. The list provides information such as name, scientific name, time of sighting, and location. If the user gets interested in a bird sighting, they can view the bird's information on `eBird.org`.

<hr/>

## Technologies

- React Native
- Firebase Authentication and Realtime Database
- React Navigation, Tab Navigation, Stack Navigation
- Expo SDK (expo-location)
- React Native Elements (@rneui/themed @rneui/base)
- DateTimePicker (@react-native-community/datetimepicker)
- MaterialCommunityIcons (@expo/vector-icons)
- Environment variables (react-native-dotenv)

<hr/>

## Configuration
The application requires an API key from the eBird API to fetch the bird data. Follow these steps to obtain an API key:

1. Sign up or log in to your eBird account at https://ebird.org/home
2. Visit https://ebird.org/api/keygen to generate an API key
3. Place the API key either within the `firebase.js` or use the template `.env` file

The application uses Firebase authentication and realtime database. Follow these steps:
1. Create a Firebase project
    - Visit the [Firebase Console](https://console.firebase.google.com/) and create a new project
    - Enable the "Email/Password" authentication method in the Firebase project's Authentication settings
2. Enable Firebase Realtime Database
    - In the Firebase project's Realtime Database settings, configure the security rules to:
        
        ```json
        {
        "rules": {
            "sightings": {
            "$uid": {
                // Allow only authenticated content owners access to their data
                ".read": "auth !== null && auth.uid === $uid",
                ".write": "auth !== null && auth.uid === $uid"
            }
            }
        }
        }
        ```
3. Set up the Firebase credentials in the application

    - Open the project in your code editor
    - Navigate to the `firebase.js` file
    - Replace the placeholder values in the `firebaseConfig` object with your Firebase project's credentials


<hr/>

## eBird API 2.0

##### https://documenter.getpostman.com/view/664302/S1ENwy59

The application uses the following end points with an API key:
```http
https://api.ebird.org/v2/data/obs/geo/recent?lat=${latitude}&lng=${longitude}
```

```http
https://api.ebird.org/v2/ref/taxonomy/ebird?fmt=json&locale=en&cat=species&countryCode=FI
```

The following web pages do not require an API key:
```http
https://ebird.org/species/{speciesCode}
```

```http
https://media.ebird.org/catalog?sort=rating_rank_desc&taxonCode={speciesCode}
```
