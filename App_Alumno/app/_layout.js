import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Creamos el cliente de React Query
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false, 
        }}
      >
        {}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {}
        <Stack.Screen 
          name="login" 
          options={{ 
            title: 'Iniciar Sesión',
            headerShown: false 
          }} 
        />

        {}
        <Stack.Screen 
          name="register" 
          options={{ 
            title: 'Registro',
            headerShown: true 
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}