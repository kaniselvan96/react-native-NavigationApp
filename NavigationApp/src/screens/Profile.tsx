import React, {useState, useEffect} from 'react';
import {SafeAreaView, View, Image, StyleSheet, Text} from 'react-native';
import Button from '../components/Button';
import CustomModal from '../components/CustomModal';
import LoadingIndicator from '../components/LoadingIndicator';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [id, onChangeId] = useState('');
  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [image, onChangeImage] = useState('');
  const [visible, setViisble] = useState(false);

  const url = 'http://localhost:3000/profile';

  const getProfile = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      onChangeId(json.id);
      onChangeName(json.name);
      onChangeEmail(json.email);
      onChangeImage(json.avatar);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = (
    id: string,
    name: string,
    email: string,
    image: string,
  ) => {
    fetch(`${url}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        name: name,
        email: email,
        avatar: image,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log(JSON.stringify(responseData));
      });
  };

  const handleVisibleModal = () => {
    setViisble(!visible);
  };

  const handelUpdateTask = (name: string, email: string, avatar: string) => {
    updateTask(id, name, email, avatar);
    getProfile();
    handleVisibleModal();
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <SafeAreaView style={styles.container}>
          <CustomModal
            visible={visible}
            handelUpdateTask1={handelUpdateTask}
            handleOnPressClose={handleVisibleModal}
            input1={name}
            input2={email}
            input3={image}
          />
          <Image source={{uri: image}} style={styles.image} />
          <View>
            <Text style={styles.textName}>{name}</Text>
            <Text style={styles.textEmail}> {email}</Text>
          </View>
          <View style={styles.btnContainer}>
            <Button
              isRed={false}
              name="Edit Profile"
              handleOnPress={handleVisibleModal}
            />
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textName: {
    paddingTop: 30,
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
  },
  textEmail: {
    paddingTop: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginTop: 20,
  },
  btnContainer: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
