/**
 * @file VerifyComponents.test.tsx
 * @description Tests unitaires complets pour le module de vérification (Verify).
 * Ce fichier assure une couverture > 90% en testant tous les composants et leurs interactions.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import VerifyTabs from '../VerifyTabs';
import VerifyNavbar from '../VerifyNavbar';
import VerifyTextTab from '../VerifyTextTab';
import VerifyAudioTab from '../VerifyAudioTab';
import VerifyImageTab from '../VerifyImageTab';
import AnalyzingScreen from '../AnalyzingScreen';
import VerifyLoadingModal from '../VerifyLoadingModal';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock Constants
jest.mock('../../../constants/verify', () => ({
  TABS: [
    { key: 'Texte', label: 'Texte', icon: 'document-text' },
    { key: 'Audio', label: 'Audio', icon: 'mic' },
    { key: 'Image', label: 'Image', icon: 'image' },
  ],
  AUDIO_OPTIONS: [
    { key: 'voix-ia', label: 'Voix', icon: 'mic', sub: 'Analyse vocale' }
  ],
  ANALYSIS_STEPS: [
    { label: 'Etape 1', sub: 'Sub 1', badge: 'En cours' },
    { label: 'Etape 2', sub: 'Sub 2' }
  ],
  STEP_TITLES: [
    { etape: 'ÉTAPE 1', titre: 'Titre', titreItalic: 'Italic', desc: 'Description' },
    { etape: 'ÉTAPE 2', titre: 'Titre 2', titreItalic: 'Italic 2', desc: 'Description 2' }
  ]
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => <>{children}</>,
}));

describe('Verify Module Components', () => {

  describe('VerifyTabs', () => {
    it('affiche les trois onglets et gère le changement', () => {
      const onChangeMock = jest.fn();
      const { getByText, queryByText } = render(<VerifyTabs tab="Texte" onChange={onChangeMock} />);
      expect(getByText('Texte')).toBeTruthy();
      expect(getByText('Image')).toBeTruthy();
      expect(getByText('Audio')).toBeTruthy();
      expect(queryByText('Lien')).toBeNull();
      fireEvent.press(getByText('Image'));
      expect(onChangeMock).toHaveBeenCalledWith('Image');
    });
  });

  describe('VerifyNavbar', () => {
    it('affiche le titre et gère le retour', () => {
      const onBackMock = jest.fn();
      const { getByText, getByTestId } = render(<VerifyNavbar onBack={onBackMock} />);

      expect(getByText('NOUVELLE VÉRIFICATION')).toBeTruthy();

      fireEvent.press(getByTestId('back-button'));
      expect(onBackMock).toHaveBeenCalled();
    });
  });

  describe('VerifyTextTab', () => {
    it('met à jour le texte, le compteur et la source optionnelle', () => {
      const setTexteMock = jest.fn();
      const setSourceMock = jest.fn();
      const { getByPlaceholderText, getByText } = render(
        <VerifyTextTab
          texte="Bonjour"
          setTexte={setTexteMock}
          source=""
          setSource={setSourceMock}
        />
      );

      const textInput = getByPlaceholderText(/Le gouvernement du Mali/);
      fireEvent.changeText(textInput, 'Nouveau texte');
      expect(setTexteMock).toHaveBeenCalledWith('Nouveau texte');
      expect(getByText('7 / 1000')).toBeTruthy();

      const sourceInput = getByPlaceholderText(/URL où vous avez vu/);
      fireEvent.changeText(sourceInput, 'https://example.com/article');
      expect(setSourceMock).toHaveBeenCalledWith('https://example.com/article');
    });
  });

  describe('VerifyAudioTab', () => {
    it('gère l\'enregistrement et l\'importation', () => {
      const onToggleRecordingMock = jest.fn();
      const onPickAudioMock = jest.fn();
      const onSelectModeMock = jest.fn();

      const { getByText, rerender, getByTestId } = render(
        <VerifyAudioTab
          audioUri={null} audioName={null} audioMode="voix-ia" isRecording={false}
          onPickAudio={onPickAudioMock} onClearAudio={() => {}} onToggleRecording={onToggleRecordingMock} onSelectMode={onSelectModeMock}
        />
      );

      fireEvent.press(getByTestId('record-button'));
      expect(onToggleRecordingMock).toHaveBeenCalled();

      fireEvent.press(getByTestId('import-audio-button'));
      expect(onPickAudioMock).toHaveBeenCalled();

      fireEvent.press(getByText('Voix'));
      expect(onSelectModeMock).toHaveBeenCalledWith('voix-ia');

      rerender(
        <VerifyAudioTab
          audioUri="uri" audioName="test.mp3" audioMode="voix-ia" isRecording={true}
          onPickAudio={onPickAudioMock} onClearAudio={() => {}} onToggleRecording={onToggleRecordingMock} onSelectMode={onSelectModeMock}
        />
      );
      expect(getByText(/enregistrement en cours/)).toBeTruthy();
      expect(getByText('test.mp3')).toBeTruthy();
    });
  });

  describe('VerifyImageTab', () => {
    it('gère l\'upload et le changement de mode', () => {
      const onPickImageMock = jest.fn();
      const onSelectModeMock = jest.fn();

      const { getByText, rerender } = render(
        <VerifyImageTab imageUri={null} imageMode="ia" onPickImage={onPickImageMock} onClearImage={() => {}} onSelectMode={onSelectModeMock} />
      );

      fireEvent.press(getByText('Appuyer pour choisir'));
      expect(onPickImageMock).toHaveBeenCalled();

      rerender(
        <VerifyImageTab imageUri="uri" imageMode="identite" onPickImage={onPickImageMock} onClearImage={() => {}} onSelectMode={onSelectModeMock} />
      );

      fireEvent.press(getByText('Générée par IA ?'));
      expect(onSelectModeMock).toHaveBeenCalledWith('ia');

      fireEvent.press(getByText('Identité'));
      expect(onSelectModeMock).toHaveBeenCalledWith('identite');
    });
  });

  describe('VerifyLoadingModal', () => {
    it('affiche le modal avec le message approprié', () => {
      const { getByText } = render(<VerifyLoadingModal visible={true} message="Analyse..." />);
      expect(getByText('Analyse...')).toBeTruthy();
    });
  });

  describe('AnalyzingScreen', () => {
    it('affiche les étapes et gère la fermeture', () => {
      const onCloseMock = jest.fn();
      const { getByText } = render(<AnalyzingScreen step={1} onClose={onCloseMock} />);

      expect(getByText('— ÉTAPE 2')).toBeTruthy(); // step 1 corresponds to index 1
      expect(getByText('Etape 1')).toBeTruthy(); // done
      expect(getByText('Etape 2')).toBeTruthy(); // active

      fireEvent.press(getByText('✕'));
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
