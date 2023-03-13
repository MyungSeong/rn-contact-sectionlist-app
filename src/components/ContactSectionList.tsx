import React, { useEffect } from 'react';
import { View, SectionList, StyleSheet, Button, Text } from 'react-native';

const contacts = [
    {
        index: 0,
        name: 'Carolyn Colon',
    },
    {
        index: 1,
        name: 'Bryant Olsen',
    },
    {
        index: 2,
        name: 'Michelle Vasquez',
    },
    {
        index: 3,
        name: 'Slater Holland',
    },
    {
        index: 4,
        name: 'Parrish Bowman',
    },
    {
        index: 5,
        name: 'Enid Fowler',
    },
    {
        index: 6,
        name: 'Twila Price',
    },
    {
        index: 7,
        name: 'Hawkins Mills',
    },
    {
        index: 8,
        name: 'Eileen Roth',
    },
    {
        index: 9,
        name: 'Amda Hells',
    },
];

const ContactSectionList = () => {
    useEffect(() => {
        console.log(JSON.stringify(generateSectionData(contacts)));
    }, []);

    const generateSectionData = data => {
        const contactsArray = [];
        const alphabetBaseUnicode: string = 'A'.charCodeAt(0);

        for (let i = 0; i < 26; i++) {
            const currentChar: string = String.fromCharCode(
                alphabetBaseUnicode + i,
            );

            let obj = {
                title: currentChar,
                data: {},
            };

            const currentContacts = data.filter(
                contact => contact.name[0].toUpperCase() === currentChar,
            );

            if (currentContacts.length > 0) {
                currentContacts.sort((a, b) => a.name.localeCompare(b.name));

                obj.data = currentContacts;

                contactsArray.push(obj);
            }
        }

        return contactsArray;
    };

    return (
        <View style={styles.container}>
            <SectionList
                sections={generateSectionData(contacts)}
                ListHeaderComponent={<Button title="연락처" />}
                renderItem={({ item }) => (
                    <View styles={styles.row}>
                        <Text>{item.name}</Text>
                    </View>
                )}
                renderSectionHeader={section => (
                    <View styles={styles.sectionHeader}>
                        <Text>{section.title}</Text>
                    </View>
                )}
                keyExtractor={item => item.index}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignSelf: 'stretch',
        paddingVertical: 20,
    },
    row: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sectionHeader: {
        backgroundColor: '#efefef',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});

export default ContactSectionList;
