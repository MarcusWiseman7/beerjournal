<template>
  <div>
    <v-card-title>
      <v-layout
        wrap
        align-center
      >
        <v-img
          :src="logoSrc"
          lazy-src="https://res.cloudinary.com/dukumou2e/image/upload/v1557745360/breweries/lazy-src_zpkrwj.jpg"
          alt="Beer logo"
          aspect-ratio="1"
          min-width="30vw"
          max-width="30vw"
          class="mr-3"
        >
          <template v-slot:placeholder>
            <v-layout
              fill-height
              align-center
              justify-center
              ma-0
            >
              <v-progress-circular indeterminate></v-progress-circular>
            </v-layout>
          </template>
        </v-img>
        <v-layout
          wrap
          column
        >
          <v-layout wrap>
            <h1
              v-if="beer.brewery"
              class="mr-2"
            >{{ beer.brewery.name }}</h1>
            <h1>{{ beer.beerName }}</h1>
          </v-layout>
          <h2>{{ beer.style }}</h2>
        </v-layout>
      </v-layout>
    </v-card-title>
    <v-card-text>
      <v-layout
        align-center
        justify-center
        wrap
      >
        <v-rating
          v-model="beer.averageRating"
          background-color="secondary"
          readonly
          medium
          half-increments
          full-icon="fa fa-beer"
          half-icon="fa fa-beer"
          empty-icon="fa fa-beer"
        ></v-rating>
        <h3 class="ml-2">({{ beer.averageRating }})</h3>
      </v-layout>
      <v-layout
        align-center
        justify-center
        class="my-4"
      >
        <h2 class="my-box">{{ beer.degrees }}°</h2>
        <v-divider vertical></v-divider>
        <h2 class="my-box">{{ beer.abv }}% abv</h2>
      </v-layout>
      <v-layout
        align-center
        justify-center
      >
        <h2 class="my-box">{{ beer.totalNumberOfRatings }} reviews</h2>
        <v-divider vertical></v-divider>
        <h2 class="my-box">~ {{ beer.averagePrice }} czk</h2>
      </v-layout>
      <v-layout
        v-if="beer.description"
        class="mt-4"
        column
      >
        <h3 v-if="beer.brewery">{{ beer.brewery.name }}</h3>
        <p class="beer-quote">{{ beer.description }}</p>
      </v-layout>
    </v-card-text>
    <v-card-actions class="my-3">
      <v-spacer></v-spacer>
      <v-btn
        flat
        @click.native="onClose()"
      >close</v-btn>
      <v-btn
        color="primary"
        @click.native="onNotes()"
      >Notes</v-btn>
    </v-card-actions>
    <v-card-text v-if="!$store.state.reviewForm">
      <v-layout
        v-if="myReview.notes"
        column
      >
        <v-divider class="my-4"></v-divider>
        <h3 v-if="myReview.reviewer">{{ myReview.reviewer.name }}</h3>
        <p class="beer-quote">{{ myReview.notes }}</p>
      </v-layout>
      <div
        v-for="(review, i) in reviews"
        :key="i"
        column
      >
        <v-layout
          v-if="review.notes"
          column
        >
          <v-divider class="my-4"></v-divider>
          <h3 v-if="review.reviewer">{{ review.reviewer.name }}</h3>
          <p class="beer-quote">{{ review.notes }}</p>
        </v-layout>
      </div>
    </v-card-text>
  </div>
</template>

<script>
export default {
  name: 'BeerInfo',
  computed: {
    beer() { return this.$store.state.beerInfo.beer },
    reviews() { return this.$store.state.beerInfo.reviews },
    myReview() { return this.$store.state.beerInfo.myReview },
    logoSrc() {
      return this.beer.logo
        ? this.beer.logo
        : this.beer.brewery.logo
          ? this.beer.brewery.logo
          : 'https://res.cloudinary.com/dukumou2e/image/upload/v1557745360/breweries/lazy-src_zpkrwj.jpg'
    }
  },
  methods: {
    onNotes() {
      if (this.$store.state.auth.loggedIn) {
        this.$store.commit('toggle', 'reviewForm')
      } else {
        this.$store.commit('truthy', { item: 'beerReviewDialog', bool: false })
        this.$store.commit('truthy', { item: 'beerInfoView', bool: false })
        this.$store.commit('resetBeerInfo')
        this.$store.commit('toggle', 'myAuth')
      }
    },
    onClose() {
      this.$store.commit('toggle', 'beerInfoView')
      this.$store.commit('toggle', 'beerReviewDialog')
      this.$store.commit('resetBeerInfo')
      this.$store.commit('truthy', { item: 'reviewForm', bool: false })
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-box {
  width: 40vw;
  text-align: center;
}

.beer-quote {
  font-style: italic;
  margin-left: 20px;
  letter-spacing: 1.75px;
  line-height: 2rem;
}
</style>
