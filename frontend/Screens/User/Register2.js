import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button } from "native-base";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input.js";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "native-base";
import RNPickerSelect from 'react-native-picker-select';

var { height, width } = Dimensions.get("window");

const Register2 = () => {
    const [age, setAge] = useState(null);
    const [phone, setPhone] = useState("");
    const [barangay, setBarangay] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [preference, setPreference] = useState("They/Them");
    const [error, setError] = useState("");
    const navigation = useNavigation();
    const route = useRoute();

    const { email, name, password } = route.params;

    const register = () => {
        if (age === null || phone === "" || barangay === "" || zip === "" || city === "" || country === "") {
            setError("Please fill in the form correctly");
            return;
        }

        const user = {
            name,
            email,
            password,
            age,
            phone,
            barangay,
            zip,
            city,
            country,
            preference,
            isAdmin: false,
        };

        axios
            .post(`${baseURL}/users/register`, user)
            .then((res) => {
                if (res.status === 200) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Registration Succeeded",
                        text2: "Please Log in to your account",
                    });
                    setTimeout(() => {
                        navigation.navigate("Login");
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    position: "bottom",
                    bottomOffset: 20,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again",
                });
                console.log(error.message);
            });
    };

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >
            <FormContainer style={styles.container}>
                <Image
                    source={require("../../assets/RP_EParokya.png")}
                    style={{ width: 250, height: 260, marginRight: 10 }}
                />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age</Text>
                    <RNPickerSelect
                        placeholder={{ label: 'Select Age', value: null }}
                        onValueChange={(value) => setAge(value)}
                        items={Array.from({ length: 100 }, (_, i) => ({
                            label: `${i + 1}`,
                            value: i + 1
                        }))}
                        style={pickerSelectStyles}
                        value={age}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Preference</Text>
                    <RNPickerSelect
                        placeholder={{ label: 'Select Preference', value: null }}
                        onValueChange={(value) => setPreference(value)}
                        items={[
                            { label: 'He', value: 'He' },
                            { label: 'She', value: 'She' },
                            { label: 'They/Them', value: 'They/Them' }
                        ]}
                        style={pickerSelectStyles}
                        value={preference}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <Input
                        placeholder={"Phone Number"}
                        name={"phone"}
                        id={"phone"}
                        keyboardType={"numeric"}
                        onChangeText={(text) => setPhone(text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Barangay</Text>
                    <Input
                        placeholder={"Barangay"}
                        name={"barangay"}
                        id={"barangay"}
                        onChangeText={(text) => setBarangay(text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Zip Code</Text>
                    <Input
                        placeholder={"Zip Code"}
                        name={"zip"}
                        id={"zip"}
                        keyboardType={"numeric"}
                        onChangeText={(text) => setZip(text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>City</Text>
                    <Input
                        placeholder={"City"}
                        name={"city"}
                        id={"city"}
                        onChangeText={(text) => setCity(text)}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Country</Text>
                    <Input
                        placeholder={"Country"}
                        name={"country"}
                        id={"country"}
                        onChangeText={(text) => setCountry(text)}
                    />
                </View>

                <View style={styles.buttonGroup}>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <Button
                    variant={"ghost"}
                    onPress={register}
                    style={styles.registerButton}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </Button>

            </FormContainer>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    inputContainer: {
        width: "90%",
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#000',
    },
    buttonGroup: {
        width: "100%",
        margin: 10,
        alignItems: "center",
    },
    registerButton: {
        backgroundColor: '#1C5739',
        marginTop: 20,
        width: '80%',
        borderRadius: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: "white",
        fontFamily: "Roboto",
    },
    errorText: {
        color: "red",
        textAlign: "center",
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        width: '100%',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        width: '100%',
    },
});

export default Register2;
