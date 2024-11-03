import React, { Fragment, useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Dimensions,
    TextInput,
    StyleSheet,
} from "react-native";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import baseURL from "../../../assets/common/baseUrl";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setFormData } from "../../../utils/formData";
import { List } from "native-base";

const { width } = Dimensions.get("window");

const CreateMinistry = ({ navigation }) => {
    const [ministry, setMinistry] = useState([]);
    const [ministryName, setMinistryName] = useState('');
    const [ministryDescription, setMinistryDescription] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const fetchMinistries = async () => {
            try {
                const response = await axios.get(`${baseURL}/`);
                setMinistry(response.data);
            } catch (error) {
                alert("Error loading Ministry Categories");
            }
        };

        const fetchToken = async () => {
            const res = await AsyncStorage.getItem("jwt");
            setToken(res);
        };

        fetchToken();
        fetchMinistries();

        return () => {
            setMinistry([]);
            setToken('');
        };
    }, []);

    const addMinistry = async () => {
        const newMinistry = {
            name: ministryName,
            description: ministryDescription,
        };
    
        const formData = await setFormData(newMinistry);
    
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: token,
            }
        };
    
        try {
            const response = await axios.post(`${baseURL}/create`, formData, config);
            setMinistry([...ministry, response.data]); 
            setMinistryName("");
            setMinistryDescription("");
        } catch (error) {
            console.log("Error Response:", error.response.data); // Log the error response data
            alert("Failed to create ministry. Please try again.");
        }
    };
    
    const renderItem = ({ item }) => (
        <List style={styles.item}>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
        </List>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={ministry}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()} 
            />
            <View>
                <Text style={{ marginLeft: 10 }}>Ministry Name</Text>
                <TextInput
                    value={ministryName}
                    style={styles.input}
                    onChangeText={setMinistryName}
                    placeholder="Ministry Name"
                />
                <Text style={{ marginLeft: 10 }}>Description</Text>
                <TextInput
                    value={ministryDescription}
                    style={styles.input}
                    onChangeText={setMinistryDescription}
                    placeholder="Ministry Description"
                />
                <View style={{ alignItems: "center" }}>
                    <EasyButton
                        medium
                        primary
                        onPress={addMinistry}
                    >
                        <Text style={{ color: "white", fontWeight: "bold" }}>Create</Text>
                    </EasyButton>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        margin: 9,
        padding: 5,
    },
    item: {
        padding: 10,
        marginVertical: 5,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default CreateMinistry;
