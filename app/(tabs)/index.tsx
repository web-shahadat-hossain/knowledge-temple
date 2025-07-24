import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

import ContentWrapper from "@/components/contentwrapper";
import SimpleInput from "@/components/simpleInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import SimilarCourse from "@/components/courseCard";

import { Colors } from "@/constants/Colors";
import { moderateScale } from "@/utils/metrices";
import useGetQuery from "@/hooks/get-query.hook";
import usePostQuery from "@/hooks/post-query.hook";
import { apiUrls } from "@/apis/apis";

// Interfaces
interface Offer {
  _id: string;
  title: string;
  description?: string;
  image: string;
  startAt: string;
  endAt: string;
  offrPer?: number;
}

interface Course {
  _id: string;
  title: string;
  offer?: {
    discountPercentage: number;
  };
}

interface UserProfile {
  name?: string;
  user?: {
    name?: string;
  };
  profileCompletion?: number;
}

interface RootState {
  user: {
    user: UserProfile;
  };
}

const { width } = Dimensions.get("window");

const HomeScreen: React.FC = () => {
  const { user }: { user: UserProfile } = useSelector(
    (state: RootState) => state.user
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(true);

  const tabBarHeight = useBottomTabBarHeight();

  const { postQuery } = usePostQuery();
  const { getQuery, loading: offersLoading, data: offerData } = useGetQuery();

  const profileCompletionPercentage = user?.profileCompletion || 0;

  useEffect(() => {
    getQuery({
      url: apiUrls.offer,
    });
  }, []);

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredCourses([]);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    postQuery({
      url: apiUrls.getCourses,
      onSuccess: (res: any) => {
        setSearchLoading(false);
        setFilteredCourses(res?.data?.docs || []);
      },
      onFail: (err: any) => {
        setSearchLoading(false);
        setSearchError(err?.message || "Something went wrong");
      },
      postData: {
        page: 1,
        search: text,
        subjectId: "",
        standardId: "",
      },
    });
  };

  const isOfferActive = (offer: Offer): boolean => {
    const now = new Date();
    const start = new Date(offer.startAt);
    const end = new Date(offer.endAt);
    return now >= start && now <= end;
  };

  const handleCrossClick = () => {
    setIsProfileComplete(false);
  };

  const OfferCard: React.FC<{ data: Offer }> = ({ data }) => {
    return (
      <View style={styles.offerCardContainer}>
        <ImageBackground
          source={{ uri: data.image }}
          style={styles.offerBackground}
          imageStyle={styles.offerImageStyle}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.gradientOverlay}
          />
          {data.offrPer && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{data.offrPer}% OFF</Text>
            </View>
          )}
          <View style={styles.offerContent}>
            <Text style={styles.offerTitle}>{data.title}</Text>
            <Text style={styles.offerDescription}>
              {data.description || `Get ${data.offrPer}% discount`}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const myOffers: Offer[] = offerData?.data?.offers || [];

  return (
    <ContentWrapper mainContainerStyle={{ paddingBottom: tabBarHeight }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome {user?.user?.name || user?.name || "John Doe"}! 👍
            </Text>
            <FontAwesome
              style={styles.bellIcon}
              name="bell"
              size={24}
              color="black"
            />
          </View>

          <SimpleInput
            placeholder="Search here"
            style={styles.searchInput}
            renderLeft={() => (
              <Feather name="search" size={20} color={Colors.placeholder} />
            )}
            value={searchQuery}
            onChangeText={handleSearchInputChange}
          />
        </View>

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <View style={styles.searchResultsContainer}>
            {searchLoading ? (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.loadingIndicator}
              />
            ) : searchError ? (
              <Text style={styles.errorText}>{searchError}</Text>
            ) : filteredCourses.length > 0 ? (
              <ScrollView keyboardShouldPersistTaps="handled">
                {filteredCourses.map((course) => (
                  <TouchableOpacity
                    key={course._id}
                    style={styles.searchResultItem}
                    onPress={() =>
                      router.push({
                        pathname: "/selectCourse",
                        params: { id: course._id },
                      })
                    }
                  >
                    <Text style={styles.searchResultText}>{course.title}</Text>
                    {course.offer && (
                      <Text style={styles.courseOfferText}>
                        {course.offer.discountPercentage}% OFF
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noResultsText}>
                No courses found for "{searchQuery}"
              </Text>
            )}
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          {isProfileComplete ? (
            <View style={styles.profileSection}>
              <TouchableOpacity style={styles.cross} onPress={handleCrossClick}>
                <Entypo
                  style={styles.crossIcon}
                  name="cross"
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
              <View style={styles.completeProfileContainer}>
                <Text style={styles.sectionTitle}>Complete Profile</Text>
                <Link href="/profile/profileDetails" style={styles.seeAllText}>
                  See all
                </Link>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${profileCompletionPercentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressPercentage}>
                  {profileCompletionPercentage}% Complete
                </Text>
              </View>
              <Text style={styles.profileDescription}>
                Completing your profile allows for a more accurate assessment of
                your studies and education.
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <View style={styles.progressSection}>
                <View style={styles.completeProfileContainer}>
                  <View style={styles.studyContainer}>
                    <AntDesign
                      style={styles.playIcon}
                      name="playcircleo"
                      size={30}
                      color="#387ade"
                    />
                    <View>
                      <Text style={styles.studyTitle}>Study Name</Text>
                      <Text style={styles.detailsText}>Study details</Text>
                    </View>
                  </View>
                  <Text style={styles.minText}>5 min</Text>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Progress.Bar
                    progress={0.4}
                    height={10}
                    width={200}
                    borderRadius={10}
                    unfilledColor="white"
                    borderColor="blue"
                    animated={true}
                    animationConfig={{ bounciness: 5 }}
                    animationType="timing"
                  />
                </View>

                <PrimaryButton
                  text="Start"
                  style={styles.continueButton}
                  onPress={() => {}}
                />
              </View>
            </View>
          )}

          {/* Offers */}
          <View style={styles.offersHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <Text style={styles.viewAllText}>View all</Text>
          </View>

          {offersLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offersContainer}
            >
              {myOffers
                .filter((offer) => isOfferActive(offer))
                .map((offer) => (
                  <OfferCard key={offer._id} data={offer} />
                ))}
            </ScrollView>
          )}

          {/* Recommended Courses */}
          <View style={styles.section}>
            <View style={styles.completeProfileContainer}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <Text style={styles.viewAllText}>View all</Text>
            </View>
            <SimilarCourse
              onPress={(course: Course) =>
                router.push({
                  pathname: "/selectCourse",
                  params: { id: course._id },
                })
              }
              emptyMessage="No Courses Found"
            />
          </View>
        </ScrollView>
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    padding: 20,
    paddingBottom: 5,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bellIcon: {
    backgroundColor: "#EAEAEA",
    padding: 10,
    borderRadius: 50,
  },
  searchInput: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  searchResultsContainer: {
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 5,
    maxHeight: 200,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchResultText: {
    fontSize: 16,
    color: Colors.text,
  },
  courseOfferText: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  loadingIndicator: {
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    padding: 20,
    textAlign: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: Colors.placeholder,
    padding: 20,
    textAlign: "center",
  },
  profileSection: {
    margin: 15,
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
    position: "relative",
  },
  cross: {
    position: "absolute",
    top: -10,
    right: 1,
    padding: 1,
  },
  crossIcon: {
    backgroundColor: "#cbd5e1",
    borderRadius: 50,
  },
  completeProfileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dashDivider: {
    borderTopWidth: 10,
    borderColor: Colors.primary,
    borderStyle: "solid",
    borderRadius: 8,
    marginVertical: 10,
  },
  profileDescription: {
    color: Colors.placeholder,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
  },
  progressSection: {
    margin: 15,
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  playIcon: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 50,
  },
  studyContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  studyTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  minText: {
    color: Colors.white,
  },
  detailsText: {
    color: Colors.placeholder,
    fontSize: 16,
    fontWeight: "600",
  },
  continueButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: Colors.white,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAllText: {
    color: Colors.placeholder,
    fontWeight: "bold",
  },
  seeAllText: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  // Offer Card Styles
  offerCardContainer: {
    width: width * 0.85,
    height: 180,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  offerBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  offerImageStyle: {
    borderRadius: 12,
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
    borderRadius: 12,
  },
  discountBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: Colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  discountText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  offerContent: {
    padding: 15,
  },
  offerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  offerDescription: {
    color: Colors.white,
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 10,
  },
  applicableText: {
    color: Colors.white,
    fontSize: 12,
    opacity: 0.8,
    marginTop: 5,
  },
  offersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  offersContainer: {
    paddingLeft: 15,
    paddingBottom: 10,
  },
  progressBarContainer: {
    marginVertical: 10,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  progressPercentage: {
    marginTop: 5,
    textAlign: "right",
    color: Colors.primary,
    fontWeight: "bold",
  },
});

export default HomeScreen;
