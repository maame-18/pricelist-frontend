
function calculateAll() {
    const rows = document.querySelectorAll("#pricing-table tbody tr");
    let grandTotal = 0;
  
    rows.forEach(row => {
      const quantityInput = row.querySelector(".quantity");
      const unitPrice = parseFloat(row.querySelector("td[data-unit-price]").dataset.unitPrice);
      const quantity = parseInt(quantityInput.value) || 0;
  
      const rowTotal = unitPrice * quantity;
      row.querySelector(".row-total").textContent = rowTotal.toFixed(2);
  
     
      grandTotal += rowTotal;
    });
  
   
    document.getElementById("grand-total").textContent = grandTotal.toFixed(2);
  }
  


function searchProduct() {
    const searchInput = document.getElementById("search-bar").value.toLowerCase();
    const tableRows = document.querySelectorAll("#pricing-table tbody tr");
  
    tableRows.forEach(row => {
      const productName = row.cells[0].textContent.toLowerCase();
      const productSize = row.cells[1].textContent.toLowerCase();
  
      if (productName.includes(searchInput) || productSize.includes(searchInput)) {
        row.style.display = ""; // Show matching rows
      } else {
        row.style.display = "none"; // Hide non-matching rows
      }
    });
  }
  
  // Simple authentication
// const validCredentials = {
//     username: "admin",
//     password: "password123",
//   };
  
//   function handleLogin(event) {
//     event.preventDefault();
  
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;
  
//     if (username === validCredentials.username && password === validCredentials.password) {
//       alert("Login successful!");
//       document.getElementById("login-container").style.display = "none";
//       document.getElementById("app-container").style.display = "block";
//     } else {
//       alert("Invalid username or password. Please try again.");
//     }
//   }

// User credentials
const users = {
  cashier1: "password1",
  cashier2: "password2",
  cashier3: "password3",
  cashier4: "password4",
  cashier5: "password5",
  admin: "adminpassword",
};

// Handle Login
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (users[username] === password) {
    alert("Login successful!");
    document.getElementById("login-container").style.display = "none";
    if (username === "admin") {
      document.getElementById("admin-container").style.display = "block";
    } else {
      document.getElementById("app-container").style.display = "block";
    }
  } else {
    alert("Invalid username or password. Please try again.");
  }
}

  

  async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    // Add a title
    doc.text("Wholesale Pricing List", 10, 10);
  
    // Extract table content
    const table = document.querySelector("#pricing-table");
    const rows = table.querySelectorAll("tr");
  
    let yPosition = 20;
  
    rows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      let rowText = "";
  
      cells.forEach((cell) => {
        rowText += `${cell.textContent}    `;
      });
  
      doc.text(rowText, 10, yPosition);
      yPosition += 10;
    });
  
    // Save PDF
    doc.save("pricing_list.pdf");
  }
  

  function exportToExcel() {
    const table = document.querySelector("#pricing-table");
    const rows = table.querySelectorAll("tr");
    const data = [];
  
    rows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      const rowData = Array.from(cells).map((cell) => cell.textContent.trim());
      data.push(rowData);
    });
  
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pricing List");
  
    XLSX.writeFile(workbook, "pricing_list.xlsx");
  }
  

  // Admin's panel

  const transactions = [];
  const products = [
    { name: "Oba Rice", price: 550 },
    { name: "Canola Oil", price: 30 },
  ];
  
  function logTransaction(action, product, price = null) {
    const timestamp = new Date().toLocaleString();
    let transaction = `${timestamp}: ${action} - ${product}`;
    if (price !== null) transaction += ` (New Price: GHS ${price})`;
    transactions.push(transaction);
    updateTransactionList();
  }
  
  function updateTransactionList() {
    const list = document.getElementById("transaction-list");
    list.innerHTML = transactions
      .map((t) => `<tr><td colspan="3">${t}</td></tr>`)
      .join("");
  }
  
  function updatePrice(event) {
    event.preventDefault();
    const name = document.getElementById("product-name").value;
    const price = parseFloat(document.getElementById("product-price").value);
  
    const product = products.find((p) => p.name === name);
    if (product) {
      product.price = price;
      alert(`Updated ${name}'s price to GHS ${product.price}`);
      logTransaction("Updated Price", name, price);
    } else {
      alert("Product not found!");
    }
  }
  
  function deleteOutOfStock() {
    const deletedProducts = products.filter((p) => p.price <= 0).map((p) => p.name);
  
    // Keep only products with valid prices
    const inStockProducts = products.filter((p) => p.price > 0);
    products.length = 0;
    products.push(...inStockProducts);
  
    alert(`Deleted products: ${deletedProducts.join(", ")}`);
    deletedProducts.forEach((name) => logTransaction("Deleted Product", name));
  }
  