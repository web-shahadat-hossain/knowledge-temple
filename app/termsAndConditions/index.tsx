import ContentWrapper from "@/components/contentwrapper";
import Header from "@/components/header";
import React from "react";
import { ScrollView, StyleSheet, Text, View, Linking } from "react-native";

const TermsAndConditions = () => {
  return (
    <ContentWrapper>
      <Header heading={"Terms and Conditions"} showLeft />
      <ScrollView style={styles.container}>
        <Text style={styles.lastUpdated}>
          Terms and Conditions Last Updated: 19/03/2025
        </Text>
        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to <Text style={styles.boldText}>Knowledge Temple</Text>!
          These Terms & Conditions ("Terms") govern your access to and use of
          our online learning platform, website, mobile applications, and
          related services (collectively, the "Platform"). By registering,
          accessing, or using our services, you acknowledge that you have read,
          understood, and agreed to these Terms. If you do not agree with these
          Terms, please do not use the platform.
        </Text>
        <Text style={styles.heading}>2. User Eligibility</Text>
        <Text style={styles.paragraph}>
          You must provide accurate and complete information when registering
          for an account. Knowledge Temple reserves the right to deny access or
          terminate accounts that provide false or misleading information.
        </Text>
        <Text style={styles.heading}>3. Account Registration and Security</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • Users must create an account to access certain features of the
            platform.
          </Text>
          <Text style={styles.bulletPoint}>
            • You are responsible for maintaining the security of your login
            credentials.
          </Text>
          <Text style={styles.bulletPoint}>
            • You agree not to share your account with others or allow
            unauthorized access.
          </Text>
          <Text style={styles.bulletPoint}>
            • If you suspect unauthorized use of your account, notify us
            immediately at{" "}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL("mailto:ktemple1412@gmail.com")}
            >
              [ktemple1412@gmail.com]
            </Text>
            .
          </Text>
        </View>
        <Text style={styles.heading}>4. Use of Services</Text>
        <Text style={styles.paragraph}>
          By using Knowledge Temple, you agree:
        </Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • To use the platform for educational and personal development
            purposes only.
          </Text>
          <Text style={styles.bulletPoint}>
            • Not to engage in plagiarism, cheating, or academic dishonesty.
          </Text>
          <Text style={styles.bulletPoint}>
            • Not to distribute, reproduce, or sell course content without
            permission.
          </Text>
          <Text style={styles.bulletPoint}>
            • Not to use automated bots, scraping tools, or exploit the platform
            in any way.
          </Text>
          <Text style={styles.bulletPoint}>
            • Not to post, upload, or share content that is illegal, offensive,
            defamatory, or violates intellectual property rights. Failure to
            comply may result in suspension or termination of your account.
          </Text>
        </View>
        <Text style={styles.heading}>
          5. Payments, Subscriptions, and Refunds
        </Text>
        <Text style={styles.subHeading}>5.1 Pricing & Payment</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • Some courses and features may require payment. Prices are
            displayed before checkout.
          </Text>
          <Text style={styles.bulletPoint}>
            • Payments can be made via credit/debit cards, UPI, PayPal, or other
            supported methods.
          </Text>
          <Text style={styles.bulletPoint}>
            • All transactions are final unless a refund is granted under our
            refund policy.
          </Text>
        </View>
        <Text style={styles.subHeading}>5.2 Subscription Plans</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • If you purchase a subscription, it will automatically renew unless
            cancel before the renewal date.
          </Text>
          <Text style={styles.bulletPoint}>
            • You can cancel your subscription anytime via the account settings.
          </Text>
        </View>
        <Text style={styles.subHeading}>5.3 Refund Policy</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • Refunds are granted only under specific conditions, such as:
          </Text>
          <Text style={[styles.bulletPoint, { marginLeft: 20 }]}>
            • Course access issues due to a platform error.
          </Text>
          <Text style={[styles.bulletPoint, { marginLeft: 20 }]}>
            • Incorrect charges or duplicate transactions.
          </Text>
          <Text style={styles.bulletPoint}>
            • Refund requests can be submitted at{" "}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL("mailto:ktemple1412@gmail.com")}
            >
              [ktemple1412@gmail.com]
            </Text>
            .
          </Text>
        </View>
        <Text style={styles.heading}>6. Intellectual Property Rights</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • All content, including videos, PDFs, quizzes, and graphics, is
            owned by Knowledge Temple or its licensors.
          </Text>
          <Text style={styles.bulletPoint}>
            • You are granted a limited, non-transferable, non-exclusive license
            to access the content.
          </Text>
          <Text style={styles.bulletPoint}>
            • You may not modify, distribute, reproduce, or publicly display
            content without written permission.
          </Text>
          <Text style={styles.bulletPoint}>
            • Unauthorized use of content will result in legal action.
          </Text>
        </View>
        <Text style={styles.heading}>
          7. User Conduct and Community Guidelines
        </Text>
        <Text style={styles.paragraph}>
          To maintain a safe learning environment, users must not:
        </Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • Harass, threaten, or discriminate against others.
          </Text>
          <Text style={styles.bulletPoint}>
            • Share misleading or false information.
          </Text>
          <Text style={styles.bulletPoint}>
            • Attempt to hack, disrupt, or damage the platform.
          </Text>
          <Text style={styles.bulletPoint}>
            • Impersonate any individual or organization. Violation of these
            rules may lead to account suspension or legal action.
          </Text>
        </View>
        <Text style={styles.heading}>
          8. Third-Party Content and External Links
        </Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • Some courses may include links to third-party websites or
            resources.
          </Text>
          <Text style={styles.bulletPoint}>
            • We are not responsible for the accuracy, safety, or policies of
            third-party content.
          </Text>
          <Text style={styles.bulletPoint}>
            • Users should review third-party terms before engaging with
            external sites.
          </Text>
        </View>
        <Text style={styles.heading}>9. Limitation of Liability</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • Knowledge Temple is not responsible for any direct, indirect,
            incidental, or consequential damages.
          </Text>
          <Text style={styles.bulletPoint}>
            • We do not guarantee uninterrupted access due to technical issues,
            server downtimes, or maintenance.
          </Text>
          <Text style={styles.bulletPoint}>
            • We are not liable for data loss, cybersecurity threats, or
            unauthorized account access.
          </Text>
        </View>
        <Text style={styles.heading}>10. Privacy Policy</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • We collect and store personal data as outlined in our Privacy
            Policy.
          </Text>
          <Text style={styles.bulletPoint}>
            • Your data will not be sold or shared with third parties without
            consent, except as required by law.
          </Text>
          <Text style={styles.bulletPoint}>
            • By using the platform, you consent to data collection as per our
            policy.
          </Text>
        </View>
        <Text style={styles.heading}>11. Modification of Terms</Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • We may update these Terms from time to time.
          </Text>
          <Text style={styles.bulletPoint}>
            • Users will be notified of significant changes via email or
            platform announcements.
          </Text>
          <Text style={styles.bulletPoint}>
            • Continued use of the platform after changes implies acceptance of
            the new Terms.
          </Text>
        </View>
        {/* Note: Section 12 is missing in the provided text, so I'm skipping it. */}
        <Text style={styles.heading}>
          13. Governing Law & Dispute Resolution
        </Text>
        <View style={styles.bulletPointContainer}>
          <Text style={styles.bulletPoint}>
            • These Terms are governed by the laws of India.
          </Text>
          <Text style={styles.bulletPoint}>
            • Disputes will be resolved through arbitration or legal proceedings
            as per applicable law.
          </Text>
        </View>
        <Text style={styles.heading}>14. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions, concerns, or feedback, please contact us
          at:
        </Text>
        <Text style={styles.contactInfo}>
          📧{" "}
          <Text
            style={styles.linkText}
            onPress={() => Linking.openURL("mailto:ktemple1412@gmail.com")}
          >
            ktemple1412@gmail.com
          </Text>
        </Text>
        <Text style={styles.contactInfo}>
          📞{" "}
          <Text
            style={styles.linkText}
            onPress={() => Linking.openURL("tel:8200319401")}
          >
            8200319401
          </Text>
        </Text>
        <View style={{ height: 50 }} /> {/* Add some spacing at the bottom */}
      </ScrollView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8", // Light background for better readability
  },
  lastUpdated: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
    color: "#333",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
    color: "#444",
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 15,
    color: "#555",
  },
  boldText: {
    fontWeight: "bold",
  },
  bulletPointContainer: {
    marginBottom: 15,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 5,
    color: "#555",
  },
  linkText: {
    color: "#007AFF", // Standard blue for links
    textDecorationLine: "underline",
  },
  contactInfo: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 5,
    color: "#555",
  },
});

export default TermsAndConditions;
