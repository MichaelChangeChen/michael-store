export default {
  components: {
  },
  data() {
    return {
      drawer: null,
      showSearch: false,
    }
  },
  methods: {
    onKeyup(e) {
      this.$refs.search.focus()
    }
  }
}
