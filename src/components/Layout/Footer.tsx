import { Box, Text, Center } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Box as="footer" bg="black" py={4} mt="auto" borderTop="2px solid" borderColor="emerald.600">
      <Center>
        <Text fontSize="sm" color="emerald.400">
          © {new Date().getFullYear()} IT Auditor Assistant - All processing done locally in your browser
        </Text>
      </Center>
    </Box>
  );
};


