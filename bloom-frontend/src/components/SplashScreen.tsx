import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Heart } from 'lucide-react-native';

export const SplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    }, 1800);
    return () => clearTimeout(timer);
  }, [opacity]);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}> 
      <View style={styles.container}>
        <View style={styles.logoBadge}>
          <Heart size={36} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Bloom</Text>
        <Text style={styles.subtitle}>Intelligent Cycle & Health Companion</Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FAF7F2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#E85D88',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#E85D88',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D2438',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 20,
  },
  progressTrack: {
    width: 120,
    height: 4,
    backgroundColor: '#E7E5E4',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F472B6',
  },
});
