import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "../views/HomeScreen";
import ExpenseScreen from "../views/ExpenseScreen";
import EntryScreen from "../views/EntryScreen";
import InvestimentScreen from "../views/InvestimentScreen";
import { renderColorType } from "../utils";

const Tab = createBottomTabNavigator();

export const viewsTab = [
  {
    name: "Home",
    title: "Geral",
    tabBarLabel: "Início",
    tabBarIcon: () => <MaterialIcons name="home" size={28} color="black" />,
    component: HomeScreen,
  },
  {
    name: "Expense",
    title: "Despesa",
    tabBarLabel: "Despesa",
    tabBarIcon: () => (
      <MaterialCommunityIcons name="cash-remove" size={28} color="black" />
    ),
    component: ExpenseScreen,
  },
  {
    name: "Entry",
    title: "Entrada",
    tabBarLabel: "Entrada",
    tabBarIcon: () => (
      <MaterialCommunityIcons name="cash-check" size={28} color="black" />
    ),
    component: EntryScreen,
  },
  {
    name: "Investiment",
    title: "Investimento",
    tabBarLabel: "Investimento",
    tabBarIcon: () => (
      <MaterialIcons name="attach-money" size={28} color="black" />
    ),
    component: InvestimentScreen,
  },
];

export function HomeStack() {
  return (
    <Tab.Navigator initialRouteName="Home">
      {viewsTab.map(({ name, title, tabBarIcon, tabBarLabel, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarLabel,
            tabBarIcon,
            tabBarActiveTintColor: "#333",
            tabBarActiveBackgroundColor: "#eee",
            tabBarItemStyle: { padding: 10 },
            tabBarLabelStyle: {
              fontSize: 12,
              color: "#000",
            },
            tabBarStyle: { height: 75 },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: renderColorType(name.toLocaleLowerCase()),
              height: 35,
            },
            headerTitleStyle: {
              fontSize: 15,
              fontWeight: "bold",
            },
          }}
          component={component}
        />
      ))}
    </Tab.Navigator>
  );
}
