import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import MessagesScreen from './screens/MessagesScreen';
import ChatScreen from './screens/ChatScreen';
import TasksScreen from './screens/TasksScreen';
import SettingsScreen from './screens/SettingsScreen';
import QuickStatsScreen from './screens/QuickStatsScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import PasswordScreen from './screens/PasswordScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import HelpScreen from './screens/HelpScreen';
import NewTaskScreen from './screens/NewTaskScreen';
import UserTaskScreen from './screens/UserTaskScreen';
import UserStatsScreen from './screens/UserStatsScreen';
import { ThemeProvider } from './ThemeContext';
import StaffDirectoryScreen from './screens/StaffDirectoryScreen';

// Components
import CustomDrawerContent from './components/CustomDrawerContent';
import WidgetPanel from './components/WidgetPanel';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator({ onLogout, tasks, setTasks }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} onLogout={onLogout} />}
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#1f1f1f' },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#1f1f1f',
          width: 250,
        },
        drawerInactiveTintColor: '#ccc',
        drawerActiveTintColor: '#FF4DB8',
        drawerLabelStyle: {
          marginLeft: 0,
          fontSize: 16,
          marginRight: -10,
        },
        drawerItemStyle: {
          marginVertical: 5,
        },
        drawerIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'home-outline';
              break;
            case 'Messages':
              iconName = 'chatbubble-outline';
              break;
            case 'Tasks':
              iconName = 'checkbox-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
            case 'Staff Directory':
              iconName = 'people-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} style={{ marginRight: -10 }} />;
        },
      })}
    >
      <Drawer.Screen name="Dashboard" component={HomeScreen} />
      <Drawer.Screen name="Messages" component={MessagesScreen} />
      <Drawer.Screen name="Tasks">
        {(props) => <TasksScreen {...props} tasks={tasks} setTasks={setTasks} />}
      </Drawer.Screen>
      <Drawer.Screen name="Staff Directory" component={StaffDirectoryScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}


export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {showSplash ? (
            <Stack.Screen name="Splash" options={{ headerShown: false }}>
              {() => <SplashScreen onFinish={() => setShowSplash(false)} />}
            </Stack.Screen>
          ) : !isLoggedIn ? (
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {() => <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="Main" options={{ headerShown: false }}>
                {() => <DrawerNavigator onLogout={() => setIsLoggedIn(false)} tasks={tasks} setTasks={setTasks} />}
              </Stack.Screen>

              {/* Screens outside Drawer */}
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Password" component={PasswordScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen name="Help" component={HelpScreen} />
              <Stack.Screen name="QuickStats" component={QuickStatsScreen} />
              <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
              <Stack.Screen name="Widgets" component={WidgetPanel} />
              <Stack.Screen name="UserStatsScreen" component={UserStatsScreen} />
              <Stack.Screen name="NewTask">
                {(props) => <NewTaskScreen {...props} tasks={tasks} setTasks={setTasks} />}
              </Stack.Screen>
              <Stack.Screen name="UserTasks">
                {(props) => <UserTaskScreen {...props} tasks={tasks} />}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
