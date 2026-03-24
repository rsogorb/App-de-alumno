import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonCourseCard = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Animación de parpadeo infinita
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.image} />
      <View style={styles.content}>
        <View style={styles.title} />
        <View style={styles.description} />
        <View style={styles.tags}>
          <View style={styles.tag} />
          <View style={styles.tag} />
          <View style={styles.tag} />
        </View>
        <View style={styles.button} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#C0C0C0',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    width: '80%',
    height: 18,
    borderRadius: 4,
    backgroundColor: '#C0C0C0',
    marginBottom: 8,
  },
  description: {
    width: '100%',
    height: 40,
    borderRadius: 4,
    backgroundColor: '#C0C0C0',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tag: {
    width: 70,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#C0C0C0',
    marginRight: 8,
  },
  button: {
    width: 100,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#C0C0C0',
  },
});

export default SkeletonCourseCard;