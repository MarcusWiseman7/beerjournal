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
        @click.native="$store.dispatch('onCancelReview')"
      >close</v-btn>
      <v-btn
        color="primary"
        @click.native="$store.commit('toggle', 'beerInfo')"
      >Notes</v-btn>
    </v-card-actions>
    <v-card-text>
      <v-layout
        v-for="(review, i) in reviews"
        :key="i"
        column
      >
        <v-divider class="my-4"></v-divider>
        <h3 v-if="review.reviewer">{{ review.reviewer.name }}</h3>
        <p class="beer-quote">{{ review.notes }}</p>
      </v-layout>
    </v-card-text>
  </div>
</template>

<script>
export default {
  name: 'BeerInfo',
  data() {
    return {
      reviews: []
    }
  },
  computed: {
    beer() { return this.$store.state.beerReview.beer },
    logoSrc() {
      return this.beer.logo
        ? this.beer.logo
        : this.beer.brewery.logo
          ? this.beer.brewery.logo
          : 'https://res.cloudinary.com/dukumou2e/image/upload/v1557745360/breweries/lazy-src_zpkrwj.jpg'
    }
  },
  async mounted() {
    this.reviews = await this.$axios.get(`/reviews/${this.beer._id}`)
      .then(res => res.data)
      // eslint-disable-next-line no-console
      .catch(err => console.log(err))
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
