<template>
  <div id="app">
    <b-navbar fluid type="dark" variant="dark" fixed sticky toggleable class="toggle-navbar">
      <b-container>
        <b-navbar-brand to="/">
          <b-img style="max-height:27px; max-width:200px;" :src="require('./assets/images/simpower.png')"></b-img>
        </b-navbar-brand>

        <b-navbar-toggle target="navbar-toggle-collapse">
          <template v-slot:default="{ expanded }">
            <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
            <b-icon v-else icon="chevron-bar-down"></b-icon>
          </template>
        </b-navbar-toggle>

        <b-collapse id="navbar-toggle-collapse" is-nav>
          <b-navbar-nav>        
            <b-nav-item to="/">Home</b-nav-item>

            <b-nav-item-dropdown text="Leagues" left>
              <template v-for="league in leagueData">
                <b-dropdown-item 
                  :key="league.details.name" 
                  v-if="league.details.visible" 
                  :to="'/league/' + league.key + '/info'">
                  {{ league.details.menu_title }}
                </b-dropdown-item>
              </template>
            </b-nav-item-dropdown>

            <b-nav-item href="https://discord.gg/6B67YnY" target="_blank">Discord</b-nav-item>
          </b-navbar-nav>
        </b-collapse>

      </b-container>
    </b-navbar>

    <b-navbar fluid type="dark" variant="dark" fixed sticky class="normal-navbar">
      <b-container>
        <b-navbar-brand to="/">
          <b-img style="max-height:27px; max-width:200px;" :src="require('./assets/images/simpower.png')"></b-img>
        </b-navbar-brand>

        <b-navbar-nav>        
          <b-nav-item class="nav-spacing" to="/">Home</b-nav-item>

          <b-nav-item class="nav-spacing" href="/league/carrera-cup-s2/info">PorscheSport Cup Season 2</b-nav-item>

          <b-nav-item-dropdown class="nav-spacing" text="Other Leagues" left>
            <template v-for="league in leagueData">
              <b-dropdown-item 
                :key="league.details.name" 
                v-if="league.details.visible" 
                :to="'/league/' + league.key + '/info'">
                {{ league.details.menu_title }}
              </b-dropdown-item>
            </template>
          </b-nav-item-dropdown>

          <b-nav-item class="nav-spacing" href="https://discord.gg/6B67YnY" target="_blank">Discord</b-nav-item>
        </b-navbar-nav>

      </b-container>
    </b-navbar>
    <router-view/>
    <div class="push" v-if="$route.params.slug"></div>

    <b-navbar type="dark" variant="dark" v-if="$route.params.slug" class="smallNav" fixed="bottom" sticky>
      <b-container fluid>
        <b-nav pills>
          <b-nav-item to="info" :active="$route.params.tab == 'info'">
            <b-icon icon="info-square"></b-icon>
            <span class="navTitle">&nbsp;Info</span>
          </b-nav-item>
          <b-nav-item to="schedule" :active="$route.params.tab == 'schedule'">
            <b-icon icon="calendar3"></b-icon>
            <span class="navTitle">&nbsp;Schedule</span>
          </b-nav-item>
          <b-nav-item to="entries" :active="$route.params.tab == 'entries'">
            <b-icon icon="card-list"></b-icon>
            <span class="navTitle">&nbsp;Entries</span>
          </b-nav-item>
          <b-nav-item to="standings" :active="$route.params.tab == 'standings'">
            <b-icon icon="list-ol"></b-icon>
            <span class="navTitle">&nbsp;Standings</span>
          </b-nav-item>
          <b-nav-item to="signup" :active="$route.params.tab == 'signup'" disabled>
            <b-icon icon="pencil-square"></b-icon>
            <span class="navTitle">&nbsp;Sign up</span>
          </b-nav-item>
        </b-nav>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
import leagueData from './assets/leagues.json'
import simpowerData from './assets/simpower.json'

export default {
    data: function () {
        return {
            leagueData,
            simpowerData
        }
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.push {
  margin-top: 70px;
  display: block;
}

.nav-spacing {
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

div.tabContainer > div > ul.nav {
  display: none !important;
}

.table {
  margin-bottom: 0 !important;
}

@media (min-width: 768px) {
  .toggle-navbar {  
    display: none !important;
  }
}

@media (max-width: 767px) {
  .normal-navbar {
    display: none !important;
  }
  .navTitle {
    display: none !important;
  }
}

@media (min-width: 992px) {
  .smallNav {
    display: none !important;
  }
  .push {
    display: none !important;
  }
}

@media (max-width: 991px) {
  .largeNav {
    display: none !important;
  }
}
</style>
