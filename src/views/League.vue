<template>
  <div class="home">
    <!-- {{ data }} -->
    <b-container class="mt-2" v-if="data == null">
      <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
    </b-container>
    <b-container fluid="lg" class="mt-2" v-if="data != null">
      <b-row>
        <b-col>
          <b-nav pills class="largeNav">
            <b-nav-item to="info" :active="tabIndex == 0">Info</b-nav-item>
            <b-nav-item to="schedule" :active="tabIndex == 1">Schedule</b-nav-item>
            <b-nav-item to="entries" :active="tabIndex == 2">Entries</b-nav-item>
            <b-nav-item to="standings" :active="tabIndex == 3">Standings</b-nav-item>
            <b-nav-item to="signup" :active="tabIndex == 4" disabled>Sign up</b-nav-item>
          </b-nav>
          <b-tabs pills content-class="mt-3" v-model="tabIndex" class="tabContainer">
            <b-tab title="Info" class="text-left">
              <b-row class="mb-4">
                <b-col lg="4" md="12">
                  <b-img v-if="data.promo_image" fluid :src="require('../assets/images/' + data.promo_image)"></b-img>
                </b-col>
                <b-col lg="8" md="12">
                  <b-row>
                    <b-col>
                      <h1>{{ data.title }}</h1>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <p class="text-justify">
                        {{ data.description }}
                      </p>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="4" md="12">
                  <h3>Key info</h3>
                  <div class="mb-2" v-if="data.key_info.car_classes.length < 2">
                    <!-- Single class -->
                    <strong>Car class</strong><br>
                    {{ data.key_info.car_classes[0].class }}
                  </div>
                  <div v-if="data.key_info.car_classes.length > 1">
                    <!-- Multiclass -->
                    <strong>Car classes</strong><br>
                    <span v-for="car_class in data.key_info.car_classes" :key="car_class.class">
                      {{ car_class.class }}<br>
                    </span>
                  </div>
                  <div class="mb-2">
                    <strong>Event type</strong><br>
                    {{ data.key_info.event_type }}
                  </div>
                  <div class="mb-2" v-if="data.key_info.broadcast.text">
                    <strong>Broadcast</strong><br>
                    <span v-if="data.key_info.broadcast.url">
                      <b-link :href="data.key_info.broadcast.url" target="_blank">{{ data.key_info.broadcast.text }}</b-link>
                    </span>
                    <span v-else>
                      {{ data.key_info.broadcast.text }}
                    </span>
                  </div>
                  <div class="mb-2">
                    <strong>Number of rounds</strong><br>
                    {{ data.key_info.nr_of_rounds }}
                  </div>
                  <div class="mb-2">
                    <strong>Overall prize pool <span v-if="data.key_info.race_prize_pool > 0">| Per race prize pool</span></strong><br>
                    &euro;{{ data.key_info.overall_prize_pool }} <span v-if="data.key_info.race_prize_pool > 0">| &euro;{{ data.key_info.race_prize_pool }}</span>
                  </div>
                  <div class="mb-2">
                    <strong>Entry fee</strong><br>
                    &euro;{{ data.key_info.entry_fee }}
                  </div>
                  <div class="mb-2" v-if="data.key_info.regulations_url">
                    <strong>Regulations</strong><br>
                    <b-link :href="data.key_info.regulations_url" target="_blank">Regulations</b-link>
                  </div>
                </b-col>
                <b-col lg="4" md="12">
                  <h3>Key dates</h3>
                  <b-table striped small borderless :items="data.key_dates"></b-table>
                </b-col>
                <b-col lg="4" md="12">
                  <h3>Partners</h3>

                  <b-img class="mb-4" fluid v-for="partner in data.partners" :key="partner.name" :src="require('../assets/images/' + partner.image)"></b-img>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Schedule">
              <b-row>
                <b-col md="12" lg="8" sm="12">
                  <h3 class="text-left">Sessions <span style="float:right;"><b-button @click="hidePractice = !hidePractice" size="sm">{{ hidePractice ? "Show" : "Hide" }} practice</b-button></span></h3>
                  <b-card class="mb-2" v-for="session in filteredSessions" :key="session.name" 
                    header-tag="header" 
                    :border-variant="session.type == 'race' ? 'primary' : 'none'" 
                    :header-bg-variant="session.type == 'race' ? 'primary' : 'none'"
                    :header-text-variant="session.type == 'race' ? 'white' : 'none'">
                    <template v-slot:header>
                      <h5 class="mb-0">{{ session.name }}</h5>
                    </template>
                    <b-row no-gutters>
                      <b-col cols="3">
                        <h1><b-icon icon="calendar3"></b-icon></h1>
                        {{ session.date }}
                      </b-col>
                      <b-col>
                        <b-card-body class="text-left">
                          <b-card-text>
                            <span v-if="session.time"><strong>Session start time</strong> {{ session.time }}<br></span>
                            Sim time {{ session.simtime }} | {{ session.weather }} | {{ session.sky }} <br>
                            <span v-if="session.broadcast_url && session.type == 'race'">
                              <b-link :href="session.broadcast_url" target="_blank">Broadcast</b-link> |
                            </span>
                            <span v-if="!session.broadcast_url && session.type == 'race'">
                              <b-link disabled>Broadcast</b-link> |
                            </span>
                            <span v-if="session.results_files.length > 0">
                              <b-link @click="openResults(session.name)">Results</b-link>
                            </span>
                            <span v-if="!session.results_files.length > 0">
                              <b-link disabled>Results</b-link>
                            </span>
                          </b-card-text>
                          <template v-slot:footer>
                            <em>Footer Slot</em>
                          </template>
                        </b-card-body>
                      </b-col>
                    </b-row>
                  </b-card>
                </b-col>
                <b-col class="text-left" md="12" lg="4" sm="12">
                  <h3>Session schedule</h3>
                  <b-table striped small borderless :items="data.schedule"></b-table>
                </b-col>
              </b-row>

            </b-tab>
            <b-tab title="Entries">
              <b-row class="text-left">
                <b-col>
                  <h3>Entries</h3>
                  <b-card-group deck>
                    <b-card class="mb-2 team-card" v-for="team in teams" :key="team.name">
                      <b-row no-gutters>
                        <b-col cols="4">
                          <b-img v-if="team.logo" fluid :src="require('../assets/images/teams/' + team.logo)"></b-img>
                        </b-col>
                        <b-col>
                          <b-card-body :title="team.name">
                            <b-card-text>
                              <b-table small borderless :items="team.drivers" :fields="team_card_fields"></b-table> 
                            </b-card-text>
                          </b-card-body>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-card-group>
                  <b-card-group deck>
                    <b-card class="mb-2 team-card" v-for="team in privateers" :key="team.name">
                      <b-row no-gutters>
                        <b-col cols="4">
                          <b-img v-if="team.logo" fluid :src="require('../assets/images/teams/' + team.logo)"></b-img>
                        </b-col>
                        <b-col>
                          <b-card-body :title="team.name">
                            <b-card-text>
                              <b-table small borderless :items="team.drivers" :fields="team_card_fields"></b-table> 
                            </b-card-text>
                          </b-card-body>
                        </b-col>
                      </b-row>
                    </b-card>
                  </b-card-group>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Standings">
              <b-row class="text-left">
                <b-col align-self="stretch" cols="12" lg="8" md="12">
                  <h3>Driver standings <span style="float:right;"><b-button v-b-modal.driverTableInfo size="sm">Table info</b-button></span></h3>
                  <b-table 
                    striped 
                    small 
                    outlined
                    no-border-collapse
                    :items="standings.driver" 
                    :fields="data.standings_fields" 
                    sort-by="points" 
                    sort-desc
                    sort-icon-left
                    responsive>
                    <template v-slot:cell(index)="data">
                      {{ data.index + 1 }}
                    </template>
                  </b-table>
                </b-col>

                <b-col lg="4">
                  <h3>Team standings <span style="float:right;"><b-button v-b-modal.teamTableInfo size="sm">Table info</b-button></span></h3>
                  <b-table 
                    striped 
                    small 
                    outlined
                    no-border-collapse
                    :items="standings.team"
                    :fields="data.team_standings_fields" 
                    sort-by="points"
                    sort-desc
                    sort-icon-left
                    responsive>
                    <template v-slot:cell(index)="data">
                      {{ data.index + 1 }}
                    </template>
                  </b-table>
                </b-col>

              </b-row>

            </b-tab>
            <b-tab title="Sign up" disabled></b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>

    <b-modal id="driverTableInfo" title="Table info" size="lg">

      <b-table v-if="data"
        small
        borderless
        :items="data.driver_table_info"
      ></b-table>

      <template v-slot:modal-footer>
        <div>
        </div>
      </template>
    </b-modal>

    <b-modal id="teamTableInfo" title="Table info" size="lg">

      <b-table v-if="data"
        small
        borderless
        :items="data.team_table_info"
      ></b-table>

      <template v-slot:modal-footer>
        <div>
        </div>
      </template>
    </b-modal>

    <b-modal id="results" title="Results" size="xl">

      <b-tabs v-if="visibleResults.results && visibleResults.results.length > 0" v-model="resultsTabIndex" pills>
        <b-tab 
          v-for="result in visibleResults.results" 
          :key="result.name" 
          :title="result.name">
          <b-table
            striped 
            small 
            outlined
            responsive
            :items="result.results"
            class="mt-2"
          ></b-table>
          <template v-if="result.fastest_lap">
            <strong>Fastest lap</strong> <small>({{ result.fastest_lap.points > 1 ? result.fastest_lap.points + " points" : result.fastest_lap.points + " point"}})</small> <br>
            {{ result.fastest_lap.driver }} - {{ result.fastest_lap.laptime }}
          </template>
        </b-tab>

      </b-tabs>

      <template v-slot:modal-footer>
        <div>
        </div>
      </template>
    </b-modal>

  </div>
