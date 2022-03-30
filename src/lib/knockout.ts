import TSS from '@/data/schema/TSS'
import push from '@/data/push'
import {
  MatchParticipants,
  MatchRequest,
  Round,
  Winner,
  Sport,
} from '@/types/TSS'
import { pullCollection } from '@/data/pull'

const delimiter = () => {
  const date = new Date().toString()
  const line = '='.repeat(date.length)
  console.log(`\n\n\n${line}\n${date}\n${line}\n`) // perma
}

const sportList = ['dodgeball', 'frisbee', 'volleyball', 'tchoukball']
const roundList: Array<Round> = [
  'round_of_32',
  'round_of_16',
  'quarterfinals',
  'semifinals',
  'finals',
]

function resetTSS() {
  push({ collection: 'TSS', docs: TSS, merge: false })
}

/*
 * have tabs to toggle which knockout table to view
 * dodgeball/volleyball/tchoukball/frisbee...
 */

/* BACKEND FUNCTIONS */

/*
 * takes in
 *  1. event type (dodgeball/volleyball/tchoukball/frisbee...)
 *  2. match id
 *  3. match winner
 * writes the outcome to database
 *
 */

const getNextRound = (round: Round) => {
  const currentOrder = roundList.indexOf(round)
  const nextOrder = currentOrder + 1
  if (nextOrder <= roundList.length) {
    return roundList[currentOrder + 1]
  } else {
    return roundList[-1]
  }
}

const getNextMatchNumber = (matchNumber: number) => {
  return Math.floor(matchNumber / 2)
}

function handleMatch({ sport, round, matchNumber, winner }: MatchRequest) {
  delimiter()

  // get that exact match
  const matchParticipants: MatchParticipants = TSS[sport][round][matchNumber]
  const winnerName = matchParticipants[winner]

  var packet
  if (round === 'finals') {
    packet = {
      [sport]: {
        // update the outcome of that match
        [round]: {
          [matchNumber]: { ...matchParticipants, winner },
        },
        champions: winnerName,
      },
    }
  } else {
    const nextRound: Round = getNextRound(round)
    const nextMatchNumber = getNextMatchNumber(matchNumber)
    const nextMatch = TSS[sport][nextRound][nextMatchNumber]
    const nextSlot: Winner = matchNumber % 2 === 0 ? 'A' : 'B'
    packet = {
      [sport]: {
        // update the outcome of that match
        [round]: {
          [matchNumber]: { ...matchParticipants, winner },
        },
        // apend the schedule for next match
        [nextRound]: {
          [nextMatchNumber]: { ...nextMatch, [nextSlot]: winnerName },
        },
      },
    }
  }

  // update the database
  push({ collection: 'TSS', docs: packet })
}

async function getKnockoutTable({ sport }: { sport: Sport }) {
  const data = await pullCollection({ collection: 'TSS' })
  return data[sport]
}

export { resetTSS, handleMatch, delimiter, getKnockoutTable }
export { sportList, roundList }
