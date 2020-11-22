<template>
  <v-dialog
    :value="show"
    :overlay-color="$vuetify.theme.dark ? 'rgb(222, 222, 222)' : 'rgb(33, 33, 33)'"
    persistent
    max-width="400px"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title>
        <h3 class="headline mb-0">
          Update available
        </h3>
      </v-card-title>
      <v-card-text>
        An update of this app is available. Please refresh.
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="cancel"
        >
          Not now
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="confirm"
        >
          Refresh
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  data () {
    return {
      show: false,
      refreshing: false,
      registration: null
    }
  },
  created () {
    // Listen for our custom event from the SW registration
    document.addEventListener('swUpdated', this.updateAvailable, { once: true })

    // Prevent multiple refreshes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!this.refreshing) {
        this.refreshing = true
        // Here the actual reload of the page occurs
        window.location.reload()
      }
    })
  },

  methods: {
    // Store the SW registration so we can send it a message
    updateAvailable (event) {
      this.registration = event.detail
      this.show = true
    },

    // Called when the user accepts the update
    refreshApp () {
      this.updateExists = false
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (this.registration && this.registration.waiting) {
        // send message to SW to skip the waiting and activate the new SW
        this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    },
    confirm () {
      this.refreshApp()
      this.show = false
    },
    cancel () {
      this.show = false
    }
  }
}

</script>
