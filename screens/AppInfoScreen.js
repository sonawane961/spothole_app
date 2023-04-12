import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { Text } from "react-native-elements";
import { LinearGradient } from 'expo-linear-gradient';

import * as Font from 'expo-font';

const customFonts = {
  'Poppins': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
  'Raleway': require('../assets/fonts/Raleway/static/Raleway-Black.ttf'),
};

async function loadFonts() {
  await Font.loadAsync(customFonts);
}

loadFonts();

const AppInfoScreen = ({ route, navigation }) => {

  return (
    <>
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['rgba(220, 185, 138, 1)', 'rgba(242, 220, 172, 1)', 'rgba(255, 245, 210, 1)']}
          style={styles.background}
        />
        <Image
          source={require('../assets/logo_name.png')}
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.heading}>
            Welcome to our app, designed to help track police officers who are deployed to 
            bandobast duty. Our app is specifically created to address the problem statement PS13 of Kavach 2023
        </Text>
        <Text style={styles.body}>Crafted By :</Text>
        <Text style={styles.names}>Utsav Khatu{'\n'}Tushar Bauskar{'\n'}Saurabh Powar{'\n'}Shubham Nazare{'\n'}Asavari Ambavane{'\n'}Chaitravi Chalke</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default AppInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  image: {
    height: '30%',
    marginTop: "-5%"
  },
  heading: {
    fontSize: 14,
    fontFamily: 'Poppins',
    color: "black",
    paddingHorizontal: '10%',
    marginTop: '-5%',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Raleway',
    color: "black",
    paddingHorizontal: '10%',
    textAlign: 'center',
    marginTop: '4%',
    marginBottom: '2%'
  },
  names: {
    fontSize: 14,
    fontFamily: 'Raleway',
    color: "black",
    paddingHorizontal: '10%',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'black',
    width: '75%',
    marginTop: '15%',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 2,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    elevation: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: "500"
  },
});