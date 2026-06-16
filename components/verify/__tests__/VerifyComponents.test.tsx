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
import VerifyImageTab from '../VerifyImageTab';
import AnalyzingScreen from '../AnalyzingScreen';
import VerifyLoadingModal from '../VerifyLoadingModal';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-audio', () => ({
  AudioModule: {
    getRecordingPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
    requestRecordingPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  },
  RecordingPresets: { HIGH_QUALITY: {} },
  setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
  useAudioRecorder: () => ({
    prepareToRecordAsync: jest.fn().mockResolvedValue(undefined),
    record: jest.fn(),
    stop: jest.fn().mockResolvedValue(undefined),
    uri: null,
  }),
  useAudioRecorderState: () => ({ metering: -60, isRecording: false }),
}));

// Mock Constants
jest.mock('../../../constants/verify', () => ({
  TABS: [
    { key: 'Texte', label: 'Texte', icon: 'document-text' },
    { key: 'Image', label: 'Image', icon: 'image' },
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
    it('affiche Texte et Image et gère le changement (pas d\'Audio, alignement web)', () => {
      const onChangeMock = jest.fn();
      const { getByText, queryByText } = render(<VerifyTabs tab="Texte" onChange={onChangeMock} />);
      expect(getByText('Texte')).toBeTruthy();
      expect(getByText('Image')).toBeTruthy();
      expect(queryByText('Audio')).toBeNull();
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

    it('affiche le sélecteur de langue Français/Bambara et émet le changement', () => {
      const onChangeLanguageMock = jest.fn();
      const { getByTestId, getByText } = render(
        <VerifyTextTab
          texte=""
          setTexte={jest.fn()}
          source=""
          setSource={jest.fn()}
          language="fr"
          onChangeLanguage={onChangeLanguageMock}
        />
      );

      expect(getByTestId('language-segmented')).toBeTruthy();
      expect(getByText('Français')).toBeTruthy();
      expect(getByText('Bambara')).toBeTruthy();

      fireEvent.press(getByTestId('lang-bm'));
      expect(onChangeLanguageMock).toHaveBeenCalledWith('bm');
    });

    it('en mode bambara cache la zone de texte tant que rien n\'a été dicté', () => {
      const { queryByPlaceholderText, getByTestId, queryByTestId } = render(
        <VerifyTextTab
          texte=""
          setTexte={jest.fn()}
          source=""
          setSource={jest.fn()}
          language="bm"
          onChangeLanguage={jest.fn()}
        />
      );

      expect(getByTestId('bambara-dictation')).toBeTruthy();
      expect(queryByPlaceholderText(/Le gouvernement du Mali/)).toBeNull();
      expect(queryByTestId('translated-badge')).toBeNull();
    });

    it('affiche la zone de texte avec le badge « Traduit du bambara » après dictée', () => {
      const { getByDisplayValue, getByTestId } = render(
        <VerifyTextTab
          texte="Le Mali a fait une annonce."
          setTexte={jest.fn()}
          source=""
          setSource={jest.fn()}
          language="bm"
          onChangeLanguage={jest.fn()}
          translatedFromBambara={true}
        />
      );

      expect(getByTestId('translated-badge')).toBeTruthy();
      expect(getByDisplayValue('Le Mali a fait une annonce.')).toBeTruthy();
    });
  });

  describe('VerifyImageTab', () => {
    it('gère l\'upload et le changement de mode', () => {
      const onPickImageMock = jest.fn();
      const onSelectModeMock = jest.fn();

      const onChangeClaimMock = jest.fn();
      const baseProps = {
        imageUri: null as string | null,
        imageMode: 'ia' as const,
        imageClaim: '',
        onPickImage: onPickImageMock,
        onClearImage: () => {},
        onSelectMode: onSelectModeMock,
        onChangeClaim: onChangeClaimMock,
      };
      const { getByText, getByPlaceholderText, rerender, queryByPlaceholderText } = render(
        <VerifyImageTab {...baseProps} />
      );

      fireEvent.press(getByText('Appuyer pour choisir'));
      expect(onPickImageMock).toHaveBeenCalled();

      // AI mode does not show a claim textarea
      expect(queryByPlaceholderText(/Cette image montre/)).toBeNull();

      rerender(
        <VerifyImageTab {...baseProps} imageUri="uri" imageMode="content" />
      );

      fireEvent.press(getByText('Générée par IA ?'));
      expect(onSelectModeMock).toHaveBeenCalledWith('ia');

      fireEvent.press(getByText('Vérifier le contenu'));
      expect(onSelectModeMock).toHaveBeenCalledWith('content');

      // Content mode shows a claim textarea
      const claimInput = getByPlaceholderText(/Cette image montre/);
      fireEvent.changeText(claimInput, 'Affirmation à vérifier');
      expect(onChangeClaimMock).toHaveBeenCalledWith('Affirmation à vérifier');
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
