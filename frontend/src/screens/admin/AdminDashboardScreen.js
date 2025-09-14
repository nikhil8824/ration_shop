import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ordersAPI, productsAPI } from '../../services/api';
import Toast from 'react-native-toast-message';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load order statistics
      const ordersResponse = await ordersAPI.getOrderStats();
      if (ordersResponse.data.success) {
        const orderStats = ordersResponse.data.data;
        setStats(prev => ({
          ...prev,
          totalOrders: orderStats.totalOrders,
          totalRevenue: orderStats.totalRevenue,
          pendingOrders: orderStats.statusStats.find(s => s._id === 'pending')?.count || 0,
        }));
      }

      // Load product count
      const productsResponse = await productsAPI.getAdminProducts({ limit: 1 });
      if (productsResponse.data.success) {
        setStats(prev => ({
          ...prev,
          totalProducts: productsResponse.data.data.pagination.totalProducts,
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]} onPress={onPress}>
      <Card.Content style={styles.statContent}>
        <Text style={styles.statIcon}>{icon}</Text>
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Admin Dashboard</Title>
          <Text style={styles.headerSubtitle}>Welcome back!</Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="📦"
            color="#2196F3"
            onPress={() => navigation.navigate('Orders')}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toFixed(2)}`}
            icon="💰"
            color="#4CAF50"
            onPress={() => navigation.navigate('Orders')}
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="🛍️"
            color="#FF9800"
            onPress={() => navigation.navigate('Products')}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="⏳"
            color="#F44336"
            onPress={() => navigation.navigate('Orders')}
          />
        </View>

        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quick Actions</Title>
            
            <View style={styles.actionGrid}>
              <Card
                style={styles.actionCard}
                onPress={() => navigation.navigate('AddProduct')}
              >
                <Card.Content style={styles.actionContent}>
                  <Text style={styles.actionIcon}>➕</Text>
                  <Text style={styles.actionText}>Add Product</Text>
                </Card.Content>
              </Card>
              
              <Card
                style={styles.actionCard}
                onPress={() => navigation.navigate('Products')}
              >
                <Card.Content style={styles.actionContent}>
                  <Text style={styles.actionIcon}>📝</Text>
                  <Text style={styles.actionText}>Manage Products</Text>
                </Card.Content>
              </Card>
              
              <Card
                style={styles.actionCard}
                onPress={() => navigation.navigate('Orders')}
              >
                <Card.Content style={styles.actionContent}>
                  <Text style={styles.actionIcon}>📋</Text>
                  <Text style={styles.actionText}>View Orders</Text>
                </Card.Content>
              </Card>
              
              <Card
                style={styles.actionCard}
                onPress={() => navigation.navigate('Users')}
              >
                <Card.Content style={styles.actionContent}>
                  <Text style={styles.actionIcon}>👥</Text>
                  <Text style={styles.actionText}>Manage Users</Text>
                </Card.Content>
              </Card>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.recentActivityCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Activity</Title>
            <Text style={styles.comingSoonText}>
              Recent activity tracking will be available soon.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    paddingBottom: 10,
  },
  statCard: {
    width: '48%',
    marginBottom: 15,
    marginRight: '2%',
    elevation: 2,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  statTitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  quickActionsCard: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    marginBottom: 15,
    elevation: 1,
    borderRadius: 8,
  },
  actionContent: {
    alignItems: 'center',
    padding: 15,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
    textAlign: 'center',
  },
  recentActivityCard: {
    margin: 20,
    marginTop: 0,
    elevation: 2,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AdminDashboardScreen;



