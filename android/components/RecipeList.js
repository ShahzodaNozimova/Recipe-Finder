import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Box } from "native-base";
import { useDispatch, useSelector } from "react-redux";
import { MAIN_URL } from "@env";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/recipes/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleEdit = (id) => {
    navigation.navigate("EditRecipeScreen", { recipeId: id });
  };

  const handleDeleteRecipe = async (id) => {
    console.log("clicked");
    try {
      const response = await fetch(`${MAIN_URL}/recipes/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // Remove the deleted recipe from the list
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      } else {
        throw new Error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const oneRecipe = ({ item }) => {
    console.log(item);
    return (
      <Box
        borderWidth={1}
        borderColor="gray.300"
        borderRadius={8}
        padding={4}
        margin={3}
        flexDirection="row"
        alignItems="center"
      >
        <Image
          source={{ uri: item.image }}
          alt={item.name}
          width={95}
          height={95}
          style={{ width: 95, height: 95, marginRight: 8 }}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.infoContainer}>
            <Text>{item.description}</Text>
            <Text>Cook Time: {item.cook_time}</Text>
            <Text>Ingredients:</Text>
            <View>
              {item.ingredients.map((ingredient) => (
                <Text key={ingredient.id}>{ingredient.name}</Text>
              ))}
              <Text style={styles.description}>
                {formatDate(item.created_at)}
              </Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity onPress={() => handleEdit(item.id)}>
              <Text
                style={{
                  padding: 8,
                  borderRadius: 5,
                  textAlign: "center",
                  backgroundColor: "blue",
                  color: "white",
                  marginRight: 5,
                }}
              >
                Edit
              </Text>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={() => handleDeleteRecipe(item.id)}>
              <Text
                style={{
                  padding: 8,
                  borderRadius: 5,
                  textAlign: "center",
                  backgroundColor: "red",
                  color: "white",
                }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Box>
    );
  };

  return (
    <View>
      <FlatList
        data={recipes}
        renderItem={oneRecipe}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontWeight: "bold",
  },
  description: {
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
});

export default RecipeList;
