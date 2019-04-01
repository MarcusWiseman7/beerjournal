<template>
  <v-dialog
    v-model="loading"
    fullscreen
    persistent
    content-class="my-spinner"
  >
    <v-container fill-height>
      <v-layout
        justify-center
        align-center
      >
        <v-progress-circular
          indeterminate
          :size="70"
          :width="7"
          color="primary"
        ></v-progress-circular>
      </v-layout>
    </v-container>
  </v-dialog>
</template>

<script>
export default {
  name: 'MySpinner',
  props: {
    loading: { type: Boolean, default: false }
  }
}
</script>

<style lang="stylus">
.my-spinner {
  background: #282c2dad;
}
</style>
