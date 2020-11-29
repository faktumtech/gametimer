/**
 * Simple directive to catch click/touch vs long-click/long-touch
 */

let binding
let timeout
// time in ms to count as long press
const longpressTime = 400
// check if we're using a touch screen
const isTouch = ('ontouchstart' in window)
// switch to touch events if using a touch screen
const startEvent = isTouch ? 'touchstart' : 'mousedown'
const stopEvent = isTouch ? 'touchend' : 'mouseup'

function start (event) {
  if (timeout) {
    return
  }
  timeout = setTimeout(function () {
    timeout = false
    binding.value('long')
  }, longpressTime)
}

function stop (event) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = false
    binding.value('short')
  }
}

export default {
  bind: function (el, _binding) {
    binding = _binding
    el.addEventListener(startEvent, start)
    el.addEventListener(stopEvent, stop)
  },
  unbind: function (el) {
    el.removeEventListener(startEvent)
    el.removeEventListener(stopEvent)
  }
}
