import { Group, ParticipantsData } from '@/types/participants'
import { SOARTeamData } from '@/types/SOAR'
import { objFromArray } from './utils'

const SOARinit: SOARTeamData = {
  timerRunning: false,
  started: false,
  stopped: false,
  startTime: {},
  stopTime: {},
  timerEvents: [],
  lastPause: {},
  lastResume: {},
  direction: 'A',
  stationsCompleted: [],
  points: 0,
}

const testOne = {
  groupTitle: 'Known_Painters',
  registeredEvents: {
    TSS: {
      volleyball: true,
    },
    SOAR: true,
  },
  SOAR: SOARinit,
  members: [
    {
      email: 'alice@gmail.com',
      phone: '77884793',
    },
    {
      email: 'brandon@gmail.com',
      phone: '79412799',
    },
    {
      email: 'carla@gmail.com',
      phone: '77008669',
    },
    {
      email: 'dave@gmail.com',
      phone: '70620715',
    },
  ],
}

const testTwo = {
  groupTitle: 'Modest_Liberators',
  registeredEvents: {
    SOAR: true,
  },
  SOAR: SOARinit,
  members: [
    {
      email: 'adam@gmail.com',
      phone: '73125593',
    },
    {
      email: 'beverly@gmail.com',
      phone: '75687708',
    },
    {
      email: 'cedric@gmail.com',
      phone: '75893845',
    },
    {
      email: 'dana@gmail.com',
      phone: '78449264',
    },
  ],
}

const SOARDevInit = SOARinit

SOARDevInit.stationsCompleted.push('Slide')

const Developer: Group = {
  groupTitle: 'Dev_loper',
  registeredEvents: {
    SOAR: true,
  },
  SOAR: SOARDevInit,
  members: [
    {
      email: 'adam@gmail.com',
      phone: '73125593',
      loginId: 'dev_loper120389',
    },
    {
      email: 'beverly@gmail.com',
      phone: '75687708',
      loginId: 'dev_loper120388',
    },
    {
      email: 'calista@gmail.com',
      phone: '75893845',
      loginId: 'k',
    },
    {
      email: 'dana@gmail.com',
      phone: '78449264',
      loginId: 'dev_loper120386',
    },
  ],
}

const trimGroupNameToLowercase = (grp: string) => {
  return grp.split('_').join('').split(' ').join('').toLowerCase()
}

const generateRandomID = () => {
  return Math.random().toString(10).substring(2, 8)
}

const addLoginId = (obj: any): Group => {
  let grpNameTitle = trimGroupNameToLowercase(obj.groupTitle)
  obj.members.forEach((e: any) => {
    e['loginId'] = grpNameTitle + generateRandomID()
  })
  return obj
}

const allTeams: Array<Group> = [
  addLoginId(testOne),
  addLoginId(testTwo),
  Developer,
]

const allLoginIds: {
  [key: string]: { groupTitle: string; index: number; email: string }
} = {}

const allEmails: {
  [key: string]: { groupTitle: string; index: number; loginId: string }
} = {}

allTeams.forEach((team) => {
  team.members.forEach((member, index) => {
    allLoginIds[member.loginId] = {
      groupTitle: team.groupTitle,
      index,
      email: member.email,
    }
    allEmails[member.email] = {
      groupTitle: team.groupTitle,
      index,
      loginId: member.loginId,
    }
  })
})

const participants: ParticipantsData = objFromArray(allTeams, 'groupTitle')
participants['allLoginIds'] = allLoginIds
participants['allEmails'] = allEmails

export default participants
