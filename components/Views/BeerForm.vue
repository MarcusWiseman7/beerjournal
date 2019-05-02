<template>
  <div>
    <my-spinner :loading="loading" />
    <v-card-title>
      <h1 style="color:#FFA000">Beer</h1>
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
            <v-icon @click.native="decDegrees">remove</v-icon>
          </template>
          <template v-slot:append>
            <v-icon @click.native="incDegrees">add</v-icon>
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

export default {
  name: 'BeerForm',
  data() {
    return {
      loading: false,
      beerStyles
    }
  },
  computed: {
    ...mapState(['selectBeer']),
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
    rules() { return this.$store.state.rules },
    beerNames() {
      return this.$store.state.beers.map(x => x.beerName).sort((a, b) => a.localeCompare(b))
    },
    breweries() {
      return this.$store.state.beers.map(x => x.brewery).sort((a, b) => a.localeCompare(b))
    }
  },
  methods: {
    onSelect() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const beer = this.$store.state.beers.filter(x => x.brewery === this.selectBeerBrewery)
          .find(x => x.beerName === this.selectBeer)
        if (beer) {
          const reviews = this.$store.state.auth.user.reviews
          if (reviews.map(x => x.beer._id).includes(beer._id)) {
            this.$store.commit('setReview', reviews[reviews.findIndex(x => x.beer._id === beer._id)])
            this.loading = false
          } else {
            this.beer = beer
            this.loading = false
          }
        } else {
          // Post new temp beer to user
          this.$axios.post(`/beers/tempBeer/${this.userId}`, {
            beerName: this.beerName,
            brewery: this.brewery,
            style: this.style,
            degrees: this.degrees,
            abv: this.abv
          })
            .then((res) => {
              this.loading = false
              this.$store.commit('setReview', { beer: res.data })
            })
            .catch(() => {
              this.loading = false
              this.$toast.error('Error adding beer, please try again', { duration: 4000 })
            })
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

<style lang="stylus" scoped></style>
