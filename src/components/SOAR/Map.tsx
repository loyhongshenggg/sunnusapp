import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import MapPoint from '@/components/SOAR/MapPoint'

import { map as styles } from '@/styles/fresh'
import { MapProps } from '@/types/SOAR'
import { Text } from 'react-native'
import { customMapStyle } from './MapStyle'
import { NUSCoordinates } from '@/data/constants'

const Map = ({
  navigation,
  displayLocations,
  mapRef,
  startStatus,
}: MapProps) => {
  const gameLocations = displayLocations.filter(
    (stn) => stn.stationType === 'game'
  )
  const nonGameLocations = displayLocations.filter(
    (e: any) => e.stationType !== 'game'
  )

  const GameLocations = () => {
    return startStatus ? (
      <>
        {gameLocations.map((e: any, i: number) => (
          <MapPoint
            key={i}
            navigation={navigation}
            coordinate={e.coordinate}
            pointType={e.stationType}
            content={e.content}
            status={e.status}
          />
        ))}
      </>
    ) : null
  }

  const NonGameLocations = () => {
    return (
      <>
        {nonGameLocations.map((e: any, i: number) => (
          <MapPoint
            key={i}
            navigation={navigation}
            coordinate={e.coordinate}
            pointType={e.stationType}
            content={e.content}
          >
            <Text>{`${e.stationType}: ${e.title}`}</Text>
          </MapPoint>
        ))}
      </>
    )
  }

  return mapRef ? (
    <MapView
      ref={mapRef}
      style={styles.overlap}
      provider={PROVIDER_GOOGLE}
      initialCamera={NUSCoordinates}
      customMapStyle={customMapStyle}
      showsUserLocation={true}
    >
      <GameLocations />
      <NonGameLocations />
    </MapView>
  ) : null
}

export default Map
