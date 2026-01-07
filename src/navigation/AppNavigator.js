import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import ClientFormScreen from "../screens/ClientFormScreen";
import CompanyFormScreen from "../screens/CompanyFormScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DrawerNav from "./DrawerNavigator";

const Stack = createNativeStackNavigator();

function AppNav() {
  const { access, loading } = React.useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {access ? (
          <>
          <Stack.Screen
            name="Home"
            component={DrawerNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ClientForm" 
          component={ClientFormScreen} 
          />
          <Stack.Screen 
            name="CompanyForm" 
          component={CompanyFormScreen} 
          />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function Navigation() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}
