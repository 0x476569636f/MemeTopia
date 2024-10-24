import { View, Alert, Pressable } from 'react-native';
import React from 'react';
import { useAuth } from '~/context/auth';
import { supabase } from '~/lib/supabase';
import { Button } from '~/components/nativewindui/Button';
import ScreenWrapper from '~/components/ScreenWrapperWithNavbar';
import { Text } from '~/components/nativewindui/Text';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from '~/lib/useColorScheme';
import { useRouter } from 'expo-router';

const Home = () => {
  const { user, setAuth }: any = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const router = useRouter();

  const logout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScreenWrapper routeName="Home">
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text>Home</Text>
          {user && (
            <Text>
              Welcome, Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores quidem
              voluptate et nesciunt natus iste non laborum amet animi nihil porro fugiat sunt
              itaque, ea quibusdam distinctio qui aspernatur nemo? Lorem ipsum dolor sit amet
              consectetur, adipisicing elit. Totam maxime quas mollitia animi quos adipisci amet
              quasi et, laboriosam saepe facere voluptatibus, dolorum aspernatur, eligendi
              voluptatum quidem exercitationem. Eaque, quaerat. Delectus atque odio laborum,
              dignissimos soluta maiores inventore ut, quia ipsa rerum alias cumque necessitatibus
              nam voluptate dolores dolore commodi animi quod quos adipisci consequatur obcaecati
              fuga repellat mollitia. Voluptatibus. A ipsa hic dolores nostrum, blanditiis tempore
              vel atque doloremque labore expedita libero repudiandae soluta cupiditate repellendus
              quasi quisquam magni maxime. Error eaque commodi doloribus aliquam eligendi suscipit
              omnis accusamus? Ut reprehenderit iste voluptate praesentium pariatur? Optio possimus
              voluptates voluptate tempora quis aut veritatis inventore repellat soluta provident,
              tenetur id dolores sapiente expedita sit ipsa incidunt debitis est voluptatibus
              pariatur. Voluptas accusamus esse, eius necessitatibus atque maxime quae. Praesentium
              ex adipisci officia, id, maiores facere perferendis reiciendis doloribus obcaecati
              nisi, fuga vitae consectetur impedit at ratione esse. Culpa, maiores aliquid. Alias
              vitae numquam deleniti est rem reprehenderit maxime quae perspiciatis. Ad eligendi
              asperiores maiores incidunt deserunt exercitationem aliquam nostrum, nesciunt quas qui
              voluptas cupiditate adipisci voluptatibus fugit omnis similique eius? Obcaecati eaque
              architecto assumenda et dolore modi possimus facere tempora totam nam quibusdam
              blanditiis repellendus tempore, soluta quidem velit suscipit eveniet, eos quis laborum
              repellat quae. Voluptas eius quam ut. Rerum ipsa autem, officiis, dicta illum iusto
              repellat praesentium totam eius aspernatur ullam in temporibus suscipit! Eos fugit
              quod delectus obcaecati quae ullam a saepe beatae, eligendi, quis, sit minima! Nisi
              corporis repellat blanditiis quia, incidunt nam nobis placeat. Laudantium,
              consequuntur? Facere, magnam culpa cupiditate omnis ea distinctio. Illum dolorem
              aspernatur accusantium maiores. Earum, id? Repellendus sint pariatur odio dolores.
              Vitae recusandae aspernatur ipsum, officiis veniam iure aut odio commodi corporis
              alias omnis ullam quam rem cumque mollitia pariatur. Ullam magnam delectus voluptate
              minus facere veniam voluptatum voluptates vero quisquam!
            </Text>
          )}
          <Button onPress={logout}>
            <Text>Logout</Text>
          </Button>
        </ScrollView>
        <Pressable
          onPress={() => router.push('/new-post')}
          style={{
            position: 'absolute',
            bottom: 10,
            right: 18,
            backgroundColor: isDarkColorScheme ? 'rgb(0, 123, 254)' : '#FFFFFF',
            borderRadius: 50,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          }}>
          <FontAwesome6 name="add" size={24} color={isDarkColorScheme ? '#FFFFFF' : '#000000'} />
        </Pressable>
      </View>
    </ScreenWrapper>
  );
};

export default Home;
