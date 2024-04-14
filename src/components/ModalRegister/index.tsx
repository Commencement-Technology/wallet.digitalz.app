import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import uuid from "react-native-uuid";
import { NumericFormat } from "react-number-format";

import { Props } from "./types";
import Button from "../Button";
import Select from "../Select";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store";
import {
  setModalRegister,
  setRegister,
  setEditRegister,
} from "../../store/commonSlice";

export default function ModalRegister(props: Props) {
  const dispatch = useAppDispatch();
  const common = useAppSelector((state: RootState) => state.commonState);

  const intitialForm = {
    name: "",
    type: "",
    value: "",
    date: new Date().toLocaleDateString(),
  };

  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [formModal, setFormModal] = useState(intitialForm);

  const handleChange = (value: string, name: string) => {
    setFormModal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShowDate(false);
    setDate(currentDate);
    handleChange(new Date(currentDate).toLocaleDateString(), "date");
  };

  const dataType = [
    { label: "Investimento", value: "investiment" },
    { label: "Entrada", value: "entry" },
    { label: "Despesa", value: "expense" },
    { label: "Veículo", value: "vehicle" },
  ];

  function saveStore() {
    const { name, value, date, type } = formModal;
    if (name && value && date && type) {
      if (common.modalRegister == "edit") {
        dispatch(
          setEditRegister({
            id: common.registerData.id,
            ...formModal,
          })
        );
      } else {
        const values = [
          {
            id: uuid.v4(),
            name,
            value,
            date,
            type,
          },
          ...common.registers,
        ];
        dispatch(setRegister(values));
      }

      dispatch(setModalRegister(""));

      // Toast.show({
      //   type: 'success',
      //   text1: 'Sucesso',
      //   text2: 'Novo registro criado 👋',
      //   props: { className: 'z-50' }
      // });
    } else {
      // Toast.show({
      //   type: 'error',
      //   text1: 'Atenção',
      //   text2: 'Você precisa preencher tudo 👋',
      //   props: { className: 'z-50' }
      // });
    }
  }

  useEffect(() => {
    if (common.modalRegister == "edit") {
      const [month, day, year] = common.registerData.date
        .split("/")
        .map(Number);
      setDate(new Date(year, month - 1, day));
      setFormModal({ ...common.registerData });
      setInputValue(common.registerData.value);
    } else {
      setFormModal(intitialForm);
      setDate(new Date());
      setInputValue("");
    }
  }, [common.modalRegister]);

  return (
    <>
      <Button
        text="Novo Registro"
        label="Botão para criar novo registro"
        backgroundColor="bg-green-600"
        textColor="text-white"
        className="rounded-none"
        onPress={() => dispatch(setModalRegister("register"))}
        icon={<MaterialIcons name="add-circle" size={22} color="white" />}
      />
      <Modal
        testID="modal-register"
        animationType="slide"
        transparent={true}
        visible={
          common.modalRegister == "register" || common.modalRegister == "edit"
        }
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          dispatch(setModalRegister(""));
        }}
      >
        <SafeAreaView className="bg-black/70 min-h-screen">
          <KeyboardAvoidingView
            behavior="padding"
            className="flex justify-center translate-y-[-30px]"
          >
            <View className="bg-white p-4 rounded-lg m-10">
              <Text className="text-black text-center mb-2 border-b-2 pb-2 border-slate-300">
                {common.modalRegister == "edit"
                  ? "Editar Registro"
                  : "Criar Novo Registro"}
              </Text>
              <Text className="text-black mb-2">Tipo</Text>
              <Select
                data={dataType}
                maxHeight={300}
                placeholder="Selecione o tipo"
                value={formModal.type}
                handleChangeObject="type"
                onChange={handleChange}
              />
              {showDate && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  onChange={onChange}
                />
              )}
              <Text className="text-black mb-2">Data</Text>
              <Pressable
                onPress={() => setShowDate(true)}
                className="flex flex-row mb-4 p-1 px-2 bg-white rounded-lg border-2 border-slate-400"
              >
                <MaterialIcons name="calendar-month" size={22} color="black" />
                <TextInput
                  className="ml-2 text-black"
                  placeholder="Data do registro"
                  onChangeText={(value: string) => handleChange(value, "date")}
                  value={formModal.date}
                  editable={false}
                />
              </Pressable>
              <Text className="text-black mb-2">Nome</Text>
              <TextInput
                className="mb-4 p-1 px-2 bg-white rounded-lg border-2 border-slate-400"
                placeholder="Nome do registro"
                onChangeText={(value: string) => handleChange(value, "name")}
                value={formModal.name}
              />
              <Text className="text-black mb-2">Valor</Text>
              <NumericFormat
                value={inputValue}
                displayType={"text"}
                thousandSeparator={"."}
                decimalSeparator={","}
                decimalScale={2}
                prefix={"R$ "}
                onValueChange={(values) => handleChange(values.value, "value")}
                renderText={(value) => {
                  return (
                    <TextInput
                      className="mb-4 p-1 px-2 bg-white rounded-lg border-2 border-slate-400"
                      placeholder="Valor do registro"
                      onChangeText={(value: string) => setInputValue(value)}
                      value={value}
                      keyboardType="phone-pad"
                    />
                  );
                }}
              />
              <View className="flex flex-row">
                <Button
                  text="Cancelar"
                  label="Botão para cancelar e fechar o modal do registro"
                  backgroundColor="bg-gray-600"
                  className="flex-1 mr-1"
                  textColor="text-white"
                  onPress={() => dispatch(setModalRegister(""))}
                  icon={<MaterialIcons name="cancel" size={22} color="white" />}
                />
                <Button
                  text={common.modalRegister == "edit" ? "Salvar" : "Criar"}
                  label={`Botão para ${common.modalRegister == "edit" ? "Salvar" : "Criar"} o registro`}
                  backgroundColor="bg-green-600"
                  className="flex-1 mr-1"
                  textColor="text-white"
                  onPress={() => saveStore()}
                  icon={<MaterialIcons name="save" size={22} color="white" />}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}
