import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Check, 
  Sparkles, 
  Shield, 
  Coffee, 
  Truck, 
  IndianRupee, 
  Utensils 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function SubscribeScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);

  // 1. Logic to handle the "Free Trial" click
  const handleStartTrial = () => {
    setLoading(true);
    // Simulate a brief API delay if needed, then redirect
    setTimeout(() => {
      setLoading(false);
      // 'replace' ensures the user can't swipe back to the subscribe screen
      router.replace('/(tabs)'); 
    }, 500);
  };

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: 50,
      period: 'mo',
      description: 'Cancel anytime',
      highlight: false
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: 480,
      originalPrice: 600,
      period: 'yr',
      monthlyPrice: 40,
      description: 'Best Value',
      badge: 'Most Popular',
      savings: 'Save 20%',
      highlight: true
    }
  ];

  const benefits = [
    'Unlimited meal logging',
    'Indian meal nutrition estimates',
    'Weekly habit map & AI report',
    'Smart swap suggestions',
    'Goal tracking & Custom meals',
    'No ads. No spam.'
  ];

  const analogies = [
    { icon: Truck, text: 'Less than delivery fee of 1 order' },
    { icon: Utensils, text: 'Cheaper than 2 samosas 🥟' },
    { icon: Coffee, text: 'Less than one café coffee ☕' },
    { icon: IndianRupee, text: '₹1.5 / day to know your food' }
  ];

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={['#ECFDF5', '#FFFFFF', '#F0FDFA']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Eat smarter for less than a snack</Text>
          <Text style={styles.headerSubtitle}>
            Know what you eat. Improve weekly.
          </Text>
        </View>

        {/* Trial Highlight Card */}
        <LinearGradient
          colors={['#10B981', '#0D9488']} // Emerald-500 to Teal-600
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.trialCard}
        >
          <View style={styles.trialBadge}>
            <Sparkles color="#FFF" size={16} />
            <Text style={styles.trialBadgeText}>5-Day Free Trial</Text>
          </View>
          <Text style={styles.trialDesc}>
            Try everything. No credit card needed.
          </Text>
          
          <TouchableOpacity 
            style={styles.trialBtn}
            onPress={handleStartTrial}
            disabled={loading}
          >
            <Text style={styles.trialBtnText}>
              {loading ? 'Starting...' : 'Start Free Trial'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Pricing Cards */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.9}
                onPress={() => setSelectedPlan(plan.id)}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected
                ]}
              >
                {plan.badge && (
                  <View style={styles.popularBadge}>
                     <LinearGradient
                        colors={['#F59E0B', '#EA580C']}
                        style={styles.badgeGradient}
                      >
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </LinearGradient>
                  </View>
                )}

                <Text style={styles.planName}>{plan.name}</Text>
                
                {plan.originalPrice && (
                  <Text style={styles.strikethroughText}>₹{plan.originalPrice}</Text>
                )}

                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>₹{plan.price}</Text>
                  <Text style={styles.periodText}>/{plan.period}</Text>
                </View>

                {plan.monthlyPrice && (
                  <Text style={styles.monthlyEquivalent}>₹{plan.monthlyPrice} / mo</Text>
                )}
                
                {plan.savings && (
                  <View style={styles.savingsContainer}>
                    <Text style={styles.savingsText}>{plan.savings}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Value Analogies */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>What ₹40 really means...</Text>
          <View style={styles.analogyGrid}>
            {analogies.map((item, i) => (
              <View key={i} style={styles.analogyItem}>
                <View style={styles.iconBox}>
                  <item.icon size={20} color="#059669" />
                </View>
                <Text style={styles.analogyText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Premium includes:</Text>
          {benefits.map((benefit, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <Check size={12} color="#059669" />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Trust Footers */}
        <View style={styles.trustFooter}>
          <View style={styles.trustItem}>
            <Shield size={14} color="#6B7280" />
            <Text style={styles.trustText}>No card required</Text>
          </View>
          <View style={styles.trustItem}>
            <Check size={14} color="#6B7280" />
            <Text style={styles.trustText}>Cancel anytime</Text>
          </View>
        </View>

        {/* Space for fixed bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity 
          onPress={handleStartTrial}
          style={styles.footerBtn}
        >
          <LinearGradient
            colors={['#10B981', '#0D9488']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.footerGradient}
          >
            <Text style={styles.footerBtnText}>
              Start 5-Day Free Trial — ₹0 today
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  // Trial Card
  trialCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  trialBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  trialDesc: {
    color: '#ECFDF5',
    marginBottom: 20,
    fontSize: 14,
  },
  trialBtn: {
    backgroundColor: '#fff',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  trialBtnText: {
    color: '#059669',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Plan Cards
  plansContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  planCardSelected: {
    borderColor: '#10B981', // Emerald-500
    backgroundColor: '#ECFDF5', // Emerald-50
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
  },
  badgeGradient: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    marginTop: 4,
  },
  strikethroughText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  periodText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 2,
  },
  monthlyEquivalent: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 8,
  },
  savingsContainer: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  savingsText: {
    color: '#047857',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Analogies Section
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  analogyGrid: {
    gap: 10,
  },
  analogyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analogyText: {
    fontSize: 13,
    color: '#374151',
    flex: 1,
  },
  // Benefits
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    color: '#374151',
    fontSize: 14,
  },
  // Trust Footer
  trustFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Sticky Footer
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
    paddingBottom: 30, // Extra padding for iPhone home indicator
  },
  footerBtn: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  footerGradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});