// Script kiểm tra databases trong MongoDB cluster
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dtai:dtai@cieldt.37clwun.mongodb.net/?retryWrites=true&w=majority&appName=cieldt";

async function listDatabases() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const databasesList = await client.db().admin().listDatabases();
    
    console.log("📊 Databases trong MongoDB cluster của bạn:");
    console.log("=".repeat(50));
    
    databasesList.databases.forEach((db, index) => {
      console.log(`${index + 1}. ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
  } finally {
    await client.close();
  }
}

listDatabases().catch(console.error);
