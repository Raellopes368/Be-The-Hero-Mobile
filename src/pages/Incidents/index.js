import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/logo.png';
import {  View,Text, Image, TouchableOpacity, FlatList } from 'react-native';
import styles from './style';
import api from '../../services/api';


export default function Incidents(){
  const [incidents, setIncidents] = useState([]);
  const [total , setTotal] = useState(0);
  const [page , setPage] = useState(1);
  const [loading , setLoading] = useState(false);
  async function loadIncidents(){
    if(loading) return;
    if(total > 0 && incidents.length === total) return;
    setLoading(true);
    console.log({
      loading,
      page,
      total
    })
    
    try {
      const { data, headers } = await api.get('/incidents',{
        params: { page }
      });
      setIncidents([... incidents,...data]);
      setTotal(headers['x-total-count']);
      setLoading(false);
      setPage(page + 1)
    } catch (error) {
      
    }
  }
  useEffect(()=> {
    loadIncidents();
  },[]);
  const navigation = useNavigation();
  function navigateToDetails(incident){
    navigation.navigate('detail', { incident });

  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo}/>
        <Text style={styles.headerText}>
            Total de <Text style={styles.headerTextBold}>{total} casos.</Text>
        </Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia</Text>
      
      <FlatList 
        style={styles.incidentsList}
        data={incidents}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        keyExtractor={incident => String(incident.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({item: incident })=>(
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG: </Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO: </Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR: </Text>
            <Text style={styles.incidentValue}>{Intl.NumberFormat('pt-BR', {  
              style: 'currency',
              currency: 'BRL'
              }).format(incident.value)}
            </Text>
            <TouchableOpacity 
              style={styles.detailsButton} 
              onPress={()=> navigateToDetails(incident)}
              >
                <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                <Feather name='arrow-right' size={16} color='#e02041'/>
            </TouchableOpacity>
          </View>
        )}  
      />


      <View style={styles.incidentsList}>
        

        
      </View>
    </View>
  );
}