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
        <template v-slot:items="props">
          <tr @click="editBeer(props.item)">
            <td class="text-xs-right">{{ props.item.rating }}</td>
            <td><span style="color:#FFA000">{{ props.item.beerName }}</span></td>
            <td>{{ props.item.brewery }}</td>
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
  components: {

  },
  props: {
    title: { type: String, default: () => { return 'Beers' } }
  },
  data() {
    return {
      loading: false,
      search: '',
      reviewBeer: {},
      user: {},
      items: []
    }
  },
  computed: {
    headers() {
      return this.title === 'Beers'
        ? [
          { text: 'Ave Rating', value: 'rating' },
          { text: 'Beer', value: 'beerName' },
          { text: 'Brewery', value: 'brewery' }
        ]
        : [
          { text: 'Rating', value: 'rating' },
          { text: 'Beer', value: 'beerName' },
          { text: 'Brewery', value: 'brewery' }
        ]
    }
  },
  created() {
    if (this.title === 'My Beers') {
      this.items = this.items.concat(this.$store.state.auth.user.reviews)
    } else {
      this.$axios.get('/beers')
        .then((res) => {
          this.items = this.items.concat(res.data)
        })
    }
  },
  methods: {
    editBeer(beer) {

    }
  }
}
</script>

<style lang="stylus" scoped></style>
