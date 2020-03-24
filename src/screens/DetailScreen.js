import React from 'react';
import { Text, Image, View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Storage } from '../helpers/Index'
import AsyncStorage from '@react-native-community/async-storage'


export class DetailScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: this.props.navigation.getParam('categories'),
            data: null,
            trans: null,
            loading: true,
            id3: null,
        }
    }


    componentDidMount() {

        Storage.get('data', (data) => {
            this.setState({
                loading: false,
                data: JSON.parse(data),
            })
        })

        Storage.get('bookmarks', (bookmarks) => {
            this.setState({
                loading: false,
                bookmarks: JSON.parse(bookmarks),
            })
        })
    }

    onFocusFunction = () => {

        Storage.get('data', (data) => {
            this.setState({
                loading: false,
                data: JSON.parse(data),
            })
        })

        Storage.get('bookmarks', (bookmarks) => {
            this.setState({
                loading: false,
                bookmarks: JSON.parse(bookmarks),
            })
        })
    }

    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            this.onFocusFunction()
        })

    }

    componentWillUnmount() {
        this.focusListener.remove()
    }



    removeBookmark = async () => {
        for (var i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].title == this.state.bookmarks[this.state.id3 - 1].title) {
                this.state.data[i].isBookmarked = false
                AsyncStorage.setItem('data', JSON.stringify(this.state.data));
            }
        }
        this.state.bookmarks.splice(this.state.id3 - 1, 1)
        AsyncStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
    }


    render() {
        if (this.state.loading)
            return <ActivityIndicator />
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.leftHeader} onPress={() => {
                        this.props.navigation.navigate('Home')
                    }}><Text style={styles.leftHeaderText}>Фильмы</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.centerHeader}
                    ><Text style={styles.centerHeaderText}>Избранное</Text></TouchableOpacity>
                </View>

                <FlatList
                    data={this.state.bookmarks}
                    renderItem={({ item, index }) => (

                        <View
                            style={styles.listItem}
                        >
                            <View style={styles.firstColumnStyle} >
                                <Text style={styles.listTitle}
                                >{item.title}</Text>
                            </View>

                            <View style={styles.secondColumnStyle}>

                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({ id3: index + 1, });
                                        this.state.id3 = index + 1
                                        this.removeBookmark();
                                    }
                                    }
                                >

                                    <Image source={require('../assets/image/bookmark.png')} style={styles.plus}
                                    /></TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()} />
            </View >
        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: 'silver',
        paddingTop: 20,
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    leftHeader: {
        flexDirection: 'row',
        position: 'absolute',
        paddingTop: 20,
        paddingLeft: 10
    },
    back: {
        width: 20,
        height: 20,
        marginTop: 3,
        marginRight: 0,
        tintColor: 'dodgerblue',
    },
    leftHeaderText: {
        color: "dodgerblue",
        fontWeight: 'bold',
        fontSize: 18
    },
    centerHeader: {
        position: "relative",
        paddingLeft: 140,
    },
    centerHeaderText: {
        color: "black",
        fontWeight: 'bold',
        fontSize: 18
    },
    listItem: {
        paddingTop: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 4,
        paddingHorizontal: 4,
        justifyContent: "space-between",

    },
    firstColumnStyle: {
        position: 'relative',
        top: 10,
        paddingTop: 10,
        alignSelf: "flex-start",
        paddingLeft: 15,
        width: 250
    },
    subFirstColumn: {
        flexDirection: 'row',
    },
    secondColumnStyle: {
        flexDirection: 'column',
        position: 'relative',
        alignSelf: "flex-start",
        paddingTop: 10,
        marginTop: 0,
    },
    subSecondColumn: {
        flexDirection: 'row'
    },
    sumStyle: {
        color: 'green',
        fontWeight: "bold",
        fontSize: 16
    },
    sumStyle_2: {
        color: 'red',
        fontWeight: "bold",
        fontSize: 16
    },
    forward: {
        width: 15,
        height: 15,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    balance: {
        paddingTop: 0,
        paddingRight: 35,
        alignSelf: 'flex-end',
        color: 'black',
        fontSize: 14,
        fontWeight: "bold",

    },
    listTitle: {
        fontSize: 16,
    },

    listTitle_2: {
        fontSize: 16,
        paddingTop: 12
    },
    keller: {
        height: 45,
        backgroundColor: '#808080',
        flexDirection: 'row',
        justifyContent: "space-around",

    },
    kellerText: {
        color: 'white',
        fontSize: 16,
        alignSelf: 'center',
    },
    plus: {
        marginTop: 0,
        width: 20,
        height: 20,
        marginRight: 15
    },
    leftHeader: {

    },
    leftHeaderText: {
        color: "black",
        fontWeight: 'bold',
        fontSize: 18
    },
    centerHeader: {
        paddingLeft: 80
    },
    centerHeaderText: {
        color: "dodgerblue",
        fontWeight: 'bold',
        fontSize: 18
    },
})