import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useBloomStore } from './store/useBloomStore';
import { Header } from './components/Header';
import { BottomNavbar } from './components/BottomNavbar';
import { SplashScreen } from './components/SplashScreen';
import { HomeTab } from './components/tabs/HomeTab';
import { TrackTab } from './components/tabs/TrackTab';
import { CommunityTab } from './components/tabs/CommunityTab';
import { LearnTab } from './components/tabs/LearnTab';
import { ProfileModal } from './components/modals/ProfileModal';
import { DischargeModal } from './components/modals/DischargeModal';
import { NewPostModal } from './components/modals/NewPostModal';
import { ArticleModal } from './components/modals/ArticleModal';

export default function App() {
  const { activeTab } = useBloomStore();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab key="home" />;
      case 'track':
        return <TrackTab key="track" />;
      case 'community':
        return <CommunityTab key="community" />;
      case 'learn':
        return <LearnTab key="learn" />;
      default:
        return <HomeTab key="home" />;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.outerWrapper}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF7F5" />
        
        {/* Animated Intro Splash Screen */}
        <SplashScreen />

        {/* Central App Shell for Desktop/Tablet Centering */}
        <View style={styles.appShell}>
          {/* Top Header */}
          <Header />

          {/* Main Tab Stage */}
          <View style={styles.mainContent}>
            {renderActiveTab()}
          </View>

          {/* Bottom Floating Navigation */}
          <BottomNavbar />
        </View>

        {/* Global Modals & Drawers */}
        <ProfileModal />
        <DischargeModal />
        <NewPostModal />
        <ArticleModal />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    flex: 1,
    backgroundColor: '#FAF7F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: 580,
    backgroundColor: '#FAF7F5',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 0 50px rgba(0, 0, 0, 0.05)',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

