import { Image, TouchableOpacity, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={{ flex: 1 }}>
      <View
        style={{
          position: 'absolute',
          top: '7%',
          width: '100%',
          zIndex: 100,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
      }}>
        {/* Hello, username! (?) */}
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 20,
          }}
        >
        </ThemedText>

        <TouchableOpacity
          onPress={() => {
            {/* TODO: Create profile page/setting/preferences */}
            console.log('Profile Pic clicked');
          }}
          style={{
            marginRight: 20,
          }}
        >
          <View
            style={{
              padding: 3, 
              borderWidth: 2,
              borderColor: colorScheme === 'light' ? '#222' : '#fff',
              borderRadius: 25, 
            }}
          > 
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={{ width: 25, height: 25, borderRadius: 20 }}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: '30%',
          marginLeft: 20,
          flexDirection: 'column',


        }}
      >
        <ThemedText style={{
          fontSize: 40,
          fontWeight: 'bold',
          textAlign: 'left',
          paddingTop: 20,
        }}>
          My Fridge
        </ThemedText>
        
        {/* TODO: Ingredients list */}

      </View>


      {/* TODO: Get recipes button */}

    </ThemedView>
  );
}
