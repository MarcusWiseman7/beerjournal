<template>
  <div>
    <v-card-text>
      <v-divider></v-divider>
    </v-card-text>
    <v-card-title>
      <h1>My Beer Notes</h1>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        lazy-validation
      >
        <h3>Rating (5 is best)</h3>
        <v-layout
          align-center
          justify-center
        >
          <v-rating
            v-model="rating"
            :rules="[rules.required]"
            class="my-3"
            background-color="secondary"
            medium
            full-icon="fa fa-beer"
            empty-icon="fa fa-beer"
          ></v-rating>
        </v-layout>
        <!-- <h3 class="mb-5">.5L Price (CZK)</h3>
        <v-slider
          v-model="price"
          always-dirty
          thumb-label="always"
          min="0"
          max="150"
        >
          <template v-slot:prepend>
            <v-icon @click.native="decrement()">remove</v-icon>
          </template>
          <template v-slot:append>
            <v-icon @click.native="increment()">add</v-icon>
          </template>
        </v-slider> -->
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
        v-if="beerInfo.myReview._id"
        :small="smallScreen"
        color="error"
        @click.native="onCheckDelete = true"
      >Delete</v-btn>
      <v-btn
        :small="smallScreen"
        @click.native="onCancel()"
      >Cancel</v-btn>
      <v-btn
        v-show="beer._id"
        :small="smallScreen"
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
    ...mapState(['beerInfo']),
    _id: {
      set(_id) { this.$store.commit('setMyReview', { _id }) },
      get() { return this.beerInfo.myReview._id }
    },
    rating: {
      set(rating) { this.$store.commit('setMyReview', { rating }) },
      get() { return this.beerInfo.myReview.rating }
    },
    // price: {
    //   set(price) { this.$store.commit('setMyReview', { price }) },
    //   get() { return this.beerInfo.myReview.price }
    // },
    location: {
      set(location) { this.$store.commit('setMyReview', { location }) },
      get() { return this.beerInfo.myReview.location }
    },
    notes: {
      set(notes) { this.$store.commit('setMyReview', { notes }) },
      get() { return this.beerInfo.myReview.notes }
    },
    beer() { return this.beerInfo.beer },
    userId() { return this.$store.state.auth.user._id },
    rules() { return this.$store.state.rules },
    smallScreen() { return window.screen.availWidth < 360 }
  },
  methods: {
    onCancel() {
      this.$store.commit('truthy', { item: 'reviewForm', bool: false })
      this.$store.commit('incCounter2')
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.$store.commit('toggle', 'loading')
        const body = {
          // price: this.price,
          location: this.location,
          rating: this.rating,
          notes: this.notes,
          beer: this.beer._id,
          reviewer: this.userId
        }
        if (!this._id) {
          this.$axios.post('/reviews', body)
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
          this.onCheckDelete = false
          this.onCancel()
          this.$toast.success('Deleted beer review', { duration: 4000 })
        })
        .catch(() => {
          this.$store.commit('toggle', 'loading')
          this.$toast.error('Error deleting beer review, please try again', { duration: 4000 })
        })
    },
    decrement() { this.price-- },
    increment() { this.price++ }
  }
}
</script>
