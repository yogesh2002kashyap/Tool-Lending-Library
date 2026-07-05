const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Tool = require('./models/Tool');

const API_URL = 'http://localhost:5000/api/tools';

async function postData(url, data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  return { status: response.status, data: json, headers: response.headers };
}

async function getData(url) {
  const response = await fetch(url);
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  return { status: response.status, data, headers: response.headers };
}

async function request(url, method) {
  const response = await fetch(url, { method });
  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  return { status: response.status, data };
}

async function runTests() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('\n--- Test 2: Clear Collection ---');
    await Tool.deleteMany({});
    let res = await getData(API_URL);
    console.log('HTTP Status:', res.status, res.status === 200 ? 'PASS' : 'FAIL');
    console.log('Is empty array:', Array.isArray(res.data) && res.data.length === 0 ? 'PASS' : 'FAIL');

    console.log('\n--- Test 1: Seed and Get Tools ---');
    const doc1 = await Tool.create({
      toolName: 'Tool 1',
      category: 'Power Tools',
      condition: 'Good',
      status: 'Available',
      borrower: 'Owner 1',
      description: 'Desc 1'
    });
    // Add artificial delay to ensure different createdAt timestamps
    await new Promise(resolve => setTimeout(resolve, 1000));
    const doc2 = await Tool.create({
      toolName: 'Tool 2',
      category: 'Hand Tools',
      condition: 'Excellent',
      status: 'Borrowed',
      borrower: 'Owner 2',
      description: 'Desc 2'
    });
    
    res = await getData(API_URL);
    console.log('HTTP Status:', res.status, res.status === 200 ? 'PASS' : 'FAIL');
    console.log('All records returned:', res.data.length === 2 ? 'PASS' : 'FAIL');
    let sortedDesc = true;
    for(let i=0; i<res.data.length - 1; i++) {
        if(new Date(res.data[i].createdAt) < new Date(res.data[i+1].createdAt)) {
            sortedDesc = false;
        }
    }
    // Explicitly check that doc2 is first in the array because it was created later
    const newestFirst = res.data[0].toolName === 'Tool 2';
    console.log('Sorted by createdAt descending:', (sortedDesc && newestFirst) ? 'PASS' : 'FAIL');

    console.log('\n--- Test 3: Response Consistency ---');
    console.log('HTTP Status:', res.status, res.status === 200 ? 'PASS' : 'FAIL');
    console.log('Content-Type header:', res.headers.get('content-type').includes('application/json') ? 'PASS' : 'FAIL');
    console.log('JSON Structure matches conventions:', (res.data[0].toolName && res.data[0]._id) ? 'PASS' : 'FAIL');

    console.log('\n--- Test 4: Regression Testing ---');
    const postRes = await postData(API_URL, {
      toolName: 'Tool 3',
      category: 'Garden Tools',
      condition: 'Fair',
      status: 'Maintenance',
      borrower: 'Owner 3',
      description: 'Desc 3'
    });
    console.log('POST Status:', postRes.status, postRes.status === 201 ? 'PASS' : 'FAIL');
    
    const getByIdRes = await request(`${API_URL}/${res.data[0]._id}`, 'GET');
    console.log('GET by ID Status:', getByIdRes.status, getByIdRes.status === 501 ? 'PASS' : 'FAIL');
    
    const putRes = await request(`${API_URL}/${res.data[0]._id}`, 'PUT');
    console.log('PUT Status:', putRes.status, putRes.status === 501 ? 'PASS' : 'FAIL');
    
    const delRes = await request(`${API_URL}/${res.data[0]._id}`, 'DELETE');
    console.log('DELETE Status:', delRes.status, delRes.status === 501 ? 'PASS' : 'FAIL');

  } catch (error) {
    console.error('Test script error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

runTests();
