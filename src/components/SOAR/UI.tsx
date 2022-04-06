import { map as styles } from '@/styles/fresh'
import { NoTouchDiv, Overlap } from '@/components/Views'
import { Ionicons as IC, MaterialIcons as MI } from '@expo/vector-icons'
import {
  MapBottomButton,
  MapNavigationButton,
  MapSOSButton,
  MapAdminToggle,
} from '@/components/SOAR'
import { MapCurretLocationButton } from './MapButtons'
import { Text } from 'react-native'

import SOAR from '@/lib/SOAR'
import { QRCommands as q } from '@/lib/SOAR/QRCommands'
import writeSchema from '../../data/writeSchema'

const UI = ({
  navigation,
  filtered,
  toggleAdminStations,
  handleSOS,
  openQRScanner,
  flyToCurrentLocation,
  Timer,
}: any) => {
  const TopUI = () => {
    return (
      <NoTouchDiv style={styles.mapTopContainer}>
        <Overlap style={styles.mapRightContainer}>
          <MapAdminToggle
            onPress={toggleAdminStations}
            activated={filtered.water}
          />
        </Overlap>
        <Overlap>
          <NoTouchDiv style={styles.timerContainer}>
            <Timer />
          </NoTouchDiv>
        </Overlap>
        <Overlap>
          <NoTouchDiv style={styles.navigationContainer}>
            <MapNavigationButton
              icon={[IC, 'arrow-back']}
              onPress={() => navigation.navigate('HomeScreen')}
            />
          </NoTouchDiv>
        </Overlap>
      </NoTouchDiv>
    )
  }

  const Debug = () => {
    return (
      <>
        <MapSOSButton onPress={writeSchema} />
        <MapSOSButton onPress={() => SOAR.start("Dev_loper", q.start)} />
        <MapSOSButton onPress={() => SOAR.pause('Dev_loper', q.pause)} />
        <MapSOSButton onPress={() => SOAR.resume('Dev_loper', q.resume)} />
        <MapSOSButton onPress={() => SOAR.stopFinal('Dev_loper', q.stopFinal)} />
      </>
    )
  }

  const BottomUI = () => {
    return (
      <NoTouchDiv style={styles.mapBottomContainer}>
        <NoTouchDiv style={styles.mapLeftContainer}>
          <NoTouchDiv style={styles.flex1} />
          <MapSOSButton onPress={handleSOS} />
        </NoTouchDiv>
        <NoTouchDiv style={styles.mapRightContainer}>
          {/* <Debug /> */}
          <MapCurretLocationButton onPress={flyToCurrentLocation} />
          <MapBottomButton icon={[MI, 'qr-code']} onPress={openQRScanner} />
        </NoTouchDiv>
      </NoTouchDiv>
    )
  }

  return (
    <Overlap>
      <NoTouchDiv style={styles.mapUIContainer}>
        <TopUI />
        <BottomUI />
      </NoTouchDiv>
    </Overlap>
  )
}

export default UI
