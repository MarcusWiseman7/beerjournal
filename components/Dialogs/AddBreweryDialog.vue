<template>
  <v-dialog
    v-model="$store.state.addBreweryDialog"
    max-width="450"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
  >
    <v-card>
      <beer-banner />
      <v-card-title>
        <h1>Add Brewery</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-combobox
            v-model.trim="brewery.name"
            :rules="[rules.required, rules.max]"
            :items="breweries"
            append-icon="arrow_drop_down"
            label="Brewery"
            required
            autofocus
          ></v-combobox>
          <v-text-field
            v-model="brewery.type"
            label="Type"
          ></v-text-field>
          <v-text-field
            v-model="brewery.logo"
            label="Logo URL"
          ></v-text-field>
          <v-text-field
            v-model="brewery.location"
            label="Location"
          ></v-text-field>
          <v-textarea
            v-model="brewery.description"
            label="Description"
          ></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="onCancel()">Cancel</v-btn>
        <v-btn
          color="primary"
          @click.native="onSubmit()"
        >Add</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import preloadedBreweries from '~/data/breweries.json'

export default {
  name: 'AddBreweryDialog',
  data() {
    return {
      preloadedBreweries,
      brewery: {
        name: '',
        type: '',
        logo: '',
        location: '',
        description: ''
      }
    }
  },
  computed: {
    breweries() {
      const loadedBreweries = this.$store.state.breweries.map(x => x.name)
      return loadedBreweries.concat(this.preloadedBreweries).sort((a, b) => a.localeCompare(b))
    },
    rules() { return this.$store.state.rules }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.$store.commit('toggle', 'loading')
        this.$axios.post('/breweries', this.brewery)
          .then(() => {
            this.$store.commit('toggle', 'loading')
            this.onCancel()
            this.$toast.success('Brewery added', { duration: 4000 })
          })
          .catch(() => {
            this.$store.commit('toggle', 'loading')
            this.$toast.error('Error adding brewery, please try again', { duration: 4000 })
          })
      }
    },
    onCancel() {
      this.brewery = {
        name: '',
        type: '',
        logo: '',
        location: '',
        description: ''
      }
      this.$store.commit('toggle', 'addBreweryDialog')
    }
  }
}
</script>
