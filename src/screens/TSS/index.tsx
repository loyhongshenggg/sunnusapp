import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { httpsCallable } from 'firebase/functions'

/* navigation */
// import { TSSPage } from '@/types/navigation'
// import { useNavigation } from '@react-navigation/native'

/* sunnus components */
import { TSS as styles } from '@/styles/fresh'

// DELETE AFTER USE
import PickerProvider from '@/components/TSS/PickerProvider'
import { Field, FieldStates, Round, Sport, Winner } from '@/types/TSS'
import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { auth, functions } from '@/sunnus/firebase'
import { matchNumbers, sportList, roundList } from '@/data/constants'
import Picker, { Item } from 'react-native-picker-select'
import { getItems, replaceUnderscoresWithSpaces } from '@/lib/utils'
import CustomPicker from '@/components/TSS/CustomPicker'
import { LastContext } from '@/contexts/LastContext'
import { OnPress } from '@/types/index'
import colors from '@/styles/colors'

const FinalButton = ({
  onPress,
  containerStyle,
  textStyle,
  text,
}: {
  onPress: OnPress
  containerStyle: StyleProp<ViewStyle>
  textStyle: StyleProp<TextStyle>
  text: string
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.baseButton, containerStyle]}
    >
      <View style={styles.buttonTextContainer}>
        <Text style={[styles.buttonBaseText, textStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}

const TSSScreen = () => {
  // const navigation = useNavigation<TSSPage<'TSSScreen'>>()
  const fields: Field[] = ['sport', 'round', 'matchNumber']
  const { roundData, sport, setSport } = useContext(LastContext)
  const roundState = useState<Round>('round_of_32')
  const matchNumberState = useState(0)
  const round = roundState[0]
  const matchNumber = matchNumberState[0]

  /* requirements for picker handling */
  const states: FieldStates = {
    sport: [sport, setSport],
    matchNumber: matchNumberState,
    round: roundState,
  }
  const display: FieldStates = {
    sport: useState<Sport>(sport),
    matchNumber: useState(0),
    round: useState<Round>('round_of_32'),
  }
  const refs: Record<Field, MutableRefObject<Picker | null>> = {
    sport: useRef<Picker>(null),
    round: useRef<Picker>(null),
    matchNumber: useRef<Picker>(null),
  }

  /* when the match number changes, refresh the team names */
  useEffect(() => {
    // clear scores
    scoreRefA.current?.clear()
    scoreRefB.current?.clear()
  }, [matchNumber])

  /* when the round changes, reset the match number to zero */
  useEffect(() => {
    items.matchNumber[1](getItems(matchNumbers[round]))
    states.matchNumber[1](0)
    display.matchNumber[1](0)

    // clear scores
    scoreRefA.current?.clear()
    scoreRefB.current?.clear()
  }, [round])

  const handleConfirm = () => {
    setGonnaSend(false)
    const email = auth.currentUser ? auth.currentUser.email : 'noreply-mail.com'
    const outcome: Winner =
      scoreA === scoreB ? 'U' : scoreA > scoreB ? 'A' : 'B'
    const request = {
      series: 'TSS',
      sport: states.sport[0],
      round: states.round[0],
      matchNumber: states.matchNumber[0],
      A: roundData[round][matchNumber].A,
      B: roundData[round][matchNumber].B,
      winner: outcome,
      scoreA,
      scoreB,
      facilitatorEmail: email,
    }
    /* if the scores are untouched, send a toast */
    if (scoreA === -1 || scoreB === -1) {
      console.log('please key in both scores')
      return
    }
    // TODO add confirmation modal
    const firebaseHandleMatch = httpsCallable(functions, 'handleMatch')
    firebaseHandleMatch(request)
    // TODO: add successful response notice
  }

  const items = {
    sport: useState<Item[]>([]),
    round: useState<Item[]>([]),
    matchNumber: useState<Item[]>([]),
  }

  // initialize default items (don't let this depend on roundData)
  useEffect(() => {
    items.sport[1](getItems(sportList))
    items.round[1](getItems(roundList))
    items.matchNumber[1](getItems(matchNumbers[round]))
  }, [])

  const [scoreA, setScoreA] = useState(-1)
  const [scoreB, setScoreB] = useState(-1)
  const scoreRefA = useRef<TextInput>(null)
  const scoreRefB = useRef<TextInput>(null)

  const teamNameA = replaceUnderscoresWithSpaces(
    roundData[round][matchNumber].A
  )
  const teamNameB = replaceUnderscoresWithSpaces(
    roundData[round][matchNumber].B
  )

  /* to sync up value of sport/tempSport with match handler page */
  useEffect(() => {
    display.sport[1](sport)
  }, [sport])

  /* confirmation handling */
  const [gonnaSend, setGonnaSend] = useState(false)

  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <Text style={styles.titleText}>TSS Match Update Tool</Text>

      <View style={styles.numberInputContainer}>
        <View style={styles.numberInputTeamContainer}>
          <View style={styles.numberInputTeamNameContainer}>
            <Text numberOfLines={2} style={styles.numberInputTeamName}>
              {teamNameA}
            </Text>
          </View>
          <TextInput
            ref={scoreRefA}
            onChangeText={(text) => setScoreA(parseInt(text))}
            placeholder="_"
            placeholderTextColor={colors.gray[300]}
            style={styles.numberInput}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>
        <View style={styles.numberInputSpacer} />
        <View style={styles.numberInputTeamContainer}>
          <View style={styles.numberInputTeamNameContainer}>
            <Text numberOfLines={2} style={styles.numberInputTeamName}>
              {teamNameB}
            </Text>
          </View>
          <TextInput
            ref={scoreRefB}
            onChangeText={(text) => setScoreB(parseInt(text))}
            placeholder="_"
            placeholderTextColor={colors.gray[300]}
            style={styles.numberInput}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        </View>
      </View>
      {fields.map((field, idx) => {
        return (
          <PickerProvider
            _ref={refs[field]}
            setState={states[field][1]}
            display={display[field]}
            items={items[field][0]}
            key={idx}
          />
        )
      })}
      {fields.map((field, idx) => (
        <CustomPicker
          pickerRef={refs[field]}
          display={display[field][0]}
          key={idx}
        />
      ))}

      <View style={styles.bottomAreaButtonContainer}>
        {gonnaSend ? (
          <>
          <FinalButton
            onPress={() => setGonnaSend(false)}
            containerStyle={styles.backButton}
            textStyle={styles.backText}
            text="Back"
          />
            <View style={{width: 10}}/>
          <FinalButton
            onPress={handleConfirm}
            containerStyle={styles.confirmButton}
            textStyle={styles.confirmText}
            text="Confirm"
          />
            </>
        ) : (
          <FinalButton
            onPress={() => setGonnaSend(true)}
            containerStyle={styles.pushButton}
            textStyle={styles.pushText}
            text="Push"
          />
        )}
      </View>
    </ScrollView>
  )
}

export default TSSScreen
