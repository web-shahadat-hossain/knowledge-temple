import { apiUrls } from "@/apis/apis";
import ContentWrapper from "@/components/contentwrapper";
import Loader from "@/components/loader";
import SimpleInput from "@/components/simpleInput";
import { Colors } from "@/constants/Colors";
import usePostQuery from "@/hooks/post-query.hook";
import { moderateScale } from "@/utils/metrices";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { shareAsync } from "expo-sharing";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Alert,
  Platform,
  Linking,
  Modal,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

const StudyMaterialsScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "video" | "pdf" | "practical"
  >("all");
  const [material, setMaterial] = useState<any[]>([]);
  const [materialList, setMaterialList] = useState<any[]>([]);
  const { postQuery, loading } = usePostQuery();
  const [videoVisible, setVideoVisible] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const playerRef = useRef(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Convert Google Drive URL to direct download URL
  const getGoogleDriveDirectUrl = (url: string) => {
    const fileId =
      url.match(/\/file\/d\/([^\/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1];
    return fileId
      ? `https://drive.google.com/uc?export=download&id=${fileId}`
      : null;
  };

  // Function to handle material download
  const handleDownload = async (
    url: string,
    title: string,
    type: "video" | "pdf"
  ) => {
    if (!url) {
      Alert.alert("Error", "No file available for download");
      return;
    }

    try {
      // For Android, request permissions
      if (Platform.OS === "android") {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission required",
            "Please allow storage access to download files"
          );
          return;
        }
      }

      Alert.alert("Downloading", "Please wait while we download your file...");

      // Handle Google Drive links
      let downloadUrl = url.includes("drive.google.com")
        ? getGoogleDriveDirectUrl(url) || url
        : url;

      // Get the file extension
      const fileExtension = type === "pdf" ? "pdf" : "mp4";
      const fileName = `${title.replace(/\s+/g, "_")}.${fileExtension}`;

      // Download the file
      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        FileSystem.documentDirectory + fileName,
        {}
      );

      const { uri } = await downloadResumable.downloadAsync();

      // Save to media library or share
      if (Platform.OS === "ios" || type === "pdf") {
        await shareAsync(uri);
      } else {
        await MediaLibrary.createAssetAsync(uri);
      }

      Alert.alert("Success", "File downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download file. Please try again.");
    }
  };

  // Function to open material
  const openMaterial = (item: any) => {
    if (item.materialType === "video") {
      if (
        item.materialUrl.includes("youtube.com") ||
        item.materialUrl.includes("youtu.be")
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
      } else {
        WebBrowser.openBrowserAsync(item.materialUrl).catch((err) => {
          Alert.alert("Error", "Failed to open video. Please try again.");
        });
      }
    } else if (item.materialType === "pdf") {
      if (item.materialUrl) {
        // Handle Google Drive PDFs
        if (item.materialUrl.includes("drive.google.com")) {
          const directUrl = getGoogleDriveDirectUrl(item.materialUrl);
          if (directUrl) {
            WebBrowser.openBrowserAsync(directUrl).catch((err) => {
              Alert.alert("Error", "Failed to open PDF. Please try again.");
            });
          } else {
            Alert.alert("Error", "Invalid Google Drive URL");
          }
        } else {
          // Regular PDF URL
          WebBrowser.openBrowserAsync(item.materialUrl).catch((err) => {
            Alert.alert("Error", "Failed to open PDF. Please try again.");
          });
        }
      } else {
        Alert.alert("Error", "No PDF URL available");
      }
    }
  };

  // Fetch course materials
  const fetchMaterials = async (search = "", type = "") => {
    postQuery({
      url: apiUrls.material.getCourseMaterials,
      onSuccess: (res: any) => {
        setMaterial(res.data?.docs || []);
      },
      onFail: (err: any) => {
        console.error("Error fetching courses:", err);
      },
      postData: {
        page: 1,
        search: search,
        subjectId: "",
        standardId: "",
        type: type,
      },
    });
  };

  // Fetch material list
  const fetchMaterialsList = async (search = "", type = "") => {
    postQuery({
      url: apiUrls.material.getMaterials,
      onSuccess: (res: any) => {
        setMaterialList(res.data?.docs || []);
      },
      onFail: (err: any) => {
        console.error("Error fetching materials:", err);
      },
      postData: {
        page: 1,
        search: search,
        subjectId: "",
        standardId: "",
        type: type,
      },
    });
  };

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchMaterials(
      text,
      activeTab === "all" ? "" : activeTab === "video" ? "v" : "p"
    );
    fetchMaterialsList(
      text,
      activeTab === "all" ? "" : activeTab === "video" ? "v" : "p"
    );
  };

  // Handle tab change
  const handleTabChange = (tab: "all" | "video" | "pdf" | "practical") => {
    setActiveTab(tab);
    const type = tab === "all" ? "" : tab === "video" ? "v" : "p";
    fetchMaterials(searchQuery, type);
    fetchMaterialsList(searchQuery, type);
  };

  useEffect(() => {
    fetchMaterials();
    fetchMaterialsList();
  }, []);

  // Render material item
  const renderMaterialItem = ({ item }: { item: any }) => {
    const isVideo = item.materialType === "video";
    const iconName = isVideo ? "play-circle" : "file-pdf";
    const IconComponent = isVideo ? FontAwesome : MaterialIcons;
    const durationText = isVideo ? "Video" : "PDF";

    return (
      <TouchableOpacity
        style={styles.materialItem}
        onPress={() => openMaterial(item)}
      >
        <View style={styles.materialIconContainer}>
          <IconComponent
            name={iconName}
            size={24}
            color={isVideo ? Colors.primary : Colors.danger}
          />
        </View>

        <View style={styles.materialInfo}>
          <Text style={styles.materialTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.materialDescription} numberOfLines={1}>
            {item.description}
          </Text>

          <View style={styles.materialMeta}>
            <Text style={styles.materialDuration}>{durationText}</Text>
            <Text style={styles.materialCourse}>{item.courseId?.title}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() =>
            handleDownload(item.materialUrl, item.title, item.materialType)
          }
        >
          <AntDesign name="download" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Render featured course
  const renderFeaturedCourse = () => {
    if (material.length === 0) return null;

    const featured = material[0];
    const isVideo = featured.materialType === "video";

    return (
      <TouchableOpacity
        style={styles.featuredCard}
        onPress={() => openMaterial(featured)}
      >
        <ImageBackground
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2WUisIb3DyB667hgienksLQoJi5yFh26pqg&s",
          }}
          style={styles.featuredImage}
          resizeMode="cover"
        >
          <View style={styles.featuredBadge}>
            {isVideo ? (
              <Ionicons name="play" size={20} color={Colors.white} />
            ) : (
              <MaterialIcons
                name="picture-as-pdf"
                size={20}
                color={Colors.white}
              />
            )}
          </View>
        </ImageBackground>

        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>{featured.title}</Text>
          <Text style={styles.featuredDescription} numberOfLines={2}>
            {featured.description || "No description available"}
          </Text>

          <View style={styles.featuredMeta}>
            <View style={styles.metaItem}>
              <FontAwesome6 name="clock" size={14} color={Colors.text} />
              <Text style={styles.metaText}>{isVideo ? "45 min" : "PDF"}</Text>
            </View>

            <View style={styles.metaItem}>
              <FontAwesome name="book" size={14} color={Colors.text} />
              <Text style={styles.metaText}>{featured.courseId?.title}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ContentWrapper
      mainContainerStyle={{
        paddingBottom: tabBarHeight,
      }}
    >
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
              ref={playerRef}
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Study Materials</Text>
          </View>

          <SimpleInput
            placeholder="Search materials..."
            style={styles.searchInput}
            renderLeft={() => (
              <Feather name="search" size={20} color={Colors.placeholder} />
            )}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          <TouchableOpacity
            style={[
              styles.category,
              activeTab === "all" && styles.categoryActive,
            ]}
            onPress={() => handleTabChange("all")}
          >
            <Text
              style={[
                styles.categoryText,
                activeTab === "all" && styles.categoryTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.category,
              activeTab === "video" && styles.categoryActive,
            ]}
            onPress={() => handleTabChange("video")}
          >
            <Text
              style={[
                styles.categoryText,
                activeTab === "video" && styles.categoryTextActive,
              ]}
            >
              Videos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.category,
              activeTab === "pdf" && styles.categoryActive,
            ]}
            onPress={() => handleTabChange("pdf")}
          >
            <Text
              style={[
                styles.categoryText,
                activeTab === "pdf" && styles.categoryTextActive,
              ]}
            >
              PDFs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.category,
              activeTab === "practical" && styles.categoryActive,
            ]}
            onPress={() => handleTabChange("practical")}
          >
            <Text
              style={[
                styles.categoryText,
                activeTab === "practical" && styles.categoryTextActive,
              ]}
            >
              Practical
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Loader visible={loading} />

          {/* Featured Material */}
          {renderFeaturedCourse()}

          {/* All Materials */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Study Materials</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={material}
            renderItem={renderMaterialItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            contentContainerStyle={styles.materialList}
          />

          {/* Recommended Materials */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={materialList}
            renderItem={renderMaterialItem}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            contentContainerStyle={styles.materialList}
          />
        </ScrollView>
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: moderateScale(16),
  },
  header: {
    marginBottom: moderateScale(16),
  },
  welcomeContainer: {
    marginBottom: moderateScale(12),
  },
  welcomeText: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    color: Colors.text,
  },
  searchInput: {
    borderRadius: moderateScale(10),
    backgroundColor: Colors.white,
    paddingHorizontal: moderateScale(12),
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: moderateScale(16),
  },
  category: {
    backgroundColor: Colors.white,
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: moderateScale(14),
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  featuredCard: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(12),
    overflow: "hidden",
    marginBottom: moderateScale(20),
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredImage: {
    width: "100%",
    height: moderateScale(180),
    justifyContent: "flex-end",
  },
  featuredBadge: {
    position: "absolute",
    top: moderateScale(12),
    right: moderateScale(12),
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: moderateScale(6),
    borderRadius: moderateScale(20),
  },
  featuredContent: {
    padding: moderateScale(16),
  },
  featuredTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: moderateScale(8),
  },
  featuredDescription: {
    fontSize: moderateScale(14),
    color: Colors.textSecondary,
    marginBottom: moderateScale(12),
  },
  featuredMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4),
  },
  metaText: {
    fontSize: moderateScale(12),
    color: Colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "bold",
    color: Colors.text,
  },
  viewAllText: {
    fontSize: moderateScale(14),
    color: Colors.primary,
    fontWeight: "500",
  },
  materialList: {
    paddingBottom: moderateScale(16),
  },
  materialItem: {
    backgroundColor: Colors.white,
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: moderateScale(10),
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  materialIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: Colors.lightPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12),
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: Colors.text,
    marginBottom: moderateScale(4),
  },
  materialDescription: {
    fontSize: moderateScale(12),
    color: Colors.textSecondary,
    marginBottom: moderateScale(6),
  },
  materialMeta: {
    flexDirection: "row",
    gap: moderateScale(12),
  },
  materialDuration: {
    fontSize: moderateScale(12),
    color: Colors.textSecondary,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(2),
    borderRadius: moderateScale(4),
  },
  materialCourse: {
    fontSize: moderateScale(12),
    color: Colors.textSecondary,
  },
  downloadButton: {
    padding: moderateScale(8),
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

export default StudyMaterialsScreen;
