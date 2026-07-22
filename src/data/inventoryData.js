import rawInventory from './inventory.json';

export const INVENTORY = rawInventory;

export const FLOOR_TYPES = {
  'LOWER GROUND': 'LOWER GROUND COMMERCIAL SHOPS',
  'Ground FLOOR': 'GROUND FLOOR COMMERCIAL SHOPS',
  'MEZZANINE': 'MEZZANINE EXECUTIVE OFFICES',
  '1ST FLOOR': 'OFFICES - 1ST FLOOR',
  '2ND FLOOR': 'OFFICES - 2ND FLOOR',
  '3RD FLOOR': 'OFFICES - 3RD FLOOR',
  '4TH FLOOR': 'OFFICES - 4TH FLOOR',
};

export function getFloorCategory(floorName) {
  if (!floorName) return 'COMMERCIAL / OFFICE';
  const f = floorName.toUpperCase();
  if (f.includes('GROUND') || f.includes('LG')) return 'COMMERCIAL SHOPS';
  return 'OFFICES';
}

export function formatPKR(num) {
  if (num === null || num === undefined || isNaN(num)) return 'PKR 0';
  const val = Math.round(num);
  return 'PKR ' + val.toLocaleString('en-PK');
}

export function formatCompactNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Math.round(num).toLocaleString('en-PK');
}
