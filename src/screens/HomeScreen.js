import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Storage } from '../helpers/Index';
import AsyncStorage from '@react-native-community/async-storage'
import { SearchBar } from 'react-native-elements';

export class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            fullData: null,
            fullData2: null,
            loading: true,
            categories: null,
            category: null,
            id: null,
            id2: null,
            isNotActive: true,
            query: null,
            aggResultSum: [],
            activator: false,
            activator2: false,
            bookmarks: null,
            isBookmarked: null,
            filteredId: [],

        }
    }

    componentDidMount() {
        Storage.get('data', (data) => {
            this.setState({
                loading: false,
                data: JSON.parse(data),
                fullData: JSON.parse(data),

            })
        })

        Storage.get('categories', (data) => {
            this.setState({
                loading: false,
                categories: JSON.parse(data),
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
                fullData: JSON.parse(data),

            })
        })

        Storage.get('categories', (data) => {
            this.setState({
                loading: false,
                categories: JSON.parse(data),
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


    filteredSearch = async () => {
        let result = []; // получается в итоге массив из массивов
        let result_2 = []; //один из массивов
        let resultSum = []; // объединенный конечный массив
        let aggResultSum = this.state.aggResultSum;

        this.state.filteredId.push(this.state.id)

        if (this.state.activator2 == true) {
            this.setState({
                fullData: null,
                fullData2: null,
                activator: true
            })
        }

        for (var i = 0; i < this.state.data[0].tags.length; i++) {
            result_2 = this.state.data.filter(x => x.tags[i] === this.state.categories[this.state.id - 1]);
            result.push(result_2)
        }

        for (var i = 0; i < result.length; i++) {
            resultSum = resultSum.concat(result[i])
        }
        aggResultSum.push(resultSum)

        if (aggResultSum.length == 1) {
            this.setState({
                fullData: resultSum,
                fullData2: resultSum,
                activator: true,
            })
        }

        var count = 0;
        if (this.state.filteredId.length > 2) {
            for (var i = 0; i < this.state.filteredId.length - 1; i++) {
                if (this.state.filteredId[this.state.filteredId.length - 1] == this.state.filteredId[i]) {
                    this.state.filteredId.splice(this.state.filteredId.length - 1, 1)
                    count += 1
                }
                this.setState({
                    filteredId: this.state.filteredId,
                    activator: true
                })
            }
        }

        if (this.state.filteredId.length > 1 && count == 0) {
            let aggResultSumNew = [];
            for (var i = 0; i < aggResultSum.length; i++) {
                for (var j = 0; j < aggResultSum[i].length; j++) {
                    aggResultSumNew.push(aggResultSum[i][j])
                }
            }
            this.setState({
                fullData: aggResultSumNew,
                fullData2: aggResultSumNew,

                activator: true,
            })
        }


        this.state.aggResultSum = aggResultSum
        count = 0
    }



    handleSearch = text => {
        this.setState({
            query: text,
            fullData: this.state.data,
            data: this.state.data,
        })
        var a = []

        if (this.state.activator == false) {
            for (var i = 0; i < this.state.data.length; i++) {
                var sum = 0;
                for (var j = 0; j < text.length; j++) {
                    if (this.state.data[i].title.indexOf(text[j], [0]) == j) {
                        sum += 1;
                    }
                }
                if (sum == text.length)
                    a.push(this.state.data[i])
            }
        }

        else {
            if (this.state.fullData2 != null) {
                for (var i = 0; i < this.state.fullData2.length; i++) {
                    var sum = 0;
                    for (var j = 0; j < text.length; j++) {
                        if (this.state.fullData2[i].title.indexOf(text[j], [0]) == j) {
                            sum += 1;
                        }
                    }
                    if (sum == text.length)
                        a.push(this.state.fullData2[i])
                }
            }
            else {
            }
        }

        this.setState({
            fullData: a,
            activator2: true
        })
    }



    addToBookmarks = async () => {

        if (this.state.fullData[this.state.id2 - 1].isBookmarked != true) {
            if (this.state.fullData2 == null || this.state.fullData2 == 0) {
                this.state.bookmarks.push(this.state.fullData[this.state.id2 - 1])
                AsyncStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
                this.state.data[this.state.id2 - 1].isBookmarked = true
                AsyncStorage.setItem('data', JSON.stringify(this.state.data));
                this.setState({
                    fullData: this.state.data,
                    data: this.state.data
                })
            }

            else {
                this.state.bookmarks.push(this.state.fullData2[this.state.id2 - 1])
                AsyncStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
                this.state.fullData2[this.state.id2 - 1].isBookmarked = true

                for (var i = 0; i < this.state.data.length; i++) {
                    if (this.state.fullData2[this.state.id2 - 1].title == this.state.data[i].title) {
                        this.state.data[i].isBookmarked = true
                    }
                    AsyncStorage.setItem('data', JSON.stringify(this.state.data));
                }

                this.setState({
                    fullData: this.state.data
                })
            }
        }

        else {
            for (var i = 0; i < this.state.bookmarks.length; i++) {
                if (this.state.data[this.state.id2 - 1].title == this.state.bookmarks[i].title || this.state.fullData[this.state.id2 - 1].title == this.state.bookmarks[i].title) {
                    this.state.bookmarks.splice(i, 1)
                    AsyncStorage.setItem('bookmarks', JSON.stringify(this.state.bookmarks));
                    this.state.fullData[this.state.id2 - 1].isBookmarked = false
                    this.state.data[this.state.id2 - 1].isBookmarked = false
                    AsyncStorage.setItem('data', JSON.stringify(this.state.data));
                    this.setState({
                        fullData: this.state.data
                    })
                }
            }
        }
    }

    renderHeader = () => {
        return <SearchBar placeholder="Type here..." lightTheme round onChangeText={this.handleSearch} />
    }



    render() {
        if (this.state.loading)
            return <ActivityIndicator />
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.leftHeader}><Text style={styles.leftHeaderText}>Фильмы</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.centerHeader}
                        onPress={() => {
                            this.setState({
                                filteredId: [],
                                aggResultSum: []
                            })

                            this.props.navigation.navigate('Detail', {
                            })
                        }}><Text style={styles.centerHeaderText}>Избранное</Text></TouchableOpacity>
                </View>
                <View>
                    <TextInput placeholder="Поиск" style={styles.search}
                        value={this.state.text} onChangeText={this.handleSearch}
                    ></TextInput>
                </View>

                <View style={styles.tags}>
                    {this.state.categories != null ? this.state.categories
                        .map((item, i) => {
                            return <TouchableOpacity key={i} style={styles.tag}
                                onPress={() => {
                                    this.setState({
                                        id: i + 1,
                                    });
                                    this.state.id = i + 1
                                    this.filteredSearch();
                                }
                                }>
                                {this.state.isNotActive ? <Text style={styles.textTag} >{item}</Text> : <Text style={styles.textTag2} >{item}</Text>}</TouchableOpacity>

                        })
                        :
                        null}
                </View>

                <FlatList
                    data={this.state.fullData}
                    renderItem={({ item, index }) => (

                        <View
                            style={styles.listItem}
                        >
                            <View style={styles.firstColumnStyle} >
                                <Text style={styles.listTitle}
                                >{item.title}</Text>
                            </View>

                            <View style={styles.secondColumnStyle}>

                                <TouchableOpacity style={styles.imgStyle}
                                    onPress={() => {
                                        this.setState({
                                            id2: index + 1,
                                            data: this.state.data
                                        });
                                        this.state.id2 = index + 1
                                        this.addToBookmarks();
                                    }
                                    }
                                >
                                    {item.isBookmarked === true ? <Image
                                        source={require('../assets/image/bookmark.png')} style={styles.plus}
                                    />
                                        :
                                        <Image source={require('../assets/image/notBookmark.png')} style={styles.plus}
                                        />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()} />
            </View>
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

    },
    leftHeaderText: {
        color: "dodgerblue",
        fontWeight: 'bold',
        fontSize: 18
    },
    centerHeader: {
        paddingLeft: 80
    },
    centerHeaderText: {
        color: "black",
        fontWeight: 'bold',
        fontSize: 18
    },


    headtext: {
        paddingTop: 3,
        paddingLeft: 5,
        fontWeight: "bold"
    },

    listItem: {
        flex: 1,
        height: 60,
        paddingLeft: 20,
        paddingRight: 10,
        flexDirection: 'row',
        paddingVertical: 4,
        paddingHorizontal: 4,
        justifyContent: "space-between",
        borderBottomColor: 'silver',
        borderBottomWidth: 1,
    },
    firstColumnStyle: {
        width: 350,
        flexWrap: 'nowrap',
        paddingTop: 10,
        alignSelf: "flex-end",
        marginBottom: 10,
    },

    sumStyle: {
        color: 'green',
        fontWeight: "bold"
    },
    sumStyle_2: {
        color: 'red'
    },
    secondColumnStyle: {
        //   position: 'relative',
        flexWrap: 'nowrap',
        alignSelf: "flex-end",
        marginBottom: 8,
        flexDirection: "row",

    },

    listTitle: {
        fontSize: 16,
    },
    plus: {
        marginTop: 0,
        width: 20,
        height: 20,
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
    title: {
        textAlign: 'center',
        marginVertical: 8
    },
    tags: {

        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingBottom: 30
    },
    tag: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    textTag: {
        color: "black"
    },
    textTag2: {
        color: "green"
    },
    search: {
        paddingLeft: 20,
        fontSize: 16,
        borderBottomWidth: 0.5,
        marginBottom: 20
    },

});



