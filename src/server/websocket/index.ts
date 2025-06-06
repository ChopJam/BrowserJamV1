import type { Peer, Message } from "crossws";
import Jammer from "~/lib/jammer";

/**
 * Connection state with message queue
 */
interface Connection {
  jammer: Jammer;
  peer: Peer;
  isConnected: boolean;
  messageQueue: string[];
}

/**
 * Stores the connections to the game client.
 */
const connections = new Map<string, Connection>();

/**
 * Handles WebSocket connections for Ruffle.
 */
export default defineWebSocketHandler({
  /**
   * Handles open connections.
   */
  async open(peer: Peer) {
    const peerId = peer.id;

    const requestUrl = peer.request?.url || '';
    const url = new URL(requestUrl);
    const params = url.searchParams;

    const screenName = params.get('screen_name') || '';
    const token = params.get('token') || '';
    
    if (!screenName || !token) {
      console.error(`[WebSocket] Missing credentials: screen_name=${screenName}, token=${token ? 'yes' : 'no'}`);
      peer.close(4000, "Missing credentials");
      return;
    }
    
    const connection: Connection = {
      jammer: new Jammer({
        host: "lb-iss02-classic-prod.animaljam.com",
        port: 443,
        screen_name: screenName,
        auth_token: token
      }),
      peer,
      isConnected: false,
      messageQueue: []
    };
    
    connections.set(peerId, connection);
    
    connection.jammer.on('received', (data) => {
      if (peer.websocket.readyState === 1) {
        peer.send(data);
      }
    });
    
    connection.jammer.on('error', (error) => {
      console.error(`[WebSocket] Jammer error: ${error.message}`);
      cleanupConnection(peerId);
    });
    
    connection.jammer.on('close', () => {
      console.log(`[WebSocket] Jammer connection closed`);
      cleanupConnection(peerId);
    });
    
    try {
      await connection.jammer.connect();
      console.log(`[WebSocket] Connected to game server`);
      
      connection.isConnected = true;
      
      processQueue(peerId);
    } catch (error) {
      console.error(`[WebSocket] Connection error: ${error.message}`);
      cleanupConnection(peerId);
    }
  },
  
  /**
   * Handles messages from the client.
   */
  message(peer: Peer, message: Message) {
    const peerId = peer.id;
    const connection = connections.get(peerId);
    let shouldSend = true
    
    if (!connection) {
      console.warn(`[WebSocket] No connection found for peer: ${peerId}`);
      return;
    }
          
    if (connection.isConnected && shouldSend) {
      connection.jammer.write(message.toString());
    } else {
      connection.messageQueue.push(message.toString());
    }
  },
  
  /**
   * Handles connection closure.
   */
  close(peer: Peer) {
    cleanupConnection(peer.id);
  }
});

/**
 * Clean up a connection and its resources.
 */
function cleanupConnection(peerId: string) {
  const connection = connections.get(peerId);
  if (!connection) return;
  
  
  try {
    if (connection.peer.websocket.readyState === 1) {
      connection.peer.close();
    }
  } catch (e) {
    console.error(`[WebSocket] Error closing peer: ${e.message}`);
  }
  
  try {
    connection.jammer.destroy();
  } catch (e) {
    console.error(`[WebSocket] Error cleaning up Jammer: ${e.message}`);
  } finally {
    connection.jammer.removeAllListeners();
  }
  
  connections.delete(peerId);
}

/**
 * Process queued messages for a connection.
 */
function processQueue(peerId: string) {
  const connection = connections.get(peerId);
  if (!connection || !connection.isConnected) return;
  
  const { messageQueue, jammer } = connection;
  
  if (messageQueue.length === 0) {
    return;
  }
  
  
  while (messageQueue.length > 0) {
    const data = messageQueue.shift()!;
    jammer.write(data);
  }
}