<template>
  <div>
    <my-spinner :loading="loading" />
    <v-dialog
      v-model="$store.state.beerReviewDialog"
      max-width="450"
      persistent
    >
      <v-card>
        <v-card-title>
          <v-layout column>
            <h1 style="color:#FFA000">Beer Review</h1>
            <h2 v-if="beer">{{ beer.brewery }} {{ beer.beerName }}</h2>
            <h3 v-if="beer">Ave Rating: {{ beer.averageRating }}</h3>
          </v-layout>
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
          <v-btn
            v-if="_id"
            small
            color="error"
            @click.native="onDelete()"
          >Delete</v-btn>
          <v-btn
            small
            @click.native="onCancel()"
          >Cancel</v-btn>
          <v-btn
            small
            color="primary"
            @click.native="onSubmit()"
          >Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'BeerReview',
  data() {
    return {
      loading: false,
      max: v => (v && v.length <= 250) || 'Max 250 characters'
    }
  },
  computed: {
    ...mapState(['beerReview']),
    _id() { return this.beerReview._id },
    rating: {
      set(rating) { this.$store.commit('setReview', { rating }) },
      get() { return this.beerReview.rating }
    },
    price: {
      set(price) { this.$store.commit('setReview', { price }) },
      get() { return this.beerReview.price }
    },
    location: {
      set(location) { this.$store.commit('setReview', { location }) },
      get() { return this.beerReview.location }
    },
    notes: {
      set(notes) { this.$store.commit('setReview', { notes }) },
      get() { return this.beerReview.notes }
    },
    beer: {
      set(beer) { this.$store.commit('setReview', { beer }) },
      get() { return this.beerReview.beer }
    },
    userId() { return this.$store.state.auth.user._id },
    rules() { return this.$store.state.rules }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const body = {
          userId: this.userId,
          price: this.price,
          location: this.location,
          rating: this.rating,
          notes: this.notes,
          beer: this.beer._id
        }
        if (!this._id) {
          this.$axios.post(`/reviews/${this.$store.state.auth.user._id}`, body)
            .then((res) => {
              this.loading = false
              this.$store.commit('setUser', res.data)
              this.onCancel()
              this.$toast.success('Added beer review', { duration: 4000 })
            })
            .catch(() => {
              this.loading = false
              this.$toast.error('Error adding beer review, please try again', { duration: 4000 })
            })
        } else {
          this.$axios.patch(`/reviews/${this._id}`, body)
            .then((res) => {
              this.loading = false
              this.$store.commit('setUser', res.data)
              this.onCancel()
              this.$toast.success('Updated beer review', { duration: 4000 })
            })
            .catch(() => {
              this.loading = false
              this.$toast.error('Error updating beer review, please try again', { duration: 4000 })
            })
        }
      }
    },
    onDelete() {
      this.loading = true
      this.$axios.delete(`/reviews/${this._id}/${this.userId}`)
        .then((res) => {
          this.loading = false
          this.$store.commit('setUser', res.data)
          this.onCancel()
          this.$toast.success('Deleted beer review', { duration: 4000 })
        })
        .catch(() => {
          this.loading = false
          this.$toast.error('Error deleting beer review, please try again', { duration: 4000 })
        })
    },
    onCancel() {
      this.$store.commit('setReview', {
        _id: undefined,
        rating: null,
        price: null,
        location: '',
        notes: '',
        beer: {}
      })
      this.$store.commit('toggleBeerReview')
    },
    decrement() { this.rating-- },
    increment() { this.rating++ },
    decrement1() { this.price-- },
    increment1() { this.price++ }
  }
}
</script>

<style lang="stylus" scoped></style>
