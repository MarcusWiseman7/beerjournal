<template>
  <div>
    <my-spinner :loading="loading" />
    <v-card>
      <v-card-title>
        <h1 style="color:#FFA000">Beer</h1>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
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
          <td><span style="color:#FFA000">{{ props.item.beerName }}</span></td>
          <td>{{ props.item.brewery }}</td>
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
  data() {
    return {
      loading: false,
      search: '',
      headers: [
        { text: 'Beer', value: 'beerName' },
        { text: 'Brewery', value: 'brewery' }
      ],
      items: []
    }
  },
  created() {
    this.$axios.get('/beers')
      .then((res) => {
        this.items = this.items.concat(res.data)
      })
  }
}
</script>

<style lang="stylus" scoped></style>
