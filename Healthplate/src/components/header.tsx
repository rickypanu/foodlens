import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Colors
const BRAND_GREEN = '#047857'; 
const TAGLINE_GRAY = '#6B7280';

const CustomHeader = ({ title, isBack, onRightPress, rightText }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
  
      {/* 1. Main Content Area */}
      <View style={styles.contentContainer}>
        
        {/* LEFT / CENTER CONTENT */}
        <View style={styles.mainSection}>
          
          {/* CONDITION: If we are NOT on a back-navigable page, show Branding. 
              Otherwise, show the Back Arrow + Title. */}
          
          {!isBack ? (
            /* --- BRANDING ROW (Home State) --- */
            <View style={styles.brandingRow}>
              <View style={styles.logoContainer}>
                {/* Ensure this path exists in your project */}
                <Image 
                  source={require("../../assets/images/logo.png")}
                  style={styles.logo} 
                />
              </View>
              
              <View>
                <Text style={styles.brandTitle}>Healthplate</Text>
                <Text style={styles.brandTagline}>
                  Made for Indian meals. Built for better health.
                </Text>
              </View>
            </View>
          ) : (
            /* --- NAVIGATION ROW (Inner Page State) --- */
            <View style={styles.navigationRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Text style={styles.backArrow}>←</Text>
              </TouchableOpacity>
              <Text style={styles.pageTitle}>{title}</Text>
            </View>
          )}

        </View>

        {/* 2. Optional Right Action Button (e.g., "Save" or "Profile") */}
        {rightText && (
          <View style={styles.rightSection}>
            <TouchableOpacity onPress={onRightPress} style={styles.actionBtn}>
              <Text style={styles.actionText}>{rightText}</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    // Handle status bar height for Android transparency
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // --- Branded Styles ---
  mainSection: {
    flex: 1,
    justifyContent: 'center',
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND_GREEN,
  },
  brandTagline: {
    fontSize: 11,
    color: TAGLINE_GRAY,
    marginTop: 2,
  },

  // --- Normal Navigation Styles ---
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    paddingRight: 12,
    paddingVertical: 4, // Hit slop area
  },
  backArrow: {
    fontSize: 24,
    color: '#374151',
    fontWeight: 'bold',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },

  // --- Right Action Button ---
  rightSection: {
    marginLeft: 10,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ECFDF5', // Light green background
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    color: BRAND_GREEN,
    fontWeight: '600',
  },
});

export default CustomHeader;