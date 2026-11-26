import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';

const INITIAL_API = 'http://10.0.2.2:8080';
const FILTERS = [
  { key: 'todos', label: 'Todos' }, { key: 'livro', label: 'Livros' },
  { key: 'material', label: 'Patrimônio material' }, { key: 'imaterial', label: 'Patrimônio imaterial' },
];

async function getList(base, path) {
  const response = await fetch(`${base}${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Erro ${response.status}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export default function CatalogScreen() {
  const [apiInput, setApiInput] = useState(INITIAL_API);
  const [api, setApi] = useState(INITIAL_API);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const load = useCallback(async (base = api, isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const [physicalBooks, digitalBooks, material, immaterial] = await Promise.all([
        getList(base, '/livros_fisicos'), getList(base, '/livros_digitais'),
        getList(base, '/patrimonios-materiais'), getList(base, '/patrimonios-imateriais'),
      ]);
      setItems([
        ...physicalBooks.map((item) => ({ ...item, type: 'livro', endpoint: '/livros_fisicos' })),
        ...digitalBooks.map((item) => ({ ...item, type: 'livro', endpoint: '/livros_digitais' })),
        ...material.map((item) => ({ ...item, type: 'material', endpoint: '/patrimonios-materiais' })),
        ...immaterial.map((item) => ({ ...item, type: 'imaterial', endpoint: '/patrimonios-imateriais' })),
      ]);
    } catch {
      setError('Confira o endereço, a rede e se o servidor desktop está ligado.');
    } finally { setLoading(false); setRefreshing(false); }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  const visibleItems = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    return items.filter((item) => {
      const matchesType = filter === 'todos' || item.type === filter;
      const searchText = `${item.titulo || item.nome || ''} ${item.autor || item.tipo || item.tipoManifestacao || ''} ${item.editora || ''}`;
      return matchesType && searchText.toLocaleLowerCase('pt-BR').includes(term);
    });
  }, [filter, items, search]);

  function saveApi() {
    const clean = apiInput.trim().replace(/\/$/, '');
    if (!/^https?:\/\//i.test(clean)) { setError('O endereço precisa começar com http:// ou https://.'); return; }
    setApi(clean);
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f1ea" />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(api, true)} tintColor="#f47a28" />}>
        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandIcon}>LA</Text></View>
          <View><Text style={styles.eyebrow}>LABORATÓRIO DAS ARTES</Text><Text style={styles.brandTitle}>Acervo</Text></View>
          <View style={styles.readOnly}><Text style={styles.readOnlyText}>CONSULTA</Text></View>
        </View>
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>MEMÓRIA • CULTURA • CONHECIMENTO</Text>
          <Text style={styles.heroTitle}>Um acervo vivo,{ '\n' }sempre por perto.</Text>
          <Text style={styles.heroCopy}>Explore livros e patrimônios catalogados pelo Laboratório das Artes.</Text>
          <View style={styles.countRow}><Text style={styles.countNumber}>{items.length}</Text><Text style={styles.countLabel}>itens no acervo</Text><View style={styles.liveDot} /></View>
        </View>
        <Text style={styles.sectionTitle}>Encontrar no acervo</Text>
        <TextInput value={search} onChangeText={setSearch} placeholder="Buscar por título, nome ou autor" placeholderTextColor="#8b918b" style={styles.search} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((item) => <Pressable key={item.key} onPress={() => setFilter(item.key)} style={[styles.filterChip, filter === item.key && styles.filterChipActive]}><Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>{item.label}</Text></Pressable>)}
        </ScrollView>
        <View style={styles.resultsHeader}><Text style={styles.sectionTitle}>Catálogo</Text><Text style={styles.resultCount}>{visibleItems.length} {visibleItems.length === 1 ? 'item' : 'itens'}</Text></View>
        {loading && <View style={styles.stateBox}><ActivityIndicator color="#f47a28" size="large" /><Text style={styles.stateText}>Carregando acervo…</Text></View>}
        {!loading && error ? <View style={styles.errorBox}><Text style={styles.errorTitle}>Sem conexão com o acervo</Text><Text style={styles.errorText}>{error}</Text><Pressable style={styles.retry} onPress={() => load(api)}><Text style={styles.retryText}>Tentar novamente</Text></Pressable></View> : null}
        {!loading && !error && visibleItems.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>Nenhum item encontrado</Text><Text style={styles.stateText}>Tente outro termo ou categoria.</Text></View> : null}
        {!loading && !error && visibleItems.map((item) => {
          const title = item.titulo || item.nome || 'Item sem título';
          const subtitle = item.type === 'livro' ? (item.autor || 'Autoria não informada') : item.type === 'material' ? (item.tipo || 'Patrimônio material') : (item.tipoManifestacao || 'Patrimônio imaterial');
          const category = item.type === 'livro' ? 'LIVRO' : item.type === 'material' ? 'PATRIMÔNIO MATERIAL' : 'PATRIMÔNIO IMATERIAL';
          return <Link key={`${item.type}-${item.id}`} href={{ pathname: '/detail', params: { endpoint: item.endpoint, id: String(item.id), type: item.type, api } }} asChild>
            <Pressable style={styles.card}><View style={[styles.cardIcon, item.type !== 'livro' && styles.cardIconHeritage]}><Text style={styles.cardIconText}>{item.type === 'livro' ? '▤' : '⌂'}</Text></View><View style={styles.cardBody}><Text style={styles.cardCategory}>{category}</Text><Text numberOfLines={2} style={styles.cardTitle}>{title}</Text><Text numberOfLines={1} style={styles.cardSubtitle}>{subtitle}</Text></View><Text style={styles.chevron}>›</Text></Pressable>
          </Link>;
        })}
        <View style={styles.settings}><Text style={styles.settingsTitle}>Conexão com o servidor</Text><Text style={styles.settingsCopy}>No celular, use o IP do computador na mesma rede Wi-Fi. Ex.: http://192.168.0.10:8080</Text><View style={styles.apiRow}><TextInput value={apiInput} onChangeText={setApiInput} onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250)} autoCapitalize="none" autoCorrect={false} keyboardType="url" returnKeyType="done" style={styles.apiInput} placeholder="http://192.168.0.10:8080"/><Pressable style={styles.apiButton} onPress={saveApi}><Text style={styles.apiButtonText}>Conectar</Text></Pressable></View></View>
        <Text style={styles.footer}>Laboratório das Artes · Acervo cultural</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f1ea' }, content: { paddingHorizontal: 20, paddingTop: 58, paddingBottom: 32, maxWidth: 680, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 }, brandMark: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#171512', alignItems: 'center', justifyContent: 'center', marginRight: 11 }, brandIcon: { color: '#f47a28', fontSize: 14, fontWeight: '900' }, eyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, color: '#777168' }, brandTitle: { fontSize: 19, fontWeight: '800', color: '#171512', marginTop: 1 }, readOnly: { marginLeft: 'auto', borderRadius: 20, backgroundColor: '#ffe8d6', paddingHorizontal: 11, paddingVertical: 7 }, readOnlyText: { fontSize: 9, fontWeight: '800', letterSpacing: 1.1, color: '#d85e16' },
  hero: { backgroundColor: '#f47a28', borderRadius: 24, padding: 23, marginBottom: 27 }, heroKicker: { color: '#171512', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 }, heroTitle: { color: '#fffdf8', fontSize: 30, lineHeight: 35, fontWeight: '800', marginTop: 12 }, heroCopy: { color: '#fffdf8', fontSize: 13, lineHeight: 19, marginTop: 9, maxWidth: 275 }, countRow: { flexDirection: 'row', alignItems: 'center', marginTop: 21 }, countNumber: { color: '#171512', fontWeight: '800', fontSize: 23 }, countLabel: { color: '#fffdf8', marginLeft: 8, fontSize: 12 }, liveDot: { width: 7, height: 7, backgroundColor: '#171512', borderRadius: 5, marginLeft: 8 },
  sectionTitle: { color: '#171512', fontSize: 18, fontWeight: '800' }, search: { height: 50, backgroundColor: '#fffdf8', borderWidth: 1, borderColor: 'rgba(23,21,18,.10)', borderRadius: 14, marginTop: 13, paddingHorizontal: 15, fontSize: 14, color: '#171512' }, filters: { gap: 8, paddingVertical: 13 }, filterChip: { borderRadius: 22, borderColor: 'rgba(23,21,18,.10)', borderWidth: 1, paddingVertical: 9, paddingHorizontal: 13, backgroundColor: '#fffdf8' }, filterChipActive: { backgroundColor: '#f47a28', borderColor: '#f47a28' }, filterText: { fontSize: 11, color: '#777168', fontWeight: '700' }, filterTextActive: { color: '#171512' }, resultsHeader: { marginTop: 10, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, resultCount: { color: '#777168', fontSize: 12 },
  card: { backgroundColor: '#fffdf8', borderRadius: 17, borderWidth: 1, borderColor: 'rgba(23,21,18,.10)', padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }, cardIcon: { width: 47, height: 47, borderRadius: 14, backgroundColor: '#ffe8d6', alignItems: 'center', justifyContent: 'center' }, cardIconHeritage: { backgroundColor: '#ffe8d6' }, cardIconText: { color: '#d85e16', fontSize: 24 }, cardBody: { flex: 1, marginLeft: 13 }, cardCategory: { color: '#777168', fontSize: 8, fontWeight: '800', letterSpacing: 1.1, marginBottom: 4 }, cardTitle: { color: '#171512', fontSize: 15, fontWeight: '800', lineHeight: 19 }, cardSubtitle: { color: '#777168', fontSize: 12, marginTop: 4 }, chevron: { color: '#777168', fontSize: 28, marginLeft: 8 },
  stateBox: { padding: 32, alignItems: 'center' }, stateText: { color: '#777168', fontSize: 13, marginTop: 10, lineHeight: 19 }, empty: { padding: 24, alignItems: 'center', backgroundColor: '#fffdf8', borderRadius: 16 }, emptyTitle: { fontWeight: '800', color: '#171512' }, errorBox: { padding: 18, borderRadius: 16, backgroundColor: '#ffe8d6', borderWidth: 1, borderColor: 'rgba(23,21,18,.10)' }, errorTitle: { color: '#171512', fontWeight: '800', fontSize: 15 }, errorText: { color: '#292620', fontSize: 12, lineHeight: 18, marginTop: 6 }, retry: { marginTop: 12, backgroundColor: '#f47a28', alignSelf: 'flex-start', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 }, retryText: { color: '#171512', fontWeight: '700', fontSize: 12 },
  settings: { backgroundColor: '#ebe6da', borderRadius: 17, padding: 16, marginTop: 20 }, settingsTitle: { color: '#171512', fontSize: 13, fontWeight: '800' }, settingsCopy: { color: '#777168', fontSize: 11, lineHeight: 16, marginTop: 5 }, apiRow: { flexDirection: 'row', marginTop: 11, gap: 7 }, apiInput: { flex: 1, height: 42, borderRadius: 11, backgroundColor: '#fffdf8', paddingHorizontal: 10, color: '#171512', fontSize: 11 }, apiButton: { backgroundColor: '#f47a28', borderRadius: 11, justifyContent: 'center', paddingHorizontal: 13 }, apiButtonText: { color: '#171512', fontSize: 11, fontWeight: '800' }, footer: { textAlign: 'center', color: '#777168', fontSize: 10, marginTop: 22 },
});
