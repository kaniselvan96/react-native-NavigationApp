import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Notification = () => {
  type dataType = {id: string; message: string; read: boolean};

  const Item = ({id, message, read}: dataType) => (
    <View key={id} style={styles.item}>
      {read ? (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.title}>{message}</Text>
          <Text
            style={styles.title}
            onPress={() => handleClick(id, message, !read)}>
            Unread
          </Text>
        </View>
      ) : (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.title_unread}>{message}</Text>
          <Text
            style={styles.title_unread}
            onPress={() => handleClick(id, message, !read)}>
            Read
          </Text>
          {/* <Icon name="circle-thin" size={24} color="red" /> */}
        </View>
      )}
    </View>
  );

  const [data, setData] = useState<dataType[]>([]);
  const [loading, setLoading] = useState(true);

  const url = 'http://localhost:3000/notifications';
  const getItems = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const updateItem = (id: string, message: string, read: boolean) => {
    fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        message: message,
        read: read,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(JSON.stringify(responseData));
      });
  };

  const handleClick = (id: string, message: string, read: boolean) => {
    updateItem(id, message, read);
    getItems();
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={data}
            renderItem={({item}) => (
              <Item id={item.id} message={item.message} read={item.read} />
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separator}></View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    height: '100%',
    backgroundColor: 'white',
  },
  item: {
    padding: 15,
    width: '90%',
    marginVertical: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
  },
  title_unread: {
    fontSize: 20,
    color: '#218aff',
  },
  separator: {
    height: 2,
    backgroundColor: '#f1f2f6',
  },
});
