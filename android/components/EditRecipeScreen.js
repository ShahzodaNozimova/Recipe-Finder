import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert } from "react-native";
import { Input, FormControl, Image, Box } from "native-base";
import { MAIN_URL } from "@env";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { MultipleSelectList } from "react-native-dropdown-select-list";

const EditRecipeScreen = ({ route }) => {
  const { recipeId } = route.params; 
  const [recipeData, setRecipeData] = useState(null);
  const [description, setDescription] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRecipeData();
    // fetchCategories();
    // fetchTags();
  }, []);

  const fetchRecipeData = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/recipes/${recipeId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log(data)
      setRecipeData(data);
      setDescription(data.description);
      setCookTime(data.cook_time);
      setCategoryId(data.category.id);
      setSelectedTags(data.ingredients.map((tag) => tag.id));
      setImage({ assets: [{ uri: data.image }] });
    } catch (error) {
      console.error("Error fetching recipe data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/recipes/${recipeId}`, {
        method: "PATCH",
      });

      if (response.ok) {
        // Handle success
        navigation.navigate("RecipeList")
      } else {
        Alert.alert("Failed to update recipe", "Unexpected Error");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
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
          selected={selectedTags}
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
      <Button title="Submit Changes" onPress={handleSubmit} />
    </View>
  );
};

export default EditRecipeScreen;
