import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../src/constants/theme';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
}); 