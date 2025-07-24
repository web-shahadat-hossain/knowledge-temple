import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

type ReferModalProps = {
  visible: boolean;
  onClose: () => void;
  onSkip: () => void;
  onSubmit: () => void;
  setReferCode: (code: string) => void;
  referCode: string;
};

const ReferModal = ({
  visible = false,
  onClose,
  onSubmit,
  setReferCode,
  onSkip,
  referCode = "",
}: ReferModalProps) => {
  const [inputValue, setInputValue] = useState(referCode);

  useEffect(() => {
    setReferCode(inputValue);
  }, [inputValue]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Enter Referral Code</Text>
            <Text style={styles.subtitle}>
              Get bonus credits when you refer a friend
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter code (optional)"
            placeholderTextColor="#999"
            value={inputValue}
            onChangeText={setInputValue}
            autoCapitalize="characters"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={onSubmit}
              activeOpacity={0.8}
              disabled={!inputValue}
            >
              <Text style={styles.submitButtonText}>Apply Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.85,
    padding: 25,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  skipButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButtonText: {
    color: "#555",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ReferModal;
