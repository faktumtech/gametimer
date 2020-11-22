/**
 * Simple directive to catch click/touch vs long-click/long-touch
 */

var binding
var timeout
var longpressTime = 400 // time in ms to count as long press

function start (event) {
  if (timeout) {
    return
  }
  timeout = setTimeout(function () {
    timeout = false
    binding.value('long')
    // console.log('long')
  }, longpressTime)
}

function stop (event) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = false
    binding.value('short')
    // console.log('short')
  }
}

export default {
  bind: function (el, _binding) {
    binding = _binding

    el.addEventListener('touchstart', start)
    // el.addEventListener('touchcancel', cancel)
    el.addEventListener('touchend', stop)
    el.addEventListener('mousedown', start)
    el.addEventListener('mouseup', stop)
  },
  unbind: function (el) {
    el.removeEventListener('touchstart')
    // el.removeEventListener('touchcancel')
    el.removeEventListener('touchend')
    el.removeEventListener('mousedown')
    el.removeEventListener('mouseup')
  }
}
