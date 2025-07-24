// import {
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, { useCallback, useEffect, useState } from 'react';
// import ContentWrapper from '@/components/contentwrapper';
// import SimpleInput from '@/components/simpleInput';
// import { AntDesign, EvilIcons, Feather } from '@expo/vector-icons';
// import { Colors } from '@/constants/Colors';
// import { horizontalScale, moderateScale } from '@/utils/metrices';
// import { router, useFocusEffect } from 'expo-router';

// import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
// import useGetQuery from '@/hooks/get-query.hook';
// import { apiUrls } from '@/apis/apis';
// import usePostQuery from '@/hooks/post-query.hook';
// import Loader from '@/components/loader';
// import WebView from 'react-native-webview';
// import PrimaryButton from '@/components/common/PrimaryButton';

// const Quizes = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const tabBarHeight = useBottomTabBarHeight();
//   const [mentors, setMentors] = useState([]);
//   const [quizes, setQuizes] = useState([]);
//   const [myQuizes, setMyQuizes] = useState([]);

//   const { getQuery, loading } = useGetQuery();

//   const fetchMentors = () => {
//     getQuery({
//       url: apiUrls.mentor,
//       onSuccess: (res) => {
//         console.log('mentor', res);
//         setMentors(res.data.docs);
//       },
//     });
//   };
//   const fetchQuizes = () => {
//     getQuery({
//       url: apiUrls.quiz.getQuiz,
//       onSuccess: (res) => {
//         console.log('quiz', res);
//         setQuizes(res.data.docs);
//       },
//     });
//   };
//   const fetchMyQuizes = () => {
//     getQuery({
//       url: apiUrls.quiz.myQuiz,
//       onSuccess: (res) => {
//         setMyQuizes(res.data.docs);
//       },
//     });
//   };

//   useFocusEffect(
//     useCallback(() => {
//       fetchMentors();
//       fetchQuizes();
//       fetchMyQuizes();
//     }, [])
//   );

//   const Mentor = ({ data }) => {
//     return (
//       <TouchableOpacity
//         onPress={() => router.push(`/mentor/${data._id}`)}
//         style={{
//           width: moderateScale(120),
//           height: moderateScale(120),
//           borderRadius: 16,
//           marginLeft: 15,
//           overflow: 'hidden',
//         }}
//       >
//         <ImageBackground
//           source={{ uri: data?.image }}
//           style={styles.offerSection}
//           imageStyle={{ borderRadius: 10, overflow: 'hidden' }}
//         >
//           <View style={styles.offerContent}>
//             <Text style={styles.offerTittle}>{data?.name}</Text>
//           </View>
//         </ImageBackground>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <ContentWrapper
//       mainContainerStyle={{
//         paddingBottom: tabBarHeight,
//       }}
//     >
//       <Loader visible={loading} />
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.welcomeContainer}>
//             <Text style={styles.welcomeText}>Quiz</Text>
//           </View>
//           <SimpleInput
//             placeholder="Search here"
//             style={styles.searchInput}
//             renderLeft={() => (
//               <Feather name="search" size={20} color={Colors.placeholder} />
//             )}
//             value={searchQuery}
//             // onChangeText={handleSearch}
//           />
//         </View>

//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={[styles.completeProfileContainer, { margin: 15 }]}>
//             <Text style={styles.sectionTitle}>Quizes</Text>
//             <Text style={styles.viewAllText}>View all</Text>
//           </View>
//           {/* Courses */}
//           <View style={styles.section}>
//             {quizes.length ? (
//               quizes.map((quiz) => {
//                 return (
//                   <TouchableOpacity
//                     key={quiz?._id}
//                     onPress={() =>
//                       router.push({
//                         pathname: `/quiz`,
//                         params: quiz,
//                       })
//                     }
//                     style={styles.courseCard}
//                   >
//                     {/* <ImageBackground
//                     source={{ uri: quiz?.image }}
//                     style={styles.courseImage}
//                   /> */}
//                     <View style={styles.completeProfileContainer}>
//                       <Text style={styles.courseTitle}>{quiz?.title}</Text>
//                     </View>
//                     <Text style={styles.courseDescription}>
//                       {quiz?.description}
//                     </Text>
//                     <Text style={styles.priceText}>₹ {quiz?.price}</Text>
//                   </TouchableOpacity>
//                 );
//               })
//             ) : (
//               <View
//                 style={{
//                   justifyContent: 'center',
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     color: Colors.placeholder,
//                     textAlign: 'center',
//                   }}
//                 >
//                   No quiz found
//                 </Text>
//               </View>
//             )}
//           </View>

