const API_URL = 'http://localhost:5000/api/tools';

async function postData(url, data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await response.json();
  return { status: response.status, data: json };
}

async function runTests() {
  console.log('--- TEST 1: Valid Data ---');
  let res = await postData(API_URL, {
    toolName: 'Test Tool',
    category: 'Hand Tools',
    condition: 'Good',
    status: 'Available',
    borrower: 'Test Borrower',
    description: 'Test description',
  });
  console.log('Status:', res.status);
  console.log('Response:', res.data);

  console.log('\n--- TEST 2: Missing all fields ---');
  res = await postData(API_URL, {});
  console.log('Status:', res.status, res.data);

  console.log('\n--- TEST 3: Missing one field at a time ---');
  const requiredFields = ['toolName', 'category', 'condition', 'description'];
  for (const field of requiredFields) {
    const payload = {
      toolName: 'A', category: 'A', condition: 'Good', status: 'Available', description: 'A', borrower: 'A'
    };
    delete payload[field];
    res = await postData(API_URL, payload);
    console.log(`Missing ${field} -> Status:`, res.status, res.data);
  }

  console.log('\n--- TEST 4: XSS Payload ---');
  res = await postData(API_URL, {
    toolName: '<script>alert("xss")</script>',
    category: '<img src="x" onerror="alert(1)">',
    condition: 'Good',
    status: 'Available',
    borrower: '<b>Borrower</b>',
    description: '<iframe src="javascript:alert(1)">',
  });
  console.log('Status:', res.status);
  console.log('Sanitized Data:', res.data);
}

runTests();
