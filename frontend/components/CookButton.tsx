import { TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Sizes } from '@/constants/Add-button-sizes';

const TABBAR_HEIGHT = Sizes.TABBAR_HEIGHT;

const CookButton = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity
    style={{
      position: 'absolute',
      bottom: TABBAR_HEIGHT + 20,
      left: '50%',
      transform: [{ translateX: -75 }],
    }}
    onPress={onPress}
  >
    <View
      style={{
        backgroundColor: '#2C2C2E',
        width: 150,
        height: 55,
        borderRadius: 70,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <ThemedText style={{ color: 'white', fontSize: 16, paddingRight: 10, paddingBottom: 0 }}>Cook</ThemedText>
      <MaterialCommunityIcons name='bowl-mix' size={18} color="white" style={{ paddingBottom: 4 }}></MaterialCommunityIcons>
    </View>
  </TouchableOpacity>
);

export { CookButton };