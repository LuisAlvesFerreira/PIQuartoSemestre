import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

export default function DetailScreen() {
  const { endpoint, id, type, api } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`${api}${endpoint}`, { headers: { Accept: 'application/json' } })
      .then((response) => { if (!response.ok) throw new Error('Falha'); return response.json(); })
      .then((data) => {
        const record = Array.isArray(data) ? data.find((entry) => String(entry.id) === String(id)) : null;
        if (!record) throw new Error('Registro não encontrado');
        if (active) setItem(record);
      })
      .catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [api, endpoint, id]);

  const heritage = type !== 'livro';
  const title = item?.titulo || item?.nome || 'Detalhes do item';
  const rows = heritage ? [
    ['Categoria', type === 'material' ? 'Patrimônio material' : 'Patrimônio imaterial'], ['Tipo', item?.tipo || item?.tipoManifestacao],
    ['Localização', item?.endereco || item?.localidade], ['Data de tombamento', item?.dataTombamento], ['Contexto', item?.contexto],
  ] : [
    ['Autor', item?.autor], ['Editora', item?.editora], ['Ano', item?.ano], ['Formato', item?.formato || (item?.numPaginas ? 'Livro físico' : null)],
    ['Número de páginas', item?.numPaginas], ['Localização', item?.localizacao], ['Tamanho do arquivo', item?.tamanhoArquivo ? `${item.tamanhoArquivo} MB` : null],
  ];

  return <View style={styles.screen}>
    <Stack.Screen options={{ headerShown: false }} /><StatusBar barStyle="dark-content" backgroundColor="#f4f1ea" />
    <ScrollView contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.back()} style={styles.back}><Text style={styles.backText}>‹  Voltar ao acervo</Text></Pressable>
      <View style={[styles.cover, heritage && styles.coverHeritage]}><Text style={styles.coverIcon}>{heritage ? '⌂' : '▤'}</Text><Text style={styles.coverLabel}>{heritage ? 'MEMÓRIA E PATRIMÔNIO' : 'BIBLIOTECA'}</Text></View>
      <Text style={styles.category}>{heritage ? 'PATRIMÔNIO CULTURAL' : 'LIVRO'}</Text><Text style={styles.title}>{title}</Text>
      {item ? <View style={styles.card}>{rows.filter(([, value]) => value !== null && value !== undefined && value !== '').map(([label, value]) => <View key={label} style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{String(value)}</Text></View>)}</View> : error ? <Text style={styles.error}>Não foi possível carregar os detalhes. Confira a conexão com o servidor.</Text> : <ActivityIndicator color="#f47a28" size="large" style={{ marginTop: 30 }} />}
      <View style={styles.notice}><Text style={styles.noticeText}>Ficha para consulta · Este aplicativo não permite alterar o acervo.</Text></View>
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f1ea' }, content: { padding: 22, paddingTop: 58, paddingBottom: 36, maxWidth: 680, width: '100%', alignSelf: 'center' }, back: { marginBottom: 18 }, backText: { color: '#d85e16', fontWeight: '800', fontSize: 14 },
  cover: { height: 170, borderRadius: 22, backgroundColor: '#f47a28', justifyContent: 'center', alignItems: 'center' }, coverHeritage: { backgroundColor: '#f47a28' }, coverIcon: { fontSize: 48, color: '#171512' }, coverLabel: { fontSize: 9, letterSpacing: 2, color: '#fffdf8', fontWeight: '800', marginTop: 9 }, category: { color: '#d85e16', fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginTop: 24 }, title: { color: '#171512', fontSize: 27, lineHeight: 33, fontWeight: '800', marginTop: 7, marginBottom: 18 }, card: { backgroundColor: '#fffdf8', borderWidth: 1, borderColor: 'rgba(23,21,18,.10)', borderRadius: 17, paddingHorizontal: 16 }, row: { borderBottomWidth: 1, borderBottomColor: 'rgba(23,21,18,.10)', paddingVertical: 13 }, label: { color: '#777168', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 }, value: { color: '#171512', fontSize: 14, lineHeight: 20, marginTop: 5 }, notice: { backgroundColor: '#ffe8d6', borderRadius: 13, padding: 13, marginTop: 16 }, noticeText: { color: '#171512', textAlign: 'center', fontSize: 11, fontWeight: '700' }, error: { color: '#d85e16', marginTop: 18 },
});
