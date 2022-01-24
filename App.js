import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import Index from './src/index';


export default function App() {
  return (
    <PaperProvider>
      <Index />
    </PaperProvider>
  );
}


