import { Colors } from "@/constants/Colors";
import { Entypo, Feather, AntDesign, EvilIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ViewStyle,
  ImageStyle,
  TextStyle,
  StyleSheet,
} from "react-native";
import usePostQuery from "@/hooks/post-query.hook";
import { apiUrls } from "@/apis/apis";
import { router } from "expo-router";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

interface SimilarCourseProps {
  screenName?: string;
  showRecommended?: boolean;
  showSimilar?: boolean;
  courseId?: string;
  subjectId?: string;
  keyword?: string;
  emptyMessage?: string;
  onPress?: (course: any) => void;
}

interface Styles {
  container: ViewStyle;
  loader: ViewStyle;
  listContent: ViewStyle;
  separator: ViewStyle;
  courseCard: ViewStyle;
  imageContainer: ViewStyle;
  courseImage: ImageStyle;
  newCourseBadge: ViewStyle;
  newCourseText: TextStyle;
  courseContent: ViewStyle;
  headerRow: ViewStyle;
  courseTitle: TextStyle;
  ratingContainer: ViewStyle;
  ratingText: TextStyle;
  courseDescription: TextStyle;
  footerRow: ViewStyle;
  metaContainer: ViewStyle;
  metaItem: ViewStyle;
  metaText: TextStyle;
  priceText: TextStyle;
  actionContainer: ViewStyle;
  actionButton: ViewStyle;
  emptyListContainer: ViewStyle;
  emptyListText: TextStyle;
}

const SimilarCourse = ({
  screenName = "home",
  showRecommended = false,
  showSimilar = false,
  courseId = "",
  subjectId = "",
  keyword = "",
  emptyMessage = "Empty list",
  onPress,
}: SimilarCourseProps) => {
  const [courses, setCourses] = useState<any[]>([]);
  const { postQuery, loading: isLoading } = usePostQuery();
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector((state: any) => state.user.user);

  const fetchCourses = async () => {
    setRefreshing(true);
    postQuery({
      url: apiUrls.course.getCourseList,
      onSuccess: (res: any) => {
        setCourses(res.data?.docs || []);
        setRefreshing(false);
      },
      onFail: (err: any) => {
        console.error("Error fetching courses:", err);
        setRefreshing(false);
      },
      postData: {
        page: 1,
        search: "",
        subjectId: "", // optional - filter
        standardId: "", // optional - filter
        type: showRecommended ? "R" : showSimilar ? "S" : "", // 'R' for recomended and 'S' for similar course
      },
    });
  };
  console.log(user?.stdId || "");
  useEffect(() => {
    fetchCourses();
  }, [keyword, courseId, subjectId]);

  const handlePress = (course: any) => {
    if (onPress) {
      onPress(course);
    } else if (screenName === "home") {
      router.push(`/courses`);
    } else if (screenName === "courses") {
      router.push({ pathname: `/selectCourse`, params: { id: course._id } });
    }
  };

  const renderCourseItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => handlePress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{
              uri: item.thumbnail || "https://via.placeholder.com/300",
            }}
            style={styles.courseImage}
            resizeMode="cover"
          >
            {item.isNew && (
              <View style={styles.newCourseBadge}>
                <Text style={styles.newCourseText}>New</Text>
              </View>
            )}
          </ImageBackground>
        </View>

        <View style={styles.courseContent}>
          <View style={styles.headerRow}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {item.title || "Course Title"}
            </Text>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={16} color={Colors.warning} />
              <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
            </View>
          </View>

          <Text style={styles.courseDescription} numberOfLines={2}>
            {item.description || "No description available."}
          </Text>

          <View style={styles.footerRow}>
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Entypo name="back-in-time" size={16} color={Colors.gray} />
                <Text style={styles.metaText}>{item.duration || "N/A"}</Text>
              </View>
              <View style={styles.metaItem}>
                {item.offer?.discountPercentage ? (
                  <>
                    <Text
                      style={[
                        styles.priceText,
                        {
                          textDecorationLine: "line-through",
                          color: Colors.gray,
                        },
                      ]}
                    >
                      ₹{item.price || "0"}
                    </Text>
                    <Text style={[styles.priceText, { color: Colors.primary }]}>
                      ₹
                      {Math.floor(
                        item.price * (1 - item.offer.discountPercentage / 100)
                      )}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.priceText}>₹{item.price || "0"}</Text>
                )}
              </View>
            </View>

            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <EvilIcons
                  name="sc-telegram"
                  size={24}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="bookmark" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContent}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={refreshing}
          onRefresh={fetchCourses}
          ListEmptyComponent={() => (
            <View style={styles.emptyListContainer}>
              <Text style={styles.emptyListText}>{emptyMessage}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    paddingVertical: 12,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  separator: {
    width: 16,
  },
  courseCard: {
    width: width * 0.8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 160,
  },
  courseImage: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  newCourseBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    alignSelf: "flex-start",
    margin: 8,
  },
  newCourseText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  courseContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: Colors.dark,
    marginLeft: 4,
  },
  courseDescription: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 12,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.gray,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyListContainer: {
    width: width - 32,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyListText: {
    color: Colors.gray,
    fontSize: 16,
    textAlign: "center",
  },
});

export default SimilarCourse;
