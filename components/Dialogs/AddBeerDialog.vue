<template>
  <v-dialog
    v-model="$store.state.addBeerDialog"
    max-width="450"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
  >
    <v-card>
      <beer-banner />
      <v-card-title>
        <h1>Add Beer</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-combobox
            v-model.trim="beer.beerName"
            :rules="[rules.required, rules.max]"
            :items="beerNames"
            append-icon="arrow_drop_down"
            label="Beer name"
            required
            autofocus
          ></v-combobox>
          <v-combobox
            v-model.trim="beer.brewery"
            :rules="[rules.required, rules.max]"
            :items="breweries"
            append-icon="arrow_drop_down"
            label="Brewery"
            required
          ></v-combobox>
          <v-combobox
            v-model="beer.style"
            :rules="[rules.required]"
            :items="beerStyles"
            append-icon="arrow_drop_down"
            label="Style"
            required
          ></v-combobox>
          <h3 class="mb-5">Degrees</h3>
          <v-slider
            v-model="beer.degrees"
            always-dirty
            thumb-label="always"
            min="4"
            max="25"
          >
            <template v-slot:prepend>
              <v-icon @click.native="decDegrees">remove</v-icon>
            </template>
            <template v-slot:append>
              <v-icon @click.native="incDegrees">add</v-icon>
            </template>
          </v-slider>
          <h3 class="mb-5">ABV</h3>
          <v-slider
            v-model="beer.abv"
            always-dirty
            thumb-label="always"
            step="0.1"
            min="3"
            max="14"
          >
            <template v-slot:prepend>
              <v-icon @click.native="decAbv">remove</v-icon>
            </template>
            <template v-slot:append>
              <v-icon @click.native="incAbv">add</v-icon>
            </template>
          </v-slider>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="onCancel()">Cancel</v-btn>
        <v-btn
          color="primary"
          @click.native="onSubmit()"
        >Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import beerStyles from '~/data/beerStyles.json'
import preloadedBreweries from '~/data/breweries.json'
import preloadedBeerNames from '~/data/beerNames.json'

export default {
  name: 'AddBeerDialog',
  data() {
    return {
      beerStyles,
      preloadedBreweries,
      preloadedBeerNames,
      beer: {
        beerName: '',
        brewery: '',
        style: '',
        degrees: null,
        abv: null
      }
    }
  },
  computed: {
    breweries() {
      const loadedBreweries = this.$store.state.breweries.map(x => x.name)
      return loadedBreweries.concat(this.preloadedBreweries).sort((a, b) => a.localeCompare(b))
    },
    beerNames() {
      const loadedBeerNames = this.$store.state.beers.map(x => x.beerName)
      return loadedBeerNames.concat(this.preloadedBeerNames).sort((a, b) => a.localeCompare(b))
    },
    rules() { return this.$store.state.rules },
    beerNameItems() { return this.$store.state.beers.map(x => x.beerName) }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.$store.commit('toggle', 'loading')
        this.$axios.post('/beers', this.beer)
          .then(() => {
            this.$store.commit('toggle', 'loading')
            this.$store.dispatch('getBeers')
            this.onCancel()
            this.$toast.success('Beer added', { duration: 4000 })
          })
          .catch(() => {
            this.$store.commit('toggle', 'loading')
            this.$toast.error('Error adding beer, please try again', { duration: 4000 })
          })
      }
    },
    onCancel() {
      this.beer = {
        beerName: '',
        brewery: '',
        style: '',
        degrees: null,
        abv: null
      }
      this.$store.commit('toggle', 'addBeerDialog')
    },
    decDegrees() { this.beer.degrees-- },
    incDegrees() { this.beer.degrees++ },
    decAbv() { this.beer.abv = +this.beer.abv - 0.1 },
    incAbv() { this.beer.abv = +this.beer.abv + 0.1 }
  }
}
</script>
