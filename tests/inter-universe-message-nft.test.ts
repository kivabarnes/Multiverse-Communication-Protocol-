import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
let lastMessageId = 0;
const messageData = new Map();
const messageOwners = new Map();

// Simulated contract functions
function mintMessage(senderUniverse: string, recipientUniverse: string, contentHash: Buffer, channelId: number, sender: string) {
  if (sender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  const messageId = ++lastMessageId;
  messageData.set(messageId, {
    senderUniverse,
    recipientUniverse,
    contentHash,
    timestamp: Date.now(),
    channelId
  });
  messageOwners.set(messageId, sender);
  return messageId;
}

function transferMessage(messageId: number, sender: string, recipient: string) {
  if (messageOwners.get(messageId) !== sender) throw new Error('Not authorized');
  messageOwners.set(messageId, recipient);
  return true;
}

describe('Inter-Universe Message NFT Contract', () => {
  beforeEach(() => {
    lastMessageId = 0;
    messageData.clear();
    messageOwners.clear();
  });
  
  it('should mint a new message NFT', () => {
    const contentHash = Buffer.from('test-content-hash');
    const messageId = mintMessage('Universe A', 'Universe B', contentHash, 1, 'CONTRACT_OWNER');
    expect(messageId).toBe(1);
    const message = messageData.get(messageId);
    expect(message.senderUniverse).toBe('Universe A');
    expect(message.recipientUniverse).toBe('Universe B');
    expect(message.contentHash).toEqual(contentHash);
    expect(message.channelId).toBe(1);
    expect(messageOwners.get(messageId)).toBe('CONTRACT_OWNER');
  });
  
  it('should not allow unauthorized message minting', () => {
    const contentHash = Buffer.from('test-content-hash');
    expect(() => mintMessage('Universe X', 'Universe Y', contentHash, 1, 'UNAUTHORIZED_USER')).toThrow('Not authorized');
  });
  
  it('should transfer message ownership', () => {
    const contentHash = Buffer.from('test-content-hash');
    const messageId = mintMessage('Universe C', 'Universe D', contentHash, 2, 'CONTRACT_OWNER');
    expect(transferMessage(messageId, 'CONTRACT_OWNER', 'NEW_OWNER')).toBe(true);
    expect(messageOwners.get(messageId)).toBe('NEW_OWNER');
  });
  
  it('should not allow unauthorized message transfers', () => {
    const contentHash = Buffer.from('test-content-hash');
    const messageId = mintMessage('Universe E', 'Universe F', contentHash, 3, 'CONTRACT_OWNER');
    expect(() => transferMessage(messageId, 'UNAUTHORIZED_USER', 'NEW_OWNER')).toThrow('Not authorized');
  });
});

