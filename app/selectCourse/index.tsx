import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Linking,
  Modal,
  Alert,
} from "react-native";
import {
  AntDesign,
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import PrimaryButton from "@/components/common/PrimaryButton";
import ContentWrapper from "@/components/contentwrapper";
import { useLocalSearchParams } from "expo-router";
import usePostQuery from "@/hooks/post-query.hook";
import { apiUrls } from "@/apis/apis";
import Loader from "@/components/loader";
import SimilarCourse from "@/components/courseCard";
import { useSelector } from "react-redux";
import { images } from "@/assets/images";
import * as WebBrowser from "expo-web-browser";
import YoutubePlayer from "react-native-youtube-iframe";

const { width } = Dimensions.get("window");

interface Resource {
  name: string;
  url: string;
}

interface Lesson {
  _id: string;
  title: string;
  materialType: string;
  duration?: string;
  description?: string;
  materialUrl?: string;
  resources?: Resource[];
}

interface CourseDetails {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  rating: number;
  reviewsCount: number;
  price: number;
  enrolledStudents: any[];
  features: string[];
  lessons: Lesson[];
  bookPDF: string[];
}

export default function SelectCourse() {
  const { user } = useSelector((state: any) => state.user);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [detailCourse, setDetailCourse] = useState<CourseDetails | null>(null);
  const [selectedTab, setSelectedTab] = useState("Overview");
  const [isLocked, setIsLocked] = useState(true);
  const [price, setPrice] = useState("");
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [videoVisible, setVideoVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");

  const { postQuery, loading } = usePostQuery();

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Function to open material
  const openMaterial = (item: Lesson) => {
    if (item.materialType === "video") {
      if (
        item.materialUrl?.includes("youtube.com") ||
        item.materialUrl?.includes("youtu.be")
      ) {
        const videoId = getYouTubeId(item.materialUrl);
        if (videoId) {
          setCurrentVideoId(videoId);
          setVideoVisible(true);
        } else {
          Linking.openURL(item.materialUrl).catch((err) => {
            Alert.alert("Error", "Failed to open video. Please try again.");
          });
        }
      } else if (item.materialUrl) {
        WebBrowser.openBrowserAsync(item.materialUrl).catch((err) => {
          Alert.alert("Error", "Failed to open video. Please try again.");
        });
      }
    } else if (item.materialType === "pdf" && item.materialUrl) {
      WebBrowser.openBrowserAsync(item.materialUrl).catch((err) => {
        Alert.alert("Error", "Failed to open PDF. Please try again.");
      });
    }
  };

  const fetchCourseDetails = async () => {
    postQuery({
      url: apiUrls.course.getCourseDetails,
      onSuccess: (res: { data: CourseDetails }) => {
        setDetailCourse(res.data);
        setPrice(res.data?.price ? `₹${res.data.price}` : "₹0");
        if (res.data.enrolledStudents) {
          setTotalEnrollments(res.data.enrolledStudents.length);
        }
      },
      onFail: (err) => {
        console.error("Error fetching course details:", err);
      },
      postData: { courseId: id },
    });
  };

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  useEffect(() => {
    if (detailCourse && user) {
      const isEnrolled = detailCourse.enrolledStudents?.some(
        (enrolledStudent) => enrolledStudent?.userId?._id === user?._id
      );
      setIsLocked(!isEnrolled);
    }
  }, [detailCourse, user]);

  const renderTabButton = (tabName: string, label: string) => {
    const isActive = selectedTab === tabName;
    const isLockedTab = tabName === "Lessons" && isLocked;

    return (
      <TouchableOpacity
        onPress={!isLockedTab ? () => setSelectedTab(tabName) : undefined}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={[
              styles.tabText,
              isActive && styles.activeTabText,
              isLockedTab && styles.lockedTabText,
            ]}
          >
            {label}
          </Text>
          {isActive && <View style={styles.activeIndicator} />}
        </View>
        {isLockedTab && <Image source={images.Lock} style={styles.lockIcon} />}
      </TouchableOpacity>
    );
  };

  const renderLessonItem = (lesson: Lesson, index: number) => {
    const isVideo = lesson.materialType?.toLowerCase().includes("video");
    const isPDF = lesson.materialType?.toLowerCase().includes("pdf");

    return (
      <TouchableOpacity
        key={lesson._id}
        style={styles.lessonCard}
        onPress={() => openMaterial(lesson)}
      >
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonNumber}>{index + 1}.</Text>
          <Text style={styles.lessonTitle}>{lesson?.title}</Text>

          <View style={styles.materialIconContainer}>
            {isVideo ? (
              <FontAwesome
                name="play-circle"
                size={20}
                color={Colors.primary}
              />
            ) : isPDF ? (
              <MaterialIcons
                name="picture-as-pdf"
                size={20}
                color={Colors.danger}
              />
            ) : (
              <Feather name="file-text" size={20} color={Colors.gray} />
            )}
          </View>
        </View>

        <View style={styles.lessonMetaContainer}>
          <Text style={styles.lessonMeta}>
            <Feather name="file-text" size={14} color={Colors.gray} />{" "}
            {lesson?.materialType}
          </Text>
          {lesson?.duration && (
            <Text style={styles.lessonDuration}>
              <Feather name="clock" size={14} color={Colors.gray} />{" "}
              {lesson.duration}
            </Text>
          )}
        </View>

        {lesson?.description && (
          <Text style={styles.lessonDescription}>{lesson.description}</Text>
        )}

        {lesson?.resources && lesson.resources.length > 0 && (
          <View style={styles.resourcesContainer}>
            <Text style={styles.resourcesTitle}>Resources:</Text>
            {lesson.resources.map((resource, resIndex) => (
              <TouchableOpacity
                key={resIndex}
                onPress={() => Linking.openURL(resource.url)}
                style={styles.resourceItem}
              >
                <Feather name="download" size={16} color={Colors.primary} />
                <Text style={styles.resourceText}>{resource.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (!detailCourse) {
    return <Loader visible={loading} />;
  }

  return (
    <ContentWrapper>
      <Loader visible={loading} />

      {/* YouTube Player Modal */}
      <Modal
        visible={videoVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setVideoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.videoContainer}>
            <YoutubePlayer
              height={300}
              width="100%"
              videoId={currentVideoId}
              play={true}
              onChangeState={(event) => {
                if (event === "ended") {
                  setVideoVisible(false);
                }
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVideoVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.container}>
        {/* Header with Course Image */}
        <View style={styles.header}>
          <ImageBackground
            source={{ uri: detailCourse.thumbnail }}
            style={styles.bannerImage}
            resizeMode="cover"
          >
            <View style={styles.headerContent}>
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => router.back()}>
                  <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.courseTitle}>{detailCourse.title}</Text>
                <View style={styles.headerIcons}>
                  <TouchableOpacity>
                    <EvilIcons name="sc-telegram" size={28} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Feather name="bookmark" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.courseMeta}>
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {detailCourse.description}
                </Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    <Feather name="clock" size={14} color="white" />{" "}
                    {detailCourse.duration}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={14} color="gold" />
                    <Text style={styles.ratingText}>
                      {detailCourse.rating || "0"}
                    </Text>
                    <Text style={styles.ratingCount}>
                      ({detailCourse.reviewsCount || "0"})
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Main Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Enroll Section */}
          <View style={styles.enrollSection}>
            <PrimaryButton
              style={styles.enrollButton}
              textStyle={styles.enrollText}
              text={isLocked ? `Enroll Now - ${price}` : "Upcoming Lives"}
              onPress={
                isLocked
                  ? () =>
                      router.push({
                        pathname: "/payment",
                        params: { courseId: id },
                      })
                  : () =>
                      router.push({
                        pathname: "/upcomingLives",
                        params: { courseId: id },
                      })
              }
            />

            <View style={styles.enrolledContainer}>
              <View style={styles.avatarGroup}>
                {[1, 2, 3].map((_, index) => (
                  <Image
                    key={index}
                    source={images.classroom}
                    style={[
                      styles.userAvatar,
                      { marginLeft: index > 0 ? -10 : 0 },
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.enrolledText}>
                {totalEnrollments > 0
                  ? `${totalEnrollments}+ Already Enrolled`
                  : "Be the first to enroll!"}
              </Text>
            </View>
          </View>

          {/* Tabs Navigation */}
          <View style={styles.tabsContainer}>
            {renderTabButton("Overview", "Overview")}
            {renderTabButton("Lessons", "Lessons")}
            {renderTabButton("Review", "Review")}
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {selectedTab === "Overview" && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {detailCourse.description}
                  </Text>
                </View>

                {detailCourse.features && detailCourse.features.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Course Features</Text>
                    {detailCourse.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Feather
                          name="check-circle"
                          size={16}
                          color={Colors.primary}
                        />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {detailCourse.bookPDF && detailCourse.bookPDF.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Course Materials</Text>
                    {detailCourse.bookPDF.map((pdfUrl, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.pdfItem}
                        onPress={() => WebBrowser.openBrowserAsync(pdfUrl)}
                      >
                        <MaterialIcons
                          name="picture-as-pdf"
                          size={24}
                          color={Colors.danger}
                        />
                        <Text style={styles.pdfText}>
                          PDF Material {index + 1}
                        </Text>
                        <AntDesign
                          name="download"
                          size={20}
                          color={Colors.primary}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}

            {selectedTab === "Lessons" && (
              <View style={styles.lessonsContainer}>
                {detailCourse.lessons && detailCourse.lessons.length > 0 ? (
                  detailCourse.lessons.map((lesson, index) =>
                    renderLessonItem(lesson, index)
                  )
                ) : (
                  <Text style={styles.noLessonsText}>
                    No lessons available yet
                  </Text>
                )}
              </View>
            )}

            {selectedTab === "Review" && (
              <View style={styles.reviewContainer}>
                <Text style={styles.sectionTitle}>Course Reviews</Text>
                <Text style={styles.comingSoonText}>Reviews coming soon!</Text>
              </View>
            )}
          </View>

          {/* Similar Courses */}
          <View style={styles.similarCourses}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Similar Courses</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <SimilarCourse
              screenName="courses"
              showSimilar
              courseId={id as string}
              emptyMessage="No similar courses found"
            />
          </View>
        </ScrollView>
      </View>
    </ContentWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    height: 300,
    width: "100%",
  },
  bannerImage: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  courseTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginHorizontal: 16,
  },
  courseMeta: {
    marginBottom: 16,
  },
  courseDescription: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    color: "white",
    fontSize: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
  },
  ratingCount: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  enrollSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  enrollButton: {
    flex: 1,
    marginRight: 10,
  },
  enrollText: {
    color: "white",
    fontWeight: "bold",
  },
  enrolledContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarGroup: {
    flexDirection: "row",
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  enrolledText: {
    color: Colors.gray,
    fontSize: 12,
    marginLeft: 8,
    flexShrink: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  tabButton: {
    paddingVertical: 12,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray,
  },
  activeTabText: {
    color: Colors.primary,
  },
  lockedTabText: {
    color: Colors.lightGray,
  },
  activeIndicator: {
    height: 3,
    width: "100%",
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  lockIcon: {
    width: 16,
    height: 16,
    position: "absolute",
    right: -8,
    top: 8,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: Colors.dark,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.dark,
  },
  pdfItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    justifyContent: "space-between",
  },
  pdfText: {
    flex: 1,
    marginLeft: 12,
    color: Colors.dark,
  },
  lessonsContainer: {
    marginTop: 16,
  },
  lessonCard: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  lessonNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginRight: 8,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    flex: 1,
  },
  materialIconContainer: {
    marginLeft: 8,
  },
  lessonMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  lessonMeta: {
    fontSize: 12,
    color: Colors.gray,
    flexDirection: "row",
    alignItems: "center",
  },
  lessonDuration: {
    fontSize: 12,
    color: Colors.gray,
    flexDirection: "row",
    alignItems: "center",
  },
  lessonDescription: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
    marginBottom: 8,
  },
  resourcesContainer: {
    marginTop: 8,
  },
  resourcesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  resourceText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
    textDecorationLine: "underline",
  },
  noLessonsText: {
    color: Colors.gray,
    fontSize: 16,
    textAlign: "center",
    marginTop: 24,
  },
  reviewContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  comingSoonText: {
    color: Colors.gray,
    fontSize: 16,
    marginTop: 16,
  },
  similarCourses: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.9)",
  },
  videoContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  closeButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
