import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, IconButton, List, Modal, Portal, Text, Button, TextInput, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = useState([])
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [refreshFlatlist, setRefreshFlatList] = useState(false);
  const _handleSearch = () => console.log('Searching');
  const _handleMore = () => console.log('Shown more');
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20, margin: 20};

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('mytodolist')
      console.log(jsonValue != null ? JSON.parse(jsonValue) : null, 'data')
      if(jsonValue){
        setData(JSON.parse(jsonValue))
      } 
      
    //   return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

  const addTodo = async () => {
      data.push({
        id: data.length,
        title: title,
        description: description,
        completed: false
      })

      try {
        const jsonValue = JSON.stringify(data)
        await AsyncStorage.setItem('mytodolist', jsonValue)
      } catch (e) {
        // saving error
      }
      setTitle('')
      setDescription('')
      hideModal()
  }

  const removeTodo = async (id) => {
    data.splice(id, 1)
    setRefreshFlatList(!refreshFlatlist)
    try {
        const jsonValue = JSON.stringify(data)
        await AsyncStorage.setItem('mytodolist', jsonValue)
      } catch (e) {
        // saving error
      }

  }

  const taskCompletion = (id) => {
    let state = data.map(i => i.id == id ? {...i, completed: !i.completed} : i)
    setData(state)
  }


  const renderItem = ({item}) => {
      return(
        <List.Item
            title={item.title}
            description={item.description}
            right={() => 
            <IconButton
                    icon="delete"
                    color='gray'
                    size={20}
                    onPress={() => removeTodo(item.id)}
                />}
            left={() => <Checkbox
                status={item.completed ? 'checked' : 'unchecked'}
                onPress={() => {
                    taskCompletion(item.id);
                }}
              />}
        />
      );
  }

  return (
    <>
        <Appbar.Header>
            <Appbar.Content title="TodoApp" />
            <Appbar.Action icon="magnify" onPress={_handleSearch} />
            <Appbar.Action icon="plus" onPress={showModal} />
        </Appbar.Header>
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            extraData={refreshFlatlist}
        />
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                <TextInput
                    label="Title"
                    value={title}
                    onChangeText={text => setTitle(text)}
                    style={{ marginVertical: 10 }}
                    />
                <TextInput
                    label="Description"
                    value={description}
                    onChangeText={text => setDescription(text)}
                    style={{ marginVertical: 10 }}
                    />
                <Button icon="plus" mode="contained" onPress={() => addTodo()} disabled={title && description ? false : true}>
                    Add Todo
                </Button>
            </Modal>
        </Portal>
    </>
    
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});
