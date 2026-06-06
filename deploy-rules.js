#!/usr/bin/env node

// Simple script to update Firestore rules via REST API
// This is a workaround since Firebase CLI auth is interactive

const https = require('https');
const fs = require('fs');

const rulesContent = fs.readFileSync('./firestore.rules', 'utf8');
const projectId = 'neighborhood-choice';

// Read rules and prepare the payload
const payload = {
  rules: {
    files: [
      {
        name: 'firestore.rules',
        content: rulesContent
      }
    ]
  }
};

console.log('Firestore rules file read successfully');
console.log('To deploy rules, you need Firebase authentication.');
console.log('Rules file is ready at ./firestore.rules');
console.log('\nTo deploy manually:');
console.log('1. Go to: https://console.firebase.google.com/project/' + projectId + '/firestore/rules');
console.log('2. Copy the content from firestore.rules file');
console.log('3. Paste it into the rules editor');
console.log('4. Click "Publish"');
console.log('\nRules content:');
console.log('---');
console.log(rulesContent);
console.log('---');
