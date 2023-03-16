import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import SectionListSidebar from '@components/flashlist/SectionListSidebar';
import { HangulUtils, Storage, RegEx, i18n } from '@utils/index';

const windowHeight = Dimensions.get('window').height;

interface Data {
    key: string;
    title: string;
    data: string[];
}

const RenderItem = ({ item }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{item}</Text>
        </View>
    );
};

const RenderItem0 = memo(RenderItem);

const SectionListSidebarLayout = () => {
    const [data, setData] = useState<Data[]>([]);
    const sidebarRef = useRef<any>();
    const [isShow, setIsShow] = useState<boolean>(false);
    const [indicatorText, setIndicatorText] = useState<string>('');

    let language = '';

    useEffect(() => {
        /*
         * TODO: react-i18next
         */
        language = 'ko';

        const names = [
            '김명성',
            '김현민',
            '나명성',
            '다명성',
            '라현민',
            '마현민',
            '바명성',
            '사명성',
            '아현민',
            '자현민',
            '차명성',
            '카명성',
            '타명성',
            '파현민',
            '하현민',
            'Angular',
            // 'Alpine.js' // Regex 특문 처리
            'Ember',
            'Preact',
            'Zulu',
            '名前',
        ];

        setData(createContactDataset(names));
    }, []);

    const createContactDataset = (names: string[]) => {
        const sectionInfoList: Data[] = [
            /* {
                key: 'ㄱ',
                title: 'ㄱ',
                data: ['김명성', '김현민'],
            }, */
        ];

        const uniqueFirstConsonants = [
            ...new Set(
                names.map(name => {
                    if (!name) {
                        return;
                    }

                    switch (language) {
                        case 'ko':
                            if (RegEx.isKorean(name)) {
                                return HangulUtils.getConstantVowel(name)
                                    ?.firstConsonant!;
                            } else if (RegEx.isEnglish(name)) {
                                return name[0].toUpperCase();
                            } else {
                                return '#';
                            }

                        default:
                            if (RegEx.isEnglish(name)) {
                                return name[0].toUpperCase();
                            } else {
                                return '#';
                            }
                    }
                }),
            ),
        ];

        uniqueFirstConsonants.forEach(firstConsonants => {
            const obj = {
                key: firstConsonants!,
                title: firstConsonants!,
                data: [],
            };

            sectionInfoList.push(obj);
        });

        names.forEach(name => {
            let currentFirstConsonant: string = '';

            switch (language) {
                case 'ko':
                    if (RegEx.isKorean(name)) {
                        currentFirstConsonant =
                            HangulUtils.getConstantVowel(name)?.firstConsonant!;
                    } else if (RegEx.isEnglish(name)) {
                        currentFirstConsonant = name[0].toUpperCase();
                    } else {
                        currentFirstConsonant = '#';
                    }
                    break;

                default:
                    if (RegEx.isEnglish(name)) {
                        currentFirstConsonant = name[0].toUpperCase();
                    } else {
                        currentFirstConsonant = '#';
                    }
                    break;
            }

            for (const index in sectionInfoList) {
                if (sectionInfoList[index].key === currentFirstConsonant) {
                    sectionInfoList[index]?.data?.push(name);
                }
            }
        });

        return sectionInfoList;
    };

    const jumpToSection = (sectionIndex, itemIndex = 0) => {
        try {
            sidebarRef.current!.scrollToLocation({
                sectionIndex,
                itemIndex,
            });
        } catch (e) {}
    };

    const renderSidebarItem = useCallback(({ item, index }) => {
        return (
            <View key={item} style={{ paddingVertical: 10 }}>
                <Pressable
                    onPressIn={() => {
                        jumpToSection(index);
                        setIndicatorText(item);
                        setIsShow(true);
                    }}
                    onPressOut={() => {
                        setIsShow(false);
                    }}
                    style={[styles.sidebarBtn]}>
                    <Text
                        style={[
                            styles.sidebarText,
                            index % 2 === 1 && {
                                fontSize: 5,
                                fontWeight: '900',
                            },
                        ]}>
                        {index % 2 ? '·' : item}
                    </Text>
                </Pressable>
            </View>
        );
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <SectionListSidebar
                ref={sidebarRef}
                sectionHeaderStyle={{ color: 'black' }}
                itemHeight={30}
                sectionHeaderHeight={30}
                stickySectionHeadersEnabled={true}
                sections={data}
                data={data}
                selectedText={indicatorText}
                isSelectedShow={isShow}
                renderItem={({ item }) => <RenderItem0 item={item} />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 8,
    },
    item: {
        padding: 3,
        marginVertical: 4,
        height: 30,
    },
    header: {
        justifyContent: 'center',
        fontSize: 16,
        height: 28,
    },
    title: {
        fontSize: 14,
        color: 'black',
    },
    sidebarBtn: {
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sidebarContainer: {
        flex: 1,
        opacity: 0.8,
        position: 'absolute',
        bottom: 0,
        top: 20,
        right: 0,
        justifyContent: 'center',
        height: (windowHeight * 2) / 3,
    },
    sidebarText: {
        flex: 1,
        fontSize: 10,
        color: '#222',
        justifyContent: 'center',
        textAlignVertical: 'center',
    },
});

export default SectionListSidebarLayout;
