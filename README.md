# Project Title

This app is able to help users find routes from any station to any other station on Singapore's future rail network.

The functionality are as follows:

- Allow the user to specify origin and destination stations.
- Display one or more routes from the origin to the destination. Routes instructions include "On <XX>-line, take" and "from <station> to <station>".

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

Following commands to get a development env running

1. `unzip` files to a folder
2. `npm install` to get all the dependencies and packages
3. `npm run start` to start application on `localhost:3000`

## Running the App

1. Under the `Find Route` component, search for the station to start from and station to end at.
2. Click the submit button.
3. Route instructions will be generated.

## Deployment

`npm run build` can be used to build app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.<br>

The build file can then be used to deploy site.

## Built With

- [create-react-app](https://github.com/facebook/create-react-app) - The web framework used
- [Google fonts](https://fonts.google.com/) - Used for font

## Authors

- **Xin Fang** - _Initial work_
