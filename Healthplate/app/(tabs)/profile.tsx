import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, Alert, 
  TouchableOpacity, ActivityIndicator, RefreshControl, Switch, Image 
} from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { api } from "../../src/services/api";
import CustomHeader from '../../src/components/header';
import PremiumPlanScreen from '../../src/components/PremiumPlanScreen';
// --- CONFIGURATION ---
const THEME_COLOR = '#10B981'; // Emerald 500
const BG_COLOR = '#F3F4F6';

// Mappings for converting 0,1,2 to Strings
const DIET_OPTIONS = {
  0: "Vegetarian 🥦",
  1: "Non-Vegetarian 🍗",
  2: "Vegan 🥗",
  3: "Eggitarian 🥚"
};

const ACTIVITY_OPTIONS = {
  0: "Sedentary 🛋️",
  1: "Light 🚶",
  2: "Moderate 🏃",
  3: "High 🏋️"
};

const GENDER_OPTIONS = {
    0: "Male 👨",
    1: "Female 👩",
    2: "Other 🧑"
};

export default function ProfileScreen() {
  const { logout, userToken } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  // 1. Fetch Profile
  const fetchProfile = async () => {
    try {
        if (!userToken) return;
        const response = await api.get("/me", {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        setProfileData(response.data);
    } catch (error) {
        console.error("Fetch Error:", error);
        // gracefully handle error or show toast
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userToken]);

  // 2. Sync Edit Data
  useEffect(() => {
    if (profileData) {
      setEditData(JSON.parse(JSON.stringify(profileData)));
    }
  }, [profileData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfile();
  }, []);

  // 3. Save Handler
  const handleSave = async () => {
    try {
      const response = await api.put("/me", editData, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setProfileData(response.data);
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleCancel = () => {
    if (profileData) setEditData(JSON.parse(JSON.stringify(profileData)));
    setIsEditing(false);
  };

  // --- UI HELPER COMPONENTS ---

  const StatBox = ({ label, value, unit, editKey }) => (
    <View style={styles.statBox}>
        {isEditing ? (
             <TextInput 
                style={styles.statInput}
                keyboardType="numeric"
                value={String(editData[editKey] || '')}
                onChangeText={(text) => setEditData(prev => ({...prev, [editKey]: text}))}
             />
        ) : (
            <Text style={styles.statValue}>{value || '-'}</Text>
        )}
        <Text style={styles.statLabel}>{label} {unit && <Text style={styles.statUnit}>({unit})</Text>}</Text>
    </View>
  );

  const SelectionGrid = ({ label, options, selectedValue, onSelect }) => (
      <View style={styles.selectionContainer}>
          <Text style={styles.sectionTitle}>{label}</Text>
          <View style={styles.pillContainer}>
            {Object.entries(options).map(([key, text]) => {
                const isSelected = String(selectedValue) === String(key);
                return (
                    <TouchableOpacity 
                        key={key}
                        style={[styles.pill, isSelected && styles.pillSelected]}
                        onPress={() => onSelect(key)}
                    >
                        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                            {text}
                        </Text>
                    </TouchableOpacity>
                );
            })}
          </View>
      </View>
  );

  // --- MAIN RENDER ---
  if (loading) {
      return (
          <View style={[styles.container, styles.center]}>
              <ActivityIndicator size="large" color={THEME_COLOR} />
          </View>
      );
  }

  // Determine which data source to use
  const data = isEditing ? editData : profileData;
  if (!data) return null;

  // Extract Known Keys to prevent them appearing in "Other Details"
  const KNOWN_KEYS = ['_id', 'password', 'name', 'email', 'age', 'height', 'weight', 'food_preference', 'activity_level', 'bio', 'is_private', 'gender'];

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      
      {/* USE THE HEADER HERE */}
      <CustomHeader />

    <ScrollView 
        style={{ flex: 1, backgroundColor: BG_COLOR }}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      
      
      {/* 1. Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
             <Text style={styles.screenTitle}>Profile</Text>
             <TouchableOpacity onPress={isEditing ? handleSave : () => setIsEditing(true)}>
                <Text style={styles.actionBtn}>{isEditing ? "Save" : "Edit"}</Text>
             </TouchableOpacity>
        </View>

        <View style={styles.profileSummary}>
            {/* Avatar Placeholder */}
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                    {data.name ? data.name.charAt(0).toUpperCase() : "U"}
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                {isEditing ? (
                    <TextInput 
                        style={styles.nameInput} 
                        value={editData.name} 
                        placeholder="Your Name"
                        onChangeText={(t) => setEditData({...editData, name: t})}
                    />
                ) : (
                    <Text style={styles.nameText}>{data.name || "User Name"}</Text>
                )}
                <Text style={styles.emailText}>{data.email || "No Email"}</Text>
            </View>
        </View>
      </View>

      {/* 2. Stats Grid (Age, Height, Weight) */}
      <View style={styles.card}>
         <View style={styles.statsRow}>
            <StatBox label="Age" value={data.age} editKey="age" />
            <View style={styles.statDivider} />
            <StatBox label="Height" value={data.height} unit="cm" editKey="height" />
            <View style={styles.statDivider} />
            <StatBox label="Weight" value={data.weight} unit="kg" editKey="weight" />
         </View>
      </View>

      {/* 3. Bio Section */}
      <View style={styles.card}>
          <Text style={styles.sectionTitle}>About Me</Text>
          {isEditing ? (
            <TextInput 
                style={styles.bioInput}
                multiline
                placeholder="Write something about your fitness journey..."
                value={editData.bio}
                onChangeText={(t) => setEditData({...editData, bio: t})}
            />
          ) : (
            <Text style={styles.bioText}>{data.bio || "No bio added yet."}</Text>
          )}
      </View>
      
      <PremiumPlanScreen/>

      {/* 4. Preferences (Diet, Activity, Gender) */}
      <View style={styles.card}>
        {isEditing ? (
            <>
                <SelectionGrid 
                    label="Food Preference" 
                    options={DIET_OPTIONS} 
                    selectedValue={editData.food_preference} 
                    onSelect={(k) => setEditData({...editData, food_preference: k})} 
                />
                <View style={styles.hr} />
                <SelectionGrid 
                    label="Activity Level" 
                    options={ACTIVITY_OPTIONS} 
                    selectedValue={editData.activity_level} 
                    onSelect={(k) => setEditData({...editData, activity_level: k})} 
                />
                <View style={styles.hr} />
                <SelectionGrid 
                    label="Gender" 
                    options={GENDER_OPTIONS} 
                    selectedValue={editData.gender} 
                    onSelect={(k) => setEditData({...editData, gender: k})} 
                />
            </>
        ) : (
            <View style={styles.detailsList}>
                 <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Food Preference</Text>
                    <Text style={styles.detailValue}>{DIET_OPTIONS[data.food_preference] || "Not Set"}</Text>
                 </View>
                 <View style={styles.hr} />
                 <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Activity Level</Text>
                    <Text style={styles.detailValue}>{ACTIVITY_OPTIONS[data.activity_level] || "Not Set"}</Text>
                 </View>
                 <View style={styles.hr} />
                 <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Gender</Text>
                    <Text style={styles.detailValue}>{GENDER_OPTIONS[data.gender] || "Not Set"}</Text>
                 </View>
            </View>
        )}
      </View>

      {/* 5. Privacy & Settings */}
      <View style={styles.card}>
         <View style={[styles.detailRow, { justifyContent: 'space-between' }]}>
            <View>
                <Text style={styles.sectionTitle}>Profile Privacy</Text>
                <Text style={styles.helperText}>
                    {data.is_private ? "Only you can see your post." : "Your post is visible to others."}
                </Text>
            </View>
            {isEditing ? (
                 <Switch 
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={editData.is_private ? THEME_COLOR : "#f4f3f4"}
                    onValueChange={(val) => setEditData({...editData, is_private: val})}
                    value={editData.is_private || false}
                 />
            ) : (
                <Text style={{ fontSize: 24 }}>{data.is_private ? "🔒" : "🌍"}</Text>
            )}
         </View>
      </View>

      {/* 6. Dynamic/Other Data (Fallback for extra fields) */}
      {Object.keys(data).some(k => !KNOWN_KEYS.includes(k)) && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            {Object.entries(data).map(([key, value]) => {
                if (KNOWN_KEYS.includes(key)) return null;
                if (typeof value === 'object') return null; // Simple render only
                return (
                    <View key={key} style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{key}</Text>
                        <Text style={styles.detailValue}>{String(value)}</Text>
                    </View>
                );
            })}
          </View>
      )}

      {/* 7. Action Buttons */}
      <View style={{ paddingHorizontal: 20, marginTop: 10 }}>
        {isEditing && (
             <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                 <Text style={styles.cancelBtnText}>Cancel Changes</Text>
             </TouchableOpacity>
        )}
        
        {!isEditing && (
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        )}
      </View>

    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header
  header: { padding: 24, paddingBottom: 30, backgroundColor: '#fff', marginBottom: 10 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  actionBtn: { fontSize: 16, color: THEME_COLOR, fontWeight: '700' },
  
  profileSummary: { flexDirection: 'row', alignItems: 'center' },
  avatar: { 
      width: 70, height: 70, borderRadius: 25, 
      backgroundColor: THEME_COLOR, alignItems: 'center', justifyContent: 'center',
      marginRight: 16,
      shadowColor: THEME_COLOR, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  nameText: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  nameInput: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', borderBottomWidth: 1, borderColor: '#ddd', padding: 0 },
  emailText: { fontSize: 14, color: '#6B7280', marginTop: 2 },

  // Generic Card
  card: { 
      backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 16, 
      borderRadius: 20, padding: 20,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginBottom: 12 },
  
  // Stats Grid
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#111827' },
  statInput: { fontSize: 22, fontWeight: '800', color: '#111827', borderBottomWidth: 1, borderColor: '#ddd', textAlign: 'center', minWidth: 40 },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  statUnit: { fontSize: 11 },
  statDivider: { width: 1, backgroundColor: '#E5E7EB', height: '80%' },

  // Bio
  bioText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  bioInput: { 
      fontSize: 15, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB', 
      borderRadius: 12, padding: 12, height: 100, textAlignVertical: 'top', backgroundColor: '#F9FAFB'
  },

  // Pills (Selection)
  selectionContainer: { marginBottom: 10 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { 
      paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, 
      backgroundColor: '#F3F4F6', marginBottom: 6
  },
  pillSelected: { backgroundColor: THEME_COLOR },
  pillText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  pillTextSelected: { color: '#fff' },

  // Details List
  detailsList: { gap: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  detailLabel: { fontSize: 15, color: '#6B7280', fontWeight: '500' },
  detailValue: { fontSize: 15, color: '#111827', fontWeight: '600' },
  helperText: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  hr: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 8 },

  // Buttons
  logoutBtn: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
  cancelBtn: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 16, alignItems: 'center', marginBottom: 12 },
  cancelBtnText: { color: '#4B5563', fontWeight: '700', fontSize: 16 },
});