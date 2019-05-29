<template>
  <div>
    <v-dialog
      v-model="$store.state.breweryInfoDialog"
      max-width="450"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      persistent
    >
      <v-card>
        <beer-banner />
        <v-card-title>
          <v-layout
            wrap
            align-center
          >
            <v-img
              :src="logoSrc"
              lazy-src="https://res.cloudinary.com/dukumou2e/image/upload/v1557745360/breweries/lazy-src_zpkrwj.jpg"
              alt="Brewery logo"
              aspect-ratio="1"
              min-width="30vw"
              max-width="30vw"
              class="mr-3"
            >
              <template v-slot:placeholder>
                <v-layout
                  fill-height
                  align-center
                  justify-center
                  ma-0
                >
                  <v-progress-circular indeterminate></v-progress-circular>
                </v-layout>
              </template>
            </v-img>
            <v-layout
              wrap
              column
            >
              <h1>{{ brewery.name }}</h1>
              <h2>{{ brewery.type }}</h2>
            </v-layout>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-layout
            align-center
            justify-center
            wrap
          >
            <v-rating
              v-model="brewery.averageRating"
              background-color="secondary"
              readonly
              medium
              half-increments
              full-icon="fa fa-beer"
              half-icon="fa fa-beer"
              empty-icon="fa fa-beer"
            ></v-rating>
            <h3 class="ml-2">({{ brewery.averageRating }})</h3>
          </v-layout>
          <p class="brewery-desc">{{ brewery.description }}</p>
          <v-layout
            v-if="beers.length"
            column
          >
            <h2 class="text-xs-center">{{ brewery.name }} beers</h2>
            <v-layout
              v-for="(beer, i) in beers"
              :key="i"
              justify-center
              align-center
              class="my-2"
            >
              <a @click="openBeerInfo(beer)">
                <h2 class="my-box">{{ beer.beerName }}</h2>
              </a>
              <v-divider vertical></v-divider>
              <h3 class="my-box">{{ beer.style }}</h3>
            </v-layout>
          </v-layout>
        </v-card-text>
        <v-card-actions class="my-3">
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click.native="onClose()"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'BreweryInfoDialog',
  computed: {
    brewery() { return this.$store.state.breweryInfo },
    beers() {
      return this.$store.state.beers.filter((x) => {
        return x.brewery.name === this.brewery.name
      })
    },
    logoSrc() {
      return this.brewery.logo
        ? this.brewery.logo
        : 'https://res.cloudinary.com/dukumou2e/image/upload/v1559137015/icons/icon_emuh44.png'
    }
  },
  methods: {
    onClose() {
      this.$store.commit('toggle', 'breweryInfoDialog')
      this.$store.commit('resetBreweryInfo')
    },
    openBeerInfo(beer) {
      this.$store.dispatch('beerInfo', beer)
      this.onClose()
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-box {
  width: 40vw;
  max-width: 40vw;
  text-align: center;
  overflow-wrap: break-word;
}
</style>
