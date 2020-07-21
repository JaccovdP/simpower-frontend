# Simpower website repository

## Website
[Simpower website](https://simpower.co.uk)

## Project setup
### Install dependencies
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Updating data
All data for our leagues is formatted in JSON and can be found in [src/assets/leagues.json](src/assets/leagues.json).

### Adding a logo
To add a logo to a team, do the following:
- Add an image to [src/assets/images/teams](src/assets/images/teams)
- Add the filename of the image to the "logo" property of the correct team in [src/assets/leagues.json](src/assets/leagues.json)

## League pages
All league pages are rendered based on [this](src/assets/leagues.json) JSON file. All logic for the league page can be found in [src/views/League.vue](src/views/League.vue).
