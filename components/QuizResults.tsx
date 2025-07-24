import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const QuizResults = ({ quizzes, formatDate }) => {
  if (quizzes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No quiz attempts found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {quizzes.map((quiz) => (
        <View key={quiz.id} style={styles.quizItem}>
          <View style={styles.quizInfo}>
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizDate}>{formatDate(quiz.completedAt)}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{quiz.score}%</Text>
            <AntDesign
              name={quiz.score >= 70 ? "checkcircle" : "closecircle"}
              size={24}
              color={quiz.score >= 70 ? "#4ADE80" : "#F87171"}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  quizItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  quizDate: {
    fontSize: 12,
    color: "#64748B",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    marginRight: 8,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
  },
});

export default QuizResults;
