import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

export default class Row extends Component{
  render() {
    return (
      <View style={styles.container}>
      {this.props.children}
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  }
});