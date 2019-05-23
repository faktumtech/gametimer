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
          <v-btn icon dark @click="closeConfig">
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
            <v-layout column warp>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  v-model="maxTime"
                  label="Total time (sec)*"
                  required
                  type="number"
                >
                </v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  v-model="alertTime"
                  label="Alert time (sec)*"
                  required
                  type="number"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-title>
          <h3>About GameTimer</h3>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout column warp>
              <v-flex xs12 sm6 md4>
                <p>A player's turn in games like Rummikub (<a href="https://en.wikipedia.org/wiki/Rummikub">https://en.wikipedia.org/wiki/Rummikub</a>) is limited by time. GameTimer has been created as an easy way to control the time used by each player during his turn.</p>
                <p>This aplication is build as Progressive Web Application (PWA) and once installed ('Add to desktop'), can be used offline.</p>
                <p>Copyright <b>cfbutt</b>. Licensed under GPL v3. Source code at <a href="https://github.com/cfbutt/GameTimer">https://github.com/cfbutt/GameTimer</a>.</p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-content
      v-touch:swipe.down="reset"
    >
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12>
            <div class="timerWrap text-xs-center">
              <v-btn
                :color="btnColor"
                fab
                large
                dark
                class="timerBtn"
                v-touch:longtap="longTab"
                v-touch:tap="start"
                >
                <div>
                  <span class="timerText">{{timerText}}</span>
                  <br>
                  <span class="timerInfo">{{timerInfo}}</span>
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
  name: 'app',
  data () {
    return {
      alert: true,
      dialog: false,
      btnColor: '#4CAF50',
      startText: 'Start',
      infoText: '(Use long tap to change settings)',
      maxTime: 60,
      alertTime: 15,
      timer: null,
      timerText: '',
      timerInfo: '',
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
    },
    start: function (id) {
      // beep once
      this.beep()
      // clear any active timer
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.activeTimer = true
      this.timerInfo = ''
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
    reset: function (id) {
      clearInterval(this.timer)
      this.activeTimer = false
      this.timerText = this.startText
      this.timerInfo = this.infoText
      this.btnColor = '#4CAF50' // Green
    },
    beep: function () {
      let snd = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=')
      snd.play()
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
    height: 50vmin !important;
    width: 50vmin !important;
  }
  .timerText {
    font-size: 8vmin !important;
  }
  .timerInfo {
    font-size: 2vmin !important;
    text-transform: none !important;
  }
</style>
