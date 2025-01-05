import { describe, it, expect, beforeEach } from 'vitest';

// Simulated contract state
const balances = new Map();
let totalSupply = 0;

// Simulated contract functions
function mint(amount: number, recipient: string, sender: string) {
  if (sender !== 'CONTRACT_OWNER') throw new Error('Not authorized');
  const currentBalance = balances.get(recipient) || 0;
  balances.set(recipient, currentBalance + amount);
  totalSupply += amount;
  return true;
}

function transfer(amount: number, sender: string, recipient: string) {
  const senderBalance = balances.get(sender) || 0;
  if (senderBalance < amount) throw new Error('Insufficient balance');
  balances.set(sender, senderBalance - amount);
  const recipientBalance = balances.get(recipient) || 0;
  balances.set(recipient, recipientBalance + amount);
  return true;
}

function burn(amount: number, owner: string) {
  const currentBalance = balances.get(owner) || 0;
  if (currentBalance < amount) throw new Error('Insufficient balance');
  balances.set(owner, currentBalance - amount);
  totalSupply -= amount;
  return true;
}

describe('Network Incentive Token Contract', () => {
  beforeEach(() => {
    balances.clear();
    totalSupply = 0;
  });
  
  it('should mint tokens', () => {
    expect(mint(1000, 'USER_A', 'CONTRACT_OWNER')).toBe(true);
    expect(balances.get('USER_A')).toBe(1000);
    expect(totalSupply).toBe(1000);
  });
  
  it('should not allow unauthorized minting', () => {
    expect(() => mint(1000, 'USER_B', 'UNAUTHORIZED_USER')).toThrow('Not authorized');
  });
  
  it('should transfer tokens', () => {
    mint(1000, 'USER_C', 'CONTRACT_OWNER');
    expect(transfer(500, 'USER_C', 'USER_D')).toBe(true);
    expect(balances.get('USER_C')).toBe(500);
    expect(balances.get('USER_D')).toBe(500);
  });
  
  it('should not allow transfers with insufficient balance', () => {
    mint(1000, 'USER_E', 'CONTRACT_OWNER');
    expect(() => transfer(1500, 'USER_E', 'USER_F')).toThrow('Insufficient balance');
  });
  
  it('should burn tokens', () => {
    mint(1000, 'USER_G', 'CONTRACT_OWNER');
    expect(burn(300, 'USER_G')).toBe(true);
    expect(balances.get('USER_G')).toBe(700);
    expect(totalSupply).toBe(700);
  });
  
  it('should not allow burning more than balance', () => {
    mint(1000, 'USER_H', 'CONTRACT_OWNER');
    expect(() => burn(1500, 'USER_H')).toThrow('Insufficient balance');
  });
});

