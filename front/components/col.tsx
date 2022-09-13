import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
 
export default class Col extends Component{
  render() {
    let customStyles = Object.assign({}, this.props.customStyles, styles.container);
    return (
      <View style={customStyles}>
      {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      marginLeft: 5,
      marginRight: 5,
  }
});