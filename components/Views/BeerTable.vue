<template>
  <v-card>
    <v-card-title>
      <v-layout column>
        <v-layout wrap>
          <h1 class="ml-2">{{ title }}</h1>
          <v-spacer></v-spacer>
          <v-btn
            v-if="title === 'My Beers'"
            fab
            color="primary"
            top
            right
            absolute
            @click.native="toggleBeerReview()"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn
            v-if="$store.state.auth.loggedIn && title === 'Beers' && $store.state.auth.user.email === 'md.wiseman@hotmail.com'"
            @click.native="$store.commit('toggle', 'addBeerDialog')"
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
      :hide-actions="hideActions"
    >
      <template
        v-if="title === 'Beers'"
        v-slot:items="props"
      >
        <tr @click="reviewBeer(props.item)">
          <td class="my-row-item">{{ props.item.brewery }}</td>
          <td class="my-row-item-beer"><span>{{ props.item.beerName }}</span></td>
          <td
            v-if="props.item.averageRating !== 0"
            class="my-row-item-rating"
          >{{ props.item.averageRating }}</td>
          <td
            v-else
            class="my-row-item-rating"
          >-</td>
        </tr>
      </template>
      <template
        v-else-if="title === 'My Beers'"
        v-slot:items="props"
      >
        <tr @click="reviewBeer(props.item)">
          <td class="my-row-item">{{ props.item.beer.brewery }}</td>
          <td class="my-row-item-beer"><span>{{ props.item.beer.beerName }}</span></td>
          <td class="my-row-item-rating">{{ props.item.rating }}</td>
        </tr>
      </template>
      <template
        v-else
        v-slot:items="props"
      >
        <tr @click="editBeer(props.item)">
          <td class="my-row-item">{{ props.item.brewery }}</td>
          <td class="my-row-item-beer">{{ props.item.beerName }}</td>
          <td class="my-row-item-rating">{{ props.item.degrees }}°/{{ props.item.abv }}%</td>
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
</template>

<script>
export default {
  name: 'BeerTable',
  props: {
    title: { type: String, default: () => { return 'Beers' } }
  },
  data() {
    return {
      search: '',
      user: {},
      items: []
    }
  },
  computed: {
    hideActions() {
      return !(this.items.length && this.items.length > 5)
    },
    headers() {
      return this.title === 'Beers'
        ? [
          { text: 'Brewery', value: 'brewery' },
          { text: 'Beer', value: 'beerName' },
          { text: 'Average', value: 'averageRating' }
        ]
        : this.title === 'My Beers'
          ? [
            { text: 'Brewery', value: 'beer.brewery' },
            { text: 'Beer', value: 'beer.beerName' },
            { text: 'Rating', value: 'rating' }
          ]
          : [
            { text: 'Brewery', value: 'brewery' },
            { text: 'Beer', value: 'beerName' },
            { text: 'Info', value: 'degrees' }
          ]
    }
  },
  async created() {
    if (this.title === 'My Beers') {
      this.items = this.$store.state.auth.user.reviews
    } else if (this.title === 'Beers') {
      this.items = this.$store.state.beers
    } else {
      this.items = await this.$axios.get('/beers/tempBeers')
        .then(res => res.data)
        .catch(() => this.$toast.error('Error getting temp beers', { duration: 4000 }))
    }
  },
  methods: {
    editBeer(beer) {
      this.$store.commit('setSelectBeer', beer)
      this.$store.commit('toggle', 'editBeerDialog')
    },
    reviewBeer(beer) {
      if (this.$store.state.auth.loggedIn) {
        const reviews = this.$store.state.auth.user.reviews
        const review = this.title === 'My Beers'
          ? beer
          : reviews.map(x => x.beer._id).includes(beer._id)
            ? reviews[reviews.findIndex(x => x.beer._id === beer._id)]
            : { beer }

        this.$store.commit('setReview', review)
        this.$store.commit('toggle', 'beerInfo')
        this.$store.commit('toggle', 'beerReviewDialog')
      }
    },
    toggleBeerReview() {
      this.$store.commit('resetReview')
      this.$store.commit('toggle', 'beerReviewDialog')
    }
  }
}
</script>

<style scoped>
span {
  color: #ffa000;
}

.my-row-item {
  max-width: 30vw;
  overflow-wrap: break-word;
}

.my-row-item-beer {
  max-width: 40vw;
  overflow-wrap: break-word;
}

.my-row-item-rating {
  max-width: 30vw;
}
</style>
