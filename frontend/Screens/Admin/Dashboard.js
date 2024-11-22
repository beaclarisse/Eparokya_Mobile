import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

const Dashboard = () => {
  const [userData, setUserData] = useState({ users: 0, admins: 0 });
  const [weddingData, setWeddingData] = useState([]);
  const [confirmedWeddingData, setConfirmedWeddingData] = useState([]);
  const [batchData, setBatchData] = useState([]); // State for batch data
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserRoles();
    fetchWeddingForms();
    fetchConfirmedWeddings();
    fetchMemberCountByBatch(); // Fetch batch data
  }, []);

  const processWeddingData = (data) => {
    return data.map((item) => (isNaN(item) ? 0 : item));
  };

  const fetchUserRoles = async () => {
    try {
      const response = await axios.get(`${baseURL}/users/`);
      const users = response.data.filter((user) => !user.isAdmin).length;
      const admins = response.data.filter((user) => user.isAdmin).length;
      setUserData({ users, admins });
    } catch (error) {
      console.error("Error fetching user roles:", error.message);
    }
  };

  const fetchWeddingForms = async () => {
    try {
      const response = await axios.get(`${baseURL}/wedding/`);
      const monthlyData = new Array(12).fill(0);
      response.data.forEach((wedding) => {
        const month = new Date(wedding.weddingDate).getMonth();
        if (!isNaN(month)) monthlyData[month]++;
      });
      setWeddingData(processWeddingData(monthlyData));
    } catch (error) {
      console.error("Error fetching wedding forms:", error.message);
    }
  };

  const fetchConfirmedWeddings = async () => {
    try {
      const response = await axios.get(`${baseURL}/wedding/confirmed`);
      const monthlyData = new Array(12).fill(0);
      response.data.forEach((wedding) => {
        const month = new Date(wedding.weddingDate).getMonth();
        if (!isNaN(month)) monthlyData[month]++;
      });
      setConfirmedWeddingData(processWeddingData(monthlyData));
    } catch (error) {
      console.error("Error fetching confirmed weddings:", error.message);
    }
  };

  const fetchMemberCountByBatch = async () => {
    try {
      const response = await axios.get(`${baseURL}/member/count-by-batch`);
      console.log("Batch Data:", response.data); // Debug batch data
      setBatchData(response.data);
    } catch (error) {
      console.error("Error fetching member count by batch:", error.message);
    }
  };

  const pieChartData = [
    {
      name: "Users",
      population: userData.users,
      color: "#C0C78C",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Admins",
      population: userData.admins,
      color: "#A6B37D",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  const barChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        data: weddingData,
        color: () => "#FEFAE0",
        strokeWidth: 2,
      },
    ],
  };

  const confirmedWeddingBarChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        data: confirmedWeddingData,
        color: () => "#B99470",
        strokeWidth: 2,
      },
    ],
  };

  const batchPieChartData = batchData.map((batch) => ({
    name: batch.batchName,
    population: batch.count,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Random color
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("WeddingForm")}
      >
        <Icon name="home-outline" size={30} color="#1E90FF" />
        <Text style={styles.iconText}>Forms</Text>
      </TouchableOpacity>

      <Text style={styles.chartTitle}>User Roles</Text>
      <PieChart
        data={pieChartData}
        width={screenWidth - 16}
        height={220}
        chartConfig={chartConfig}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
        absolute
      />

      <Text style={styles.chartTitle}>Wedding Forms Submitted Per Month</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={barChartData}
          width={screenWidth * 1.5}
          height={250}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
        />
      </ScrollView>

      <Text style={styles.chartTitle}>Confirmed Weddings Per Month</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={confirmedWeddingBarChartData}
          width={screenWidth * 1.5}
          height={250}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
        />
      </ScrollView>

      <Text style={styles.chartTitle}>Members by Year Batch</Text>
      {batchPieChartData.length > 0 ? (
        <PieChart
          data={batchPieChartData}
          width={screenWidth - 16}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />
      ) : (
        <Text style={styles.noData}>No batch data available</Text>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#E5E5E5",
  backgroundGradientTo: "#F5F5F5",
  color: () => "#1AFF92",
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 8,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  iconText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#1E90FF",
    fontWeight: "bold",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    color: "#777",
  },
});

export default Dashboard;
