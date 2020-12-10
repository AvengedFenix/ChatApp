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
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.30,
      shadowRadius: 6.27,
      elevation: 10,
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
