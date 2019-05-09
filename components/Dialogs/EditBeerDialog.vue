<template>
  <v-dialog
    v-model="$store.state.editBeerDialog"
    max-width="450"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
  >
    <v-card>
      <beer-banner />
      <beer-form />
    </v-card>
  </v-dialog>
</template>

<script>
import BeerForm from '~/components/Views/BeerForm'

export default {
  name: 'EditBeerDialog',
  components: {
    BeerForm
  }
}
</script>
