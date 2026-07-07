
/*
|---------------------------------------------------------------------
| Copy Label Component
|---------------------------------------------------------------------
|
| Copy to clipboard with the plugin clipboard `this.$clipboard`
|
*/
export default {
  props: {
    // Text to copy to clipboard
    text: {
      type: String,
      default: ''
    },
    // Text to show on toast
    toastText: {
      type: String,
      default: 'Copied to clipboard!'
    },
    isBlock: {
      type: Boolean,
      default: false
    },
    /**
     * CSS animation with animate.css
     * https://animate.style/
     */
    animation: {
      type: String,
      default: 'heartBeat'
    }
  },
  data() {
    return {
      tooltip: 'Copy',
      timeout: null
    }
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout)
  },
  methods: {
    copy() {
      this.$animate(this.$refs.copylabel, this.animation)
      this.$clipboard(this.text, this.toastText)
      this.tooltip = 'Copied!'

      this.timeout = setTimeout(() => {
        this.tooltip = 'Copy'
      }, 2000)
    }
  }
}
