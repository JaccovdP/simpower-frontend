![Deploy](https://github.com/JaccovdP/simpower-frontend/workflows/Deploy/badge.svg)

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

### Adding results to a session
- Export the CSV with the results from iRacing
- Remove all extra info from the file, first line should be the headers. The following headers are just an example, they can be different.
```CSV
"Fin Pos","Car ID","Car","Car Class ID","Car Class","Team ID","Cust ID","Name","Start Pos","Car #","Out ID","Out","Interval","Laps Led","Qualify Time","Average Lap Time","Fastest Lap Time","Fast Lap#","Laps Comp","Inc","League Points","Max Fuel Fill%","Weight Penalty (KG)"
```
- Update the results if necessary (example: apply penalties, update scored points for consolation race. Do not manually add bonus points for fastest lap, those are calculated automatically)
- Add the CSV with the results to [public/results](public/results)
- Change the "results_files" property for the session in [the JSON](src/assets/leagues.json) to look similar to this:
```JSON
"results_files": [
  { "name": "Qualifying", "index": 0, "file": "filename.csv" },
  { "name": "Heat 1", "index": 1, "fastest_lap_bonus_enabled": true, "counts_for_secondary_points": true, "file": "filename.csv" },
  { "name": "Heat 2", "index": 2, "fastest_lap_bonus_enabled": true, "counts_for_secondary_points": true, "file": "filename.csv" },
  { "name": "Consolation", "index": 3, "fastest_lap_bonus_enabled": true, "file": "filename.csv" },
  { "name": "Feature", "index": 4, "fastest_lap_bonus_enabled": true, "default": true, "file": "filename.csv" }
]
```
| Property | Description |
| :------------- | :----------: |
| name | Defines the name as shown on the results page |
| index | Defines the order of the results |
| default | Sets the default results tab (optional, default tab is 0) |
| fastest_lap_bonus_enabled | Enables the bonus point(s) for fastest lap |
| counts_for_secondary_points | Enables counting of secondary points (such as positions gained) |
| file | Filename of the CSV file with the results. Do not include the path |

## League pages
All league pages are rendered based on [this](src/assets/leagues.json) JSON file. All logic for the league page can be found in [src/views/League.vue](src/views/League.vue).
