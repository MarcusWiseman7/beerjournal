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
      const loadedBreweries = this.$store.state.breweries.map(x => x.name)
      return loadedBreweries.concat(this.preloadedBreweries).sort((a, b) => a.localeCompare(b))
    },
    me() {
      const id = this.$store.state.auth.user._id
        ? this.$store.state.auth.user._id
        : ''
      return id === '5caf07e843926a0f4899ce31' || id === '5cb4e10a80b6f075eefbf3e9'
    }
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
          const beer = this.$store.state.beers.filter(x => x.brewery._id === brewery)
            .find(x => x.beerName === this.beerName)
          if (beer) {
            const reviews = this.$store.state.auth.user.reviews
            if (reviews.map(x => x.beer._id).includes(beer._id)) {
              this.$store.commit('setReview', reviews[reviews.findIndex(x => x.beer._id === beer._id)])
              this.$store.commit('toggle', 'loading')
            } else {
              this.$store.commit('setReview', { beer })
              this.$store.commit('toggle', 'loading')
            }
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
            if (brewery) {
              data.tempBrewery = false
              data.brewery = brewery
            }
            this.$axios.post('/beers', data)
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
