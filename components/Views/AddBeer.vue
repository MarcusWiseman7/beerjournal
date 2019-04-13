<template>
  <div>
    <my-spinner :loading="loading" />
    <v-card>
      <v-card-title>
        <h1>Add Beer</h1>
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
          <v-text-field
            v-model="brewery"
            :rules="[rules.required, rules.max]"
            label="Brewery"
            required
          ></v-text-field>
          <v-select
            v-model="style"
            :rules="[rules.required]"
            :items="beerItems"
            append-icon="arrow_drop_down"
            label="Style"
            required
          ></v-select>
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

export default {
  name: 'AddBeer',
  data() {
    return {
      beerItems,
      loading: false,
      beerName: '',
      brewery: '',
      style: '',
      degrees: '',
      abv: ''
    }
  },
  computed: {
    rules() { return this.$store.state.rules }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios.push('/beers', {
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
    }
  }
}
</script>

<style lang="stylus" scoped></style>
