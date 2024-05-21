import { FlatList, View } from "react-native";
import FadeView from "../FadeView";
import ItemList from "./Item";
import TotalCategory from "../TotalCategory";
import EmptyRegisters from "./Empty";
import useOrientation from "../../hooks/useOrientation";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store";
import { setEditRegister, setRegisterData } from "../../store/commonSlice";
import {
  setModalRegister,
  setModalDelete,
  setModalInfo,
} from "../../store/modalsSlice";
import { Props } from "./types";

export default function ListRegisters(props: Props) {
  const { orientation, landscape, portrait } = useOrientation();
  const dispatch = useAppDispatch();
  const common = useAppSelector((state: RootState) => state.commonState);

  function edit(target: any) {
    dispatch(setModalRegister("edit"));
    dispatch(setRegisterData({ ...target }));
  }

  function remove(target: string) {
    dispatch(setModalDelete(target));
  }

  function handlePay(item: any) {
    const updatedItem = { ...item, pay: true }; // Marcando o item como pago
    dispatch(setEditRegister(updatedItem)); // Enviando o item modificado para a store
  }

  const filteredData = common.registers.filter(
    (item: any) => item.type == props.type
  );
  const isOdd = filteredData.length % 2 !== 0;

  return (
    <FadeView testID="list-register">
      {common.registers.filter((item: any) => item.type == props.type)
        .length ? (
        <FlatList
          data={common.registers.filter((item: any) => item.type == props.type)}
          numColumns={orientation === 1 || orientation === 2 ? 1 : 2}
          renderItem={({ item, index }: any) => {
            const isLastItem = isOdd && index === filteredData.length - 1;
            return (
              <View
                className={[
                  "flex",
                  landscape ? "w-1/2" : "w-full",
                  landscape && isLastItem ? "w-1/2" : "",
                ].join(" ")}
              >
                <ItemList
                  key={item.id}
                  item={item}
                  eyeStatus={common.eyeStatus}
                  edit={() => edit(item)}
                  remove={() => remove(item.id)}
                  handlePay={() => handlePay(item)}
                />
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
          key={orientation}
          contentContainerStyle={{
            paddingBottom: landscape ? 100 : 40,
          }}
          columnWrapperStyle={
            orientation !== 1 && orientation !== 2
              ? {
                  flex: 1,
                  flexWrap: "wrap",
                  paddingLeft: 15,
                  paddingRight: 15,
                }
              : null
          }
          ListHeaderComponent={() =>
            portrait && (
              <TotalCategory
                type={props.type}
                onPress={() => dispatch(setModalInfo(props.type))}
              />
            )
          }
          stickyHeaderIndices={[0]}
        />
      ) : (
        <EmptyRegisters />
      )}
    </FadeView>
  );
}
