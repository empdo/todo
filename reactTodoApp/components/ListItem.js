import React, {Component} from 'react';
import {TextInput, View, StyleSheet, Text} from 'react-native';

const ListItem = (props) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.checkBox} />
      <Text style={styles.text}>{props.children}</Text>
    </View>
  );
};

var styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
  },
  checkBox: {
    height: 10,
    width: 10,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    marginTop: 4,
  },
  text: {
    marginLeft: 5,
    fontSize: 15,
  },
});

export default ListItem;
