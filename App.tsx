import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import FilesScreen from './src/screens/FilesScreen';
import ModelsScreen from './src/screens/ModelsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              let iconName: string;

              switch (route.name) {
                case 'Home':
                  iconName = 'home';
                  break;
                case 'Settings':
                  iconName = 'settings';
                  break;
                case 'Files':
                  iconName = 'folder';
                  break;
                case 'Models':
                  iconName = 'memory';
                  break;
                default:
                  iconName = 'help';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerShown: true,
          })}>
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'TCLDCAM' }}
          />
          <Tab.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: '設定' }}
          />
          <Tab.Screen 
            name="Files" 
            component={FilesScreen}
            options={{ title: '檔案' }}
          />
          <Tab.Screen 
            name="Models" 
            component={ModelsScreen}
            options={{ title: '模型' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;