import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailsScreen({ route, navigation }) {

    // console.log(route.params.event)

    // const event_name = route?.params?.event.name;
    // const number_of_police = route.params?.event?.personnels?.length;
    // const start_date = new Date(route?.params?.event?.start);
    // const end_date = new Date(route?.params?.event?.end);
    // const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // const formattedStartDate = start_date.toLocaleDateString('en-US', options);
    // const formattedEndDate = end_date.toLocaleDateString('en-US', options);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/stats.png')}
                    style={styles.image}
                />
                <View  />
                <Ionicons name="md-arrow-back" size={32} color="red" style={styles.backButton} onPress={() => navigation.navigate('Home')}/>
                
            </View>
            
            <View style={styles.detailsContainer}>
            <View style={{marginBottom: 10}}>
                <Text style={styles.title}>PotHoles Data 📑️ 📑️</Text>
            </View>
                <View style={styles.detailsRow}>
                  
                    <View style={styles.titleCon}>
                        <Text style={styles.priText}> Date Range </Text>
                    </View>
                    <Text style={styles.detailsText}> : 1 May - 5 May 2023</Text>
                </View>
                <View style={styles.detailsRown}>
                    <Text style={styles.detailsTextn}>250</Text>
                    <View style={styles.titleCon}>
                        <Text style={styles.priText}> Spotted on Mumbai-Pune Expressway </Text>
                    </View>
                    
                </View>
                <View style={styles.detailsRown}>
                <Text style={styles.detailsTextn2}>12</Text>
                    <View style={styles.titleCon}>
                        <Text style={styles.priText}> Spotted in Karve Road, Pune </Text>
                    </View>

                </View>
               
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Hot Update: </Text>
                    <View style={styles.desCon}>
                        <Text style={styles.descriptionText}>
                        Cracks, potholes on Mumbai-Pune Expressway days after inauguration by PM Modi; draws criticism on Twitter
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 250,
    },
    imageOverlay: {
        position: 'absolute',
        width: '100%',
        height: 250,
        backgroundColor: 'black',
        opacity: 0.3,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    title: {
        position: 'relative',
        margin: '2%',
        // bottom: 20,
        left: 20,
        // fontFamily: 'Poppins-Bold',
        fontSize: 28,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: '#000000',
        zIndex: 1,
    },
    detailsContainer: {
        padding: 20,
    },
    titleCon: {
        backgroundColor: '#80471C',
        paddingHorizontal: 18,
        marginLeft: 5,
        paddingVertical: 12,
        borderRadius: 12,
    },
    desCon: {
        backgroundColor: '#80471C',
        padding: 20,
        borderRadius: 10,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailsRown: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailsText: {
        // fontFamily: 'Poppins-Regular',
        fontSize: 18,
        color: '#10332E',
        fontWeight: 'bold',
        // left: 100
        // marginLeft: 10,
    },
    detailsTextn: {
        fontSize: 34,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'red',        
        marginBottom: 10,
    },
    detailsTextn2: {
        fontSize: 34,
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#F6BE00',        
        marginBottom: 10,
    },
    priCon: {
        backgroundColor: '#C70039',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    priText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    descriptionContainer: {
        marginTop: 20,
    },
    descriptionTitle: {
        // fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#4A2511',
        fontWeight: '600',
        marginBottom: 10,
    },
    descriptionText: {
        // fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#FFFFFF',
    }
});

