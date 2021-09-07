let database;

const request = indexedDB.open("budgetTracker", 1);

request.onupgradeneeded = (event) => {
    let db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
};

request.onsuccess = (event) => {
    database = event.target.result;
    if (navigator.onLine) {
        addToDatabase();
    }
};

request.onerror = (event) => {
    console.log(event.target.errorCode);
};

function saveRecord(transaction) {
    const transactionList = database.transaction(["pending"], "readwrite");
    const store = transactionList.objectStore("pending");
    store.add(transaction);
};

function addToDatabase() {
    const transactionList = database.transaction(["pending"], "readwrite");
    const store = transactionList.objectStore("pending");
    const allTransactions = store.getAll();
    allTransactions.onsuccess = () => {
        if (allTransactions.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(allTransactions.result),
                headers: {
                    Accept: "application/json, text/plain", 
                    "Content-Type": "application/json"
                }
            }) .then(response => {
                return response.json();

            }) .then(() => {
                const transactionList = database.transaction(["pending"], "readwrite");
                const store = transactionList.objectStore("pending");
                store.clear();
            });
        }
    }
};
window.addEventListener("online", addToDatabase)