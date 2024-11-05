import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import Toast from "react-native-toast-message";

const AnnouncementCategoryList = ({ navigation }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${baseURL}/announcementCategory`);
            setCategories(response.data.categories || []); 
            setLoading(false);
        } catch (err) {
            console.error("Error fetching categories:", err.response ? err.response.data : err.message);
            Toast.show({
                topOffset: 60,
                type: "error",
                text1: "Error loading categories",
                text2: "Please try again later",
            });
            setLoading(false);
        }
    };

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("AnnouncementCategoryDetail", { categoryId: item._id })}
        >
            {item.image && (
                <Image source={{ uri: item.image }} style={styles.image} />
            )}
            <View style={styles.content}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#1C5739" />
            ) : (
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        marginVertical: 8,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 5,
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
});

export default AnnouncementCategoryList;
