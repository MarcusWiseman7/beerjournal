<template>
  <div>
    <my-spinner :loading="loading" />
    <v-card>
      <v-card-title>
        <h1 style="color:#FFA000">Add Beer</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-combobox
            v-model="beer.beerName"
            :rules="[rules.required, rules.max]"
            :items="beerNameItems"
            append-icon="arrow_drop_down"
            label="Beer name"
            required
            autofocus
          ></v-combobox>
          <v-combobox
            v-model="beer.brewery"
            :rules="[rules.required, rules.max]"
            :items="breweries"
            append-icon="arrow_drop_down"
            label="Brewery"
            required
          ></v-combobox>
          <v-select
            v-model="beer.style"
            :rules="[rules.required]"
            :items="beerStyles"
            append-icon="arrow_drop_down"
            label="Style"
            required
          ></v-select>
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
        <v-btn @click.native="$store.commit('toggleAddBeer')">Cancel</v-btn>
        <v-btn
          color="primary"
          @click.native="onSubmit"
        >Add</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import beerStyles from '~/data/beerStyles.json'
import breweries from '~/data/sorted.json'

export default {
  name: 'AddBeer',
  data() {
    return {
      beerStyles,
      breweries,
      loading: false,
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
    rules() { return this.$store.state.rules },
    beerNameItems() { return this.$store.state.beers.map(x => x.beerName) }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios.post('/beers', this.beer)
          .then((res) => {
            this.loading = false
            this.$store.commit('toggleAddBeer')
            this.$toast.success('Beer added', { duration: 4000 })
          })
          .catch(() => {
            this.loading = false
            this.$toast.error('Error adding beer, please try again', { duration: 4000 })
          })
      }
    },
    decDegrees() { this.beer.degrees-- },
    incDegrees() { this.beer.degrees++ },
    decAbv() { this.beer.abv = +this.beer.abv - 0.1 },
    incAbv() { this.beer.abv = +this.beer.abv + 0.1 }
  }
}
</script>

<style lang="stylus" scoped>
h3 {
  font-weight: normal;
}
</style>
