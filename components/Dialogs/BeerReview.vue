<template>
  <div>
    <v-dialog
      v-model="$store.state.beerReviewDialog"
      max-width="450"
      persistent
    >
      <v-card>
        <beer-form v-show="!selectBeer"></beer-form>
        <review-form v-show="selectBeer"></review-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BeerForm from '~/components/Views/BeerForm'
import ReviewForm from '~/components/Views/ReviewForm'

export default {
  name: 'BeerReview',
  components: {
    BeerForm,
    ReviewForm
  },
  computed: {
    selectBeer() { return this.$store.state.beerReview.beer._id }
  }
}
</script>
