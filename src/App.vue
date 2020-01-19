<template>
  <v-app>
    <v-dialog
      v-model="dialog"
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
          <h3>Time Settings</h3>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout
              column
              warp
            >
              <v-flex
                xs12
                sm6
                md4
              >
                <v-text-field
                  v-model="maxTime"
                  label="Total time (sec)*"
                  required
                  type="number"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
                md4
              >
                <v-text-field
                  v-model="alertTime"
                  label="Alert time (sec)*"
                  required
                  type="number"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-title>
          <h3>About GameTimer</h3>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout
              column
              warp
            >
              <v-flex
                xs12
                sm6
                md4
              >
                <p>A player's turn in games like Rummikub (<a href="https://en.wikipedia.org/wiki/Rummikub">https://en.wikipedia.org/wiki/Rummikub</a>) is limited by time. GameTimer has been created as an easy way to control the time used by each player during his turn.</p>
                <p>This application is build as a Progressive Web Application (PWA) and once installed ('Add to desktop') it can be used offline. If no sound is played make sure you have switched off <b>silence mode</b> on you phone.</p>
                <p>Copyright <b>cfbutt</b>. Licensed under GPL v3. Source code at <a href="https://github.com/cfbutt/gametimer">https://github.com/cfbutt/gametimer</a>.</p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-content>
      <v-container
        fluid
        fill-height
      >
        <v-layout
          align-center
          justify-center
        >
          <v-flex xs12>
            <div class="timerWrap text-center">
              <v-btn
                v-touch:longtap="longTab"
                v-touch:tap="start"
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
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      alert: true,
      dialog: false,
      btnColor: '#4CAF50',
      timerText: '',
      timerInfo: '',
      startText: 'Start',
      startInfo: '(Use long tap to change settings)',
      maxTime: 60,
      alertTime: 15,
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
      tmp = window.localStorage.getItem('maxtime')
      // avoid that unset localStorage overwrites default value
      if (typeof tmp !== 'undefined' && tmp !== null) {
        this.maxTime = +tmp
      }
      tmp = window.localStorage.getItem('alertime')
      // avoid that unset localStorage overwrites default value
      if (typeof tmp !== 'undefined' && tmp !== null) {
        this.alertTime = +tmp
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
      let startTime = new Date().getTime() / 1000
      let lastAlertBeep = false
      this.btnColor = 'success'

      // start timer
      this.timer = setInterval(function () {
        // store in milliseconds because of alert beeper
        let now = new Date().getTime()
        let seconds = Math.ceil(this.maxTime + startTime - now / 1000)
        this.timerText = seconds
        // start alerting when alertTime is reached
        if (seconds > 0 && seconds <= this.alertTime) {
          this.btnColor = '#FB8C00' // orange
          // start with 1 beep per second and than increase frequency
          let frequency = 1000 * seconds / this.alertTime
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
      var frequency = 500 // hz
      var duration = 100 // ms
      var vol = 100 // %

      var myOscillator = this.audioContext.createOscillator()
      var myGain = this.audioContext.createGain()
      myOscillator.connect(myGain)
      myOscillator.frequency.value = frequency
      myOscillator.type = 'square'
      myGain.connect(this.audioContext.destination)
      myGain.gain.value = vol * 0.01
      myOscillator.start(this.audioContext.currentTime)
      myOscillator.stop(this.audioContext.currentTime + duration * 0.001)
    },
    longTab: function () {
      // if active timer longTab will reset
      if (this.activeTimer) {
        this.reset()
      } else {
        // if no active timer longTab will open config
        this.openConfig()
      }
    },
    openConfig: function () {
      this.dialog = true
    },
    closeConfig: function () {
      this.dialog = false
      this.maxTime = +this.maxTime
      this.alertTime = +this.alertTime
      window.localStorage.setItem('maxtime', this.maxTime)
      window.localStorage.setItem('alerttime', this.alertTime)
    }
  }
}
</script>

<style>
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
