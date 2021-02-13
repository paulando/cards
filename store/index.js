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
  initCards: 4,
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
  // playerCurrent: {},
  // playerBefore: {},
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
    // {
    //   id: 'future3',
    //   type: type.FUTURE,
    // },
    // {
    //   id: 'future4',
    //   type: type.FUTURE,
    // },
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
      id: 'nope3',
      type: type.NOPE,
    },
    {
      id: 'nope4',
      type: type.NOPE,
    },
    {
      id: 'nope5',
      type: type.NOPE,
    },
    {
      id: 'nope6',
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
      id: 'skip3',
      type: type.SKIP,
    },
    {
      id: 'skip4',
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
    // {
    //   id: 'favor3',
    //   type: type.FAVOR,
    // },
    // {
    //   id: 'favor4',
    //   type: type.FAVOR,
    // },
    // {
    //   id: 'favor5',
    //   type: type.FAVOR,
    // },
    // {
    //   id: 'favor6',
    //   type: type.FAVOR,
    // },
    // {
    //   id: 'foff',
    //   type: type.FOFF,
    //   shuffle your cards if someone tries to steal a valuable card from you
    // },
  ],
  discardPile: [],
  commitAction: true,
  isDemand: false,
  // is: false,
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

    let topCardFromDiscardPile = false
    if (state.discardPile.length) {
      topCardFromDiscardPile = state.discardPile[0]
    }

    if (!topCardFromDiscardPile) {
      alert("Don't waste a useful card") // TODO: show only to player who did that
      return false
    }

    console.log(topCardFromDiscardPile.type + ' WAS NOPPED')

    commit('logAction', {
      action: type.NOPE + '/' + topCardFromDiscardPile.type,
      player,
    })

    switch (topCardFromDiscardPile.type) {
      case type.SKIP:
        // TODO: set turn to player who placed SKIP
        console.log('NOPE SKIP')
        commit('setPlayerPrevious')
        break
      case type.ATTACK:
        // TODO: set turn to player who placed ATTACK
        commit('setPlayerPrevious')
        break
      // case type.SHUFFLE:
      //   // TODO: set turn to player who placed SHUFFLE
      //   break
      // case type.FUTURE:
      //   break
      case type.NOPE:
        // TODO: check how many NOPEs and get card and a player before first NOPE
        console.log('NOPE NOPE')
        commit('countNopes')
        // commit('setPlayerNext')
        break
      default:
        break
    }

    commit('throw', { card, player })
  },
  attack({ commit }, { card, player }) {
    // TODO: make doubleTurn === true, switch turn tu next player
    // alert('ACTION_ATTACK')
    commit('doubleTurn', true)

    commit('logAction', {
      action: type.ATTACK,
      player,
    })

    commit('updatePlayers', player)

    commit('throw', { card, player })
  },
  favor({ commit, state }, { card, player }) {
    commit('logAction', {
      action: type.FAVOR,
      player,
    })

    // TODO: hide yourself and hide those without a single card
    const playersListText = [...state.players]
      .map((player) => {
        return `ID ${player.id} - ${player.name}`
      })
      .join(',')

    const selectedPlayerId = parseInt(
      prompt(`Pick a player (ID): ${playersListText}`),
      10
    )

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

    if (card) {
      commit('throw', { card, player })
    }
  },
  // getCurrentPlayer({ state }) {
  //   return [...state.players].filter((player) => {
  //     if (!player.turn) {
  //       return false
  //     }
  //     return player
  //   })[0]
  // },
  giveCard({ commit }) {
    //
  },
  setPlayerPrevious({ commit }) {
    commit('setPlayerPrevious')
  },
  setPlayerNext({ commit }) {
    commit('setPlayerNext')
  },
  shufflePrepare({ commit }, { card, player }) {
    commit('logAction', {
      action: type.SHUFFLE,
      player,
    })

    commit('shufflePrepare')

    if (card) {
      commit('throw', { card, player })
    }
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

    // commit('updatePlayers', player)
    commit('setPlayerNext')

    if (card) {
      commit('throw', { card, player })
    }
  },
  switchPlayer({ state, commit }, { player, selectedPlayerId }) {
    // TODO: selected player must give one of his cards to player who throw Favor card
    // Move card from one player to other

    const playerGive = [...state.players].filter((player) => {
      if (player.id !== selectedPlayerId) {
        return false
      }
      return player
    })[0]

    commit('switchPlayer', { player, cardType: type.FAVOR, playerGive })
  },
}

