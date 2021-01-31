<template>
  <div class="container">
    <div class="grid grid-cols-3 gap-4">
      <div>
        PLAYERS
        <div v-for="player in $store.state.players" :key="player.id">
          <div>
            <strong :class="{ current: player.turn }">{{ player.name }}</strong>
          </div>
          <button
            v-for="(card, i) in player.cards"
            :key="i"
            @click="handleAction(card, player)"
          >
            {{ card.type }}
          </button>
          <hr />
          <button v-if="player.turn" @click="handleDraw(player)">
            DRAW CARD
          </button>
        </div>
      </div>
      <div>
        DRAW PILE
        <pre>
          {{ $store.state.drawPile }}
        </pre>
      </div>
      <div>
        DISCARD PILE
        <pre>
          {{ $store.state.discardPile }}
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: move outside this file
const type = {
  EXPLODE: 'EXPLODE',
  DEFUSE: 'DEFUSE',
  ATTACK: 'ATTACK',
  FUTURE: 'FUTURE',
  SHUFFLE: 'SHUFFLE',
  NOPE: 'NOPE',
  SKIP: 'SKIP',
  FAVOR: 'FAVOR',
}
export default {
  mounted() {
    this.$store.commit('deal')
  },
  methods: {
    handleAction(card, player) {
      if (!player.turn) {
        alert('NOT YOUR TURN!')
        return false
      }

      const payload = { card, player }

      switch (card.type) {
        case type.DEFUSE:
          this.$store.commit('defuse')
          break
        case type.ATTACK:
          this.$store.commit('attack', payload)
          this.$store.commit('throw', payload)
          break
        case type.FUTURE:
          this.$store.commit('future', payload)
          this.$store.commit('throw', payload)
          break
        case type.SHUFFLE:
          this.$store.commit('shuffle')
          this.$store.commit('throw', payload)
          break
        case type.NOPE:
          this.$store.commit('nope', payload)
          this.$store.commit('throw', payload)
          break
        case type.SKIP:
          this.$store.commit('skip', payload)
          this.$store.commit('throw', payload)
          break
        case type.FAVOR:
          this.$store.commit('favor', payload)
          this.$store.commit('throw', payload)
          break
        default:
          this.$store.commit('draw')
          break
      }
    },
    handleDraw(player) {
      this.$store.commit('draw', player)
    },
  },
}
</script>

<style scoped>
button {
  margin: 1rem;
}
.current {
  color: green !important;
}
</style>
