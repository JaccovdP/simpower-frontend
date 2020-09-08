<template>
  <div class="home">
    <b-container class="mt-2" v-if="!leagueData || !simpowerData">
      <b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
    </b-container>
    <div v-if="leagueData && simpowerData">
      <div class="leagues-background">

      </div>
      <b-container fluid="lg" class="leagues-container">
        <b-row>
          <b-col v-for="league in leagueData.slice(0,2)" :key="league.key" cols="12" md="6" class="mb-2">
            <b-link :to="'/league/' + league.key + '/info'">
              <b-img fluid :src="require('../assets/images/' + league.details.promo_image)"></b-img>
            </b-link>
          </b-col>
        </b-row>
      </b-container>

      <b-container fluid="lg" class="mt-4">
        <b-card no-body>
          <b-row>
            <b-col md="12">
              <b-card-body :title="simpowerData.about_us.title">
                <b-card-text class="text-justify" style="max-width: 800px; margin: 0 auto;">
                  {{ simpowerData.about_us.text }}
                  <b-row class="text-center mt-4">
                    <b-col>
                      <b-link href="https://www.instagram.com/simpowerleagues/" target="_blank">
                        <b-img height="48px" :src="require('../assets/images/iconmonstr-instagram-13-240.png')"></b-img>
                      </b-link>
                    </b-col>
                    <b-col>
                      <b-link href="https://discord.gg/6B67YnY" target="_blank">
                        <b-img height="48px" :src="require('../assets/images/iconmonstr-discord-3-240.png')"></b-img>
                      </b-link>
                    </b-col>
                    <b-col>
                      <b-link href="https://www.youtube.com/channel/UCvsbzk_sEC0ONXhXZG02myQ" target="_blank">
                        <b-img height="48px" :src="require('../assets/images/iconmonstr-youtube-8-240.png')"></b-img>
                      </b-link>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card-body>
            </b-col>
            <!-- <b-col md="3">
              <b-img fluid :src="require('../assets/images/' + simpowerData.about_us.image)"></b-img>
            </b-col> -->
          </b-row>
        </b-card>
      </b-container>

      <div class="quotes bg-dark mt-4">
        <b-container fluid="lg">
          <b-row v-if="quotes">
            <b-col v-for="quote in quotes.slice(0,3)" :key="quote.name" cols="12" md="4" class="mt-2 mb-2 text-center">
              <small><i>"{{ quote.quote }}"</i><br>
              &#9; - {{ quote.name }}</small>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="footer">
        <b-container fluid="lg">
          <b-row>
            <b-col v-for="partner in partners" :key="partner.name" cols="12" :md="(12 / partners.length) < 4 ? 3 : 12 / partners.length">
              <b-link :key="partner.name" v-if="partner.url.length > 0" :href="partner.url" target="_blank">
                <b-img height="50px" class="mt-2 mb-2" :src="require('../assets/images/' + partner.image)"></b-img>
              </b-link>
              <b-img v-if="partner.url.length == 0" height="50px" class="mt-2 mb-2" :src="require('../assets/images/' + partner.image)"></b-img>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
  </div>
  
</template>

<script>
import leagueData from '../assets/leagues.json'
import simpowerData from '../assets/simpower.json'

export default {
  name: 'Home',
  data: function () {
    return {
        leagueData,
        simpowerData,
        quotes: null,
        partners: null
    }
  },
  mounted: function() {
    this.partners = simpowerData.partners.sort(() => Math.random() - 0.5)
    this.quotes = simpowerData.quotes.sort(() => Math.random() - 0.5)
  }
}
</script>

<style scoped>
  .header {
    height: 300px;
    width: 100%;
    background-image: url("../assets/images/header.png");
  }
  .league-card .card-body {
    display: none;
  }
  .league-card .card-footer {
    padding-left: 0;
    padding-right: 0;
  }
  .league-card .navbar {
    padding: 0;
    justify-content: center;
  }
  .leagues-background {
    position: absolute;
    height: 350px;
    width: 100%;
    overflow: visible;
    background-image: url('../assets/images/homebanner.png');
    background-position: bottom;
    background-repeat: no-repeat;
    background-size:cover;
  }
  .leagues-container {
    padding-top: 300px;
  }
  .quotes {
    padding: 20px 0;
    color: #fff;
  }
  .footer {
    padding: 20px 0;
  }

  @media (max-width: 767px) {
    .leagues-background {
      display: none !important;
    }
    .leagues-container {
      padding-top: 20px;
    }
  }
</style>