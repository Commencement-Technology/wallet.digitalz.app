import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Home() {
  const intitialForm = {
    name: "",
    type: "",
    value: "",
    date: new Date().toLocaleDateString(),
  };
  const [result, setResult] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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

  async function save(key: string, value: any) {
    await SecureStore.setItemAsync(key, value);
  }

  async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      setResult(JSON.parse(result));
      console.log("🔐 Here's your value 🔐 \n" + result);
    } else {
      console.log("No values stored under that key.");
    }
  }

  function saveStore() {
    const { name, value, date, type } = formModal;
    if (name && value && date && type) {
      const values = JSON.stringify([
        {
          id: uuid.v4(),
          name,
          value,
          date,
          type,
        },
        ...result,
      ]);
      save("wallet", values);
      getValueFor("wallet");
      setModalVisible(false);
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

  function remove(target: string) {
    const filter = result.filter(({ id }) => id !== target);
    save("wallet", JSON.stringify(filter));
    getValueFor("wallet");
  }

  useEffect(() => {
    getValueFor("wallet");
  }, []);

  useEffect(() => {
    setFormModal(intitialForm);
    setDate(new Date());
  }, [modalVisible]);

  return (
    <View testID="home-screen" className="p-5">
      <TouchableOpacity
        className="flex justify-center items-center flex-row bg-green-600 rounded-lg p-2 text-center"
        onPress={() => setModalVisible(true)}
      >
        <>
          <MaterialIcons name="add-circle" size={22} color="white" />
          <Text className="ml-2 text-center text-white">Novo Registro</Text>
        </>
      </TouchableOpacity>

      {result.map((item: any) => (
        <View
          key={item.id}
          className="border-l-4 text-black mt-5 bg-white p-4 rounded-lg shadow-lg"
        >
          <TouchableOpacity
            className="scale-75 z-20 absolute top-0 right-0 m-2 flex justify-center items-center w-10 bg-gray-200 rounded-full p-2 text-center"
            onPress={() => remove(item.id)}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color="red"
            />
          </TouchableOpacity>
          <Text className="text-black">Tipo: {item.type}</Text>
          <Text className="text-black">Nome: {item.name}</Text>
          <Text className="text-black">Valor: {item.value}</Text>
          <View className="flex flex-row items-center">
            <MaterialIcons name="calendar-month" size={22} color="black" />
            <Text className="ml-2 text-black">
              Data: {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View className="bg-white p-4 rounded-lg border-2 border-slate-400 m-10">
          <TouchableOpacity
            className="scale-75 z-20 absolute top-0 right-0 m-2 flex justify-center items-center w-10 bg-red-600 rounded-full p-2 text-center"
            onPress={() => setModalVisible(!modalVisible)}
          >
            <MaterialIcons name="close" size={22} color="white" />
          </TouchableOpacity>
          <Text className="text-black text-center mb-5 border-b-2 pb-4 border-slate-300">
            Criar Novo Registro
          </Text>
          <Text className="text-black mb-2">Tipo</Text>
          <Dropdown
            style={{
              marginBottom: 20,
              paddingHorizontal: 10,
              borderRadius: 8,
              borderColor: "#94a3b8",
              borderWidth: 2,
            }}
            containerStyle={{
              paddingVertical: 2.5,
              borderRadius: 8,
              borderColor: "#94a3b8",
              borderWidth: 2,
              backgroundColor: "#fff",
            }}
            itemContainerStyle={{
              borderRadius: 6,
              marginHorizontal: 5,
              marginVertical: 2.5,
              backgroundColor: "#eee",
              padding: 0,
              height: 45,
            }}
            itemTextStyle={{
              height: 20,
              margin: 0,
              padding: 0,
              position: "relative",
              top: -5,
            }}
            activeColor="#dcfce7"
            data={dataType}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Selecione o tipo"
            value={formModal.type}
            onChange={({ value }) => handleChange(value, "type")}
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
          <TextInput
            className="mb-4 p-1 px-2 bg-white rounded-lg border-2 border-slate-400"
            placeholder="Valor do registro"
            onChangeText={(value: string) => handleChange(value, "value")}
            value={formModal.value}
          />
          <View className="flex flex-row">
            <TouchableOpacity
              className="flex flex-1 justify-center items-center flex-row bg-gray-600 rounded-lg p-2 text-center mr-1"
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <>
                <MaterialCommunityIcons name="cancel" size={22} color="white" />
                <Text className="ml-2 text-center text-white">Cancelar</Text>
              </>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex flex-1 justify-center items-center flex-row bg-green-600 rounded-lg p-2 text-center ml-1"
              onPress={() => saveStore()}
            >
              <>
                <MaterialIcons name="save" size={22} color="white" />
                <Text className="ml-2 text-center text-white">Salvar</Text>
              </>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
