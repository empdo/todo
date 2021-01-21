import React from 'react';
import {TextInput} from 'react-native';

const InputField = (props) => {
  const [value, onChangeText] = React.useState('Useless Placeholder');
  return (
    <TextInput
      style={{height: 40, borderColor: 'gray', borderWidth: 1}}
      onChangeText={this.handelInput}
      value={value}
    />
  );
};

export default InputField;
