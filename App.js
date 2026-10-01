import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

export default function App() {
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Appunti di Universitari',
      content: '# Note di Studio\n\n- **Concetto Chiave**: Spiegazione dei punti principali.\n- **Formula/Esempio**: Dettagli dell\'argomento trattato.',
      date: new Date().toLocaleDateString('it-IT'),
    },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState('1');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const updateCurrentNote = (key, value) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === selectedNoteId ? { ...note, [key]: value } : note
      )
    );
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Nuova Nota',
      content: '# Nuova Nota\n\nScrivi qui i tuoi appunti...',
      date: new Date().toLocaleDateString('it-IT'),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const deleteNote = (id) => {
    if (notes.length <= 1) return;
    const filtered = notes.filter((n) => n.id !== id);
    setNotes(filtered);
    setSelectedNoteId(filtered[0].id);
  };

  const askAI = async (actionType) => {
    setLoadingAi(true);
    setAiResponse('');

    // Simulazione di chiamata IA (sostituibile con API key personalizzata)
    setTimeout(() => {
      if (actionType === 'summarize') {
        setAiResponse(
          '🤖 **Riassunto IA**:\n\n1. **Tema principale**: Analisi dei concetti negli appunti.\n2. **Sintesi**: I punti fondamentali sono strutturati per la ripassata rapida.'
        );
      } else if (actionType === 'explain') {
        setAiResponse(
          '🤖 **Spiegazione IA**:\n\nQuesto testo descrive i principi base della materia in modo chiaro e riassuntivo.'
        );
      } else {
        setAiResponse(`🤖 **Risposta IA**:\n\nRisposta alla richiesta: "${aiPrompt}"`);
      }
      setLoadingAi(false);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* SIDEBAR SINISTRA */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Notes</Text>
          <TouchableOpacity onPress={createNewNote} style={styles.iconButton}>
            <Ionicons name="create-outline" size={26} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.noteCard,
                item.id === selectedNoteId && styles.selectedNoteCard,
              ]}
              onPress={() => setSelectedNoteId(item.id)}
            >
              <Text style={styles.noteCardTitle} numberOfLines={1}>
                {item.title || 'Senza Titolo'}
              </Text>
              <Text style={styles.noteCardDate}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* AREA EDITOR CENTRALE */}
      <View style={styles.editorContainer}>
        <View style={styles.topToolbar}>
          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => setIsPreview(!isPreview)}
          >
            <Ionicons
              name={isPreview ? 'pencil-outline' : 'eye-outline'}
              size={22}
              color="#007AFF"
            />
            <Text style={styles.toolButtonText}>
              {isPreview ? 'Modifica' : 'Anteprima'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => setIsAiOpen(!isAiOpen)}
          >
            <Ionicons name="sparkles-outline" size={22} color="#5856D6" />
            <Text style={[styles.toolButtonText, { color: '#5856D6' }]}>
              Assistente IA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => deleteNote(selectedNote.id)}
          >
            <Ionicons name="trash-outline" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.titleInput}
          value={selectedNote ? selectedNote.title : ''}
          onChangeText={(text) => updateCurrentNote('title', text)}
          placeholder="Titolo della nota..."
          placeholderTextColor="#8E8E93"
        />

        {isPreview ? (
          <ScrollView style={styles.previewContainer}>
            <Markdown>{selectedNote ? selectedNote.content : ''}</Markdown>
          </ScrollView>
        ) : (
          <TextInput
            style={styles.contentInput}
            value={selectedNote ? selectedNote.content : ''}
            onChangeText={(text) => updateCurrentNote('content', text)}
            multiline
            placeholder="Scrivi qui i tuoi appunti in Markdown..."
            placeholderTextColor="#8E8E93"
            textAlignVertical="top"
          />
        )}
      </View>

      {/* PANNELLO DESTRO IA */}
      {isAiOpen && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.aiPanel}
        >
          <View style={styles.aiHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="sparkles" size={20} color="#5856D6" />
              <Text style={styles.aiTitle}> Assistente IA</Text>
            </View>
            <TouchableOpacity onPress={() => setIsAiOpen(false)}>
              <Ionicons name="close-circle" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.aiActionsRow}>
            <TouchableOpacity
              style={styles.chipButton}
              onPress={() => askAI('summarize')}
            >
              <Text style={styles.chipText}>Riassumi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chipButton}
              onPress={() => askAI('explain')}
            >
              <Text style={styles.chipText}>Spiega</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.aiResponseArea}>
            {loadingAi ? (
              <ActivityIndicator size="large" color="#5856D6" />
            ) : (
              <Markdown>{aiResponse || 'Chiedi all\'IA di riassumere o analizzare i tuoi appunti.'}</Markdown>
            )}
          </ScrollView>

          <View style={styles.aiInputRow}>
            <TextInput
              style={styles.aiInput}
              value={aiPrompt}
              onChangeText={setAiPrompt}
              placeholder="Chiedi all'IA..."
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => askAI('custom')}>
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#E5E5EA',
    borderRightWidth: 1,
    borderColor: '#D1D1D6',
    paddingTop: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  noteCard: {
    padding: 14,
    marginHorizontal: 10,
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
  },
  selectedNoteCard: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  noteCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  noteCardDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  topToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#007AFF',
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#000',
  },
  contentInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    color: '#1C1C1E',
  },
  previewContainer: {
    flex: 1,
  },
  aiPanel: {
    width: 320,
    backgroundColor: '#F8F8FC',
    borderLeftWidth: 1,
    borderColor: '#E5E5EA',
    padding: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5856D6',
  },
  aiActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chipButton: {
    backgroundColor: '#EBEBFD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  chipText: {
    color: '#5856D6',
    fontWeight: '600',
    fontSize: 13,
  },
  aiResponseArea: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#5856D6',
    borderRadius: 20,
    padding: 10,
  },
});
