import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#1f145c', white: '#fff', good:'#e6e6fa', like:'#db7093'};
const App = () => {
  const [todos, setTodos] = React.useState([]);//state untuk hold to-do's 
  const [textInput, setTextInput] = React.useState(''); //state untuk hold inputan user kemudian set inputannya dan by default merupakan empty string

  React.useEffect(() => { //untuk memanggil method 
    getTodosFromUserDevice();
  }, []); //dikarenakan dipanggil sekali makanya string kosong

  React.useEffect(() => { //untuk memanggil method save ini berulang
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => { //digunakan untuk mengambil input user menjadikannya objek lalu memberikan id yang unik
    if (textInput == '') { //jika suatu text input kosong atau tidak ada value
      Alert.alert('Error', 'Please input todo'); //maka muncul alert yakni pemberitahuan error, meminta inputan user
    } else {
      const newTodo = { //membuat todo jika user menekan tombol icon plus
        id: Math.random(), //memberikan secara teratur id unik tiap to do
        task: textInput, 
        completed: false,
      };
      setTodos([...todos, newTodo]); //yang telah menjadi todos akan empty, jika telah mengetikkan pada add todo kemudian akan dijadikan array yang nantinya menjadi new todo 
      setTextInput(''); //kemudian set text input akan menjadi kosong karena inputan telah menjadi new todo
    }
  };

  const saveTodoToUserDevice = async todos => { //digunakan untuk menyimpan todos yang diinputkan kedalam storage user device 
    try {
      const stringifyTodos = JSON.stringify(todos); //dengan mengubah todos yang awalnya array ataupun lainnya menjadi string 
      await AsyncStorage.setItem('todos', stringifyTodos); //save into user device
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => { //digunakan untuk mengambil todos yang sudah tersimpan untuk ditampilkan kembali 
    try {
      const todos = await AsyncStorage.getItem('todos'); //membuat const untuk menampung todos yang diambil dari storage dengan todos key
      if (todos != null) { //cek jika todos tidak null atau tidak kosong 
        setTodos(JSON.parse(todos)); //maka todos yang disimpan menjadi string dikembalikan lagi menjadi bentuk array lalu ditampilkan kembali
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = todoId => { //membuat method marktodocomplete dengan parameter todoid
    const newTodosItem = todos.map(item => { //membuat konstanta yang menjadikan todos lama kemudian dijadikan map
      if (item.id == todoId) { //jika item id sama dengan todoid maka
        return {...item, completed: true}; //mengembalikan dengan spread item dan menjadikan item menjadi true
      }
      return item; //kemudian rest of item di return
    });

    setTodos(newTodosItem); //kemudian set todos pass ke new todos
  };

  const deleteTodo = todoId => { //melakukan penghapusan todoid
    const newTodosItem = todos.filter(item => item.id != todoId); //membuat konstanta untuk menampung semua todo, dengan todo filter yang
    setTodos(newTodosItem);           //memiliki keadaan item id yang tidak sesuai dengan todoid juga ditampung
  };

  const ListItem = ({todo}) => {//membuat komponen berupa list item yang mengembalikan view dengan pengaturan style
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}> 
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',//mencoret todo jika sudah diceklis atau completed bernilai true
            }}>
            {todo?.task} 
          </Text> 
        </View>
        {!todo?.completed && ( //jika todo belum completed maka icon masih muncul
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}> 
            <View style={[styles.actionIcon, {backgroundColor: 'lightgreen'}]}>
              {/* <Icon name="mark-done" size={24} color="black" /> */}
              <Text
                style={{
                fontWeight: 'bold',
                color: COLORS.primary,
                }}>
                V
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            {/* <Ionicons name="trash" size={24} color="black" /> */}
            <Text
          style={{
            fontWeight: 'bold',
            color: COLORS.primary,
          }}>
          X
        </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:'lightpink',
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            color: COLORS.like,
            marginTop: 30,
          }}>
          TODO APP
        </Text>
        {/* <Icon name="delete" size={24} color="black" onPress={clearAllTodos} /> */}
      </View>
      <FlatList //untuk membuat list to-do's
        showsVerticalScrollIndicator={false}//untuk mematikan scroll kebawah
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}//array yang menampung to-do's
        renderItem={({item}) => <ListItem todo={item} />}//membuat fungsi render item yang berisi item berasal listitem berasal dari props todo dengan value item
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput} //untuk memastikan bahwa state selalu sama dengan text input
            placeholder="Add Todo"
            onChangeText={text => setTextInput(text)} //melakukan pass dari onchangetext atau mengambil text kemudian di pass ke settextinput
          />
        </View>
        <TouchableOpacity onPress={addTodo}> 
          <View style={styles.iconContainer}>
            {/* <Ionicons name="add" size={24} color="white" /> */}
            <Text
          style={{
            fontWeight: 'bold',
            color: COLORS.like,
            fontSize: 40,
          }}>
          +
        </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius:9,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.good,
    flex: 1,
    marginVertical: 20,//naik keatas
    marginRight: 20,
    borderRadius: 20,
    borderWidth:1,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 30,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',//left to right
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default App;
