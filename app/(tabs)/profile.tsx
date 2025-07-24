import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ContentWrapper from "@/components/contentwrapper";
import Header from "@/components/header";
import { AntDesign } from "@expo/vector-icons";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utils/metrices";
import ImagePickerExample from "@/components/imageUpload";
import DropdownPicker from "@/components/dropDown";
import PieChartBox from "@/components/pieChart";
import { router, useFocusEffect } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import useGetQuery from "@/hooks/get-query.hook";
import { apiUrls } from "@/apis/apis";
import Loader from "@/components/loader";
import ProgressBar from "@/components/ProgressBar";
import QuizResults from "@/components/QuizResults";

const Profile = () => {
  const [user, setUser] = useState({});
  const { getQuery, loading } = useGetQuery();
  const tabBarHeight = useBottomTabBarHeight();
  const [courseTracking, setCourseTracking] = useState({
    completionRate: { completed: "0.00", ongoing: "100.00" },
    monthlyProgress: [],
    categoryWiseCompletion: [],
  });
  const [quizData, setQuizData] = useState({
    docs: [],
    currentPage: 1,
    totalPage: 0,
  });
  const [activeTab, setActiveTab] = useState("weekly");

  const fetchUserProfile = () => {
    getQuery({
      url: apiUrls.user.getProfile,
      onSuccess: (res) => {
        setUser(res.data);
      },
    });
  };

  const fetchCourseTracking = () => {
    getQuery({
      url: apiUrls.course.getCourseTracking,
      onSuccess: (res) => {
        setCourseTracking(res.data);
      },
    });
  };

  const fetchQuizResults = () => {
    getQuery({
      url: apiUrls.quiz.myQuiz,
      params: { page: 1 },
      onSuccess: (res) => {
        setQuizData(res.data);
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      fetchCourseTracking();
      fetchQuizResults();
    }, [])
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filterQuizzes = (period) => {
    const now = new Date();
    return quizData.docs.filter((quiz) => {
      const quizDate = new Date(quiz.completedAt);
      if (period === "weekly") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return quizDate >= oneWeekAgo;
      } else {
        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return quizDate >= oneMonthAgo;
      }
    });
  };

  return (
    <ContentWrapper
      mainContainerStyle={{
        paddingBottom: tabBarHeight,
      }}
    >
      <Loader visible={loading} />
      <Header
        renderRight={() => (
          <AntDesign
            onPress={() => router.push("/profile/settings")}
            name="setting"
            size={24}
            color={"black"}
          />
        )}
        showLeft={false}
        renderLeft={() => <Text style={styles.headerTitle}>Profile</Text>}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Profile Header - Fixed Section */}
          <View style={styles.profileHeaderContainer}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                <ImagePickerExample
                  value={user?.profileImage}
                  onImageChange={() => {}}
                  containerStyle={styles.profileImage}
                  iconStyle={styles.editIcon}
                  renderIcon={
                    <AntDesign name="edit" size={18} color={"black"} />
                  }
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.name || "User Name"}
                </Text>
                <Text style={styles.profileMeta} numberOfLines={2}>
                  {[user?.schoolName, user?.boardId?.boardname]
                    .filter(Boolean)
                    .join(" • ")}
                </Text>
              </View>
            </View>
          </View>

          {/* Score Cards */}
          <View style={styles.scoreCards}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardTitle}>
                {user?.highestResult?.quizId?.title || "Highest Score"}
              </Text>
              <View style={styles.scoreContent}>
                <Text style={styles.scoreLabel}>Highest</Text>
                <Text style={styles.scoreValue}>
                  {user?.highestResult?.score || "--"}%
                </Text>
              </View>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreCardTitle}>
                {user?.lowestResult?.quizId?.title || "Lowest Score"}
              </Text>
              <View style={styles.scoreContent}>
                <Text style={styles.scoreLabel}>Lowest</Text>
                <Text style={styles.scoreValue}>
                  {user?.lowestResult?.score || "--"}%
                </Text>
              </View>
            </View>
          </View>

          {/* Course Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Progress</Text>
            <ProgressBar
              completed={parseFloat(courseTracking.completionRate.completed)}
              ongoing={parseFloat(courseTracking.completionRate.ongoing)}
            />
          </View>

          {/* Category Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills Progress</Text>
            {courseTracking.categoryWiseCompletion?.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <Text style={styles.categoryName}>{category.category}</Text>
                <View style={styles.categoryProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${category.percentage}%` },
                    ]}
                  />
                  <Text style={styles.categoryPercentage}>
                    {category.percentage}%
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Quiz Results */}
          <View style={styles.section}>
            <View style={styles.tabHeader}>
              <Text style={styles.sectionTitle}>Quiz Results</Text>
              <DropdownPicker
                containerStyle={styles.dropdown}
                options={[
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                ]}
                selectedValue={activeTab}
                onValueChange={setActiveTab}
              />
            </View>
            <QuizResults
              quizzes={filterQuizzes(activeTab)}
              formatDate={formatDate}
            />
          </View>
        </View>
      </ScrollView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
    paddingTop: verticalScale(16),
  },
  scrollView: {
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    color: "black",
    fontSize: 24,
    fontWeight: "700",
    width: 100,
  },
  profileHeaderContainer: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  profileInfo: {
    flex: 1,
    marginLeft: horizontalScale(16),
    justifyContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: verticalScale(4),
  },
  profileMeta: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
  },
  scoreCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
    gap: horizontalScale(16),
  },
  scoreCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
  },
  scoreCardTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#fff",
    backgroundColor: "#387ADE",
    paddingVertical: verticalScale(4),
    paddingHorizontal: horizontalScale(8),
    borderRadius: moderateScale(12),
    alignSelf: "flex-start",
    marginBottom: verticalScale(12),
  },
  scoreContent: {
    flexDirection: "column",
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#94A3B8",
    marginBottom: verticalScale(4),
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "600",
    color: "#387ADE",
  },
  section: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: verticalScale(12),
  },
  categoryItem: {
    marginBottom: verticalScale(12),
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: verticalScale(4),
  },
  categoryProgress: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#4ADE80",
    borderRadius: 4,
    marginRight: horizontalScale(8),
  },
  categoryPercentage: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  tabHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  dropdown: {
    width: 120,
    height: 40,
  },
});

export default Profile;
