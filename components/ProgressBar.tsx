import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProgressBar = ({ completed, ongoing }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressItem}>
        <Text style={styles.label}>Completed</Text>
        <View style={styles.barContainer}>
          <View
            style={[
              styles.progress,
              styles.completed,
              { width: `${completed}%` },
            ]}
          />
        </View>
        <Text style={styles.percentage}>{completed}%</Text>
      </View>
      <View style={styles.progressItem}>
        <Text style={styles.label}>Ongoing</Text>
        <View style={styles.barContainer}>
          <View
            style={[styles.progress, styles.ongoing, { width: `${ongoing}%` }]}
          />
        </View>
        <Text style={styles.percentage}>{ongoing}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: 80,
    fontSize: 14,
    color: "#64748B",
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
  },
  completed: {
    backgroundColor: "#4ADE80",
  },
  ongoing: {
    backgroundColor: "#60A5FA",
  },
  percentage: {
    width: 40,
    textAlign: "right",
    fontSize: 12,
    color: "#64748B",
  },
});

export default ProgressBar;
