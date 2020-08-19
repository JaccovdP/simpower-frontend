<template>
  <div class="home">
    <b-container class="mt-2" v-if="loading">
      <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
    </b-container>
    <b-container fluid="lg" class="mt-2" v-if="data != null && !loading">
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
                    <span v-if="data.key_info.spotters_guide_url">
                      <br><b-link :href="data.key_info.spotters_guide_url" target="_blank">Spotters Guide</b-link>
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
                  <div class="mb-2">
                    <strong>Regulations</strong><br>
                    <template v-if="$route.params.slug == 'f3-pro' || $route.params.slug == 'f3-evo'">
                      <b-link href="https://regulations.simpower.co.uk/#/alkentech-f3/" target="_blank">Regulations</b-link>
                    </template>
                    <template v-else>
                      <b-link :href="'https://regulations.simpower.co.uk/#/' + $route.params.slug + '/'" target="_blank">Regulations</b-link>
                    </template>
                  </div>
                </b-col>
                <b-col lg="4" md="12">
                  <h3>Key dates</h3>
                  <b-table striped small borderless :items="data.key_dates"></b-table>
                </b-col>
                <b-col lg="4" md="12">
                  <h3>Partners</h3>
                  <template v-for="partner in data.partners">
                    <b-link :key="partner.name" v-if="partner.url.length > 0" :href="partner.url" target="_blank">
                      <b-img class="mb-4" fluid :src="require('../assets/images/' + partner.image)"></b-img>
                    </b-link>
                    <b-img class="mb-4" fluid :key="partner.name" v-if="partner.url.length == 0" :src="require('../assets/images/' + partner.image)"></b-img>
                  </template>
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
                      <b-col sm="3" md="3" cols="6">
                        <h1><b-icon icon="calendar3"></b-icon></h1>
                        {{ session.date }}
                      </b-col>

                      <b-col cols="12" sm="9" md="7" order="3" order-md="2">
                        <b-card-body class="text-left inner-card-body">
                          <b-card-text>
                            <span v-if="session.time"><strong>Session start time</strong> {{ session.time }}<br></span>
                            Sim time {{ session.simtime }} | {{ session.weather }} | {{ session.sky }} <br>
                            <span v-if="session.type == 'race' && session.winner && !resultsLoading">
                              <strong>Winner</strong>&nbsp;<b-link @click="showLicense(getDriverInfoByNumber(session.winner.number))">{{ session.winner.name }}</b-link> - {{ session.winner.team }}
                            </span>
                            <span v-if="session.type == 'race' && resultsLoading">
                              <strong>Winner</strong>&nbsp;<b-icon icon="three-dots" animation="cylon"></b-icon>
                            </span>
                            <span v-if="session.type == 'race' && !session.winner && !resultsLoading">
                              <strong>Winner</strong>&nbsp;-
                            </span>
                          </b-card-text>
                        </b-card-body>
                      </b-col>

                      <b-col v-if="session.trackmap" md="2" cols="6" order="2" order-md="3">
                        <b-img height="80px" :src="require('../assets/images/tracks/' + session.trackmap)"></b-img>
                      </b-col>

                    </b-row>
                    <template v-slot:footer>
                      <b-row no-gutters>
                        <b-col cols="3">
                          <b-icon icon="download" v-b-tooltip.hover title="Downloads &amp; Links"></b-icon>
                        </b-col>
                        <b-col>
                            <b-card-text class="text-left card-footer-body">
                              <span v-if="session.setup_url && session.type == 'race'">
                                <b-link :href="session.setup_url" target="_blank" v-b-tooltip.hover title="Setup"><b-icon icon="wrench"></b-icon></b-link>
                              </span>
                              <span v-if="!session.setup_url && session.type == 'race'">
                                <b-link disabled v-b-tooltip.hover title="Setup"><b-icon icon="wrench"></b-icon></b-link>
                              </span>
                              <span v-if="session.paintpack_url && session.type == 'race'">
                                <b-link :href="session.paintpack_url" target="_blank" v-b-tooltip.hover title="Paintpack"><b-icon icon="brush"></b-icon></b-link>
                              </span>
                              <span v-if="!session.paintpack_url && session.type == 'race'">
                                <b-link disabled v-b-tooltip.hover title="Paintpack"><b-icon icon="brush"></b-icon></b-link>
                              </span>
                              <span v-if="session.broadcast_url && session.type == 'race'">
                                <b-link :href="session.broadcast_url" target="_blank" v-b-tooltip.hover title="Broadcast"><b-icon icon="collection-play"></b-icon></b-link>
                              </span>
                              <span v-if="!session.broadcast_url && session.type == 'race'">
                                <b-link disabled v-b-tooltip.hover title="Broadcast"><b-icon icon="collection-play"></b-icon></b-link>
                              </span>
                              <span v-if="session.results_files.length > 0">
                                <b-link @click="openResults(session.name)" v-b-tooltip.hover title="Results"><b-icon icon="list-ol"></b-icon></b-link>
                              </span>
                              <span v-if="!session.results_files.length > 0">
                                <b-link disabled v-b-tooltip.hover title="Results"><b-icon icon="list-ol"></b-icon></b-link>
                              </span>
                              <span v-if="session.replay_url">
                                <b-link :href="session.replay_url" target="_blank" v-b-tooltip.hover title="Replay"><b-icon icon="camera-video"></b-icon></b-link>
                              </span>
                              <span v-if="!session.replay_url">
                                <b-link disabled v-b-tooltip.hover title="Replay"><b-icon icon="camera-video"></b-icon></b-link>
                              </span>
                            </b-card-text>
                        </b-col>
                      </b-row>
                    </template>
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
                  <b-container class="mt-2" v-if="resultsLoading">
                    <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                  </b-container>
                  <div v-if="!resultsLoading">
                    <b-card-group deck>
                      <b-card class="mb-2 team-card" v-for="team in teams" :key="team.name">
                        <b-row no-gutters>
                          <b-col cols="4">
                            <b-img v-if="team.logo" fluid :src="require('../assets/images/teams/' + team.logo)"></b-img>
                          </b-col>
                          <b-col>
                            <b-card-body :title="team.name">
                              <b-card-text>
                                <b-table small borderless :items="team.drivers" :fields="team_card_fields">
                                  <template v-slot:cell(name)="row">
                                    <b-link @click="showLicense(row.item)">{{ row.item.name }}</b-link>
                                  </template>
                                </b-table> 
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
                                <b-table small borderless :items="team.drivers" :fields="team_card_fields">
                                    <template v-slot:cell(name)="row">
                                      <b-link @click="showLicense(row.item)">{{ row.item.name }}</b-link>
                                    </template>
                                  </b-table> 
                              </b-card-text>
                            </b-card-body>
                          </b-col>
                        </b-row>
                      </b-card>
                    </b-card-group>
                  </div>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Standings">
              <b-row class="text-left">
                <b-col align-self="stretch" cols="12" lg="8" md="12">
                  <h3>Driver standings <span style="float:right;"><b-button v-b-modal.driverTableInfo size="sm">Table info</b-button></span></h3>
                  <b-container class="mt-2" v-if="resultsLoading">
                    <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                  </b-container>
                  <b-table
                    v-if="!resultsLoading"
                    striped 
                    small 
                    outlined
                    no-border-collapse
                    :items="sortedDriverStandings" 
                    :fields="data.standings_fields" 
                    responsive>
                    <template v-slot:head(points)>
                      <b-link @click="driverStandingsSort = 'points'">Points</b-link><b-icon icon="arrow-down" v-if="driverStandingsSort == 'points'"></b-icon>
                    </template>
                    <template v-slot:head(secondary_points)="data">
                      <b-link @click="driverStandingsSort = 'secondary_points'">{{data.label}}</b-link><b-icon icon="arrow-down" v-if="driverStandingsSort == 'secondary_points'"></b-icon>
                    </template>
                    <template v-slot:head(wins)="data">
                      <b-link @click="driverStandingsSort = 'wins'">{{data.label}}</b-link><b-icon icon="arrow-down" v-if="driverStandingsSort == 'wins'"></b-icon>
                    </template>
                    <template v-slot:cell(index)="data">
                      {{ data.index + 1 }}
                    </template>
                    <template v-slot:cell(name)="row">
                      <b-link @click="showLicense(row.item)">{{ row.item.name }}</b-link><br>
                      <small>{{ row.item.team }}</small>
                    </template>
                    <template v-slot:cell(points)="row" v-if="data.automatic_standings">
                      {{ row.item.points }} <small v-if="row.item.main_drop.session"><b-link @click="openResults(row.item.main_drop.session)">(+{{row.item.main_drop.points}})</b-link></small>
                    </template>
                    <template v-slot:cell(secondary_points)="row" v-if="data.automatic_standings">
                      {{ row.item.secondary_points }} <small v-if="row.item.main_drop.session"><b-link @click="openResults(row.item.secondary_drop.session)">(+{{row.item.secondary_drop.points}})</b-link></small>
                    </template>
                  </b-table>
                </b-col>

                <b-col lg="4">
                  <h3>Team standings <span style="float:right;"><b-button v-b-modal.teamTableInfo size="sm">Table info</b-button></span></h3>
                  <b-container class="mt-2" v-if="resultsLoading">
                    <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
                  </b-container>
                  <b-table
                    v-if="!resultsLoading"
                    striped 
                    small 
                    outlined
                    no-border-collapse
                    :items="standings.team"
                    :fields="data.team_standings_fields" 
                    sort-by="points"
                    sort-desc
                    responsive>
                    <template v-slot:cell(index)="data">
                      {{ data.index + 1 }}
                    </template>
                    <template v-slot:cell(points)="row" v-if="data.automatic_standings">
                      <span v-b-tooltip.hover :title="'Drop round points: ' + row.item.team_dropped">{{ row.item.points }}</span>
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

      <b-container class="mt-2" v-if="resultsLoading">
        <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
      </b-container>
      <b-tabs v-if="visibleResults.results && visibleResults.results.length > 0 && !resultsLoading" v-model="resultsTabIndex" pills>
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
          >
          <template v-slot:cell(driver)="row">
            <b-link @click="showLicense(getDriverInfoByNumber(row.item['#']))">{{ row.item.Driver }}</b-link>
          </template>
          </b-table>
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

    <b-modal id="license" title="Simpower License" size="xl">

      <b-row v-if="selectedDriver">
        <b-col lg="7">
          <!-- License -->
          <div class="license_container">

            <b-row>
              <b-col lg="12">
                <div class="license_header">
                  <b-img style="max-width:200px; max-height:30px;" :src="require('../assets/images/simpower.png')"></b-img>
                  <!-- <span style="float:right;">{{data.title}}</span> -->
                </div>
              </b-col>
            </b-row>


            <div class="license_body">
              <b-row>
                <b-col lg="12">
                  <!-- <b-img  class="mt-1" fluid :src="require('../assets/images/carreracup.png')"></b-img> -->
                </b-col>
              </b-row>
              <b-row>
                <b-col lg="6" md="6">
                  <b-img v-if="data.license_logo" class="mt-2" fluid :src="require('../assets/images/' + data.license_logo)"></b-img>
                  <b-img class="mt-2" fluid :src="'/liveries/' + $route.params.slug + '/car_' + selectedDriver.number + '.png'" v-bind:onError="`this.onError=null;this.src = '/liveries/${$route.params.slug}/blank.png'`" alt="Livery placeholder"></b-img>
                </b-col>
                <b-col lg="6" md="6">
                  <strong style="float: left;">Standing</strong><span style="float: right;">P{{ getPositionByNumber(selectedDriver.number) }} ({{ selectedDriver.points }} points)</span><br>
                  <span v-if="data.use_secondary_points"><strong style="float: left;">{{ data.standings_fields.find(x => x.key == "secondary_points").label }}</strong><span style="float: right;">P{{ getSecondaryPositionByNumber(selectedDriver.number) }} ({{ selectedDriver.secondary_points }} points)</span><br></span>
                  <strong style="float: left;">Race wins</strong><span style="float: right;">{{ selectedDriver.wins ? selectedDriver.wins : 0 }}</span><br>
                  <strong style="float: left;">Warnings</strong><span style="float: right;">{{ selectedDriver.warnings ? selectedDriver.warnings : 0 }}</span>
                </b-col>
              </b-row>
            </div>

            <b-row>
              <b-col lg="12">
                <div class="license_footer">
                  #{{ selectedDriver.number }} {{ selectedDriver.name }} - {{ selectedDriver.team ? selectedDriver.team : entries[this.getDriverIndexByNumber(selectedDriver.number).teamIndex].name }}
                </div>
              </b-col>
            </b-row>
          </div>
          
          <!-- Results -->
          <div v-if="selectedDriver.results">
            <hr style="margin-bottom:0px;">
            <h5 class="mt-2">Results</h5>
            <b-card v-for="result in selectedDriver.results" :key="result.session" class="mt-2">
              <table style="width:100%; table-layout:fixed;">
                <tr>
                  <td style="width:60%;">
                    <strong>{{ result.session }}</strong> <span v-if="result.session == selectedDriver.main_drop.session" v-b-tooltip.hover title="This round has been dropped">*</span>
                  </td>
                  <td style="width:10%;">
                    P{{ result.pos }}
                  </td>
                  <td style="width:20%;">
                    {{ result.points }} points
                  </td>
                  <td style="width:10%; text-align:right;">
                    <b-link @click="openResults(result.session)" v-b-tooltip.hover title="Results"><b-icon icon="list-ol"></b-icon></b-link>
                  </td>
                </tr>
              </table>
            </b-card>

            <template v-if="selectedDriver.main_drop">
              <h5 class="mt-2">Drop round</h5>
              <b-card class="mt-2">
                <table style="width:100%; table-layout:fixed;">
                  <tr>
                    <td style="width:60%;">
                      <strong>{{ selectedDriver.main_drop.session }}</strong>
                    </td>
                    <td style="width:10%;">
                      <span v-if="selectedDriver.main_drop.pos != 'NS'">P</span>{{ selectedDriver.main_drop.pos }}
                    </td>
                    <td style="width:20%;">
                      {{ selectedDriver.main_drop.points }} points
                    </td>
                    <td style="width:10%; text-align:right;">
                      <b-link @click="openResults(selectedDriver.main_drop.session)" v-b-tooltip.hover title="Results"><b-icon icon="list-ol"></b-icon></b-link>
                    </td>
                  </tr>
                </table>
              </b-card>
            </template>

            <template v-if="selectedDriver.secondary_drop">
              <h5 class="mt-2">Drop round ATT</h5>
              <b-card class="mt-2">
                <table style="width:100%; table-layout:fixed;">
                  <tr>
                    <td style="width:60%;">
                      <strong>{{ selectedDriver.secondary_drop.session }}</strong>
                    </td>
                    <td style="width:10%;">
                    </td>
                    <td style="width:20%;">
                      {{ selectedDriver.secondary_drop.points }} points
                    </td>
                    <td style="width:10%; text-align:right;">
                      <b-link @click="openResults(selectedDriver.secondary_drop.session)" v-b-tooltip.hover title="Results"><b-icon icon="list-ol"></b-icon></b-link>
                    </td>
                  </tr>
                </table>
              </b-card>
            </template>

          </div>
        </b-col>
        <b-col lg="5">
          <!-- Stats -->
          <h5>Stats</h5>
          <div class="table-responsive">
            <table class="table b-table table-striped table-sm border b-table-no-border-collapse">
              <tbody>
                <tr>
                  <td>
                    <strong>Wins</strong>
                  </td>
                  <td>
                    {{ selectedDriver.wins }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Feature wins</strong>
                  </td>
                  <td>
                    {{ selectedDriver.feature_wins }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Heat wins</strong>
                  </td>
                  <td>
                    {{ selectedDriver.heat_wins }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Consolation wins</strong>
                  </td>
                  <td>
                    {{ selectedDriver.consolation_wins }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Highest finishing position*</strong>
                  </td>
                  <td>
                    {{ selectedDriver.highest_finishing_position }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Lowest finishing position*</strong>
                  </td>
                  <td>
                    {{ selectedDriver.lowest_finishing_position }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Average finishing position*</strong>
                  </td>
                  <td>
                    {{ selectedDriver.average_finishing_position }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Rounds attended</strong>
                  </td>
                  <td>
                    {{ selectedDriver.heat_races_p }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Feature appearances</strong>
                  </td>
                  <td>
                    {{ selectedDriver.feature_races_p }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Heat races laps led</strong>
                  </td>
                  <td>
                    {{ selectedDriver.heat_laps_led }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Consolation races laps led</strong>
                  </td>
                  <td>
                    {{ selectedDriver.consolation_laps_led }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Feature races laps led</strong>
                  </td>
                  <td>
                    {{ selectedDriver.feature_laps_led }}
                  </td>
                </tr>                
                <tr>
                  <td>
                    <strong>Average incident points in heats</strong>
                  </td>
                  <td>
                    {{ !selectedDriver.average_inc_heat ? "-" : selectedDriver.average_inc_heat }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Average incident points in consolation</strong>
                  </td>
                  <td>
                    {{ !selectedDriver.average_inc_consolation ? "-" : selectedDriver.average_inc_consolation }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Average incident points in features</strong>
                  </td>
                  <td>
                    {{ !selectedDriver.average_inc_feature ? "-" : selectedDriver.average_inc_feature }}
                  </td>
                </tr>
              </tbody>
            </table>
            <small>*Drop round is excluded from this stat</small>
          </div>
          
        </b-col>
      </b-row>

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
        let team_dropped = 0
        let team_sec_points = 0
        for(let j = 0; j < team.drivers.length; j++) {
          let driver = team.drivers[j]
          if(this.data.automatic_standings) {
            driver.points = 0
            driver.secondary_points = 0
            let skipDropCalc = this.data.sessions.find(x => x.round == 2 && x.type == "race").results_files.length == 0
            for(let k = 1; k <= this.data.key_info.nr_of_rounds; k++) {
              let round = this.data.sessions.find(x => x.round == k && x.type == "race")
              let finished = round.results_files.length > 0
              if (finished) {
                let result
                if(driver.results && driver.results[k]) {
                  result = driver.results[k]
                  result.session = round.name
                } else {
                  result = { "pos": "NS", "points": 0, "secondary_points": 0, "dq": false, "session": round.name }
                }
                if(!result.dq) {
                  if(!skipDropCalc) {
                    if(!driver.main_drop) driver.main_drop = { "round": k, "pos": result.pos, "points": result.points, "session": result.session}
                    if(driver.main_drop.points >= result.points && (driver.main_drop.pos < result.pos || result.pos == "NS")) driver.main_drop = { "round": k, "pos": result.pos, "points": result.points, "session": result.session}
                    if(!driver.secondary_drop) driver.secondary_drop = { "round": k, "points": result.secondary_points, "session": result.session}
                    if(driver.secondary_drop.points > result.secondary_points) driver.secondary_drop = { "round": k, "points": result.secondary_points, "session": result.session}
                  }

                  driver.points += result.points
                  driver.secondary_points += result.secondary_points
                } else {
                  driver.points += 0
                  driver.secondary_points += 0
                }              
              }
            }
            if(driver.results) {
              let finishingPositions = []
              for(let n = 1; n <= this.data.key_info.nr_of_rounds; n++) {
                if(driver.results[n]) {
                  let result = driver.results[n]
                  if(driver.main_drop) {
                    if(result.session != driver.main_drop.session && result.pos != "NS") finishingPositions.push(parseInt(result.pos))
                  } else if(result.pos != "NS") {
                    finishingPositions.push(parseInt(result.pos))
                  }
                }
              }
              let sum = 0
              for(let x = 0; x < finishingPositions.length; x++) {
                sum += finishingPositions[x]
              }
              driver.highest_finishing_position = Math.max(...finishingPositions)
              driver.lowest_finishing_position = Math.min(...finishingPositions)
              driver.average_finishing_position = (sum / finishingPositions.length)
            }
            if(driver.main_drop && driver.secondary_drop) {
              driver.points -= driver.main_drop.points
              driver.secondary_points -= driver.secondary_drop.points
            }
          }
          driver_standings.push({
            number: driver.number,
            name: driver.name,
            team: team.name,
            team_logo: team.logo,
            wins: driver.wins,
            feature_wins: driver.feature_wins,
            heat_wins: driver.heat_wins,
            consolation_wins: driver.consolation_wins,
            average_finishing_position: driver.average_finishing_position,
            highest_finishing_position: driver.highest_finishing_position,
            lowest_finishing_position: driver.lowest_finishing_position,
            points: driver.points,
            secondary_points: driver.secondary_points,
            heat_races_p: driver.heat_races_p,
            consolation_races_p: driver.consolation_races_p,
            feature_races_p: driver.feature_races_p,
            heat_laps_led: driver.heat_laps_led,
            consolation_laps_led: driver.consolation_laps_led,
            feature_laps_led: driver.feature_laps_led,
            heat_inc: driver.heat_inc,
            feature_inc: driver.feature_inc,
            consolation_inc: driver.consolation_inc,
            average_inc_heat: driver.heat_inc / driver.heat_races_p,
            average_inc_consolation: driver.consolation_inc / driver.consolation_races_p,
            average_inc_feature: driver.feature_inc / driver.feature_races_p,
            warnings: driver.warnings,
            results: driver.results,
            main_drop: driver.main_drop ? driver.main_drop : {},
            secondary_drop: driver.secondary_drop ? driver.secondary_drop : {}
          })
          team_points += driver.points
          if(this.data.automatic_standings && driver.main_drop) team_dropped += driver.main_drop.points
          team_sec_points += driver.secondary_points
        }
        if(team.name != "Privateer") {
          team_standings.push({
            name: team.name,
            points: team_points,
            secondary_points: team_sec_points,
            team_dropped: team_dropped
          })
        }
      }
      return { driver: driver_standings, team: team_standings}
    },
    sortedDriversPoints() {
      let result = JSON.parse(JSON.stringify(this.standings.driver))
      return result.sort((a, b) => 
        a.points < b.points || 
        (a.points == b.points && a.feature_wins < b.feature_wins) ||
        (a.points == b.points && a.feature_wins == b.feature_wins && a.heat_wins < b.heat_wins) ||
        (a.points == b.points && a.feature_wins == b.feature_wins && a.heat_wins == b.heat_wins && a.average_finishing_position > b.average_finishing_position) ||
        (a.points == b.points && a.feature_wins == b.feature_wins && a.heat_wins == b.heat_wins && a.average_finishing_position == b.average_finishing_position && a.highest_finishing_position < b.highest_finishing_position) ||
        (a.points == b.points && a.feature_wins == b.feature_wins && a.heat_wins == b.heat_wins && a.average_finishing_position == b.average_finishing_position && a.highest_finishing_position == b.highest_finishing_position && a.lowest_finishing_position < b.lowest_finishing_position) ||
        (a.points == b.points && !a.results)
      )
    },
    sortedDriversSecondaryPoints() {
      let result = JSON.parse(JSON.stringify(this.standings.driver))
      return result.sort((a, b) =>
          a.secondary_points < b.secondary_points ||
          (a.secondary_points == b.secondary_points && a.average_inc_heat > b.average_inc_heat)
        )
    },
    sortedDriversWins() {
      let result = JSON.parse(JSON.stringify(this.standings.driver))
      return result.sort((a, b) =>
          a.wins < b.wins ||
          (a.wins == b.wins && a.feature_wins < b.feature_wins) ||
          (a.wins == b.wins && a.feature_wins == b.feature_wins && a.heat_wins < b.heat_wins) ||
          (a.wins == b.wins && a.feature_wins == b.feature_wins && a.heat_wins == b.heat_wins && a.consolation_wins < b.consolation_wins) ||
          (!a.wins)
        )
    },
    sortedDriverStandings() {
      if(this.driverStandingsSort == 'points') {
        return this.sortedDriversPoints
      } else if (this.driverStandingsSort == 'secondary_points') {
        return this.sortedDriversSecondaryPoints
      } else if (this.driverStandingsSort == 'wins') {
        return this.sortedDriversWins
      } else {
        return this.standings.driver
      }
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
    },
    resultsLoading () {
      return this.nrOfResultsToLoad > 0
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
      if (driver) {
        return driver
      } else {
        return { "number": 0, "name": "Unknown", "team": "", "wins": 0, "points": 0, "secondary_points": 0 }
      }
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
    getPositionByNumber(nr) {
      return this.sortedDriversPoints.findIndex(x => x.number == nr) + 1
    },
    getSecondaryPositionByNumber(nr) {
      return this.sortedDriversSecondaryPoints.findIndex(x => x.number == nr) + 1
    },
    processResults(session, type, info, multiplier, results) {

      let formattedResults = []

      for(let i = 0; i < results.length; i++) {
        let row = results[i]
        let formattedRow = {}
        let indexes = this.getDriverIndexByNumber(row["Car #"])
        let team = indexes.teamIndex > -1 ? this.entries[indexes.teamIndex] : { "name": "" }
        let driver = indexes.teamIndex > -1 ? this.entries[indexes.teamIndex].drivers[indexes.driverIndex] : { "name": row["Name"] }
        if(type == "race") {
          if(parseInt(row["Start Pos"]) != 0) {
            let positionsGained = parseInt(row["Start Pos"]) - parseInt(row["Fin Pos"])
            let pointsScored = 0
            let secondaryPointsScored = positionsGained
            let dq = false
            if(row["League Points"] == "DQ") {
              dq = true
            } else {
              pointsScored = row["League Points"] == "" ? 0 : parseInt(row["League Points"]) * multiplier
            }
            if(secondaryPointsScored < 0) secondaryPointsScored = 0

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
              "Points": dq ? "DQ" : pointsScored
            }

            if(info.name == "Feature" && formattedRow["Pos"] == 1) {
              session["winner"] = { "number": formattedRow["#"], "name": formattedRow["Driver"], "team": formattedRow["Team"] }
            }

            if(this.data.automatic_standings) {
              if (formattedRow["Pos"] == 1) driver.wins += 1
              if(!driver.results) driver.results = {}
              if(!driver.results[session.round]) driver.results[session.round] = { "pos": 0, "points": 0, "secondary_points": 0, "dq": dq, "session": session.name }
              if(!driver.feature_wins) driver.feature_wins = 0
              if(!driver.heat_wins) driver.heat_wins = 0
              if(!driver.consolation_wins) driver.consolation_wins = 0
              if(!driver.heat_inc) driver.heat_inc = 0
              if(!driver.consolation_inc) driver.consolation_inc = 0
              if(!driver.feature_inc) driver.feature_inc = 0
              if(!driver.heat_races_p) driver.heat_races_p = 0
              if(!driver.consolation_races_p) driver.consolation_races_p = 0
              if(!driver.feature_races_p) driver.feature_races_p = 0
              if(!driver.heat_laps_led) driver.heat_laps_led = 0
              if(!driver.consolation_laps_led) driver.consolation_laps_led = 0
              if(!driver.feature_laps_led) driver.feature_laps_led = 0

              if(info.name.includes("Heat")) {
                if(formattedRow["Pos"] == 1) driver.heat_wins += 1
                driver.heat_inc += parseInt(formattedRow["Incidents"])
                driver.heat_laps_led += parseInt(formattedRow["Laps Led"])
                driver.heat_races_p += 1
              }
              if(info.name == "Feature") {
                if(formattedRow["Pos"] == 1) driver.feature_wins += 1
                driver.feature_inc += parseInt(formattedRow["Incidents"])
                driver.results[session.round].pos = parseInt(formattedRow["Pos"])
                driver.feature_laps_led += parseInt(formattedRow["Laps Led"])
                driver.feature_races_p += 1
              }
              if(info.name == "Consolation") {
                if(formattedRow["Pos"] == 1) driver.consolation_wins += 1
                driver.consolation_inc += parseInt(formattedRow["Incidents"])
                driver.results[session.round].pos = parseInt(formattedRow["Pos"]) + 20
                driver.consolation_laps_led += parseInt(formattedRow["Laps Led"])
                driver.consolation_races_p += 1
              }

              driver.results[session.round].dq = dq
              driver.results[session.round].points += pointsScored

              if(info.counts_for_secondary_points) driver.results[session.round].secondary_points += secondaryPointsScored
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
        } else if(type == "practice") {
          formattedRow = {
            "Pos": row["Fin Pos"],
            "#": row["Car #"],
            "Driver": driver.name != "Unknown" ? driver.name : row["Name"],
            "Team": team.name,
            "Laps Completed": row["Laps Comp"],
            "Avg. Lap time": row["Average Lap Time"] != "00.000" ? row["Average Lap Time"] : "",
            "Fastest Lap Time": row["Fastest Lap Time"] + (row["Fast Lap#"] ? " (#" + row["Fast Lap#"] + ")" : "")
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
            if(!driver.nr_of_fastest_laps) driver.nr_of_fastest_laps = 0
            driver.results[session.round].points += fastestLapBonus
            driver.nr_of_fastest_laps += 1
          }
        }

        returnObject = { "name": info.name, "index": info.index, "results": formattedResults, "fastest_lap": { "points": fastestLapBonus, "driver": fastestLapRow["Driver"], "laptime": fastestLapRow["Fastest Lap Time"].split(" ")[0] } }

      } else {
        returnObject = { "name": info.name, "index": info.index, "results": formattedResults }
      }

      return returnObject
    },
    showLicense(driver) {
      this.selectedDriver = driver
      this.$bvModal.show('license')
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
      this.selectedDriver = null
      this.data = null
      let data = this.filterData(leagueData, key)
      this.data = data[0].details
      this.driverStandingsSort = "points"
      this.loadEntries()
      this.loadResults()
      this.loading = false
    },
    loadEntries() {
      this.entries = JSON.parse(JSON.stringify(this.data.teams))
    },
    loadResults() {
      this.results = []
      this.nrOfResultsToLoad = 0
      let sessions = this.data.sessions

      for(let i = 0; i < sessions.length; i++) {

        let multiplier = 1
        if(sessions[i].points_multiplier) {
          multiplier = parseInt(sessions[i].points_multiplier)
        }

        if(sessions[i].results_files.length > 0) {

          let sessionResults = { "key": sessions[i].name, "default": 0, "results": []}
          let files = sessions[i].results_files
          let type = sessions[i].type

          this.nrOfResultsToLoad += files.length

          for(let j = 0; j < files.length; j++) {
            if(files[j].default) sessionResults.default = files[j].index

            let path = "/results/" + files[j].file
            Papa.parse(path, { 
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                sessionResults.results.push(this.processResults(sessions[i], type, files[j], multiplier, results.data))
                sessionResults.results.sort((a, b) => parseInt(a.index) - parseInt(b.index))
                this.nrOfResultsToLoad -= 1
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
      loading: false,
      nrOfResultsToLoad: 0,
      hidePractice: false,
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
        { "key": "number", "label": "#"}, "name", "wins", { "key": "info", "label": "" }
      ],
      results: [],
      entries: [],
      selectedDriver: null,
      driverStandingsSort: "points"
    }
  }
}
</script>

<style scoped>
  .card-body {
    padding: 0.5rem;
  }
  .inner-card-body {
    padding: 0.25rem 0.5rem;
  }
  .card-footer {
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;
  }
  .card-footer-body {
    padding: 0 0.5rem 0 0.5rem;
  }

  .card-footer-body > span > a {
    margin-right: 15px;
  }
  a.disabled {
    color: #6c757d;
    text-decoration: none;
  }

  /* .license_container {
    max-width: 466px;
  } */

  .license_body {
    border-left: 2px solid #c92526;
    border-right: 2px solid #c92526;
    background: #eee;
    padding: 0px 5px 0 5px;
  }

  .license_header {
    min-height: 40px;
    background: #343a40;
    padding: 5px 5px 5px 5px;
    color: #fff;
  }

  .license_footer {
    min-height: 40px;
    background: #c92526;
    padding: 5px 5px 5px 5px;
    font-size: 1em;
    color: #fff;
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
