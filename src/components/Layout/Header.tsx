import { Box, Heading, HStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Box
        bg="black"
        color="emerald.400"
        py={4}
        px={6}
        boxShadow="md"
        borderBottom="2px solid"
        borderColor="emerald.600"
      >
      <HStack spacing={4}>
        <Heading size="lg">IT Auditor Assistant</Heading>
        <Box fontSize="sm" opacity={0.9}>
          GITC User Access Testing Tool
        </Box>
      </HStack>
    </Box>
    </motion.header>
  );
};