</template>

<script>

import leagueData from '../assets/leagues.json'

const Papa = require('papaparse')

export default {
  name: 'league',
  computed: {
    standings () {
      let driver_standings = []
      let team_standings = []
      for(let i = 0; i < this.entries.length; i++) {
        let team = this.entries[i]
        let team_points = 0
        let team_sec_points = 0
        for(let j = 0; j < team.drivers.length; j++) {
          let driver = team.drivers[j]
          driver_standings.push({
            number: driver.number,
            name: driver.name,
            team: team.name,
            wins: driver.wins,
            points: driver.points,
            secondary_points: driver.secondary_points
          })
          team_points += driver.points
          team_sec_points += driver.secondary_points
        }
        if(team.name != "Privateer") {
          team_standings.push({
            name: team.name,
            points: team_points,
            secondary_points: team_sec_points
          })
        }
      }
      return { driver: driver_standings, team: team_standings}
    },
    teams () {
      let teams = this.entries
      return teams.filter(function(team) {
        return team.name != "Privateer"
      })
    },
    privateers () {
      let teams = this.entries
      return teams.filter(function(team) {
        return team.name == "Privateer"
      })
    },
    filteredSessions () {
      let sessions = this.data.sessions
      if (this.hidePractice) {
        return sessions.filter(function(session) {
          return session.type == "race"
        })
      } else{
        return sessions
      }
    }
  },
  methods: {
    filterData(object, key) {
      return object.filter(function(object) {
        return object.key == key
      })
    },
    getDriverInfoByNumber(nr) {
      let driver = this.standings["driver"].find(x => x.number == nr)
      return { "name": driver ? driver.name : "Unknown", "team": driver ? driver.team : "" }
    },
    getDriverIndexByNumber(nr) {
      let teamIndex = -1;
      let driverIndex = -1;
      for(let i = 0; i < this.entries.length; i++) {
        let team = this.entries[i]
        for(let j = 0; j < team.drivers.length; j++) {
          let driver = team.drivers[j]
          if(driver.number == nr) {
            teamIndex = i
            driverIndex = j
          }
        }
      }

      return { "teamIndex": teamIndex, "driverIndex": driverIndex }
    },
    processResults(info, multiplier, results) {

      let formattedResults = []

      for(let i = 0; i < results.length; i++) {
        let row = results[i]
        let formattedRow = {}
        let indexes = this.getDriverIndexByNumber(row["Car #"])
        let team = indexes.teamIndex > -1 ? this.entries[indexes.teamIndex] : { "name": "" }
        let driver = indexes.teamIndex > -1 ? this.entries[indexes.teamIndex].drivers[indexes.driverIndex] : { "name": row["Name"] }
        if(parseInt(row["Start Pos"]) != 0) {
          let positionsGained = parseInt(row["Start Pos"]) - parseInt(row["Fin Pos"])
          let pointsScored = parseInt(row["League Points"]) * multiplier

          formattedRow = {
            "Pos": row["Fin Pos"],
            "#": row["Car #"],
            "Driver": driver.name,
            "Team": team.name,
            "Start Pos": row["Start Pos"],
            "G/L": positionsGained,
            "Interval": row["Interval"] != "-00.000" ? row["Interval"] : "",
            "Laps Led": row["Laps Led"],
            "Avg. Lap time": row["Average Lap Time"],
            "Fastest Lap Time": row["Fastest Lap Time"] + (row["Fast Lap#"] ? " (#" + row["Fast Lap#"] + ")" : ""),
            "Incidents": row["Inc"],
            "Points": pointsScored
          }

          if(this.data.automatic_standings) {
            driver.points += pointsScored
            if(info.counts_for_secondary_points) {
              let secondaryPointsLabel = this.data.standings_fields.find(x => x.key == "secondary_points").label
              if(formattedRow[secondaryPointsLabel]) {
                let secondaryPointsScored = parseInt(formattedRow[secondaryPointsLabel])
                driver.secondary_points += secondaryPointsScored
              }
            }
          }

        } else {
          formattedRow = {
            "Pos": row["Fin Pos"],
            "#": row["Car #"],
            "Driver": driver.name != "Unknown" ? driver.name : row["Name"],
            "Team": team.name,
            "Interval": row["Interval"] != "-00.000" ? row["Interval"] : "",
            "Avg. Lap time": row["Average Lap Time"],
            "Fastest Lap Time": row["Fastest Lap Time"] + (row["Fast Lap#"] ? " (#" + row["Fast Lap#"] + ")" : ""),
            "Points": 0
          }
        }

        formattedResults.push(formattedRow)
      }

      let returnObject

      if(this.data.fastest_lap_bonus > 0 && info.fastest_lap_bonus_enabled) {
        let fastestLapBonus
        let fastestLapRow
        let currentFastestLap = 99999999999999
        for(let i = 0; i < formattedResults.length; i++) {
          let row = formattedResults[i]
          let lap = row["Fastest Lap Time"] ? row["Fastest Lap Time"].split(" ")[0].replace(":","").replace(".","") : null
          if (lap && lap < currentFastestLap) {
            fastestLapRow = row
            currentFastestLap = lap
          }
        }
        fastestLapBonus = this.data.fastest_lap_bonus * multiplier
        fastestLapRow.Points += fastestLapBonus

        if(this.data.automatic_standings) {
          let indexes = this.getDriverIndexByNumber(fastestLapRow["#"])
          if (indexes.teamIndex > -1) {
            let driver = this.entries[indexes.teamIndex].drivers[indexes.driverIndex]
            driver.points += this.data.fastest_lap_bonus * multiplier
          }
        }


        returnObject = { "name": info.name, "index": info.index, "results": formattedResults, "fastest_lap": { "points": fastestLapBonus, "driver": fastestLapRow["Driver"], "laptime": fastestLapRow["Fastest Lap Time"].split(" ")[0] } }

      } else {
        returnObject = { "name": info.name, "index": info.index, "results": formattedResults }
      }

      return returnObject
    },
    openResults(key) {
      this.visibleResults = this.results.find(x => x.key == key)
      this.resultsTabIndex = this.visibleResults.default
      this.$bvModal.show('results')
    },
    setTab(tab) {
      this.tabIndex = parseInt(Object.keys(this.tabDict).find(key => this.tabDict[key] === tab))
    },
    loadData(key) {
      this.loading = true
      this.data = null
      let data = this.filterData(leagueData, key)
      this.data = data[0].details
      this.loadEntries()
      this.loadResults()
      this.loading = false
    },
    loadEntries() {
      this.entries = JSON.parse(JSON.stringify(this.data.teams))
    },
    loadResults() {
      this.results = []
      let sessions = this.data.sessions

      for(let i = 0; i < sessions.length; i++) {

        let multiplier = 1
        if(sessions[i].points_multiplier) {
          multiplier = parseInt(sessions[i].points_multiplier)
        }

        if(sessions[i].results_files.length > 0) {

          let sessionResults = { "key": sessions[i].name, "default": 0, "results": []}
          let files = sessions[i].results_files

          for(let j = 0; j < files.length; j++) {
            if(files[j].default) sessionResults.default = files[j].index

            let path = "/results/" + files[j].file
            Papa.parse(path, { 
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                sessionResults.results.push(this.processResults(files[j], multiplier, results.data))
                sessionResults.results.sort((a, b) => parseInt(a.index) - parseInt(b.index))
              }
            })
          }

          this.results.push(sessionResults)

        }
      }
    }
  },
  mounted: function() {
    this.loadData(this.$route.params.slug)
    this.setTab(this.$route.params.tab)

  },
  watch: {
    $route(from, to) {
      if(from.params.slug != to.params.slug) {
        this.loadData(this.$route.params.slug)
      }
      this.setTab(this.$route.params.tab)
    }
  },
  data: function() {
    return {
      hidePractice: false,
      loading: false,
      tabIndex: 0,
      resultsTabIndex: 0,
      visibleResults: [],
      tabDict: {
        0: "info",
        1: "schedule",
        2: "entries",
        3: "standings",
        4: "signup"
      },
      leagueData,
      data: null,
      "team_card_fields": [
        { "key": "number", "label": "#"}, "name", "wins", "points"
      ],
      results: [],
      entries: []
    }
  }
}
</script>

<style scoped>
  .card-body {
    padding: 0.5rem;
  }
  a.disabled {
    color: #6c757d;
    text-decoration: none;
  }

  @media (min-width: 992px) {
    .team-card {  
      min-width: 40%;
      max-width: 47%;
    }
  }

  @media (max-width: 991px) {
    .team-card {
      min-width: 60%;
    }
  }
</style>
