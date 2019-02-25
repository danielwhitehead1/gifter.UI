import { NotificationManager } from 'react-notifications';

export default function notification(type, object, action) {
  switch (type) {
    case 'success':
      NotificationManager.success(`${object} ${action} successfully.`, 'Success');
      break;
    case 'error':
      NotificationManager.error(`${object} not ${action} successfully.`, 'Something went wrong!');
      break;
    default:
      break;
  }
}