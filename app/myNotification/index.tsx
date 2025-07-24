import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  ListRenderItem, // Import ListRenderItem type
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import useGetQuery from "@/hooks/get-query.hook";
import { apiUrls } from "@/apis/apis";
import ContentWrapper from "@/components/contentwrapper";
import Loader from "@/components/loader";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/header";

const { width } = Dimensions.get("window");

// Define TypeScript interfaces for the notification data
interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  createdAt: string; // Assuming it's a date string
  isRead: boolean;
  // Add any other properties your notification objects might have
}

interface NotificationsApiResponse {
  docs: NotificationItem[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  // Add any other properties your API response might have
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]); // Specify type
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { getQuery, loading } = useGetQuery();

  const fetchNotifications = (pageNum = 1) => {
    getQuery({
      url: `${apiUrls.user.notifications}?page=${pageNum}`,
      onSuccess: (res: { data: NotificationsApiResponse }) => {
        // Specify type for res
        if (pageNum === 1) {
          setNotifications(res.data.docs);
        } else {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            ...res.data.docs,
          ]); // Use functional update for state
        }
        setTotalPages(res.data.totalPages);
      },
      onFail: (err: any) => {
        // Consider a more specific error type if available
        console.error("Error fetching notifications:", err);
      },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1); // Reset page to 1 for refresh
    fetchNotifications(1);
    setRefreshing(false); // This should ideally be set to false after fetch completes
    // A more robust way to handle refreshing state:
    // const onRefresh = async () => {
    //   setRefreshing(true);
    //   setPage(1);
    //   await fetchNotifications(1); // Assuming fetchNotifications can be awaited or has a callback for completion
    //   setRefreshing(false);
    // };
  };

  const loadMore = () => {
    if (page < totalPages && !loading) {
      // Add !loading to prevent multiple calls
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Use ListRenderItem type for better type checking
  const renderNotification: ListRenderItem<NotificationItem> = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.isRead && styles.unreadNotification,
        ]}
      >
        <View style={styles.notificationIcon}>
          <Ionicons
            name="notifications"
            size={24}
            color={!item.isRead ? Colors.primary : Colors.gray}
          />
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </Text>
        </View>

        <Feather
          name="chevron-right"
          size={20}
          color={Colors.gray}
          style={styles.chevron}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ContentWrapper>
      <Header heading={"Notification "} showLeft />
      <Loader visible={loading} />
      <View style={styles.container}>
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity>
            <Text style={styles.markAllRead}>Mark all as read</Text>
          </TouchableOpacity>
        </View> */}

        {notifications.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={width * 0.3}
              color={Colors.gray}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              You'll see important updates here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
              />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark,
  },
  markAllRead: {
    color: Colors.primary,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  notificationIcon: {
    marginRight: 16,
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 6,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: Colors.lightGray,
  },
  chevron: {
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default NotificationsScreen;
