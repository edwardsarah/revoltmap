 import { Doc } from 'yjs';
import { WebsocketProvider } from 'y-websocket';

 const ydoc = new Doc();
 
 export const wsProvider = new WebsocketProvider('ws://localhost:1234', 'revoltmap', ydoc);

 // Add some error handling for the provider
wsProvider.on('status', (event: any) => {
  console.log('WebSocket provider status:', event);
});

wsProvider.on('connection-error', (event: any) => {
  console.error('WebSocket provider connection error:', event);
});

export default ydoc;