<template>
  <v-dialog
    v-model="$store.state.beerReviewDialog"
    max-width="450"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
  >
    <v-card>
      <beer-banner />
      <beer-info v-if="$store.state.beerInfoView" />
      <div v-if="$store.state.auth.loggedIn">
        <beer-form v-show="!$store.state.beerInfo.beer._id"></beer-form>
        <review-form v-show="$store.state.reviewForm"></review-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import BeerForm from '~/components/Views/BeerForm'
import ReviewForm from '~/components/Views/ReviewForm'
import BeerInfo from '~/components/Views/BeerInfo'

export default {
  name: 'BeerReviewDialog',
  components: {
    BeerForm,
    ReviewForm,
    BeerInfo
  }
}
</script>
