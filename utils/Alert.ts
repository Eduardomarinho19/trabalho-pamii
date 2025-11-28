import { AlertButton, AlertOptions, Platform, Alert as RNAlert } from 'react-native';

/**
 * Alert universal que funciona tanto na web quanto no mobile
 * Usa Alert nativo do React Native no mobile e window.alert/confirm na web
 */
export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
  ) => {
    if (Platform.OS === 'web') {
      // Web: usar window.alert ou window.confirm
      if (!buttons || buttons.length === 0) {
        // Apenas um botão OK
        window.alert(`${title}\n\n${message || ''}`);
      } else if (buttons.length === 1) {
        // Um botão customizado
        window.alert(`${title}\n\n${message || ''}`);
        if (buttons[0].onPress) {
          buttons[0].onPress();
        }
      } else {
        // Múltiplos botões - usar confirm
        const confirmed = window.confirm(`${title}\n\n${message || ''}`);
        
        // Encontrar o botão apropriado
        const confirmButton = buttons.find(b => b.style !== 'cancel');
        const cancelButton = buttons.find(b => b.style === 'cancel');
        
        if (confirmed && confirmButton?.onPress) {
          confirmButton.onPress();
        } else if (!confirmed && cancelButton?.onPress) {
          cancelButton.onPress();
        }
      }
    } else {
      // Mobile: usar Alert nativo do React Native
      RNAlert.alert(title, message, buttons, options);
    }
  },
};
