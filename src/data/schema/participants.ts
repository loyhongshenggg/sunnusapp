import { Group, ParticipantsData } from '@/types/participants'
import { objFromArray } from './utils'

const testOne: Group = {
  group_title: 'Known_Painters',
  registered_events: {
    TSS: {
      volleyball: true,
    },
  },
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

const testTwo: Group = {
  group_title: 'Modest_Liberators',
  registered_events: {
    SOAR: true,
  },
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

const trimGroupNameToLowercase = (grp: string) => {
  return grp.split('_').join('').split(' ').join('').toLowerCase()
}

const generateRandomID = () => {
  return Math.random().toString(10).substring(2, 8)
}

const addLoginID = (obj: Group) => {
  let grpNameTitle = trimGroupNameToLowercase(obj.group_title)
  obj.members.forEach((e) => {
    e['loginid'] = grpNameTitle + generateRandomID()
  })
  return obj
}

const participants: ParticipantsData = objFromArray(
  [addLoginID(testOne), addLoginID(testTwo)],
  'group_title'
)

export default participants
