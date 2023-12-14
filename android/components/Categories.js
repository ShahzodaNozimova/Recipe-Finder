import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { MAIN_URL } from "@env";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedCategory, setEditedCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const accessToken = useSelector((state) => state?.auth?.accessToken);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/categories/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
    }, [])
  );

  const handleEdit = (category) => {
    setEditedCategory(category.name);
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `${MAIN_URL}/categories/${selectedCategory.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name: editedCategory }),
        }
      );

      if (response.ok) {
        setModalVisible(false);
        fetchCategories();
      } else {
        throw new Error("Failed to edit category");
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${MAIN_URL}/categories/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        fetchCategories();
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text style={[styles.button, styles.editButton]}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={[styles.button, styles.deleteButton]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            value={editedCategory}
            onChangeText={(text) => setEditedCategory(text)}
          />
          <View style={{ display: "flex", gap: 5, flexDirection: "row" }}>
            <Button title="Save" onPress={handleSaveEdit} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  categoryName: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    padding: 8,
    borderRadius: 5,
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "blue",
    color: "white",
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "red",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default Categories;
