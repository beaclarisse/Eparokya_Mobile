import React, { useState } from "react";
import { View, TextInput, Text, Button, StyleSheet } from "react-native";

const WeddingForm = ({ navigation }) => {
  const [bride, setBride] = useState("");
  const [brideAge, setBrideAge] = useState("");
  const [bridePhone, setBridePhone] = useState("");
  const [groom, setGroom] = useState("");
  const [groomAge, setGroomAge] = useState("");
  const [groomPhone, setGroomPhone] = useState("");

  const handleNext = () => {
    navigation.navigate("WeddingForm2", {
      bride,
      brideAge,
      bridePhone,
      groom,
      groomAge,
      groomPhone,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bride's Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Bride's Name"
        value={bride}
        onChangeText={setBride}
      />
      <TextInput
        style={styles.input}
        placeholder="Bride's Age"
        keyboardType="numeric"
        value={brideAge}
        onChangeText={setBrideAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Bride's Phone"
        value={bridePhone}
        onChangeText={setBridePhone}
      />
       <Text style={styles.heading}>Groom's Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Groom's Name"
        value={groom}
        onChangeText={setGroom}
      />
      <TextInput
        style={styles.input}
        placeholder="Groom's Age"
        keyboardType="numeric"
        value={groomAge}
        onChangeText={setGroomAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Groom's Phone"
        value={groomPhone}
        onChangeText={setGroomPhone}
      />
      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default WeddingForm;
