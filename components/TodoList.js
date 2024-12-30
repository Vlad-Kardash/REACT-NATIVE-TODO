import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Modal,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const TaskApp = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [tasks, setTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const saveTask = async () => {
    if (title && description && location) {
      const task = {
        id: new Date().getTime().toString(),
        title: title,
        description: description,
        location: location,
        date: date,
        location: location,
        status: "В процессе",
      };

      try {
        const existingTasks = await AsyncStorage.getItem("tasks");
        let newTasks = [];
        if (existingTasks) {
          newTasks = JSON.parse(existingTasks);
        }
        newTasks.push(task);
        await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
        setTitle("");
        setDescription("");
        setDate(new Date());
        setLocation("");
        setModalVisible(false);
        loadTasks();
        Alert.alert("Успешно", "Задача сохранена");
      } catch (e) {
        console.error("Error saving task: ", e);
      }
    } else {
      setErrorMessage("Пожалуйста, заполните все поля");
    }
  };

  const loadTasks = async () => {
    try {
      const existingTasks = await AsyncStorage.getItem("tasks");
      if (existingTasks) {
        setTasks(JSON.parse(existingTasks));
      }
    } catch (e) {
      console.error("Error loading tasks: ", e);
    }
  };

  const filterTasks = (status) => {
    if (status === "Все") {
      setSortedTasks(tasks);
    } else {
      const filteredTasks = tasks.filter((task) => task.status === status);
      setSortedTasks(filteredTasks);
    }
  };

  const markAsCompleted = async (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        task.status = "Завершено";
      }
      return task;
    });
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks); // обновляем состояние задач
    loadTasks(); // загружаем задачи заново для обновления компонента
  };

  const markAsCancel = async (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        task.status = "Отменено";
      }
      return task;
    });
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks); // обновляем состояние задач
    loadTasks(); // загружаем задачи заново для обновления компонента
  };

  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks); // обновляем состояние задач
    loadTasks(); // загружаем задачи заново для обновления компонента
  };

  const viewTask = (task) => {
    setSelectedTask(task);
  };

  const closeTaskView = () => {
    setSelectedTask(null);
  };

  if (selectedTask) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: "400px" }}>
          <Text style={{}}>Название: {selectedTask.title}</Text>
          <Text style={{}}>Описание: {selectedTask.description}</Text>
          <Text>Дата: {selectedTask.date.toLocaleString()}</Text>
          <Text>Местоположение: {selectedTask.location}</Text>
          <Text>Статус: {selectedTask.status}</Text>
          <Button title="Закрыть" onPress={closeTaskView} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              height: 350,
              width: 350,
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              elevation: 5,
            }}
          >
            <Text>Название задачи:</Text>
            <TextInput
              style={{
                height: 20,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
              }}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
            <Text>Описание задачи:</Text>
            <TextInput
              style={{
                height: 40,
                borderColor: "gray",
                borderRadius: 5,
                borderWidth: 1,
              }}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />

            <TouchableOpacity onPress={showDatePicker}>
              <Text>
                {date.toLocaleDateString()} {date.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Text>Местоположение:</Text>
            <TextInput
              style={{
                height: 20,
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: 5,
              }}
              value={location}
              onChangeText={(text) => setLocation(text)}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 10,
              }}
            >
              <Button title="Сохранить" onPress={saveTask} />
              <Button title="Отмена" onPress={() => setModalVisible(false)} />
            </View>
            {errorMessage ? (
              <Text style={{ color: "red" }}>{errorMessage}</Text>
            ) : null}
          </View>
        </View>
      </Modal>

      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              maxWidth: "400px",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
              padding: 5,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => viewTask(item)}
            >
              <Text style={{ margin: 10, maxWidth: "60px" }}>{item.title}</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ margin: 10, maxWidth: "60px", fontSize: 12 }}>
                {item.date.toLocaleString()}
              </Text>
              <TouchableOpacity
                style={{
                  fontSize: "10px",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "green",
                  padding: "2px",
                  borderRadius: "15px",
                  width: "100px",
                  height: "30px",
                }}
                onPress={() => markAsCompleted(item.id)}
              >
                <Text style={{ color: "black" }}>Завершить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  fontSize: 12,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "yellow",
                  padding: "2px",
                  borderRadius: "15px",
                  width: "80px",
                  height: "30px",
                }}
                onPress={() => markAsCancel(item.id)}
              >
                <Text style={{ color: "black" }}>Отменить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  fontSize: 12,
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "red",
                  padding: "2px",
                  borderRadius: "15px",
                  width: "80px",
                  height: "30px",
                }}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={{ color: "black" }}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 10,
          }}
        >
          <Button title="Все задачи" onPress={() => filterTasks("Все")} />
          <Button
            title="В процессе"
            onPress={() => filterTasks("В процессе")}
          />
          <Button title="+" onPress={() => setModalVisible(true)} />
          <Button title="Завершено" onPress={() => filterTasks("Завершено")} />
          <Button title="Отменено" onPress={() => filterTasks("Отменено")} />
        </View>
      </View>
    </View>
  );
};

export default TaskApp;
