<template>
  <div class="container mx-auto py-5">
    <div class="grid grid-flow-col grid-cols-4 grid-rows-1 gap-4">
      <div class="p-3" style="background-color: #b2ebf2">
        PLAYERS
        <div v-for="player in $store.state.players" :key="player.id">
          <div>
            <strong :class="{ current: player.turn }">{{ player.name }}</strong>
          </div>
          <div v-for="(card, i) in player.cards" :key="i">
            <button
              v-if="card.type !== 'NOPE'"
              @click="handleAction(card, player)"
            >
              {{ card.type }}
            </button>
            <button v-else @click="handleNope(card, player)">
              {{ card.type }}
            </button>
          </div>
          <hr />
          <button
            v-if="player.turn && !$store.state.isFavor"
            @click="handleDraw(player)"
          >
            DRAW CARD
          </button>
          <hr />
        </div>
      </div>
      <div class="p-3" style="background-color: #8bc34a">
        DRAW PILE
        <pre>
          {{ $store.state.drawPile }}
        </pre>
      </div>
      <div class="p-3" style="background-color: #ffc107">
        DISCARD PILE
        <pre>
          {{ $store.state.discardPile }}
        </pre>
      </div>
      <div class="p-3" style="background-color: #bdbdbd">
        LOGS
        <pre>
          {{ $store.state.logs }}
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

      if (this.$store.state.isFavor) {
        this.$store.dispatch('transferCard', payload)
        return false
      }

      switch (card.type) {
        case type.DEFUSE:
          this.$store.commit('defuse')
          break
        case type.ATTACK:
          this.$store.dispatch('attack', payload)
          // this.$store.commit('throw', payload)
          break
        case type.FUTURE:
          this.$store.dispatch('future', payload)
          // this.$store.commit('throw', payload)
          break
        case type.SHUFFLE:
          this.$store.dispatch('shufflePrepare', payload)
          // this.$store.commit('throw', payload)
          break
        case type.SKIP:
          this.$store.dispatch('skip', payload)
          // this.$store.commit('throw', payload)
          break
        case type.FAVOR:
          this.$store.dispatch('favor', payload)
          // this.$store.commit('throw', payload)
          break
        default:
          this.$store.commit('draw')
          break
      }
    },
    handleDraw(player) {
      this.$store.commit('draw', player)
    },
    handleNope(card, player) {
      const payload = { card, player }
      this.$store.dispatch('nope', payload)
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
