export default {
  data() {
    return {
      x: 1,
    }
  },
  methods: {
    showModel() {
      alert(this.x)
    },
  },
  mounted() {
    console.log('1111')
  },
}
