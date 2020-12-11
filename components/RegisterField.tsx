import React from 'react';
import {TextInput, StyleSheet} from 'react-native';

interface Props {
  label: string;
  action: any;
  textType: string;
  secure?: boolean;
}

const defaultProps: Props = {
  secure: false,
};

const PhoneField = ({
  label,
  textType,
  action,
  secure,
  onContentSizeChange,
}: Props) => {
  const styles = StyleSheet.create({
    textField: {
      marginHorizontal: 5,
      paddingLeft: 25,
      backgroundColor: '#fff',
      borderRadius: 100,
      shadowColor: 'blue',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 100,
      elevation: 2,
      marginVertical: 20,
    },
  });

  return (
    <>
      <TextInput
        secureTextEntry={secure}
        style={styles.textField}
        placeholder={label}
        value={textType}
        onChangeText={(text) => {
          action(text);
          console.log(textType);
        }}
      />
    </>
  );
};

export default PhoneField;
