import React, {Component, useRef, useEffect} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    SafeAreaView,
    Animated,
    TouchableOpacity,
    TouchableHighlightBase,
} from 'react-native';
window.navigator.userAgent = 'react-native';

import ListItem from './components/ListItem';

var verySecretKey = 'alvearenpotatis';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            todoList: [],
            inputText: '',
            shouldShowBanner: true,
            shouldAnimBanner: true,
            itemsToRemove: [],
            itemsToPush: [],
        };
        this.wsConnect = this.wsConnect.bind(this);
        this.inputRef = React.createRef();
    }

    wsConnect() {
        this.socket = new WebSocket('wss://smartmirror.essung.dev/websocket');
        this.socket.onopen = () => {
            this.socket.send('3' + verySecretKey);
            this.socket.send('1');
            this.setState({shouldShowBanner: false});
            this.state.itemsToRemove.forEach((e) => {
                this.socket.send('2' + e);
            });
            this.state.itemsToPush.forEach((e) => {
                this.socket.send(e);
                this.setState({itemsToPush: []});
            });
            this.state.itemsToRemove = [];
            this.setState({itemsToRemove: []});

            this.setState({shouldAnimBanner: true});
        };

        this.socket.onmessage = (e) => {
            this.setState({todoList: JSON.parse(e.data), inputText: ''});
        };

        this.socket.onclose = (e) => {
            if (!this.state.shouldShowBanner) {
                this.setState({shouldShowBanner: true});
            }
            this.timeoutId = setTimeout(() => {
                this.wsConnect();
            }, 1000);
        };
    }

    handleInput() {
        var message =
            '0' +
            JSON.stringify({
                id: this.generateUUID(),
                text: this.state.inputText,
            });
        if (this.state.shouldShowBanner) {
            if (!this.state.itemsToRemove.includes(message)) {
                this.state.itemsToPush.push(message);
            }
        } else {
            this.socket.send(message);
        }

        this.setState({inputText: ''});
        if (!this.socket) {
            return;
        }
    }

    removeItem(id) {
        if (this.state.shouldShowBanner) {
            if (!this.state.itemsToRemove.includes(id)) {
                this.state.itemsToRemove.push(id);
            }
        } else {
            this.socket.send('2' + id);
        }
    }

    generateUUID() {
        // Public Domain/MIT
        var d = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            function (c) {
                var r = Math.random() * 16;
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
            },
        );
    }

    connectionBanner = (props) => {
        if (this.state.shouldAnimBanner) {
            const FadeInView = (props) => {
                const fadeAnim = useRef(new Animated.Value(0)).current;

                useEffect(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 40,
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => {
                        this.props.remove;
                        this.setState({shouldAnimBanner: false});
                    });
                }, [fadeAnim]);

                return (
                    <Animated.View
                        style={{
                            ...props.style,
                            marginTop: fadeAnim,
                        }}>
                        {props.children}
                    </Animated.View>
                );
            };
            return this.state.shouldShowBanner ? (
                <FadeInView>
                    <View style={styles.animBannerContainer}>
                        <Text style={styles.errorText}>
                            Could not connect to websocket, reconnecting...
                        </Text>
                    </View>
                </FadeInView>
            ) : undefined;
        }
        return this.state.shouldShowBanner ? (
            <View style={styles.bannerContainer}>
                <Text style={styles.errorText}>
                    Could not connect to websocket, reconnecting... 
                </Text>
            </View>
        ) : undefined;
    };

    componentDidMount() {
        this.wsConnect();
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
        this.socket.close();
    }

    render() {
        const todoItems = this.state.todoList.map((item) => {
            const slideAnim = new Animated.Value(40);
            const fadeAnim = new Animated.Value(1);

            return (
                <Animated.View
                    key={item.id}
                    style={[
                        {
                            height: slideAnim,
                            opacity: fadeAnim,
                        },
                    ]}>
                    <TouchableOpacity
                        data-id={item.id}
                        onPress={() => {
                            Animated.timing(fadeAnim, {
                                toValue: 0,
                                duration: 100,
                                useNativeDriver: false,
                            }).start();
                            Animated.timing(slideAnim, {
                                toValue: 0,
                                duration: 150,
                                useNativeDriver: false,
                            }).start(() => {
                                this.removeItem(item.id);
                            });
                        }}>
                        <ListItem style={styles.ListItem}>{item.text}</ListItem>
                    </TouchableOpacity>
                </Animated.View>
            );
        });
        return (
            <View style={styles.bigContainer}>
                <SafeAreaView style={styles.safeArea}>
                    {this.connectionBanner()}
                    <ScrollView style={styles.container}>
                        <View style={styles.appContainer}>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    underlineColorAndroid="white"
                                    placeholderTextColor="#9a73ef"
                                    autoCapitalize="none"
                                    onChangeText={(text) =>
                                        this.setState({inputText: text})
                                    }
                                    onSubmitEditing={this.handleInput.bind(
                                        this,
                                    )}
                                    value={this.state.inputText}
                                />
                            </View>
                            <View style={styles.listContainer}>
                                {todoItems}
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

export default App;

var styles = StyleSheet.create({
    bigContainer: {
        flex: 1,
        backgroundColor: '#c7bed6',
    },
    safeArea: {
        flex: 1,
    },
    container: {
        width: '100%',
        height: '100%',
        flexGrow: 1,
    },
    appContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '60%',
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
        height: 40,

        backgroundColor: '#b070e6',
        shadowColor: '#000',
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    input: {
        width: '80%',
        textAlign: 'center',
        color: 'white',
    },
    listContainer: {
        marginTop: 10,
        width: '60%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'auto',

        shadowColor: '#000',
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    ListItem: {},
    bannerContainer: {
        backgroundColor: 'red',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
    },
    animBannerContainer: {
        backgroundColor: 'red',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginTop: -40,
    },
    errorText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
