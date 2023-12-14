import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Button, Alert } from "react-native";
import { Input, FormControl, Image, Box } from "native-base";
import * as ImagePicker from "expo-image-picker";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
import { MAIN_URL } from "@env";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const AddRealEstateScreen = () => {
  const [ingredient, setIngredient] = useState("");
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const navigation = useNavigation();


  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
      fetchTags();
    }, [])
  );

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/categories/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/tags/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const handleSubmit = async () => {
    if (!description || !cookTime || !image || !categoryId) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      // const ingredientsArray = selectedTags.map((tag) => parseInt(tag));
      console.log(selectedTags)
      const formData = new FormData();
      formData.append("category", categoryId);
      // formData.append("ingredients", 1)
      selectedTags.forEach(tagId => {
        formData.append("ingredients", tagId);
      });
      formData.append("description", description);
      formData.append("cook_time", cookTime);
      formData.append("image", {
        type: "image/jpeg",
        uri: image?.assets[0]?.uri,
        name: new Date() + "image.jpg",
      });

      const response = await fetch(`${MAIN_URL}/recipes/`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setIngredient("");
        setDescription("");
        setCookTime("");
        setImage(null);
        setCategoryId(null);
        navigation.navigate('HomePage')
      } else {
        Alert.alert("Failed to submit recipe", 'Unexpected Error');
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <FormControl isRequired>
          <FormControl.Label>Category</FormControl.Label>
          <SelectList
            setSelected={(val) => setCategoryId(val)}
            data={categories.map((category) => ({
              key: category.id,
              value: category.name,
            }))}
            save="key"
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Ingredients</FormControl.Label>
          <MultipleSelectList
            setSelected={(vals) => setSelectedTags(vals)}
            data={tags.map((tag) => ({
              key: tag.id,
              value: tag.name,
            }))}
            save="key"
            multiple
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Description</FormControl.Label>
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
          />
        </FormControl>
        <FormControl isRequired>
          <FormControl.Label>Cook Time</FormControl.Label>
          <Input
            value={cookTime}
            onChangeText={setCookTime}
            placeholder="Cook Time"
          />
        </FormControl>
        <View style={{ marginVertical: 10 }} />
        <Button title="Pick Image" onPress={pickImage} />
        {image && (
          <Box mt={2}>
            <Image
              source={{ uri: image?.assets[0].uri }}
              alt="Picked Image"
              size={"xl"}
            />
          </Box>
        )}
        <View style={{ marginVertical: 10 }} />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

export default AddRealEstateScreen;
