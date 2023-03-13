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

import SectionListSidebar from '@/components/SectionListSidebar';
import { HangeulUtils, Storage } from '@/utils';

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

    useEffect(() => {
        const names = [
            '김현민',
            '님현민',
            '남명성',
            '다명성',
            '라현민',
            '강현민',
            '김명성',
            '이명성',
            '김현민',
            '강현민',
            '김명성',
            '이명성',
            '이명성',
            '김현민',
            '강현민',
            '김명성',
            '이명성',
            '이명성',
            '김현민',
            '강현민',
            '김명성',
            '이명성',
            '이명성',
            '김현민',
            '강현민',
            '김명성',
            '이명성',
            '김현민',
            '강현민',
            '김명성',
            'Adam',
            'Grace',
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
                names.map(
                    name =>
                        HangeulUtils.getConstantVowel(name)?.firstConsonant!,
                ),
            ),
        ];

        uniqueFirstConsonants.forEach(firstConsonants => {
            const obj = {
                key: firstConsonants,
                title: firstConsonants,
                data: [],
            };

            sectionInfoList.push(obj);
        });

        names.forEach(name => {
            const currentFirstConsonant: string =
                HangeulUtils.getConstantVowel(name)?.firstConsonant!;

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
                locale={'kor'}
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
