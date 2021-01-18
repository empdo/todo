import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';

import InputField from './components/InputField'

export default class App extends React.Component {
     handleInput = (input) => {
            alert(input);
     }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
             <TextInput style = {styles.input}
                       underlineColorAndroid = "black"
                       placeholderTextColor = "#9a73ef"
                       autoCapitalize = "none"
                       onSubmitEditing = {(event) => (this.handleInput(event.nativeEvent.text))}/>
        </View>
       </View>
    );
  }
}
var styles = StyleSheet.create({
  container: {
    backgroundColor: '#c7bed6',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '55%',
    textAlign: 'center',
  }
});
