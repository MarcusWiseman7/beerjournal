<template>
  <v-card>
    <v-card-title>
      <v-layout column>
        <h1 class="ml-2">{{ title }}</h1>
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
        v-if="title !== 'Temp Beers'"
        v-slot:items="props"
      >
        <tr @click="$store.dispatch('beerInfo', props.item)">
          <td class="my-row-item">{{ props.item.brewery.name }}</td>
          <td class="my-row-item-beer">{{ props.item.beerName }}</td>
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
      <!-- <template
        v-else-if="title === 'My Beers'"
        v-slot:items="props"
      >
        <tr @click="beerInfo(props.item)">
          <td class="my-row-item">{{ props.item.brewery.name }}</td>
          <td class="my-row-item-beer"><span>{{ props.item.beerName }}</span></td>
          <td class="my-row-item-rating">{{ props.item.rating }}</td>
        </tr>
      </template> -->
      <template
        v-else
        v-slot:items="props"
      >
        <tr @click="editBeer(props.item)">
          <td class="my-row-item">{{ props.item.brewery.name }}</td>
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
      items: []
    }
  },
  computed: {
    hideActions() {
      return !(this.items.length && this.items.length > 5)
    },
    headers() {
      return this.title !== 'Temp Beers'
        ? [
          { text: 'Brewery', value: 'brewery.name' },
          { text: 'Beer', value: 'beerName' },
          { text: 'Average', value: 'averageRating' }
        ]
        : [
          { text: 'Brewery', value: 'brewery.name' },
          { text: 'Beer', value: 'beerName' },
          { text: 'Info', value: 'degrees' }
        ]
      // return this.title === 'Beers'
      //   ? [
      //     { text: 'Brewery', value: 'brewery.name' },
      //     { text: 'Beer', value: 'beerName' },
      //     { text: 'Average', value: 'averageRating' }
      //   ]
      //   : this.title === 'My Beers'
      //     ? [
      //       { text: 'Brewery', value: 'brewery.name' },
      //       { text: 'Beer', value: 'beerName' },
      //       { text: 'Rating', value: 'rating' }
      //     ]
      //     : [
      //       { text: 'Brewery', value: 'brewery.name' },
      //       { text: 'Beer', value: 'beerName' },
      //       { text: 'Info', value: 'degrees' }
      //     ]
    }
  },
  async created() {
    this.items = this.title === 'My Beers'
      ? this.$store.state.auth.user.reviews.map(x => x.beer)
      : this.title === 'Beers'
        ? this.$store.state.beers
        : await this.$axios.get('/beers/tempBeers')
          .then(res => res.data)
          .catch(() => this.$toast.error('Error getting temp beers', { duration: 4000 }))
  },
  methods: {
    editBeer(beer) {
      this.$store.commit('toggle', 'editBeerDialog')
      this.$store.dispatch('beerInfo', beer)
    }
  }
}
</script>

<style scoped>
.my-row-item {
  max-width: 30vw;
  overflow-wrap: break-word;
}

.my-row-item-beer {
  max-width: 40vw;
  color: #ffa000;
  overflow-wrap: break-word;
}

.my-row-item-rating {
  max-width: 30vw;
}
</style>