//           <View style={[styles.completeProfileContainer, { margin: 15 }]}>
//             <Text style={styles.sectionTitle}>My Quizes</Text>
//             <Text style={styles.viewAllText}>View all</Text>
//           </View>
//           {myQuizes.length > 0 ? (
//             myQuizes.map((quiz) => {
//               return (
//                 <View style={styles.section}>
//                   <View style={styles.courseCard}>
//                     {/* <ImageBackground
//                     source={{ uri: quiz?.image }}
//                     style={styles.courseImage}
//                   /> */}
//                     <View style={styles.completeProfileContainer}>
//                       <Text style={styles.courseTitle}>{quiz?.quizTitle}</Text>
//                     </View>
//                   </View>
//                 </View>
//               );
//             })
//           ) : (
//             <View
//               style={{
//                 justifyContent: 'center',
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 16,
//                   color: Colors.placeholder,
//                   textAlign: 'center',
//                 }}
//               >
//                 No quiz enrolled
//               </Text>
//             </View>
//           )}

//           {/* mentor */}
//           <View style={{ margin: 15 }}>
//             <View style={styles.completeProfileContainer}>
//               <Text style={styles.sectionTitle}>Mentor</Text>
//               <Text style={styles.viewAllText}>View all</Text>
//             </View>
//             <ScrollView
//               horizontal
//               pagingEnabled
//               // scrollEnabled
//               showsHorizontalScrollIndicator={false}
//               style={styles.mentor}
//             >
//               {mentors.map((mentor) => {
//                 return <Mentor data={mentor} key={mentor._id} />;
//               })}
//             </ScrollView>
//           </View>
//         </ScrollView>
//       </View>
//     </ContentWrapper>
//   );
// };

// export default Quizes;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f1f5f9',
//     // padding: 20,
//   },
//   header: {
//     padding: 20,
//     paddingBottom: 5,
//   },
//   welcomeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: moderateScale(20),
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },

