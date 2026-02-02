<template>
  <v-dialog
    v-model="modelValue.show"
    fullscreen
    hide-overlay
    transition="slide-x-transition"
    persistent
  >
    <v-card>
      <v-toolbar
        color="#4CAF50"
        theme="dark"
      >
        <v-btn
          icon
          @click="closeConfig"
        >
          <v-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            ><path
              style="fill: white"
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
            /></svg>
          </v-icon>
        </v-btn>
        <v-toolbar-title>GameTimer</v-toolbar-title>
      </v-toolbar>
      <v-card-title>
        <div class="text-h5 pa-5">Settings</div>
      </v-card-title>
      <v-card-text>
        <v-container class="py-0">
          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="maxTime"
                variant="underlined"
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
                variant="underlined"
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
        <div class="text-h5 pa-5">About GameTimer</div>
      </v-card-title>
      <v-card-text>
        <v-container class="py-0">
          <v-row>
            <v-col
              cols="12"
              sm="8"
              xl="6"
            >
              <p>A player's turn in games like Rummikub (<a href="https://en.wikipedia.org/wiki/Rummikub">https://en.wikipedia.org/wiki/Rummikub</a>) is limited by time. GameTimer has been created as an easy way to control the time used by each player during his turn.</p>
              <p>This application is designed as a Progressive Web Application (PWA) and once installed ('Add to desktop') it can be used offline. If no sound is played make sure you have switched off <b>silence mode</b> on you phone.</p>
              <p>App Version <b>{{ appVersion }}</b>.</p>
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
    modelValue: {
      type: Object,
      default () {
        return {
          maxTime: null,
          alertTime: null,
          dark: null,
          show: false
        }
      }
    }
  },
  data () {
    return {
      maxTime: null,
      alertTime: null,
      dark: null,
      appVersion: typeof process.env.PACKAGE_VERSION !== 'undefined' ? process.env.PACKAGE_VERSION : '0' // string
    }
  },

  watch: {
    'modelValue.show': function () {
      // this could also be done on mounted
      // but then it would not get updated each time the dialog is opened
      this.maxTime = this.modelValue.maxTime
      this.alertTime = this.modelValue.alertTime
      this.dark = this.modelValue.dark

    },
    dark: function (dark) {
      // show effect of dark immediately
      const updatedSettings = {...this.modelValue, ...{dark}}
      this.$emit('update:modelValue', (updatedSettings))
    }
  },
  methods: {
    closeConfig: function () {
      const updatedSettings = {
        maxTime: +this.maxTime,
        alertTime: +this.alertTime,
        dark: (this.dark),
        show: false
      }
      window.localStorage.setItem('maxtime', updatedSettings.maxTime)
      window.localStorage.setItem('alerttime', updatedSettings.alertTime)
      window.localStorage.setItem('dark', updatedSettings.dark)
      this.$emit('update:modelValue', updatedSettings)
    }
  }
}
</script>
