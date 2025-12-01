import { StatusBar } from 'expo-status-bar';
import { ApplicationContent } from '@/components/root/application-content';
import { Providers } from '@/components/root/providers';

export default function App() {
  return (
    <Providers>
      <StatusBar style="auto" />
      <ApplicationContent />
    </Providers>
  );
}
