import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { create, Whatsapp, SocketState } from "venom-bot";

export type QRCode = {
  base64Qr: string;
};

class Sender {
  private client: Whatsapp;
  private connected: boolean;
  private qr: QRCode;

  get isConnected(): boolean {
    return this.connected;
  }

  get qrCode(): QRCode {
    return this.qr;
  }

  constructor() {
    this.initialize();
  }

  async sendText(to: string, body: string) {
    if (!isValidPhoneNumber(to, "BR")) {
      throw new Error("Numero Invalido");
    }

    let phoneNumber = parsePhoneNumber(to, "BR")
      ?.format("E.164")
      ?.replace("+", "") as string;

    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`;

    await this.client.sendText(phoneNumber, body);
  }

  async leaveGroup(groupId: string) {

    let group = groupId.includes("@g.us")
      ? groupId
      : `${groupId}@g.us`;

    await this.client.leaveGroup(group);
  }

  private initialize() {
    const qr = (base64Qr: string) => {
      this.qr = { base64Qr };
    };

    const status = (statusSession: string) => {
      this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable"].includes(
        statusSession
      );
    };

    const start = (client: Whatsapp) => {
      this.client = client;
      client.onStateChange((state) => {
        this.connected = state === SocketState.CONNECTED;
      });
      client.onMessage((message) => {
        client.sendSeen(message.from);
      });
    };

    //create("session"+Date.now(), qr).then((client) => start(client)).catch((error) => console.error(error))
    create("Client", qr)
      .then((client) => start(client))
      .catch((error) => console.error(error));
  }
}

export default Sender;
