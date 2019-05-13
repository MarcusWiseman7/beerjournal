<template>
  <v-dialog
    v-model="$store.state.beerReviewDialog"
    max-width="450"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
  >
    <v-card>
      <beer-banner />
      <beer-info v-if="$store.state.beerInfo" />
      <div v-else>
        <beer-form v-show="!$store.state.beerReview.beer._id"></beer-form>
        <review-form v-show="$store.state.beerReview.beer._id"></review-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import BeerForm from '~/components/Views/BeerForm'
import ReviewForm from '~/components/Views/ReviewForm'
import BeerInfo from '~/components/Views/BeerInfo'

export default {
  name: 'BeerReview',
  components: {
    BeerForm,
    ReviewForm,
    BeerInfo
  },
  computed: {
    selectBeer() { return this.$store.state.beerReview.beer._id }
  }
}
</script>