//   searchInput: {
//     marginTop: 5,
//     marginBottom: 5,
//     padding: 5,
//     borderRadius: 10,
//   },
//   categories: {
//     flexDirection: 'row',
//     marginBottom: 10,
//     justifyContent: 'space-between',
//     margin: 15,
//   },
//   category: {
//     backgroundColor: Colors.white,
//     padding: 5,
//     borderRadius: 10,
//     marginRight: 5,
//     borderColor: Colors.placeholder,
//     borderWidth: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   categoryActive: {
//     backgroundColor: '#1E88E5',
//     padding: 10,
//     borderRadius: 10,
//     marginRight: 5,
//   },
//   categoryText: {
//     color: Colors.placeholder,
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   section: {
//     margin: 15,
//   },
//   courseCard: {
//     marginTop: 10,
//     backgroundColor: '#FFFFFF',
//     padding: 10,
//     borderRadius: 10,
//   },
//   courseImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 20,
//   },
//   courseTitle: {
//     fontSize: 20,
//     fontWeight: 'semibold',
//     color: Colors.black,
//     marginTop: 10,
//   },
//   courseDescription: {
//     color: Colors.placeholder,
//   },
//   newCourseBadge: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     backgroundColor: Colors.primary,
//     padding: 5,
//     borderRadius: 10,
//   },
//   newCourseText: {
//     fontWeight: 'bold',
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//   },
//   completeProfileContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   viewAllText: {
//     color: Colors.placeholder,
//     fontWeight: 'bold',
//   },
//   starIcon: {
//     color: '#D97706',
//   },
//   priceText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.black,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   bookmarkContainer: {
//     flexDirection: 'row',
//     marginLeft: horizontalScale(275),
//     alignItems: 'flex-start',
//   },
//   offerSection: {
//     borderRadius: 10,
//     overflow: 'hidden',
//     position: 'relative',
//     height: '100%',
//     flexDirection: 'column',
//     width: '100%',
//   },
//   offerContent: {
//     padding: 10,
//     position: 'absolute',
//     bottom: 0,
//     overflow: 'hidden',
//     width: '100%',
//   },
//   offerTittle: {
//     color: Colors.white,
//     fontSize: 12,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   mentor: {
//     width: '100%',
//     marginTop: 15,
//   },
// });
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ContentWrapper from "@/components/contentwrapper";
import SimpleInput from "@/components/simpleInput";
import { AntDesign, EvilIcons, Feather, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "@/utils/metrices";
import { router, useFocusEffect } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import useGetQuery from "@/hooks/get-query.hook";
import { apiUrls } from "@/apis/apis";
import Loader from "@/components/loader";
import PrimaryButton from "@/components/common/PrimaryButton";

const { width } = Dimensions.get("window");

const Quizes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const tabBarHeight = useBottomTabBarHeight();
  const [mentors, setMentors] = useState([]);
  const [quizes, setQuizes] = useState([]);
  const [myQuizes, setMyQuizes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const { getQuery, loading } = useGetQuery();

  const fetchMentors = () => {
    getQuery({
      url: apiUrls.mentor,
      onSuccess: (res) => {
        setMentors(res.data.docs);
      },
    });
  };

  const fetchQuizes = () => {
    getQuery({
      url: apiUrls.quiz.getQuiz,
      onSuccess: (res) => {
        setQuizes(res.data.docs);
      },
    });
  };

  const fetchMyQuizes = () => {
    getQuery({
      url: apiUrls.quiz.myQuiz,
      onSuccess: (res) => {
        setMyQuizes(res.data.docs);
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchMentors();
      fetchQuizes();
      fetchMyQuizes();
    }, [])
  );

  const MentorCard = ({ data }) => {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/mentor/${data._id}`)}
        style={styles.mentorCard}
      >
        <ImageBackground
          source={{ uri: data?.image }}
          style={styles.mentorImage}
          imageStyle={styles.mentorImageStyle}
        >
          <View style={styles.mentorContent}>
            <Text style={styles.mentorName}>{data?.name}</Text>
            <Text style={styles.mentorSubject}>
              {data?.subject || "Mentor"}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const QuizCard = ({ quiz, isMyQuiz = false }) => {
    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: `/quiz`, params: quiz })}
        style={styles.quizCard}
      >
        <View style={styles.quizHeader}>
          <Ionicons
            name="help-circle-outline"
            size={24}
            color={Colors.primary}
          />
          <View style={styles.quizTitleContainer}>
            <Text style={styles.quizTitle} numberOfLines={2}>
              {isMyQuiz ? quiz?.quizTitle : quiz?.title}
            </Text>
            {!isMyQuiz && (
              <Text style={styles.quizPrice}>₹{quiz?.price || "Free"}</Text>
            )}
          </View>
        </View>

        <Text style={styles.quizDescription} numberOfLines={2}>
          {quiz?.description || "No description available"}
        </Text>

        <View style={styles.quizFooter}>
          <View style={styles.quizMeta}>
            <Feather name="clock" size={14} color={Colors.gray} />
            <Text style={styles.quizMetaText}>30 mins</Text>
          </View>
          <View style={styles.quizMeta}>
            <Feather name="bar-chart-2" size={14} color={Colors.gray} />
            <Text style={styles.quizMetaText}>
              {quiz?.difficulty || "Medium"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const CategoryPill = ({ title, active }) => (
    <TouchableOpacity
      style={[styles.categoryPill, active && styles.activeCategoryPill]}
      onPress={() => setActiveCategory(title)}
    >
      <Text style={[styles.categoryText, active && styles.activeCategoryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ContentWrapper
      mainContainerStyle={{
        paddingBottom: tabBarHeight,
      }}
    >
      <Loader visible={loading} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Quizzes</Text>
            <Text style={styles.headerSubtitle}>Test your knowledge</Text>
          </View>
          <SimpleInput
            placeholder="Search quizzes..."
            style={styles.searchInput}
            renderLeft={() => (
              <Feather name="search" size={20} color={Colors.placeholder} />
            )}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {["All", "Science", "Math", "History", "Current Affairs"].map(
                (category) => (
                  <CategoryPill
                    key={category}
                    title={category}
                    active={activeCategory === category}
                  />
                )
              )}
            </ScrollView>
          </View>

          {/* Available Quizzes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Quizzes</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            {quizes.length ? (
              <FlatList
                data={quizes}
                renderItem={({ item }) => <QuizCard quiz={item} />}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quizList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="help-circle-outline"
                  size={48}
                  color={Colors.gray}
                />
                <Text style={styles.emptyStateText}>No quizzes available</Text>
              </View>
            )}
          </View>

          {/* My Quizzes */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Quizzes</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            {myQuizes.length ? (
              <FlatList
                data={myQuizes}
                renderItem={({ item }) => <QuizCard quiz={item} isMyQuiz />}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.quizList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={48} color={Colors.gray} />
                <Text style={styles.emptyStateText}>
                  No quizzes enrolled yet
                </Text>
                <PrimaryButton
                  text="Browse Quizzes"
                  style={styles.browseButton}
                  onPress={() => setActiveCategory("All")}
                />
              </View>
            )}
          </View>

          {/* Mentors */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Mentors</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            {mentors.length ? (
              <FlatList
                data={mentors}
                renderItem={({ item }) => <MentorCard data={item} />}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mentorList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color={Colors.gray} />
                <Text style={styles.emptyStateText}>No mentors available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 4,
  },
  searchInput: {
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
  },
  categoriesContainer: {
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    marginRight: 10,
  },
  activeCategoryPill: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    color: Colors.dark,
    fontSize: 14,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: Colors.white,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark,
  },
  viewAllText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  quizList: {
    paddingRight: 20,
  },
  quizCard: {
    width: width * 0.7,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  quizTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
  },
  quizPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 4,
  },
  quizDescription: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 15,
    lineHeight: 20,
  },
  quizFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quizMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  quizMetaText: {
    fontSize: 12,
    color: Colors.gray,
    marginLeft: 5,
  },
  mentorList: {
    paddingRight: 20,
  },
  mentorCard: {
    width: 140,
    height: 160,
    borderRadius: 12,
    marginRight: 15,
    overflow: "hidden",
  },
  mentorImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  mentorImageStyle: {
    borderRadius: 12,
  },
  mentorContent: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
  },
  mentorName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  mentorSubject: {
    color: Colors.lightGray,
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 10,
    textAlign: "center",
  },
  browseButton: {
    marginTop: 15,
    width: "70%",
  },
});

export default Quizes;
