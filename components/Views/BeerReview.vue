<template>
  <div>
    <my-spinner :loading="loading" />
    <v-card>
      <v-card-title>
        <h1>Beer Review</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <h3 class="mb-5">Rating (5 is best)</h3>
          <v-slider
            v-model="rating"
            :rules="[rules.required]"
            always-dirty
            thumb-label="always"
            min="1"
            max="5"
          >
            <template v-slot:prepend>
              <v-icon @click.native="decrement">remove</v-icon>
            </template>
            <template v-slot:append>
              <v-icon @click.native="increment">add</v-icon>
            </template>
          </v-slider>
          <h3 class="mb-5">Price (CZK)</h3>
          <v-slider
            v-model="price"
            always-dirty
            thumb-label="always"
            min="1"
            max="150"
          >
            <template v-slot:prepend>
              <v-icon @click.native="decrement1">remove</v-icon>
            </template>
            <template v-slot:append>
              <v-icon @click.native="increment1">add</v-icon>
            </template>
          </v-slider>
          <v-text-field
            v-model="location"
            label="Location"
            maxlength="75"
          ></v-text-field>
          <v-textarea
            v-model="notes"
            label="Notes"
            auto-grow
            maxlength="250"
            counter="250"
            rows="3"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="$store.commit('toggleBeerReview')">Cancel</v-btn>
        <v-btn
          color="primary"
          @click.native="onSubmit"
        >Add</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BeerReview',
  props: { beer: { type: Object } },
  data() {
    return {
      loading: false,
      price: null,
      location: '',
      rating: null,
      notes: '',
      max: v => (v && v.length <= 250) || 'Max 250 characters'
    }
  },
  computed: {
    rules() { return this.$store.state.rules }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios.post('/reviews', {
          price: this.price,
          location: this.location,
          rating: this.rating,
          notes: this.notes,
          beer: this.beer._id
        })
          .then((res) => {
            this.loading = false
            this.$store.commit('toggleBeerReview')
            this.$toast.success('Added beer review', { duration: 4000 })
          })
          .catch(() => {
            this.loading = false
            this.$toast.error('Error adding beer review, please try again', { duration: 4000 })
          })
      }
    },
    decrement() { this.rating-- },
    increment() { this.rating++ },
    decrement1() { this.price-- },
    increment1() { this.price++ }
  }
}
</script>

<style lang="stylus" scoped></style>
