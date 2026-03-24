import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuración del comportamiento de las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicitar permisos para notificaciones
export const requestPermissions = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('¡Necesitamos permisos para mostrarte notificaciones!');
    return false;
  }
  return true;
};

// Enviar una notificación inmediata
export const sendLocalNotification = async (title, body, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: null, // null = inmediata
    });
    console.log('Notificación enviada:', title);
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
};

// Enviar notificación programada (para más tarde)
export const scheduleNotification = async (title, body, seconds, data = {}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: {
        seconds,
      },
    });
    console.log(`Notificación programada en ${seconds} segundos:`, title);
  } catch (error) {
    console.error('Error al programar notificación:', error);
  }
};

// Configurar para Android (necesita un canal)
export const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};

// Cancelar todas las notificaciones programadas
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('Todas las notificaciones canceladas');
};