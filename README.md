# AP_ContentSpecificationExplorer

[![Maintainability](https://api.codeclimate.com/v1/badges/4edea55abd7592d015c4/maintainability)](https://codeclimate.com/github/osu-cass/AP-CSE-APP/maintainability)
[![CircleCI](https://circleci.com/gh/osu-cass/AP-CSE-APP.svg?style=svg)](https://circleci.com/gh/osu-cass/AP-CSE-APP)
[![Coverage Status](https://coveralls.io/repos/github/osu-cass/AP-CSE-APP/badge.svg?branch=dev)](https://coveralls.io/github/osu-cass/AP-CSE-APP?branch=dev)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> React frontend application for the Smarter Balanced Content Specification Explorer project. The backend can be viewed [here](https://github.com/osu-cass/AP-CSE-API), while a development deployment of this application is available [at this link](https://ap-cse-app.now.sh).

## Developing

To get started, clone the repo and install all dependencies:

```sh
# From a directory of your choice
git clone https://github.com/osu-cass/AP-CSE-APP

# Enter the cloned repo
cd AP-CSE-APP

# Install dependencies

npm install
```

## Windows Users
To install the dependencies for this application you will be required to install rsync.
You can do this by open powershell and typing the following command:
```sh
choco install rsync
```

To begin working on AP-CSE-APP, you have two choices: Run Storybook for component development, or run the frontend application with `webpack`.

### Storybook

To launch Storybook, run the following command:

```sh
# Launch Storybook at http://localhost:9001
npm run storybook
```

Code changes should be automagically loaded into Storybook with the page loaded.

### Full Application

To run the application locally, run the following command:

```sh
# Run the application at http://localhost:8080
npm run dev
```

Once again, any code changes should automatically be loaded without needing to refresh.

## Deployment
To package this app for deployment you will need to build a docker image. You can do this by running the following command in the root directory of this project.
```
docker build -t osucass/content-specification-explorer-app:<some-tag> --build-arg API=<endpoint here> -f build/Dockerfile .
```

You can verify that your build is working correctly by running:
```
docker run -p 8000:80 osucass/content-specification-explorer-app:<some-tag>

You can push this image to docker hub using:
```
docker push osucass/content-specification-explorer-app:<some-tag>
```

