import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { api } from '@/src/services/api';
import { useRouter } from "expo-router";

const ForgotPasswordScreen = () => {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // --- Actions ---

  const handleBackToLogin = () => {
    // FIX: Correctly navigate back
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(auth)/login");
    }
  };

  const handleRequestOTP = async () => {
    if (!email) return Alert.alert("Validation", "Please enter your email address.");
    
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      Alert.alert("Code Sent", `We sent a 6-digit code to ${email}`);
      setStep(2);
    } catch (error) {
      const msg = error.response?.data?.detail || "Could not send code. Check your network.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) return Alert.alert("Validation", "Please fill in all fields.");

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        new_password: newPassword
      });
      
      Alert.alert(
        "Success!", 
        "Your password has been reset successfully.",
        [
          { 
            text: "Login Now", 
            // FIX: use router.replace so they can't go back to this screen
            onPress: () => router.replace("/(auth)/login") 
          }
        ]
      );
    } catch (error) {
      const msg = error.response?.data?.detail || "Failed to reset password.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  // --- Render Components ---

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name={step === 1 ? "mail-outline" : "lock-closed-outline"} size={40} color="#007BFF" />
          </View>
          <Text style={styles.title}>
            {step === 1 ? "Forgot Password?" : "Reset Password"}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1 
              ? "No worries! Enter your email and we'll send you a reset code." 
              : "Enter the code sent to your email and choose a new password."}
          </Text>
        </View>

        {/* FORM SECTION */}
        <View style={styles.form}>
          
          {step === 1 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="at-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleRequestOTP} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send Code</Text>}
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="keypad-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#999"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleResetPassword} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Set New Password</Text>}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep(1)} style={styles.secondaryLink}>
                <Text style={styles.secondaryLinkText}>Wrong email? Change it</Text>
              </TouchableOpacity>
            </>
          )}

        </View>

        {/* FOOTER: ALWAYS VISIBLE BACK TO LOGIN */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#333" />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', 
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F0FF', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  form: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#007BFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryLinkText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;