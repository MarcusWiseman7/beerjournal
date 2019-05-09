<template>
  <div>
    <v-card-title>
      <h1>Beer</h1>
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
        <v-select
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
          min="4"
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
          min="3"
          max="14"
        >
          <template v-slot:prepend>
            <v-icon @click.native="decAbv()">remove</v-icon>
          </template>
          <template v-slot:append>
            <v-icon @click.native="incAbv()">add</v-icon>
          </template>
        </v-slider>
        <v-switch
          v-if="$store.state.editBeerDialog"
          v-model="tempBeer"
          :label="`Temp Beer: ${tempBeer.toString()}`"
        ></v-switch>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        small
        @click.native="onCancel()"
      >Cancel</v-btn>
      <v-btn
        small
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
    ...mapState(['selectBeer']),
    _id() { return this.selectBeer._id },
    beerName: {
      set(beerName) { this.$store.commit('setSelectBeer', { beerName }) },
      get() { return this.selectBeer.beerName }
    },
    brewery: {
      set(brewery) { this.$store.commit('setSelectBeer', { brewery }) },
      get() { return this.selectBeer.brewery }
    },
    style: {
      set(style) { this.$store.commit('setSelectBeer', { style }) },
      get() { return this.selectBeer.style }
    },
    degrees: {
      set(degrees) { this.$store.commit('setSelectBeer', { degrees }) },
      get() { return this.selectBeer.degrees }
    },
    abv: {
      set(abv) { this.$store.commit('setSelectBeer', { abv }) },
      get() { return this.selectBeer.abv }
    },
    tempBeer: {
      set(tempBeer) { this.$store.commit('setSelectBeer', { tempBeer }) },
      get() { return this.selectBeer.tempBeer }
    },
    rules() { return this.$store.state.rules },
    beerNames() {
      return this.$store.state.beers.map(x => x.beerName).sort((a, b) => a.localeCompare(b))
    },
    breweries() {
      const loadedBreweries = this.$store.state.beers.map(x => x.brewery)
      return loadedBreweries.concat(this.preloadedBreweries).sort((a, b) => a.localeCompare(b))
    }
  },
  methods: {
    onSelect() {
      if (this.$refs.form.validate()) {
        this.$store.commit('toggle', 'loading')
        if (this.$store.state.editBeerDialog) {
          this.$axios.patch(`/beers/${this._id}`, {
            beerName: this.beerName,
            brewery: this.brewery,
            style: this.style,
            degrees: this.degrees,
            abv: this.abv,
            tempBeer: this.tempBeer
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
          const beer = this.$store.state.beers.filter(x => x.brewery === this.selectBeerBrewery)
            .find(x => x.beerName === this.selectBeer)
          if (beer) {
            const reviews = this.$store.state.auth.user.reviews
            if (reviews.map(x => x.beer._id).includes(beer._id)) {
              this.$store.commit('setReview', reviews[reviews.findIndex(x => x.beer._id === beer._id)])
              this.$store.commit('toggle', 'loading')
            } else {
              this.beer = beer
              this.$store.commit('toggle', 'loading')
            }
          } else {
            // Post new temp beer
            this.$axios.post('/beers', {
              beerName: this.beerName,
              brewery: this.brewery,
              style: this.style,
              degrees: this.degrees,
              abv: this.abv,
              tempBeer: true
            })
              .then((res) => {
                this.$store.commit('toggle', 'loading')
                this.$store.commit('setReview', { beer: res.data })
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
      this.$store.dispatch('onCancelReview')
    },
    decDegrees() { this.degrees-- },
    incDegrees() { this.degrees++ },
    decAbv() { this.abv = +this.abv - 0.1 },
    incAbv() { this.abv = +this.abv + 0.1 }
  }
}
</script>
