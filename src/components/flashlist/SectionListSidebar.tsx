import React, {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Animated,
    Easing,
    ListRenderItem,
    PanResponder,
    PixelRatio,
    SectionList,
    SectionListData,
    SectionListProps,
    StyleProp,
    StyleSheet,
    Text,
    TextProps,
    TextStyle,
    TouchableOpacity,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import SectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import { FlashList } from '@shopify/flash-list';

import TextIndicator from '@components/TextIndicator';

interface SectionListDataType {
    key: string;
    title: string;
    data: Array<any>;
}

interface SectionListSidebarProps extends SectionListProps<any, any> {
    //general
    containerStyle?: StyleProp<ViewStyle>;
    rtl?: boolean;

    //sectionList
    renderSectionHeader?:
        | ((info: {
              section: SectionListData<any, any>;
          }) => React.ReactElement | null)
        | undefined;
    data: SectionListDataType[];
    sectionHeaderTextStyle?: StyleProp<TextStyle>;
    sectionHeaderStyle?: StyleProp<ViewStyle>;

    //getItemList
    itemHeight?: number;
    sectionHeaderHeight?: number;
    footerHeaderHeight?: number;
    separatorHeight?: number;
    listHeaderHeight?: number;

    //sidebar
    renderSidebarItem?: ListRenderItem<string>;
    sidebarContainerStyle?: StyleProp<ViewStyle>;
    sidebarItemStyle?: StyleProp<ViewStyle>;
    sidebarItemTextStyle?: StyleProp<TextStyle>;
    selectedText?: string;
    isSelectedShow?: boolean;
    maxSidebarText?: number;
    sidebarItemHeight?: number;
}

const fadeInDuration = 200;
const fadeOutDuration = 200;
const duration = 1000;

const SectionListSidebar = (
    {
        rtl = false,
        sectionHeaderHeight = 30,
        itemHeight = 30,
        footerHeaderHeight = 0,
        separatorHeight = 0,
        listHeaderHeight = 0,
        renderSectionHeader = undefined,
        renderSidebarItem = undefined,
        containerStyle,
        sectionHeaderStyle,
        sidebarContainerStyle,
        sidebarItemStyle,
        sidebarItemTextStyle,
        data,
        selectedText = '',
        isSelectedShow,
        maxSidebarText = 20,
        ...props
    }: SectionListSidebarProps,
    ref: React.LegacyRef<SectionList>,
) => {
    const sidebarRef = useRef<View>();
    const timerRef = useRef<NodeJS.Timeout>();

    const [isShow, setIsShow] = useState<boolean>(false);
    const [indicatorText, setIndicatorText] = useState<string>('');
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);
    const [sidebarItemHeight, setSidebarItemHeight] = useState<number>(0);
    const sidebarOpacity = useRef(new Animated.Value(0)).current;
    const [sidebarIdentifyData, setSidebarIdentifyData] = useState<any[]>([]);

    useEffect(() => {
        const identifyData = data.map(sectionData => {
            return { key: sectionData.key };
        });

        setSidebarIdentifyData(identifyData);
    }, [data]);

    const onLayout = useCallback(
        event => {
            const { height } = event.nativeEvent.layout;
            setSidebarItemHeight(height * (0.95 / sidebarIdentifyData.length));
        },
        [sidebarIdentifyData],
    );

    const close = useCallback(() => {
        Animated.timing(sidebarOpacity, {
            delay: 0,
            toValue: 0,
            easing: Easing.out(Easing.ease),
            duration: fadeOutDuration,
            useNativeDriver: false,
        }).start(() => {
            setVisibleSidebar(false);
        });
    }, [sidebarOpacity]);

    const show = useCallback(() => {
        setVisibleSidebar(true);
        Animated.timing(sidebarOpacity, {
            delay: 0,
            toValue: 0.7,
            easing: Easing.out(Easing.ease),
            duration: fadeInDuration,
            useNativeDriver: false,
        }).start(() => {
            clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                close();
            }, duration);
        });
    }, [sidebarOpacity]);

    const sectionKeyExtract = (item, index) => {
        return item + index;
    };

    const getItemLayout = SectionListGetItemLayout({
        getItemHeight: (rowData, sectionIndex, rowIndex) => itemHeight,
        getSectionHeaderHeight: () => sectionHeaderHeight,
        getSectionFooterHeight: () => footerHeaderHeight,
        getSeparatorHeight: () => separatorHeight / PixelRatio.get(),
        listHeaderHeight: () => listHeaderHeight,
    });

    const defaultSectionHeader = ({ section }: SectionListData<any, any>) => (
        <Text style={[styles.sectionHeaderStyle, sectionHeaderStyle]}>
            {section.title}
        </Text>
    );

    const setTargetIndexList = (input: string[]) => {
        const targetIndexList = sidebarIdentifyData
            .map(item => input.indexOf(item.key))
            .map((item, index, array) => {
                if (item === -1) {
                    for (var i = index; i <= array.length; i++) {
                        if (array[i] === undefined) continue;
                        if (array[i] !== -1) {
                            return array[i];
                        }
                    }

                    return input.length;
                }

                return item;
            });

        return targetIndexList;
    };

    const panResponder = useMemo(() => {
        var index = 0;
        const targetList = setTargetIndexList(data.map(item => item.key));
        return PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsShow(true);
            },
            onPanResponderMove: (
                event,
                { dx, dy, x0, y0, vx, vy, moveX, moveY },
            ) => {
                show();

                sidebarRef.current?.measure((fx, fy, width, height, px, py) => {
                    index = Math.floor((moveY - py) / sidebarItemHeight);

                    if (0 <= index && index < sidebarIdentifyData.length) {
                        setIndicatorText(sidebarIdentifyData[index].key);
                        jumpToSection(targetList[index], 0);
                    }
                    try {
                    } catch (e) {
                        console.log('[!] move Error : ', e);
                    }
                });

                return false;
            },
            onPanResponderEnd: () => {
                setIsShow(false);
            },
        });
    }, [sidebarItemHeight]);

    const jumpToSection = useCallback(
        (sectionIndex, itemIndex = 0) => {
            try {
                ref!.current.scrollToLocation({
                    sectionIndex,
                    itemIndex,
                });
            } catch (e) {}
        },
        [ref],
    );

    const renderDefaultSidebarItem = useCallback(
        ({ item, index }) => {
            return (
                <View key={item}>
                    <TouchableOpacity
                        pressRetentionOffset={{
                            bottom: 5,
                            left: 5,
                            right: 5,
                            top: 5,
                        }}
                        hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
                        style={[styles.sidebarItemStyle, sidebarItemStyle]}>
                        <Text
                            style={[
                                styles.sidebarItemTextStyle,
                                sidebarItemTextStyle,
                                {
                                    height: sidebarItemHeight,
                                },
                            ]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        },
        [
            jumpToSection,
            sidebarItemStyle,
            sidebarItemTextStyle,
            sidebarItemHeight,
        ],
    );

    const contacts = data.reduce((contactsMap, contact) => {
        const lastNameInitial = contact.key;
        const currentLetterContacts = contactsMap.get(lastNameInitial) ?? [];
        contactsMap.set(lastNameInitial, [...currentLetterContacts, contact]);
        return contactsMap;
    }, new Map<string, any[]>());
    
    contacts.forEach(
        (_contacts: any[], key: string, map: Map<string, any[]>) => {
            const sortedContacts = _contacts.sort((aContact, bContact) =>
                aContact.lastName.localeCompare(bContact.lastName),
            );
            map.set(key, sortedContacts);
        },
    );

    const contactsWithTitles = Array.from(contacts.keys())
        .sort((aKey, bKey) => aKey.localeCompare(bKey))
        .flatMap(key => {
            return [key, ...(contacts.get(key) ?? [])];
        });

    return (
        <View style={[styles.container, containerStyle]} onLayout={onLayout}>
            <TextIndicator isShow={isShow} text={indicatorText} />
            <View
                style={{
                    flexDirection: rtl === true ? 'row-reverse' : 'row',
                    width: '100%',
                    height: '100%',
                }}>
                <FlashList
                    data={contactsWithTitles}
                    renderItem={({ item }) => {
                        console.log(item);

                        return (
                            <View>
                                <Text
                                    style={{
                                        color: 'black',
                                    }}>
                                    {item.data}
                                </Text>
                            </View>
                        );
                    }}
                    getItemType={item =>
                        typeof item === 'string' ? 'sectionHeader' : 'row'
                    }
                    estimatedItemSize={100}
                />
                {/* <SectionList
                    keyExtractor={sectionKeyExtract}
                    getItemLayout={getItemLayout}
                    onScroll={() => {
                        show();
                        setVisibleSidebar(true);
                    }}
                    renderSectionHeader={
                        renderSectionHeader || defaultSectionHeader
                    }
                    ref={ref}
                    sections={data}
                    {...props}
                /> */}
                <Animated.View
                    ref={sidebarRef}
                    style={[
                        styles.sidebarItemContainerStyle,
                        sidebarContainerStyle,
                        { opacity: sidebarOpacity },
                    ]}
                    {...panResponder.panHandlers}>
                    {visibleSidebar &&
                        sidebarIdentifyData
                            .map(item => item.key)
                            .map((item, index) =>
                                renderSidebarItem === undefined
                                    ? renderDefaultSidebarItem({ item, index })
                                    : renderSidebarItem({ item, index }),
                            )}
                </Animated.View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionHeaderStyle: {
        justifyContent: 'flex-end',
        textAlignVertical: 'center',
        padding: 5,
        height: 30,
        fontSize: 14,
        paddingLeft: 10,
        backgroundColor: '#e5e5e5',
    },
    sidebarItemContainerStyle: {
        position: 'absolute',
        top: '2%',
        right: 0,
        justifyContent: 'center',
        backgroundColor: '#e5e5e5',
        borderRadius: 50,
        marginHorizontal: 12,
        paddingTop: 10,
    },
    sidebarItemTextStyle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#222',
        justifyContent: 'center',
        textAlignVertical: 'center',
    },
    sidebarItemStyle: {
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default memo(forwardRef(SectionListSidebar));
