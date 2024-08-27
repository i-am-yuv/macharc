# MACHARC

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

angular-cli version 15.0.3.


## To Build and Serve in http-server locally

```bash
git submodule deinit -f --all
rm -rf .git/modules/*
git submodule init
git submodule update --remote
npm install
ng build @splenta/vezo
npm run build -- --configuration=staging

cd dist/studio
http-server .
```

# Docker Setup

Follow the below steps to build and run the docker image locally.

### 1. Build the studio application

### 2. Build the docker image

```bash
docker build -t nginx:latest .
```

### 3. Run the docker image

```bash
docker run -p 80:80 nginx:latest
```