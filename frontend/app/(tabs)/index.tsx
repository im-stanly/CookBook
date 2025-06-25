import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import IngredientList, { } from '@/components/IngredientList';
import { Sizes } from '@/constants/Add-button-sizes';
import { useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useIngredients } from '@/contexts/IngredientsContext';
import { router } from 'expo-router';
import { CookButton } from '@/components/CookButton';

const TOP_MARGIN = Platform.OS === 'ios' ? '7%' : '5%';
const TABBAR_HEIGHT = Sizes.TABBAR_HEIGHT;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { onLogout } = useAuth();
  const { ingredientsState, setIngredientsState } = useIngredients();

  const handleClearAll = () => {
    setIngredientsState!({ ingredientList: [] });
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View
        style={{
          position: 'absolute',
          top: TOP_MARGIN,
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
            {/* TODO: Create profile page/setting/preferences */ }
            console.log('Profile Pic clicked');
            onLogout!();
          }}
          style={{
            marginRight: 15,
            marginTop: 10,
          }}
        >
          <View
            style={{
              // padding: 3,
              // borderWidth: 2,
              // borderColor: colorScheme === 'light' ? '#222' : '#fff',
              // backgroundColor: colorScheme === 'light' ? '#222' : '#222',
              // borderRadius: 10,
            }}
          >
            {/* <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={{ width: 25, height: 25, borderRadius: 20 }}
            /> */}
            <MaterialCommunityIcons
              name="account-circle"
              size={35}
              color={colorScheme === 'light' ? '#222' : '#fff'}/>
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: '30%',
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 300,
          flex: 1,
          flexDirection: 'column',
          overflow: 'visible',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 30,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            minHeight: 80,
            overflow: 'visible',
          }}
        >
          <ThemedText
            style={{
              fontSize: 40,
              fontWeight: 'bold',
              textAlign: 'left',
              paddingTop: 20,
              overflow: 'visible',
              lineHeight: 48,
            }}
          >
            My Fridge
          </ThemedText>

          <TouchableOpacity onPress={handleClearAll}>
            <ThemedText
              style={{
                fontSize: 20,
                paddingTop: 20,
              }}
            >
              clear all
            </ThemedText>
          </TouchableOpacity>
        </View>

        <IngredientList />
      </View>

      <CookButton
        onPress={() => router.push('/recipes')}
      />
    </ThemedView>
  );
}
