import { StatusBar } from 'expo-status-bar';
import { Text, View, ColorValue } from 'react-native';
import { Provider as PaperProvider, useTheme } from 'react-native-paper';
import Theme from './Theme';

const ExampleBox = (props: { textColor: ColorValue, backgroundColor: ColorValue }) => (
  <View style={{ backgroundColor: props.backgroundColor }}>
    <Text style={{ fontSize: 20, textAlign: 'center', color: props.textColor }} >Hello</Text>
  </View>
)

export function AppContent() {
  const { colors } = useTheme();
  return (
    <View style={{flex: 1, justifyContent: 'center' }}>
      <ExampleBox backgroundColor={colors.primary} textColor={colors.text}/>
      <ExampleBox backgroundColor={colors.accent} textColor={colors.text}/>
      <ExampleBox backgroundColor={colors.error} textColor={colors.text}/>
      <ExampleBox backgroundColor={colors.surface} textColor={colors.onSurface}/>
      <ExampleBox backgroundColor={colors.surface} textColor={colors.placeholder}/>
      <ExampleBox backgroundColor={colors.notification} textColor={colors.text}/>
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <PaperProvider theme={Theme}>
      <AppContent/>
    </PaperProvider>
  );
}
