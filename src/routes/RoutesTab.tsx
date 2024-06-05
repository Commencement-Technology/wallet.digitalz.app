import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useAppSelector } from "@store/hooks";
import { RootState } from "@store";
import TabBar from "@components/navigation/TabBar";
import utils from "@utils";
import Page from "@pages";
import { useBalance } from "@hooks/useBalance"

const Tab = createBottomTabNavigator();

export function RoutesTab() {
  const { colorScheme } = useColorScheme();
  const { getQuantity } = useBalance();
  const common = useAppSelector((state: RootState) => state.commonState);
  const getCountRegisters = (type: string) => {
    return getQuantity(type);
  };

  function configRegisterScreen(name: string, title: string, icon: any) {
    return {
      name,
      title,
      tabBarLabel: title,
      tabBarIcon: icon,
      tabBarBadge: getCountRegisters(name.toLowerCase()),
      children: <Page.Register type={name.toLocaleLowerCase()} />,
    };
  }

  const viewsTab = [
    {
      name: "Home",
      title: "Geral",
      tabBarLabel: "Início",
      tabBarIcon: (props: any) => (
        <MaterialIcons name="home" size={props.size} color={props.color} />
      ),
      children: <Page.Home />,
    },
    configRegisterScreen("Expense", "Despesa", (props: any) => (
      <MaterialCommunityIcons
        name="cash-remove"
        size={props.size}
        color={props.color}
      />
    )),
    configRegisterScreen("Entry", "Entrada", (props: any) => (
      <MaterialCommunityIcons
        name="cash-plus"
        size={props.size}
        color={props.color}
      />
    )),
    configRegisterScreen("Investment", "Investimento", (props: any) => (
      <MaterialIcons name="trending-up" size={props.size} color={props.color} />
    )),
  ];

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar {...props} />}
    >
      {viewsTab.map((item: any) => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          options={{
            tabBarLabel: item.tabBarLabel,
            tabBarIcon: item.tabBarIcon,
            tabBarBadge: item.tabBarBadge,
            headerShown: item.headerShown,
            headerStyle: {
              backgroundColor: utils.renderColorType(
                item.name.toLocaleLowerCase(),
                colorScheme
              ),
              height: 5,
              elevation: 0,
              shadowOpacity: 0,
              borderWidth: 0,
            },
            headerTitleStyle: {
              fontSize: 0,
              display: "none",
            },
          }}
        >
          {() => item.children}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}
