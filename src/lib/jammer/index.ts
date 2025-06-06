import EventEmitter from "node:events";
import { TLSSocket, connect as tlsConnect } from 'node:tls'
import type { NetworkClientOptions } from "./options";
import { DelimiterTransform } from "./transform";

/**
 * Handles communication with the game client.
 * This class is used to send and receive messages from the game client.
 */
export default class Jammer extends EventEmitter {
  private socket: TLSSocket | null = null

  /**
   * Events emitted by the Jammer class:
   */
  public override on(event: 'received', listener: (message: any) => any): this
  public override on(event: 'error', listener: (error: Error) => any): this
  public override on(event: 'close', listener: () => any): this

  public constructor(
    public readonly options: NetworkClientOptions
  ) {
    super();
  }

  /**
   * Connects to the game client.
   * @param {string} host - The host to connect to.
   * @param {number} port - The port to connect to.
   */
  public async connect(): Promise<void> {
    try {
      await this.createConnection()

      this.socket!
        .pipe(new DelimiterTransform(0x00))
        .on('data', data => this.handleReceivedData(data))
        .on('close', () => {
          console.log('connecion closed')
          this.emit('close')
        })
        .on('error', err => this.emit('error', err))
    } catch (err) {
      this.socket?.destroy()
      this.socket = null
      this.emit('error', err)
      throw err
    }
  }

  /**
   * Creates a connection to the game client.
   */
  private async createConnection(): Promise<void> {
    const connectionOptions = {
      host: this.options.host,
      port: this.options.port,
    }

    this.socket = tlsConnect({
      ...connectionOptions,
      rejectUnauthorized: false,
    })

    return new Promise<void>((resolve, reject) => {
      const onConnect = () => {
        this.socket!.removeListener('error', reject)
        resolve()
      }

      const onError = (err: Error) => {
        this.socket!.removeListener('secureConnect', onConnect)
        this.socket!.removeListener('connect', onConnect)
        reject(err)
      }

      this.socket!.once('secureConnect', onConnect)
      this.socket!.once('connect', onConnect)
      this.socket!.once('error', onError)
    })
  }

  /**
  * Writes a message to the game client.
  * @param message - The message to send.
  */
  public async write(message: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const cleanup = () => {
        this.socket!.off('error', onError)
        this.socket!.off('close', onClose)
      }

      const onError = (err: Error) => {
        cleanup()
        reject(err)
      }

      const onClose = () => {
        cleanup()
        reject(new Error('Socket closed before the message could be sent'))
      }

      this.socket!.once('error', onError)
      this.socket!.once('close', onClose)

      const writable = this.socket!.write(message)
      if (!message.endsWith('\x00')) this.socket!.write('\x00')

      if (writable) {
        cleanup()
        resolve(message.length)
      } else {
        this.socket!.once('drain', () => {
          cleanup()
          resolve(message.length)
        })
      }
    })
  }

  private handleReceivedData(data: Buffer): void {
    try {
      this.emit('received', data);
    } catch (error) {
      console.error(`[Jammer] Error handling received data:`, error);
    }
  }

  /**
   * Destroys the socket connection.
   */
  public destroy(): void {
    if (this.socket) {
      this.socket.destroy()
      this.socket = null
    }
  }
}