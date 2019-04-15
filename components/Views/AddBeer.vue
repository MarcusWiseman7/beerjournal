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
          <v-text-field
            v-model="beerName"
            :rules="[rules.required, rules.max]"
            label="Beer name"
            required
            autofocus
          ></v-text-field>
          <v-combobox
            v-model="brewery"
            :rules="[rules.required]"
            :items="breweries"
            append-icon="arrow_drop_down"
            label="Brewery"
            required
          ></v-combobox>
          <v-select
            v-model="style"
            :rules="[rules.required]"
            :items="beerItems"
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
              <v-icon @click.native="decrement">remove</v-icon>
            </template>
            <template v-slot:append>
              <v-icon @click.native="increment">add</v-icon>
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
              <v-icon @click.native="decrement1">remove</v-icon>
            </template>
            <template v-slot:append>
              <v-icon @click.native="increment1">add</v-icon>
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
import beerItems from '~/data/beerStyles.json'
import breweries from '~/data/sorted.json'

export default {
  name: 'AddBeer',
  data() {
    return {
      beerItems,
      breweries,
      loading: false,
      beerName: '',
      brewery: '',
      style: '',
      degrees: '12',
      abv: '5.6'
    }
  },
  computed: {
    rules() { return this.$store.state.rules }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios.post('/beers', {
          beerName: this.beerName,
          brewery: this.brewery,
          style: this.style,
          degrees: this.degrees,
          abv: this.abv
        })
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
    decrement() {
      this.degrees--
    },
    increment() {
      this.degrees++
    },
    decrement1() {
      this.abv = +this.abv - 0.1
    },
    increment1() {
      this.abv = +this.abv + 0.1
    }
  }
}
</script>

<style lang="stylus" scoped>
h3 {
  font-weight: normal;
}
</style>
