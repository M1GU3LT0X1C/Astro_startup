import { useActionSheet } from '@expo/react-native-action-sheet';
import { Alert } from 'react-native';

export function useAppAlerts() {
  const { showActionSheetWithOptions } = useActionSheet();

  // ALERT SIMPLES - só botão OK
  function mostrarAlerta(titulo: string, mensagem: string, onOk?: () => void) {
    Alert.alert(titulo, mensagem, [
      { text: 'OK', onPress: onOk }
    ]);
  }

  // CONFIRMAÇÃO - Cancelar embaixo sempre
  function mostrarConfirmacao(
    titulo: string, 
    mensagem: string, 
    onConfirmar: () => void,
    textoConfirmar = 'Confirmar',
    onCancelar?: () => void
  ) {
    const options = [textoConfirmar, 'Cancelar'];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      title: titulo,
      message: mensagem,
    }, (selectedIndex) => {
      if (selectedIndex === 0) onConfirmar();
      if (selectedIndex === 1 && onCancelar) onCancelar();
    });
  }

  // MENU DE OPÇÕES - Cancelar sempre embaixo
  function mostrarOpcoesFoto(abrirCamera: () => void, abrirGaleria: () => void) {
    const options = ['Câmera', 'Galeria', 'Cancelar'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      title: 'Adicionar foto',
      message: 'Escolha uma opção',
    }, (selectedIndex) => {
      if (selectedIndex === 0) abrirCamera();
      if (selectedIndex === 1) abrirGaleria();
    });
  }

  return { mostrarAlerta, mostrarConfirmacao, mostrarOpcoesFoto };
}