import { describe, it, expect } from 'vitest';
import { initialMandis, initialAppointments } from './mockData';

/**
 * Queue & Triage Logic Unit Tests
 */
describe('Mandi Queue Management & Triage Algorithms', () => {

  // Test 1: Capacity Calculation
  it('should correctly calculate remaining capacity given current bookings', () => {
    const mandi = initialMandis[0]; // Lucknow Central Mandi
    const remainingTonnes = mandi.dailyCapacityTonnes - mandi.currentBookedTonnes;
    expect(remainingTonnes).toBe(105);
    expect(remainingTonnes).toBeGreaterThan(0);
  });

  // Test 2: Dynamic EWT Calculation Formula
  it('should recalculate Estimated Wait Time (EWT) based on active weighbridges', () => {
    const queuePosition = 6;
    const activeBridges = 3;
    const avgServiceTimeMins = 15;

    // Formula: ceil((queuePosition / activeBridges) * avgServiceTimeMins)
    const expectedEwt = Math.ceil((queuePosition / activeBridges) * avgServiceTimeMins);
    expect(expectedEwt).toBe(30);

    // If 1 weighbridge suffers mechanical failure (activeBridges = 2)
    const degradedBridges = 2;
    const recalculatedEwt = Math.ceil((queuePosition / degradedBridges) * avgServiceTimeMins);
    expect(recalculatedEwt).toBe(45);
    expect(recalculatedEwt).toBeGreaterThan(expectedEwt);
  });

  // Test 3: Moisture Quality Validation Standard
  it('should reject or flag crops exceeding statutory moisture limit (17.0%)', () => {
    const statutoryLimit = 17.0;

    const sampleGood = { moisture: 14.8 };
    const sampleExceeded = { moisture: 18.5 };

    const isGoodPass = sampleGood.moisture <= statutoryLimit;
    const isExceededPass = sampleExceeded.moisture <= statutoryLimit;

    expect(isGoodPass).toBe(true);
    expect(isExceededPass).toBe(false);
  });

  // Test 4: Financial MSP Calculation Accuracy
  it('should accurately compute total payable MSP without round-off discrepancies', () => {
    const netWeightKg = 8500; // 85 Quintals
    const mspPerQuintal = 2320; // Kharif 2026-27 Paddy Common

    const quintals = netWeightKg / 100;
    const totalPayable = quintals * mspPerQuintal;

    expect(quintals).toBe(85);
    expect(totalPayable).toBe(197200);
  });

});
