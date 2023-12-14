import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, FlatList } from "react-native";
import { Box, Center, AspectRatio, Stack, Heading, HStack } from "native-base";
import { MAIN_URL } from "@env";
import { useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

function HomePage() {
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipesData();
    }, [])
  );

  const fetchRecipesData = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/recipes/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setRecipes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipe data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" />
      </Center>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date.getDate()}.${date.getFullYear()}`;
  };


  const renderItem = ({ item }) => {
    return (
      <Center mt={5}>
        <Box
          maxW={80}
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth={1}
          _dark={{
            borderColor: "coolGray.600",
            backgroundColor: "gray.700",
          }}
          _light={{
            backgroundColor: "gray.50",
          }}
          marginBottom={4}
        >
          <AspectRatio w="100%" ratio={16 / 9}>
            <Image
              source={{ uri: item.image }}
              alt="recipe image"
              resizeMode="cover"
            />
          </AspectRatio>
          <Stack p={4} space={3}>
            <Stack space={2}>
              <Heading size="md" ml={-1} fontWeight={'extrabold'}>
                {item.description}
              </Heading>
            </Stack>
            <HStack
              alignItems="center"
              space={4}
              justifyContent="space-between"
            >
              <HStack
                alignItems="center"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <View style={{display: 'flex', gap: 5}}>
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: "warmGray.200",
                    }}
                    fontWeight="400"
                  >
                    Cook Time: {item.cook_time}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: "warmGray.200",
                    }}
                    fontWeight="400"
                  >
                    Ingredients:
                  </Text>
                  <View style={{display: 'flex', gap: 5}}>
                    {item.ingredients.map((ingredient) => (
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: "warmGray.200",
                        }}
                        fontWeight="400"
                        key={ingredient.id}
                      >
                        {ingredient.name}
                      </Text>
                    ))}
                  </View>
                  <Text style={{ color: "gray" }}>{formatDate(item.created_at)}</Text>
                </View>
              </HStack>
            </HStack>
          </Stack>
        </Box>
      </Center>
    );
  };

  return (
    <View>
      <FlatList
        data={recipes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

export default HomePage;
