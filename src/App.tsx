import { Box, Container, VStack, Button, HStack, Text, Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { BackgroundAnimation } from './components/Layout/BackgroundAnimation';
import { ProvisionTest } from './components/TestModes/ProvisionTest';
import { DeprovisionTest } from './components/TestModes/DeprovisionTest';
import { FiUserPlus, FiUserMinus } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const LandingPage = () => {
  const { setTestMode, reset } = useApp();

  const handleSelectMode = (mode: 'provision' | 'deprovision') => {
    reset();
    setTestMode(mode);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Box
        position="relative"
        minH="100vh"
        _before={{
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/axsdc.png)',
          backgroundRepeat: 'repeat',
          backgroundPosition: '0 0',
          backgroundSize: '200px 200px',
          opacity: 0.1,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <VStack spacing={8} py={12} position="relative" zIndex={1}>
        <Heading size="xl" textAlign="center">
          IT Auditor Assistant
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center" maxW="600px">
          Automate GITC (General IT Controls) testing for user access provision and deprovision.
          All processing happens locally in your browser - no data is sent to any server.
        </Text>

        <HStack spacing={6} mt={8} flexWrap="wrap" justify="center">
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              size="lg"
              bg="transparent"
              color="white"
              _hover={{ bg: 'rgba(76, 175, 80, 0.2)' }}
              leftIcon={<Icon as={FiUserPlus} />}
              onClick={() => handleSelectMode('provision')}
              minW="250px"
              h="120px"
              flexDirection="column"
              gap={3}
              border="2px solid"
              borderColor="emerald.400"
              backdropFilter="blur(10px)"
            >
              <VStack spacing={2}>
                <Text fontSize="xl" fontWeight="bold">
                  User Provision Testing
                </Text>
                <Text fontSize="sm" fontWeight="normal" opacity={0.9}>
                  Compare userlists to find new provisions
                </Text>
              </VStack>
            </Button>
          </motion.div>

          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              size="lg"
              bg="transparent"
              color="white"
              _hover={{ bg: 'rgba(76, 175, 80, 0.2)' }}
              leftIcon={<Icon as={FiUserMinus} />}
              onClick={() => handleSelectMode('deprovision')}
              minW="250px"
              h="120px"
              flexDirection="column"
              gap={3}
              border="2px solid"
              borderColor="emerald.400"
              backdropFilter="blur(10px)"
            >
              <VStack spacing={2}>
                <Text fontSize="xl" fontWeight="bold">
                  User Deprovision Testing
                </Text>
                <Text fontSize="sm" fontWeight="normal" opacity={0.9}>
                  Verify timely deprovisioning compliance
                </Text>
              </VStack>
            </Button>
          </motion.div>
        </HStack>
        </VStack>
      </Box>
    </motion.div>
  );
};

const AppContent = () => {
  const { testMode, reset } = useApp();

  return (
    <Box minH="100vh" display="flex" flexDirection="column" position="relative" bg="#0a0a0a">
      <BackgroundAnimation />
      <Box position="relative" zIndex={1} width="100%">
        <Header />
        <Container maxW="container.xl" flex="1" py={8}>
        {testMode === null ? (
          <LandingPage />
        ) : testMode === 'provision' ? (
          <Box>
            <Button mb={4} onClick={reset} variant="ghost" color="emerald.400" _hover={{ bg: 'emerald.900' }}>
              ← Back to Home
            </Button>
            <ProvisionTest />
          </Box>
        ) : (
          <Box>
            <Button mb={4} onClick={reset} variant="ghost" color="emerald.400" _hover={{ bg: 'emerald.900' }}>
              ← Back to Home
            </Button>
            <DeprovisionTest />
          </Box>
        )}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;


