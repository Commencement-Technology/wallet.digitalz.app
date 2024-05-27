import { Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSelector } from "react-redux";
import useOrientation from "@hooks/useOrientation";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { selectRegistersType, setEyeStatus } from "@store/commonSlice";
import { setModalInfo, setModalFilter } from "@store/modalsSlice";
import { RootState } from "@store";
import { useNavigation } from "@react-navigation/native";
import TotalCategory from "@components/common/TotalCategory";
import Button from "@components/common/Button";
import { Props } from "./types";
import { getFilledItemsCount, isObjectEmpty } from "@utils";

export default function AppDrawerHeader(props: Props) {
  const { landscape } = useOrientation();
  const { colorScheme } = useColorScheme();
  const dispatch = useAppDispatch();
  const common = useAppSelector((state: RootState) => state.commonState);
  const store = useAppSelector((state: RootState) => state.userState);
  const toggleEye = () => dispatch(setEyeStatus(!common.eyeStatus));
  const getRegisters = useSelector(selectRegistersType(String(props.category)));
  const isTypesTab = () =>
    ["expense", "entry", "investiment"].includes(String(props.category));
  const navigation: any = useNavigation();
  const iconConfig = {
    size: 25,
    color: colorScheme === "dark" ? "white" : "black",
  };

  if (props.type === "header") {
    return (
      <>
        {landscape && (
          <>
            {
              <TotalCategory
                onPress={() => dispatch(setModalInfo(props.category))}
                type={String(props.category)}
                twClass={`top-[15] right-[195] absolute bg-transparent h-12 pr-[70] border-r-2 border-gray-100 dark:border-zinc-700 ${
                  getRegisters.length > 1 && isTypesTab()
                    ? "right-[195]"
                    : "right-[75]"
                }`}
              />
            }
            {getRegisters.length > 1 && isTypesTab() && (
              <Button
                twClass="bg-transparent justify-end pr-[25] rounded-none border-r-2 border-gray-100 dark:border-zinc-700 top-[15] right-[75] absolute h-12"
                text="Filtro"
                label="Abrir modal de filtros"
                textColor="text-black dark:text-white"
                onPress={() => dispatch(setModalFilter(props.category))}
                icon={
                  <>
                    {isObjectEmpty(common.registerFilter) ? (
                      <MaterialIcons
                        name="filter-list"
                        size={30}
                        color={colorScheme === "dark" ? "white" : "black"}
                      />
                    ) : (
                      <Text className="scale-[1.2] text-xs bg-black dark:bg-white font-bold text-white dark:text-black px-2 py-1 rounded-full">
                        {getFilledItemsCount(common.registerFilter)}
                      </Text>
                    )}
                  </>
                }
              ></Button>
            )}
          </>
        )}
        <TouchableOpacity
          testID={props.testID}
          className="p-4 mr-4 rounded-full"
          onPress={toggleEye}
          accessibilityLabel={
            common.eyeStatus ? "Ocultar valores" : "Mostrar valores"
          }
        >
          <Ionicons
            name={common.eyeStatus ? "eye" : "eye-off"}
            {...iconConfig}
          />
        </TouchableOpacity>
      </>
    );
  }

  if (props.type === "back") {
    return (
      <TouchableOpacity
        testID={props.testID}
        className="p-4 mr-4 rounded-full"
        onPress={() =>
          store.isLogin ? navigation.goBack() : navigation.navigate("Login")
        }
        accessibilityLabel="Voltar página"
      >
        <MaterialIcons
          name={store.isLogin ? "close" : "lock"}
          {...iconConfig}
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      testID={props.testID}
      className="p-4 ml-4 rounded-full"
      onPress={props.onPress}
      accessibilityLabel="Abrir menu drawer de páginas"
    >
      <MaterialIcons name="menu" {...iconConfig} />
    </TouchableOpacity>
  );
}
