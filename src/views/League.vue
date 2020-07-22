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
                            <span v-if="session.results && session.type == 'race'">
                              <b-link @click="openResults(session.results)">Open results</b-link>
                            </span>
                            <span v-if="!session.results && session.type == 'race'">
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

    <b-modal id="results" title="Results" size="xl" scrollable>

      {{ results }}

      <template v-slot:modal-footer>
        <div>
        </div>
      </template>
    </b-modal>

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
        let team_sec_points = 0
        for(let j = 0; j < team.drivers.length; j++) {
          let driver = team.drivers[j]
          driver_standings.push({
            number: driver.number,
            name: driver.name,
            team: team.name,
            wins: driver.wins,
            points: driver.points,
            secondary_points: driver.secondary_points,
            prize_money: driver.prize_money
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
    openResults(results) {
      this.results = results
      this.$bvModal.show('results')
    },
    setTab(tab) {
      this.tabIndex = parseInt(Object.keys(this.tabDict).find(key => this.tabDict[key] === tab))
    }
  },
  mounted: function() {
    this.data = null
    let data = this.filterData(leagueData, this.$route.params.slug)
    this.data = data[0].details
    this.setTab(this.$route.params.tab)
  },
  watch: {
    $route(from, to) {
      if(from.params.slug != to.params.slug) {
        this.data = null
        let data = this.filterData(leagueData, this.$route.params.slug)
        this.data = data[0].details
      }
      this.setTab(this.$route.params.tab)
    }
  },
  data: function() {
    return {
      hidePractice: false,
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
