import { StyleSheet, View, Text, Image } from 'react-native';
import { Divider } from 'react-native-elements';

const CommentView = () => {
    return (
        <View>
            <Divider />
            <View style={styles.container}>
                <View style={styles.comment}>
                    <View style={[{paddingVertical: 12}]}>
                        <Text style={[styles.user, {paddingBottom: 6}]}>@codeswift</Text>
                        <Text style={{paddingBottom: 12}}>Omg I need to try baking this it looks so delicious!!</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CommentView;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
    },
    comment: {
        width: '100%',
        justifyContent: 'flex-end',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        verticalAlign: 'middle',
        backgroundColor: "white",
        // borderRadius: 12,
        overflow: 'hidden'
    },
    user: {
        color: 'darkorange'
    },
    // align_left: {
    //     alignContent: 'flex-start',
    //     width: '100%'
    // },
//     hstack: {
//         flexDirection: 'row',
//         alignContent: 'center',
//         // backgroundColor: 'green',
//         // width: '100%'
//     },
//     image: {
//         width: '100%',
//         height: 400,
//         resizeMode: 'cover'
//     },
//     tag: {
//         paddingVertical: 4,
//         paddingHorizontal: 8,
//         color: 'white',
//         backgroundColor: 'darkorange',
//         borderRadius: 12
//     }
});