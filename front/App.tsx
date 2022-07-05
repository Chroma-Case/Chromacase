import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ColorValue } from 'react-native';
import ColorTheme from './Theme';

const ExampleBox = (props: { textColor: ColorValue, backgroundColor: ColorValue }) => (
  <View style={{ backgroundColor: props.backgroundColor }}>
    <Text style={{ fontSize: 20, textAlign: 'center', color: props.textColor }} >Hello</Text>
  </View>
)

export default function App() {
  return (
    <View style={styles.container}>
      <ExampleBox backgroundColor={ColorTheme.primary} textColor={ColorTheme.onPrimary}/>
      <ExampleBox backgroundColor={ColorTheme.primaryVariant} textColor={ColorTheme.onPrimary}/>
      <ExampleBox backgroundColor={ColorTheme.secondary} textColor={ColorTheme.onSecondary}/>
      <ExampleBox backgroundColor={ColorTheme.secondaryVariant} textColor={ColorTheme.onPrimary}/>
      <ExampleBox backgroundColor={ColorTheme.error} textColor={ColorTheme.onError}/>
      <ExampleBox backgroundColor={ColorTheme.surface} textColor={ColorTheme.onSurface}/>
      <ExampleBox backgroundColor={ColorTheme.surface} textColor={ColorTheme.placeholder}/>
      <ExampleBox backgroundColor={ColorTheme.background} textColor={ColorTheme.onBackground}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
