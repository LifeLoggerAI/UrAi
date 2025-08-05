#!/usr/bin/env node

/**
 * Script to initialize B2B partner API keys in Firestore
 * 
 * Usage: node scripts/init-b2b-partners.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAMovq3zvqgmsBBPhsjDQudb8kltxUbYV4",
  authDomain: "lifelogger-clean.firebaseapp.com",
  projectId: "lifelogger-clean",
  storageBucket: "lifelogger-clean.appspot.com",
  messagingSenderId: "360527756764",
  appId: "1:360527756764:web:a8b052be78d57340c8a319"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const partners = [
  {
    apiKey: 'trial_key_12345',
    displayName: 'Demo Trial Partner',
    industry: 'Research',
    contactEmail: 'demo-trial@example.com',
    licenseTier: 'trial',
    isApproved: true,
    createdAt: Date.now()
  },
  {
    apiKey: 'standard_key_67890',
    displayName: 'Demo Standard Partner',
    industry: 'Healthcare',
    contactEmail: 'demo-standard@example.com',
    licenseTier: 'standard',
    isApproved: true,
    createdAt: Date.now()
  },
  {
    apiKey: 'premium_key_abcde',
    displayName: 'Demo Premium Partner',
    industry: 'Technology',
    contactEmail: 'demo-premium@example.com',
    licenseTier: 'premium',
    isApproved: true,
    createdAt: Date.now()
  }
];

async function initializePartners() {
  console.log('Initializing B2B partner API keys...');

  try {
    for (const partner of partners) {
      const partnerDoc = doc(db, 'partnerAuth', partner.apiKey);
      await setDoc(partnerDoc, {
        displayName: partner.displayName,
        industry: partner.industry,
        contactEmail: partner.contactEmail,
        licenseTier: partner.licenseTier,
        isApproved: partner.isApproved,
        createdAt: partner.createdAt
      });
      
      console.log(`✓ Created partner: ${partner.displayName} (${partner.licenseTier})`);
    }

    console.log('\nPartner initialization complete!');
    console.log('\nAPI Keys:');
    partners.forEach(partner => {
      console.log(`${partner.licenseTier.toUpperCase()}: ${partner.apiKey}`);
    });

    console.log('\nTest the API:');
    console.log('curl -H "Authorization: Bearer trial_key_12345" \\');
    console.log('     "http://localhost:3000/api/v1/memories?userId=test-user"');
    
  } catch (error) {
    console.error('Error initializing partners:', error);
    process.exit(1);
  }
}

initializePartners();