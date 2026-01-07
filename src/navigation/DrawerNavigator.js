import { createDrawerNavigator } from "@react-navigation/drawer";
import SidebarDrawer from "../components/SidebarDrawer";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
//import ClientFormScreen from "../screens/ClientFormScreen";
import ClientsScreen from "../screens/ClientsScreen";
import CompaniesScreen from "../screens/CompaniesScreen";
import LogoutScreen from "../screens/LogoutScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProvidersScreen from "../screens/ProvidersScreen";
import UsersScreen from "../screens/UsersScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import ProtectedScreen from "./ProtectedScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNav() {
  return (
    <Drawer.Navigator drawerContent={(props) => <SidebarDrawer {...props} />}>
      <Drawer.Screen name="Inicio" component={WelcomeScreen} />
      <Drawer.Screen name="Clientes" component={ClientsScreen} />
      <Drawer.Screen name="Proveedores" component={ProvidersScreen} />
      <Drawer.Screen name="Empresas" component={CompaniesScreen} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Cambiar contraseña" component={ChangePasswordScreen} />
      <Drawer.Screen
        name="Usuarios"
        children={() => (
          <ProtectedScreen role="admin">
            <UsersScreen />
          </ProtectedScreen>
        )}
      />
{/*
      <Drawer.Screen name="ClientForm" component={ClientFormScreen} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="ProviderForm" component={ProviderFormScreen} options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="UserForm" component={UserFormScreen} options={{ drawerItemStyle: { display: "none" } }} />
*/}
      <Drawer.Screen name="Salirr" component={LogoutScreen} />
    </Drawer.Navigator>
  );
}
