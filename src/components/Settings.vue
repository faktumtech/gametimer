<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
    transition="slide-x-transition"
    persistent
  >
    <v-card>
      <v-toolbar
        dark
        color="#4DBA87"
      >
        <v-btn
          icon
          dark
          @click="closeConfig"
        >
          <v-icon>
            $vuetify.icons.arrowBack
          </v-icon>
        </v-btn>
        <v-toolbar-title>GameTimer</v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        <h3>Settings</h3>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="maxTime"
                label="Total time (sec)*"
                required
                type="number"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="alertTime"
                label="Alert time (sec)*"
                required
                type="number"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-switch
                v-model="dark"
                label="Dark theme"
              />
              <p>Switch between light and dark theme on this device.</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-title>
        <h3>About GameTimer</h3>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-row
            column
            warp
          >
            <v-col
              xs12
              sm6
              md4
            >
              <p>A player's turn in games like Rummikub (<a href="https://en.wikipedia.org/wiki/Rummikub">https://en.wikipedia.org/wiki/Rummikub</a>) is limited by time. GameTimer has been created as an easy way to control the time used by each player during his turn.</p>
              <p>This application is designed as a Progressive Web Application (PWA) and once installed ('Add to desktop') it can be used offline. If no sound is played make sure you have switched off <b>silence mode</b> on you phone.</p>
              <p><b>App Version {{ appVersion }}.</b></p>
              <p>Copyright <b>cfbutt</b>. Licensed under GPL v3.</p>
              <p>Source code at <a href="https://github.com/cfbutt/gametimer">https://github.com/cfbutt/gametimer</a>.</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default () {
        return {
          maxTime: null,
          alertTime: null,
          dark: null
        }
      }
    }
  },
  data () {
    return {
      maxTime: null,
      alertTime: null,
      dark: null,
      appVersion: process.env.PACKAGE_VERSION || '0'
    }
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    show: function () {
      // this could also be done on mounted
      // but then it would not get updated each time the dialog is opened
      this.maxTime = this.settings.maxTime
      this.alertTime = this.settings.alertTime
      this.dark = this.settings.dark
    },
    dark: function (dark) {
      // show effect of dark immediately
      this.$vuetify.theme.dark = (dark)
    }
  },
  methods: {
    closeConfig: function () {
      const updatedSettings = {
        maxTime: +this.maxTime,
        alertTime: +this.alertTime,
        dark: (this.dark)
      }
      window.localStorage.setItem('maxtime', updatedSettings.maxTime)
      window.localStorage.setItem('alerttime', updatedSettings.alertTime)
      window.localStorage.setItem('dark', updatedSettings.dark)
      this.$emit('update:settings', updatedSettings)
      this.show = false
    }
  }
}
</script>
