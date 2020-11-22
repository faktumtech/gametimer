<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        fill-height
      >
        <v-row
          align-center
          justify-center
        >
          <v-col xs12>
            <div class="timerWrap text-center">
              <v-btn
                v-longpress="touch"
                :color="btnColor"
                fab
                large
                dark
                class="timerBtn"
              >
                <div>
                  <span class="timerText">{{ timerText }}</span>
                  <br>
                  <span class="timerInfo">{{ timerInfo }}</span>
                </div>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <SwUpdate />
    <Settings
      v-model="showSettings"
      :settings.sync="settings"
    />
  </v-app>
</template>

<script>
import SwUpdate from '@/components/SwUpdate'
import Settings from '@/components/Settings'

export default {
  name: 'App',
  components: {
    SwUpdate,
    Settings
  },
  data () {
    return {
      showSettings: false,
      settings: {
        maxTime: 60,
        alertTime: 15,
        dark: false
      },
      btnColor: '#4CAF50',
      timerText: '',
      timerInfo: '',
      startText: 'Start',
      startInfo: '(Use long tap to change settings)',
      timer: null,
      runText: '',
      runInfo: '(Use long tap to stop completely)',
      activeTimer: false
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    init: function () {
      let tmp
      tmp = window.localStorage.getItem('dark')
      // avoid that unset localStorage overwrites default value
      if (typeof tmp !== 'undefined' && tmp !== null) {
        // local storage may save boolean as string
        this.settings.dark = JSON.parse(tmp)
      }
      this.$vuetify.theme.dark = this.settings.dark || false

      tmp = window.localStorage.getItem('maxtime')
      // avoid that unset localStorage overwrites default value
      if (typeof tmp !== 'undefined' && tmp !== null) {
        this.settings.maxTime = +tmp
      }
      tmp = window.localStorage.getItem('alertime')
      // avoid that unset localStorage overwrites default value
      if (typeof tmp !== 'undefined' && tmp !== null) {
        this.settings.alertTime = +tmp
      }

      this.reset()

      // use web audio api
      // https://stackoverflow.com/questions/29567580/play-a-beep-sound-on-button-click
      try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext
        this.audioContext = new AudioContext()
      } catch (e) {
        alert('Web Audio API is not supported in this browser')
      }
    },
    touch: function (arg) {
      if (arg === 'long') {
        if (this.activeTimer) {
          this.reset()
        } else {
          // if no active timer longTab will open config
          this.openConfig()
        }
      } else {
        this.start()
      }
    },
    start: function () {
      // audioContext is started as suspended in IOS and can
      // only be resumed by explicit user action
      // use start click to resume audioContest and beep once
      if (this.audioContext.state === 'running') {
        this.beep()
      } else if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          this.beep()
        })
      } else {
        alert(this.audioContext.state)
      }

      // clear any active timer
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.activeTimer = true
      this.timerInfo = this.runInfo
      // lets use exact time instead of timer interval to measure the elapsed time
      const startTime = new Date().getTime() / 1000
      let lastAlertBeep = false
      this.btnColor = 'success'

      // start timer
      this.timer = setInterval(function () {
        // store in milliseconds because of alert beeper
        const now = new Date().getTime()
        const seconds = Math.ceil(this.settings.maxTime + startTime - now / 1000)
        this.timerText = seconds
        // start alerting when alertTime is reached
        if (seconds > 0 && seconds <= this.settings.alertTime) {
          this.btnColor = '#FB8C00' // orange
          // start with 1 beep per second and than increase frequency
          const frequency = 1000 * seconds / this.settings.alertTime
          if (!lastAlertBeep || lastAlertBeep + frequency < now) {
            lastAlertBeep = new Date().getTime()
            this.beep()
          }
        }
        if (seconds <= 0) {
          this.btnColor = '#FF5252' // Red
        }
      }.bind(this), 50)
    },
    reset: function () {
      clearInterval(this.timer)
      this.activeTimer = false
      this.timerText = this.startText
      this.timerInfo = this.startInfo
      this.btnColor = '#4CAF50' // Green
    },
    beep: function () {
      const frequency = 500 // hz
      const duration = 100 // ms
      const vol = 100 // %

      const myOscillator = this.audioContext.createOscillator()
      const myGain = this.audioContext.createGain()
      myOscillator.connect(myGain)
      myOscillator.frequency.value = frequency
      myOscillator.type = 'square'
      myGain.connect(this.audioContext.destination)
      myGain.gain.value = vol * 0.01
      myOscillator.start(this.audioContext.currentTime)
      myOscillator.stop(this.audioContext.currentTime + duration * 0.001)
    },
    openConfig: function () {
      this.showSettings = true
    }
  }
}
</script>

<style>

  body {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
  }

  .timerBtn {
    height: 80vmin !important;
    width: 80vmin !important;
  }
  .timerText {
    font-size: 12vmin !important;
  }
  .timerInfo {
    font-size: 3vmin !important;
    text-transform: none !important;
  }
</style>
