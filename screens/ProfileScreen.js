import React from 'react';
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ route, navigation }) {
    console.log(route.params.profile)

    const name = route.params.profile.firstName + ' ' + route.params.profile.lastName
    const batch = route.params.profile.batch
    const dob = new Date(route.params.profile.dob)
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dob.toLocaleDateString('en-US', options);
    const id_number = route.params.profile.id_number
    const station_name = route.params.profile.station.name
    const station_address = route.params.profile.station.address

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['rgba(220, 185, 138, 1)', 'rgba(242, 220, 172, 1)', 'rgba(255, 245, 210, 1)']}
                style={styles.background}
            />
            <Ionicons name="md-arrow-back" size={28} color="#FFFFFF" style={styles.backButton} onPress={() => navigation.navigate('Home')}/>
            <View style={styles.header}>
                <Image
                    style={styles.profileImage}
                    source={require('../assets/police.png')}
                />
                <Text style={styles.profileName}>{name}</Text>
                <Text style={styles.profileBatch}>Batch {batch}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date of Birth:</Text>
                        <Text style={styles.infoValue}>{formattedDate}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>ID Number:</Text>
                        <Text style={styles.infoValue}>{id_number}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Station Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Station Name:</Text>
                        <Text style={styles.infoValue}>{station_name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Address:</Text>
                        <Text style={styles.infoValue}>{station_address}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        marginTop: '30%',
        marginBottom: '10%',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: '5%',
        backgroundColor: '#4A2511',
        resizeMode: 'contain',
        padding: '2%'
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    profileBatch: {
        fontSize: 16,
        color: '#666',
    },
    content: {
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: '10%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        width: '40%',
    },
    infoValue: {
        fontSize: 16,
        color: '#666',
        width: '60%',
    },
});