export const mutations = {
  clearAction(state) {
    clearTimeout(state.timeout)
  },
  countNopes(state) {
    const clonedDrawPile = [...state.discardPile]
    const firstNopedCard = clonedDrawPile.find((card) => {
      return card.type !== type.NOPE && card.type !== type.DEFUSE
    })

    console.log('firstNopedCard', firstNopedCard)

    let countNopes = 0

    for (let i = 0; i < clonedDrawPile.length; i++) {
      if (clonedDrawPile[i].type === type.NOPE) {
        countNopes++
      } else {
        break
      }
    }

    const isEvenNopes = countNopes % 2

    const player = [...state.players].filter((p) => {
      if (!p.turn) {
        return false
      }
      return p
    })[0]

    if (isEvenNopes) {
      // TODO: try again an initial action before the first nope was placed
      switch (firstNopedCard.type) {
        case type.SKIP:
          console.log(`TRY ${type.SKIP} AGAIN`)
          this.dispatch('skip', { card: false, player })
          break
        case type.SHUFFLE:
          console.log(`TRY ${type.SHUFFLE} AGAIN`)
          this.dispatch('shufflePrepare', { card: false, player })
          break
        case type.FUTURE:
          console.log(`TRY ${type.FUTURE} AGAIN`)
          this.dispatch('future', { card: false, player })
          break
        default:
          break
      }
    } else {
      this.dispatch('setPlayerPrevious')
    }
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

        state.doubleTurn = false // You have died, so forget about double turn (optional)

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
    if (!state.doubleTurn) {
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
    } else {
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
    }, state.timeoutDuration)
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
  switchPlayer(state, { player, cardType, playerGive }) {
    console.log('playerGive', playerGive)

    if (cardType === type.FAVOR) {
      // TODO: give turn to playerGive, show promtp with playerGive cards, transfer selected card to player
      state.players = [...state.players].map((p) => {
        if (p.id === playerGive.id) {
          p.turn = true
        } else {
          p.turn = false
        }
        return p
      })

      const cardListText = playerGive.cards
        .map((card, i) => {
          return `ID ${i} - ${card.id}`
        })
        .join(',')

      let selectedCard = parseInt(
        prompt(`Pick a card (ID): ${cardListText}`),
        10
      )

      selectedCard = playerGive.cards.splice(selectedCard, 1)[0]

      state.players = [...state.players].map((p) => {
        if (p.id === playerGive.id) {
          p.cards = playerGive.cards
          p.turn = false
        } else if (p.id === player.id) {
          p.cards.push(selectedCard) // TODO: place this card randomly in player's hand
          p.turn = true
        }
        return p
      })
    }
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
  setPlayerPrevious(state) {
    let previousPlayer
    const playersUpdate = [...state.players].filter((person, i) => {
      if (person.turn) {
        person.turn = !person.turn
        previousPlayer = i === 0 ? state.players.length - 1 : i - 1
      }
      return person
    })

    playersUpdate[previousPlayer].turn = true

    state.players = playersUpdate
  },
  setPlayerNext(state) {
    let nextPlayer
    const playersUpdate = [...state.players].filter((person, i) => {
      if (person.turn) {
        person.turn = !person.turn
        nextPlayer = i === state.players.length - 1 ? 0 : i + 1
      }
      return person
    })

    playersUpdate[nextPlayer].turn = true

    state.players = playersUpdate
  },
}
