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
                  <div class="mb-2">
                    <strong>Broadcast</strong><br>
                    {{ data.key_info.broadcast.text }}
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
                  <h3 class="text-left">Tracks</h3>
                  <b-card class="mb-2" v-for="track in data.tracks" :key="track.name">
                    <b-row no-gutters>
                      <b-col cols="3">
                        <h1><b-icon icon="calendar3"></b-icon></h1>
                        {{ track.date }}
                      </b-col>
                      <b-col>
                        <b-card-body :title="track.name">
                          <b-card-text>
                            Sim Time {{ track.simtime }} | {{ track.weather }} | {{ track.sky }} | 
                            <span v-if="track.results">
                              <b-link @click="openResults(track.results)">Results</b-link>
                            </span>
                            <span v-else>
                              <b-link disabled>Results</b-link>
                            </span>
                          </b-card-text>
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
                <b-col cols="12" lg="8" md="12">
                  <h3>Driver standings</h3>
                  <b-table striped outlined :items="standings.driver" :fields="standings_fields" sort-by="points" sort-desc responsive>
                    <template v-slot:cell(index)="data">
                      {{ data.index + 1 }}
                    </template>
                  </b-table>
                </b-col>

                <b-col lg="4">
                  <h3>Team standings</h3>
                  <b-table striped outlined :items="standings.team" :fields="team_standings_fields" sort-by="points" sort-desc>
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

    <b-modal id="results" title="Results" size="xl" scrollable>

      {{ results }}

      <template v-slot:modal-footer>
        <div>
        </div>
      </template>
    </b-modal>

  </div>
</template>

<script>

import leagueData from '../assets/leagues.json'

export default {
  name: 'league',
  computed: {
    standings () {
      let driver_standings = []
      let team_standings = []
      for(let i = 0; i < this.data.teams.length; i++) {
        let team = this.data.teams[i]
        let team_points = 0
        for(let j = 0; j < team.drivers.length; j++) {
          let driver = team.drivers[j]
          driver_standings.push({
            number: driver.number,
            name: driver.name,
            team: team.name,
            wins: driver.wins,
            points: driver.points,
            prize_money: driver.prize_money
          })
          team_points += driver.points
        }
        if(team.name != "Privateer") {
          team_standings.push({
            name: team.name,
            points: team_points
          })
        }
      }
      return { driver: driver_standings, team: team_standings}
    },
    teams () {
      let teams = this.data.teams
      return teams.filter(function(team) {
        return team.name != "Privateer"
      })
    },
    privateers () {
      let teams = this.data.teams
      return teams.filter(function(team) {
        return team.name == "Privateer"
      })
    }
  },
  methods: {
    filterData(object, key) {
      return object.filter(function(object) {
        return object.key == key
      })
    },
    openResults(results) {
      this.results = results
      this.$bvModal.show('results')
    },
    setTab(tab) {
      this.tabIndex = parseInt(Object.keys(this.tabDict).find(key => this.tabDict[key] === tab))
    }
  },
  mounted: function() {
    let data = this.filterData(leagueData, this.$route.params.slug)
    this.data = data[0].details
    this.setTab(this.$route.params.tab)
  },
  watch: {
    $route(from, to) {
      if(from.params.slug != to.params.slug) {
        let data = this.filterData(leagueData, this.$route.params.slug)
        this.data = data[0].details
      }
      this.setTab(this.$route.params.tab)
    }
  },
  data: function() {
    return {
      tabIndex: 0,
      tabDict: {
        0: "info",
        1: "schedule",
        2: "entries",
        3: "standings",
        4: "signup"
      },
      leagueData,
      data: null,
      "standings_fields": [
        { "key": "index", "label": "Pos", "stickyColumn": true }, { "key": "number", "label": "#" }, "name", "team", "wins", "points", { "key": "prize_money", "label": "Prizes" }
      ],
      "team_standings_fields": [
        { "key": "index", "label": "Pos", "stickyColumn": true }, "name", "points"
      ],
      "team_card_fields": [
        { "key": "number", "label": "#"}, "name", "wins", "points"
      ],
      results: null
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

    /* .largeNav {
      display: none !important;
    } */
  }
</style>
