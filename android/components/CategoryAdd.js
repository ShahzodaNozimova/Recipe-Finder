import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import {MAIN_URL} from '@env'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const CategoryAdd = () => {
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const [categoryName, setCategoryName] = useState('');
  const navigation = useNavigation();

  const handleAddCategory = async () => {
    try {
      const response = await fetch(`${MAIN_URL}/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        Alert.alert('Failed to add category');
      }

      navigation.navigate('HomePage')

      setCategoryName('');
    } catch (error) {
      // Handle error (if needed)
      console.error('Error adding category:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter category name"
        value={categoryName}
        onChangeText={(text) => setCategoryName(text)}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Add Category" onPress={handleAddCategory} />
    </View>
  );
};

export default CategoryAdd;
