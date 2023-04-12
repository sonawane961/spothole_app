import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {
    Ionicons,
    AntDesign,
    FontAwesome,
    MaterialCommunityIcons,
    Entypo,
    FontAwesome5,
} from '@expo/vector-icons';
import axios from 'axios';
import * as Font from 'expo-font';
import { host } from '../ip';

const customFonts = {
    Poppins: require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    Raleway: require('../assets/fonts/Raleway/static/Raleway-Black.ttf'),
};

export default function OnboardingScreen({ route, navigation }) {
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, ssetPhoneNumber] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);

    const loadFonts = async () => {
        await Font.loadAsync(customFonts);
        setFontLoaded(true);
    };

    useEffect(() => {
        loadFonts();
    }, []);

    const handleContinue = () => {
        // Validate form fields and navigate to next page
        setPage(page + 1);
    };

    const handlePrevious = () => {
        // Validate form fields and navigate to next page
        setPage(page - 1);
    };

    const handleSubmit = async () => {
        // Validate form fields and submit form
        console.log(password, id, typeof id, typeof Number(id));
        const data = await axios.post(`${host}/api/personnel/login`, {
            id_number: Number(id),
            password: password,
        });
        console.log(data.data);
    };

    const nextPage = () => setPage(page + 1);

    if (!fontLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../assets/logo_name.png')}
                />
            </View>
            {/* ------------------- FORM 1 ------------------ */}
            {page === 1 && (
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.indexActive}>{page}</Text>
                            <Text style={styles.index}> / 2</Text>
                        </View>
                        <Text style={styles.title}>
                            Police Registration 👮‍♂️️
                        </Text>
                        <View style={styles.inputContainer}>
                            <FontAwesome name='user-o' style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder='Full Name'
                                onChangeText={(text) => setName(text)}
                                value={name}
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <AntDesign name='idcard' style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder='Police ID Number'
                                onChangeText={(_id) => setId(_id)}
                                value={id}
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <MaterialCommunityIcons
                                name='police-badge-outline'
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Station Designation'
                                onChangeText={(text) => setName(text)}
                                value={id}
                                autoCapitalize='none'
                            />
                        </View>
                        {/* <View style={styles.inputRow}>

                        </View> */}
                        <TouchableOpacity
                            style={styles.continue}
                            onPress={handleContinue}
                        >
                            <Text style={styles.contText}>Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* ------------------- FORM 2 ------------------ */}

            {page === 2 && (
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.indexActive}>{page}</Text>
                            <Text style={styles.index}> / 2</Text>
                        </View>
                        <Text style={styles.title}>Police Registration 👮‍♂️</Text>
                        {/* <View style={styles.inputContainer}>
                            <MaterialCommunityIcons name="police-station" style={styles.icon} />
                            <TextInput style={styles.input}
                                placeholder="Posted Station"
                                onChangeText={text => setName(text)}
                                value={id}
                                autoCapitalize="none"
                            />
                        </View> */}
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name='barcode-outline'
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Password'
                                onChangeText={(_password) =>
                                    setPassword(_password)
                                }
                                value={password}
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <FontAwesome5
                                name='teamspeak'
                                style={styles.icon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder='Station Department'
                                onChangeText={(text) => setName(text)}
                                value={id}
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Entypo name='old-mobile' style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder='Phone Number'
                                value={phoneNumber}
                                onChangeText={(text) => setName(text)}
                                keyboardType='phone-pad'
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.previous}
                            onPress={handlePrevious}
                        >
                            <Text style={styles.prevText}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.continue}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.contText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Ionicons
                                name='md-checkmark-circle'
                                size={28}
                                color='#FFFFFF'
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        width: '80%',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        height: 275,
        width: 275,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
        width: '100%',
        marginTop: '-4%',
    },
    indexActive: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#EE825F',
    },
    index: {
        fontFamily: 'Poppins',
        fontSize: 16,
    },
    title: {
        fontFamily: 'Poppins',
        fontSize: 20,
        margin: 10,
        marginBottom: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        height: 50,
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    input: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#000',
        width: '90%',
        paddingHorizontal: 5,
    },
    continue: {
        backgroundColor: '#4A2511',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    previous: {
        borderColor: '#4A2511',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 9,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    contText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#FFFFFF',
    },
    prevText: {
        fontFamily: 'Poppins',
        fontSize: 16,
        color: '#4A2511',
    },
    submitButton: {
        backgroundColor: '#4A2511',
        borderRadius: 50,
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 25,
        right: 10,
    },

    icon: {
        marginRight: 10,
        fontSize: 20,
        color: '#000',
    },
});
