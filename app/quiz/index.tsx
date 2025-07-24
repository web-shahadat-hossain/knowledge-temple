import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import ContentWrapper from "@/components/contentwrapper";
import Header from "@/components/header";
import { moderateScale, verticalScale } from "@/utils/metrices";
import PrimaryButton from "@/components/common/PrimaryButton";
import { router, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import usePostQuery from "@/hooks/post-query.hook";
import { apiUrls } from "@/apis/apis";
import Toast from "react-native-toast-message";
import ReferModal from "@/components/referModal";
import TermsModal from "@/components/termsModal";
import { format } from "date-fns"; // Import date-fns for date formatting

const QuizScreen = () => {
  const params = useLocalSearchParams();
  const [visibleModal, setVisibleModal] = useState(false);
  const [referCode, setReferCode] = useState("");

  const { postQuery, loading } = usePostQuery();

  // Function to format the end date
  const formattedEndDate = params?.endDate
    ? format(new Date(params.endDate as string), "dd MMM yyyy, hh:mm a") // Example: 23 Jul 2025, 03:30 PM
    : "N/A"; // Default if endDate is not available

  // Dynamic attempts data
  const attemptsPerInterval = params?.attemptsPerInterval || 1; // Default to 2 if not provided
  const attemptIntervalHours = params?.attemptIntervalHours || "15 to 20"; // Default to 4 hours if not provided

  const handleEnrollQuiz = (quizId) => {
    postQuery({
      url: apiUrls.quiz.enrollQuiz,
      onSuccess: (res) => {
        setVisibleModal(false);
        console.log("enroll quiz", res.data);
        if (res.data.url) {
          router.push({
            pathname: "/blankPage",
            params: {
              checkoutUrl: res.data.url,
              redirectPath: "/quiz/questionScreen",
              name: "quizId",
              id: quizId,
            },
          });
        } else {
          router.push({
            pathname: "/quiz/questionScreen",
            params: { quizId },
          });
        }
      },
      onFail: (err) => {
        if (err.message === "Quiz Already Enrolled.") {
          router.push({
            pathname: "/quiz/questionScreen",
            params: { quizId },
          });
        }
        Toast.show({
          type: "error",
          text1: err.message || "Something went wrong",
        });
        console.log("===============indexssssssssssss", err);
      },
      postData: {
        quizId,
        referCode: referCode ? referCode : "",
      },
    });
  };

  const handleCloseModal = () => {
    setVisibleModal(false);
  };

  return (
    <ContentWrapper>
      <Header heading={"Quiz"} showLeft={true} />
      <View style={styles.container}>
        <View>
          <Text style={styles.quizCount}>
            Quiz &#x2022; {params?.totalQuestions} Questions
          </Text>
          <Text style={styles.heading}>{params?.title}</Text>
          <Text style={styles.subHeading}>To win this Quiz..</Text>
          <View style={styles.colTwo}>
            <Text style={styles.score}>You have to score</Text>

            <Text style={styles.percent}>
              <Text style={styles.percentText}>75%</Text> or Higher
            </Text>
          </View>
          <Text style={styles.subHeading}>Submit your Quiz</Text>
          <View
            style={[
              styles.colTwo,
              {
                marginTop: verticalScale(10),
              },
            ]}
          >
            <View>
              <Text style={styles.score}>End Date</Text>
              {/* Dynamic End Date */}
              <Text style={styles.font14}>{formattedEndDate}</Text>
            </View>
            <View>
              <Text style={styles.score}>Attempts</Text>
              {/* Dynamic Attempts */}
              <Text style={styles.font14}>
                <Text style={styles.bold}>{attemptsPerInterval}</Text> Every{" "}
                <Text style={styles.bold}>{attemptIntervalHours}</Text> Min
              </Text>
            </View>
          </View>
        </View>

        <PrimaryButton
          onPress={() => setVisibleModal(true)}
          text={"Start Quiz"}
          isOutlined
          renderIcon={() => (
            <AntDesign
              name="arrowright"
              size={24}
              color="white"
              style={{ marginLeft: 8 }}
            />
          )}
        />
      </View>
      <ReferModal
        onSkip={() => handleEnrollQuiz(params?._id)}
        visible={visibleModal}
        onClose={handleCloseModal}
        onSubmit={() => handleEnrollQuiz(params?._id)}
        setReferCode={(value) => setReferCode(value)}
        referCode={referCode}
      />
      <TermsModal />
    </ContentWrapper>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quizCount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#94A3B8",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 8,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 20,
  },
  colTwo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  score: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 4,
  },
  percent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
  },
  percentText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#387ADE",
  },
  font14: {
    fontSize: 14,
    fontWeight: "400",
    color: "#94A3B8",
  },
  bold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
  },
});
