<template>
  <div>
    <v-card-title>
      <v-layout column>
        <h1>Beer Notes</h1>
        <h2>{{ beer.brewery }} {{ beer.beerName }} <span v-if="beer.degrees">{{ beer.degrees }}°</span></h2>
        <h3>Style: {{ beer.style }}</h3>
        <h3 v-if="beer.abv">abv: {{ beer.abv }}%</h3>
        <h3 v-if="beer.averageRating !== 0">Ave Rating: {{ beer.averageRating }}</h3>
        <h3 v-if="beer.averagePrice !== 0">Ave Price: {{ beer.averagePrice }}</h3>
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
            <v-icon @click.native="decrement()">remove</v-icon>
          </template>
          <template v-slot:append>
            <v-icon @click.native="increment()">add</v-icon>
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
            <v-icon @click.native="decrement1()">remove</v-icon>
          </template>
          <template v-slot:append>
            <v-icon @click.native="increment1()">add</v-icon>
          </template>
        </v-slider>
        <v-text-field
          v-model.trim="location"
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
        v-if="beerReview._id"
        small
        color="error"
        @click.native="onCheckDelete = true"
      >Delete</v-btn>
      <v-btn
        small
        @click.native="onCancel()"
      >Cancel</v-btn>
      <v-btn
        v-show="beer._id"
        small
        color="primary"
        @click.native="onSubmit()"
      >Submit</v-btn>
    </v-card-actions>
    <v-dialog
      v-model="onCheckDelete"
      max-width="450"
      persistent
    >
      <v-card>
        <v-card-title>
          <h2>Do you really want to delete these beer notes?</h2>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click.native="onCheckDelete = false">Cancel</v-btn>
          <v-btn
            color="error"
            @click.native="onDelete()"
          >Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ReviewForm',
  data() {
    return {
      onCheckDelete: false
    }
  },
  computed: {
    ...mapState(['beerReview']),
    _id: {
      set(_id) { this.$store.commit('setReview', { _id }) },
      get() { return this.beerReview._id }
    },
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
        this.$store.commit('toggle', 'loading')
        const body = {
          price: this.price,
          location: this.location,
          rating: this.rating,
          notes: this.notes,
          beer: this.beer._id
        }
        if (!this._id) {
          this.$axios.post(`/reviews/${this.userId}`, body)
            .then((res) => {
              this.$store.commit('toggle', 'loading')
              this.$store.commit('setUser', res.data)
              this.$store.dispatch('getBeers')
              this.onCancel()
              this.$toast.success('Added beer review', { duration: 4000 })
            })
            .catch(() => {
              this.$store.commit('toggle', 'loading')
              this.$toast.error('Error adding beer review, please try again', { duration: 4000 })
            })
        } else {
          body.userId = this.userId
          this.$axios.patch(`/reviews/${this._id}`, body)
            .then((res) => {
              this.$store.commit('toggle', 'loading')
              this.$store.commit('setUser', res.data)
              this.onCancel()
              this.$toast.success('Updated beer review', { duration: 4000 })
            })
            .catch(() => {
              this.$store.commit('toggle', 'loading')
              this.$toast.error('Error updating beer review, please try again', { duration: 4000 })
            })
        }
      }
    },
    onDelete() {
      this.$store.commit('toggle', 'loading')
      this.$axios.delete(`/reviews/${this._id}/${this.userId}`)
        .then((res) => {
          this.$store.commit('toggle', 'loading')
          this.$store.commit('setUser', res.data)
          this.onCancel()
          this.$toast.success('Deleted beer review', { duration: 4000 })
        })
        .catch(() => {
          this.$store.commit('toggle', 'loading')
          this.$toast.error('Error deleting beer review, please try again', { duration: 4000 })
        })
    },
    onCancel() {
      this.$store.dispatch('onCancelReview')
    },
    decrement() { this.rating-- },
    increment() { this.rating++ },
    decrement1() { this.price-- },
    increment1() { this.price++ }
  }
}
</script>
