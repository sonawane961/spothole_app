import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailsScreen({ route, navigation }) {

    console.log(route.params.event)

    const event_name = route.params.event.name;
    const number_of_police = route.params.event.personnels.length;
    const start_date = new Date(route.params.event.start);
    const end_date = new Date(route.params.event.end);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedStartDate = start_date.toLocaleDateString('en-US', options);
    const formattedEndDate = end_date.toLocaleDateString('en-US', options);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/manase.jpg')}
                    style={styles.image}
                />
                <View style={styles.imageOverlay} />
                <Ionicons name="md-arrow-back" size={28} color="#FFFFFF" style={styles.backButton} onPress={() => navigation.navigate('Home')}/>
                <Text style={styles.title}>{event_name}🚩️🚩️</Text>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.detailsRow}>
                    <Ionicons name="md-calendar" size={24} color="#10332E" />
                    <View style={styles.titleCon}>
                        <Text style={styles.priText}> Date </Text>
                    </View>
                    <Text style={styles.detailsText}> : {formattedStartDate} - {formattedEndDate}</Text>
                </View>
                <View style={styles.detailsRow}>
                    <Ionicons name="md-time" size={24} color="#10332E" />
                    <View style={styles.titleCon}>
                        <Text style={styles.priText}> Time </Text>
                    </View>
                    <Text style={styles.detailsText}> : 10:00 AM - 12:00 PM</Text>
                </View>
                <View style={styles.detailsRow}>
                    <Ionicons name="md-people" size={24} color="#10332E" />
                    <View style={styles.titleCon}>
                        <Text style={styles.priText}> On-Duty Officers </Text>
                    </View>
                    <Text style={styles.detailsText}> 👮‍♂️ : {number_of_police} ️</Text>
                </View>
                <View style={styles.detailsRow}>
                    <Ionicons name="md-star" size={24} color="#10332E" />
                    <View style={styles.titleCon}>
                        <Text style={styles.priText}> Priority </Text>
                    </View>
                    <Text style={styles.detailsText}> : </Text>
                    <View style={styles.priCon}>
                        <Text style={styles.priText}> High </Text>
                    </View>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Description: </Text>
                    <View style={styles.desCon}>
                        <Text style={styles.descriptionText}>
                            MNS chief Raj Thackeray trained his guns at Maharashtra chief minister Eknath Shinde from the Shivaji Park after the latter held a public meeting at the same venue two weeks after Uddhav Thackeray had addressed a massive rally.
                        </Text>
                        <Text style={styles.descriptionText}>
                            {`\n`}Maharashtra Navnirman Sena (MNS) chief Raj Thackeray on Wednesday attacked chief minister Eknath Shinde for holding a public meeting at the same venue where Uddhav Thackeray had held a massive rally two weeks back.
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
        position: 'absolute',
        marginRight: '5%',
        bottom: 20,
        left: 20,
        // fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#FFFFFF',
        zIndex: 1,
    },
    detailsContainer: {
        padding: 20,
    },
    titleCon: {
        backgroundColor: '#10332E',
        paddingHorizontal: 7,
        marginLeft: 5,
        paddingVertical: 5,
        borderRadius: 12,
    },
    desCon: {
        backgroundColor: '#10332E',
        padding: 20,
        borderRadius: 10,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailsText: {
        // fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#10332E',
        fontWeight: '600',
        // marginLeft: 10,
    },
    priCon: {
        backgroundColor: '#C70039',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    priText: {
        color: '#FFFFFF',
    },
    descriptionContainer: {
        marginTop: 20,
    },
    descriptionTitle: {
        // fontFamily: 'Poppins-Bold',
        fontSize: 24,
        color: '#10332E',
        fontWeight: '600',
        marginBottom: 10,
    },
    descriptionText: {
        // fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#FFFFFF',
    }
});

