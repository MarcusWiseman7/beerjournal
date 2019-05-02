<template>
  <div>
    <my-spinner :loading="loading" />
    <v-card>
      <v-card-title>
        <v-layout column>
          <v-layout wrap>
            <h1
              class="ml-2"
              style="color:#FFA000"
            >{{ title }}</h1>
            <v-spacer></v-spacer>
            <v-btn
              v-if="title === 'My Beers'"
              fab
              color="primary"
              top
              right
              absolute
              @click.native="toggleBeerReview"
            >
              <v-icon>add</v-icon>
            </v-btn>
            <v-btn
              v-if="$store.state.auth.loggedIn && title === 'Beers' && $store.state.auth.user.email === 'md.wiseman@hotmail.com'"
              @click.native="$store.commit('toggleAddBeer')"
            >Add Beer</v-btn>
          </v-layout>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-layout>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        sort-icon="arrow_drop_down"
        prev-icon="arrow_left"
        next-icon="arrow_right"
        hide-actions
      >
        <template
          v-if="title === 'Beers'"
          v-slot:items="props"
        >
          <tr @click="reviewBeer(props.item)">
            <td class="text-xs-right">{{ props.item.averageRating }}</td>
            <td><span style="color:#FFA000">{{ props.item.beerName }}</span></td>
            <td>{{ props.item.brewery }}</td>
          </tr>
        </template>
        <template
          v-else
          v-slot:items="props"
        >
          <tr @click="reviewBeer(props.item)">
            <td class="text-xs-right">{{ props.item.rating }}</td>
            <td><span style="color:#FFA000">{{ props.item.beer.beerName }}</span></td>
            <td>{{ props.item.beer.brewery }}</td>
          </tr>
        </template>
        <v-alert
          v-slot:no-results
          :value="true"
          color="error"
          icon="warning"
        >
          Your search for "{{ search }}" found no results
        </v-alert>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'BeerTable',
  props: {
    title: { type: String, default: () => { return 'Beers' } }
  },
  data() {
    return {
      loading: false,
      search: '',
      user: {},
      items: []
    }
  },
  computed: {
    // myBeerList() {
    //   return this.items.map(x => x._id)
    // },
    headers() {
      return this.title === 'Beers'
        ? [
          { text: 'Ave Rating', value: 'averageRating' },
          { text: 'Beer', value: 'beerName' },
          { text: 'Brewery', value: 'brewery' }
        ]
        : [
          { text: 'Rating', value: 'rating' },
          { text: 'Beer', value: 'beer.beerName' },
          { text: 'Brewery', value: 'beer.brewery' }
        ]
    }
  },
  created() {
    if (this.title === 'My Beers') {
      this.items = this.$store.state.auth.user.reviews
    } else {
      this.items = this.$store.state.beers
    }
  },
  methods: {
    reviewBeer(beer) {
      if (this.$store.state.auth.loggedIn) {
        const reviews = this.$store.state.auth.user.reviews
        const review = this.title === 'My Beers'
          ? beer
          : reviews.map(x => x.beer._id).includes(beer._id)
            ? reviews[reviews.findIndex(x => x.beer._id === beer._id)]
            : { beer }

        this.$store.commit('setReview', review)
        this.$store.commit('toggleBeerReview')
      }
    },
    toggleBeerReview() {
      this.$store.commit('resetReview')
      this.$store.commit('toggleBeerReview')
    }
  }
}
</script>

<style lang="stylus" scoped></style>
