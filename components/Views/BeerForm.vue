<template>
  <div>
    <v-card-text>
      <v-divider></v-divider>
    </v-card-text>
    <v-card-title>
      <h1>Select Beer</h1>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <v-combobox
          v-model.trim="beerName"
          :rules="[rules.required, rules.max]"
          :items="beerNames"
          append-icon="arrow_drop_down"
          label="Beer name"
          required
          autofocus
        ></v-combobox>
        <v-combobox
          v-model.trim="brewery"
          :rules="[rules.required, rules.max]"
          :items="breweries"
          append-icon="arrow_drop_down"
          label="Brewery"
          required
        ></v-combobox>
        <v-combobox
          v-if="me"
          v-model="style"
          :rules="[rules.required]"
          :items="beerStyles"
          append-icon="arrow_drop_down"
          label="Style"
          required
        ></v-combobox>
        <v-select
          v-else
          v-model="style"
          :rules="[rules.required]"
          :items="beerStyles"
          append-icon="arrow_drop_down"
          label="Style"
          required
        ></v-select>
        <h3 class="mb-5">Degrees</h3>
        <v-slider
          v-model="degrees"
          always-dirty
          thumb-label="always"
          min="0"
          max="25"
        >
          <template v-slot:prepend>
            <v-icon @click.native="decDegrees()">remove</v-icon>
          </template>
          <template v-slot:append>
            <v-icon @click.native="incDegrees()">add</v-icon>
          </template>
        </v-slider>
        <h3 class="mb-5">ABV</h3>
        <v-slider
          v-model="abv"
          always-dirty
          thumb-label="always"
          step="0.1"
          min="0"
          max="14"
        >
          <template v-slot:prepend>
            <v-icon @click.native="decAbv()">remove</v-icon>
          </template>
          <template v-slot:append>
            <v-icon @click.native="incAbv()">add</v-icon>
          </template>
        </v-slider>
        <div v-if="$store.state.editBeerDialog">
          <v-switch
            v-model="tempBeer"
            :label="`Temp Beer: ${tempBeer.toString()}`"
          ></v-switch>
          <v-switch
            v-model="tempBrewery"
            :label="`Temp Brewery: ${tempBrewery.toString()}`"
          ></v-switch>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :small="smallScreen"
        @click.native="onCancel()"
      >Cancel</v-btn>
      <v-btn
        :small="smallScreen"
        color="primary"
        @click.native="onSelect()"
      >Select</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import beerStyles from '~/data/beerStyles.json'
import preloadedBreweries from '~/data/breweries.json'

export default {
  name: 'BeerForm',
  data() {
    return {
      beerStyles,
      preloadedBreweries
    }
  },
  computed: {
    ...mapState(['beerInfo']),
    _id() { return this.beerInfo.beer._id },
    beerName: {
      set(beerName) { this.$store.commit('setBeer', { beerName }) },
      get() { return this.beerInfo.beer.beerName }
    },
    brewery: {
      set(brewery) { this.$store.commit('setBeer', { brewery }) },
      get() { return this.beerInfo.beer.brewery }
    },
    style: {
      set(style) { this.$store.commit('setBeer', { style }) },
      get() { return this.beerInfo.beer.style }
    },
    degrees: {
      set(degrees) { this.$store.commit('setBeer', { degrees }) },
      get() { return this.beerInfo.beer.degrees }
    },
    abv: {
      set(abv) { this.$store.commit('setBeer', { abv }) },
      get() { return this.beerInfo.beer.abv }
    },
    tempBeer: {
      set(tempBeer) { this.$store.commit('setBeer', { tempBeer }) },
      get() { return this.beerInfo.beer.tempBeer }
    },
    tempBrewery: {
      set(tempBrewery) { this.$store.commit('setBeer', { tempBrewery }) },
      get() { return this.beerInfo.beer.tempBrewery }
    },
    rules() { return this.$store.state.rules },
    beerNames() {
      return this.$store.state.beers.map(x => x.beerName).sort((a, b) => a.localeCompare(b))
    },
    breweries() {
      const loadedBreweries = this.$store.state.breweries.map(x => x.name)
      return this.me
        ? loadedBreweries.concat(this.preloadedBreweries).sort((a, b) => a.localeCompare(b))
        : loadedBreweries
    },
    me() {
      const id = this.$store.state.auth.user._id
        ? this.$store.state.auth.user._id
        : ''
      return id === '5caf07e843926a0f4899ce31' || id === '5cb4e10a80b6f075eefbf3e9'
    },
    smallScreen() { return window.screen.availWidth < 360 }
  },
  methods: {
    onSelect() {
      if (this.$refs.form.validate()) {
        this.$store.commit('toggle', 'loading')
        const checkForBrewery = this.$store.state.breweries.find(x => x.name === this.brewery)
        const brewery = checkForBrewery ? checkForBrewery._id : null

        if (this.$store.state.editBeerDialog) {
          this.$axios.patch(`/beers/${this._id}`, {
            beerName: this.beerName,
            brewery,
            style: this.style,
            degrees: this.degrees,
            abv: this.abv,
            tempBeer: this.tempBeer,
            tempBrewery: this.tempBrewery
          })
            .then(() => {
              this.$store.commit('toggle', 'loading')
              this.$store.dispatch('onCancelReview')
              this.$store.dispatch('getBeers')
              this.$toast.success('Updated beer', { duration: 4000 })
            })
            .catch(() => {
              this.$store.commit('toggle', 'loading')
              this.$toast.error('Error updating beer', { duration: 4000 })
            })
        } else {
          const beer = this.$store.state.beers.filter(x => x.brewery._id === brewery)
            .find(x => x.beerName === this.beerName)
          if (beer) {
            this.$store.dispatch('beerInfo', beer)
            this.$store.commit('toggle', 'loading')
          } else {
            // Post new temp beer
            const data = {
              beerName: this.beerName,
              brewery: this.brewery,
              style: this.style,
              degrees: this.degrees,
              abv: this.abv,
              tempBeer: true,
              tempBrewery: true
            }
            if (checkForBrewery) {
              data.tempBrewery = false
              data.brewery = brewery
            }
            this.$axios.post('/beers', data)
              .then((res) => {
                this.$store.commit('toggle', 'loading')
                this.$store.dispatch('beerInfo', res.data)
              })
              .catch(() => {
                this.$store.commit('toggle', 'loading')
                this.$toast.error('Error adding beer, please try again', { duration: 4000 })
              })
          }
        }
      }
    },
    onCancel() {
      this.$store.commit('truthy', { item: 'beerReviewDialog', bool: false })
      this.$store.commit('resetBeerInfo')
    },
    decDegrees() { this.degrees-- },
    incDegrees() { this.degrees++ },
    decAbv() { this.abv = +this.abv - 0.1 },
    incAbv() { this.abv = +this.abv + 0.1 }
  }
}
</script>
