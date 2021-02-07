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

// TODO: move outside this file
const shuffle = (array) => {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

export const state = () => ({
  initCards: 3,
  doubleTurn: false,
  players: [
    {
      id: 0,
      name: 'Viki 👑',
      cards: [],
      turn: false,
    },
    {
      id: 1,
      name: 'CHOPPA',
      cards: [],
      turn: true,
    },
    {
      id: 2,
      name: 'Pavel',
      cards: [],
      turn: false,
    },
  ],
  playerCurrent: {},
  playerBefore: {},
  drawPile: [
    {
      id: 'explode1',
      type: type.EXPLODE,
    },
    {
      id: 'explode2',
      type: type.EXPLODE,
    },
    {
      id: 'explode3',
      type: type.EXPLODE,
    },
    {
      id: 'explode4',
      type: type.EXPLODE,
    },
    {
      id: 'defuse1',
      type: type.DEFUSE,
    },
    {
      id: 'defuse2',
      type: type.DEFUSE,
    },
    {
      id: 'defuse3',
      type: type.DEFUSE,
    },
    {
      id: 'defuse4',
      type: type.DEFUSE,
    },
    {
      id: 'attack1',
      type: type.ATTACK,
    },
    {
      id: 'attack2',
      type: type.ATTACK,
    },
    {
      id: 'future1',
      type: type.FUTURE,
    },
    {
      id: 'future2',
      type: type.FUTURE,
    },
    {
      id: 'shuffle1',
      type: type.SHUFFLE,
    },
    {
      id: 'shuffle',
      type: type.SHUFFLE,
    },
    {
      id: 'nope1',
      type: type.NOPE,
    },
    {
      id: 'nope2',
      type: type.NOPE,
    },
    {
      id: 'skip1',
      type: type.SKIP,
    },
    {
      id: 'skip2',
      type: type.SKIP,
    },
    {
      id: 'favor1',
      type: type.FAVOR,
    },
    {
      id: 'favor2',
      type: type.FAVOR,
    },
  ],
  discardPile: [],
  commitAction: true,
  isFavor: false,
  isDemand: false,
  is: false,
  timeout: null,
  timeoutDuration: 3000,
  showLogs: true,
  logs: [],
})

// TODO: commit throw inside actions and remove from index.vue throw commits

export const actions = {
  nope({ commit, state }, { card, player }) {
    // TODO: add action

    commit('clearAction', player)

    const topCardFromDiscardPile = state.discardPile[0] // TODO: check discardPile length

    console.log(topCardFromDiscardPile.type + ' WAS NOPPED')

    commit('logAction', {
      action: type.NOPE + '/' + topCardFromDiscardPile.type,
      player,
    })

    switch (topCardFromDiscardPile.type) {
      case type.SKIP:
        // TODO: set turn to player who placed SKIP
        break
      case type.ATTACK:
        // TODO: set turn to player who placed ATTACK
        break
      case type.SHUFFLE:
        // TODO: set turn to player who placed SHUFFLE
        break
      case type.FUTURE:
        break
      case type.NOPE:
        // TODO: check how many NOPEs and get card and a player before first NOPE
        break
      default:
        break
    }

    commit('throw', { card, player })
  },
  attack({ commit }, { card, player }) {
    // TODO: add action
    // alert('ACTION_ATTACK')
    commit('doubleTurn', true)

    commit('logAction', {
      action: type.ATTACK,
      player,
    })

    commit('throw', { card, player })
  },
  favor({ commit, state }, { card, player }) {
    // TODO: add action
    commit('logAction', {
      action: type.SKIP,
      player,
    })

    const playersListText = [...state.players]
      .map((player) => {
        return `ID ${player.id} - ${player.name}`
      })
      .join(',')

    const selectedPlayerId = prompt(`Pick a player (ID): ${playersListText}`)

    commit('pickPlayerForFavor', { player, selectedPlayerId })

    commit('throw', { card, player })
  },
  future({ commit }, { card, player }) {
    // TODO: see top 3 cards from drawPile
    commit('logAction', {
      action: type.FUTURE,
      player,
    })

    commit('showFuture', { card, player })

    commit('throw', { card, player })
  },
  giveCard({ commit }) {
    //
  },
  shufflePrepare({ commit }, { card, player }) {
    commit('logAction', {
      action: type.SHUFFLE,
      player,
    })

    commit('shufflePrepare')

    commit('throw', { card, player })
  },
  shuffle({ commit, state }) {
    commit('shuffle', shuffle([...state.drawPile]))
  },
  skip({ commit }, { card, player }) {
    // TODO: add action
    commit('logAction', {
      action: type.SKIP,
      player,
    })

    commit('updatePlayers', player)
    commit('throw', { card, player })
  },
  switchPlayer({ commit }, { player, selectedPlayerId }) {
    // TODO: selected player must give one of his cards to player who throw Favor card
    // Move card from one player to other

    const playerGive = [...state.players].filter((player) => {
      if (player.id !== selectedPlayerId) {
        return false
      }
      return player
    })

    commit('switchPlayer', { player, type: type.FAVOR, playerGive })
  },
  transferCard({ commit }, { playerGive, playerReceive }) {
    const cardsListText = playerGive.cards
      .map((card, i) => {
        return `ID ${i} - ${card.id}`
      })
      .join(',')
    const cardId = prompt(`Pick a card (ID): ${cardsListText}`)
    commit('transferCard', { playerGive, playerReceive, cardId })
  },
}

export const mutations = {
  clearAction(state) {
    clearTimeout(state.timeout)
  },
  deal(state) {
    // TODO: remove cards with type: EXPLODE and DEFUSE, then deal number of initCards from the remaining cards to each player

    // Storage arrays for explode and defuse cards
    const explodeCards = []
    const defuseCards = []

    // Shuffle full deck of cards
    const shuffledCards = shuffle(state.drawPile)

    // filter cards: put explode and defuse cards to their arrays and return remaining cards
    const filteredDrawCards = shuffledCards.filter((card) => {
      if (card.type === type.EXPLODE) {
        explodeCards.push(card)
        return false
      } else if (card.type === type.DEFUSE) {
        defuseCards.push(card)
        return false
      }
      return card
    })

    // give filtered cards + one defuse card to each player
    state.players.forEach((player) => {
      const playerCards = filteredDrawCards
        .splice(0, state.initCards)
        .concat(defuseCards.splice(0, 1))
      player.cards = shuffle(playerCards)
    })

    // state.players[1].cards.push(defuseCards[0]) // ONLY FOR TESTING

    // shuffle left out cards with explode cards
    state.drawPile = shuffle(
      filteredDrawCards.concat(explodeCards.splice(0, state.players.length - 1))
    )

    if (state.showLogs) {
      state.logs.unshift({
        action: 'DEAL',
        initiatedBy: 'SERVER',
      })
    }
  },
  doubleTurn(state, value) {
    state.doubleTurn = value
  },
  draw(state, player) {
    // TODO: draw a card from top of the pile

    const clonedDrawPile = [...state.drawPile]

    const drawnCard = clonedDrawPile.shift()

    if (drawnCard.type === type.EXPLODE) {
      if (state.showLogs) {
        state.logs.unshift({
          action: 'DRAW/EXPLODE',
          initiatedBy: player.name,
        })
      }

      const playerCards = []
      const hasDefuseCard = player.cards.filter((card) => {
        if (card.type === type.DEFUSE) {
          return card
        } else {
          playerCards.push(card)
          return false
        }
      })
      if (hasDefuseCard[0]) {
        // TODO: Use DEFUSE card then let the player pick where to put back EXPLODE card
        alert('RIP BRO 💀')

        const index = prompt(
          `Put explode card back in between: 0 - top of the pile, ${clonedDrawPile.length} - bottom of the pile`
        )
        if (index >= 0 && index < clonedDrawPile.length) {
          clonedDrawPile.splice(index, 0, drawnCard)
        } else {
          clonedDrawPile.splice(clonedDrawPile.length, 0, drawnCard)
        }

        state.drawPile = clonedDrawPile

        const useDefuse = hasDefuseCard.pop()
        state.discardPile.push(useDefuse)

        if (state.showLogs) {
          state.logs.unshift({
            action: 'USE DEFUSE',
            initiatedBy: player.name,
          })
        }

        state.players.map((person) => {
          if (person.id === player.id) {
            person.cards = playerCards
            person.cards.push(...hasDefuseCard)
          }
          return person
        })
      } else {
        alert(`GAME OVER, ${player.name} ✌️🥺`)

        if (state.showLogs) {
          state.logs.unshift({
            action: 'GAME OVER',
            initiatedBy: player.name,
          })
        }

        // TODO: GAME OVER - remove player
        let nextPlayerIterator
        const playersUpdate = state.players.filter((person, i) => {
          if (person.id === player.id) {
            nextPlayerIterator = state.players.length - 1 === i ? 0 : i
            return false
          } else {
            return person
          }
        })
        playersUpdate[nextPlayerIterator].turn = true
        state.players = playersUpdate

        if (state.players.length === 1) {
          alert(`Congrats, ${state.players[0].name}, you won!`)
        }
        return false
      }
    } else {
      // TODO: put new drawn card to player's hand
      console.log('DID NOT EXPLODE 👍', drawnCard)
      const playersUpdate = state.players.map((person) => {
        if (person.id === player.id) {
          person.cards.push(drawnCard)
        }
        return person
      })
      state.players = playersUpdate
      state.drawPile = clonedDrawPile

      if (state.showLogs) {
        state.logs.unshift({
          action: 'DRAW',
          initiatedBy: player.name,
        })
      }
    }
    // TODO: pass turn to the next player
    let nextPlayerIterator
    const playersUpdate = state.players.map((player, i) => {
      if (player.turn) {
        player.turn = !player.turn
        nextPlayerIterator = state.players.length - 1 === i ? 0 : i + 1
      }
      return player
    })
    playersUpdate[nextPlayerIterator].turn = true
    state.players = playersUpdate

    if (state.doubleTurn) {
      state.doubleTurn = false
    }
  },
  logAction(state, { action, player }) {
    if (state.showLogs) {
      state.logs.unshift({
        action,
        initiatedBy: player.name,
      })
    }
  },
  nope(state, { player }) {
    // TODO: add action
  },
  pick(state, card) {
    // TODO: pick desired card from discardPile
  },
  pickPlayerForFavor(state, payload) {
    state.timeout = setTimeout(() => {
      this.dispatch('switchPlayer', payload)
    }, 3000)
  },
  showFuture(state) {
    const future = state.drawPile.slice(0, 3)

    state.timeout = setTimeout(() => {
      console.log(type.FUTURE + ' timeout')
      alert(
        `ACTION_FUTURE - Card 1 - ${future[0].type}, Card 2 - ${future[1].type}, Card 3 - ${future[2].type}`
      )
    }, state.timeoutDuration)
  },
  shufflePrepare(state) {
    state.timeout = setTimeout(() => {
      console.log(type.SHUFFLE + ' timeout')
      this.dispatch('shuffle') // TODO: should be possible to change state inside this setTimeout
    }, 3000)
  },
  shuffle(state, shuffledPile) {
    state.drawPile = shuffledPile
  },
  switchPlayer(state, { player, type, playerGive }) {
    console.log('ayy')
  },
  throw(state, { card, player }) {
    // TODO: throw player's card to discardPile
    state.players.map((person) => {
      if (person.id === player.id) {
        const cards = person.cards.filter((handCard) => handCard.id !== card.id)
        person.cards = cards
      }
      return person
    })
    card.usedBy = player.name // TODO: Better use id instead of a name
    state.discardPile.unshift(card)
  },
  updatePlayers(state, player) {
    let nextPlayerIterator
    const playersUpdate = [...state.players].filter((person, i) => {
      if (person.id === player.id) {
        person.turn = !person.turn
        nextPlayerIterator = state.players.length - 1 === i ? 0 : i + 1
      }
      return person
    })

    playersUpdate[nextPlayerIterator].turn = true

    state.players = playersUpdate
  },
}
