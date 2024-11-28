document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Section Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Handle logout separately
            if (item.classList.contains('logout')) {
                handleLogout();
                return;
            }

            // Remove active class from all menu items and sections
            menuItems.forEach(mi => mi.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));

            // Add active class to clicked menu item and corresponding section
            item.classList.add('active');
            const sectionId = item.dataset.section;
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });

    // Product Management
    const addProductBtn = document.getElementById('add-product-btn');
    addProductBtn.addEventListener('click', openAddProductModal);

    // User Management
    const addUserBtn = document.getElementById('add-user-btn');
    addUserBtn.addEventListener('click', openAddUserModal);

    // Initial Data Load
    loadProducts();
    loadUsers();
    loadTransactionLogs();
    loadInventory();
});

// Product Management Functions
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function renderProducts(products) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        productsList.appendChild(row);
    });
}

function openAddProductModal() {
    const modal = document.getElementById('product-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add New Product</h2>
            <form id="add-product-form">
                <input type="text" name="name" placeholder="Product Name" required>
                <input type="number" name="price" placeholder="Price" step="0.01" required>
                <input type="number" name="quantity" placeholder="Stock Quantity" required>
                <div class="modal-actions">
                    <button type="submit">Add Product</button>
                    <button type="button" onclick="closeModal('product-modal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    modal.style.display = 'block';

    const form = document.getElementById('add-product-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const productData = Object.fromEntries(formData);

        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                closeModal('product-modal');
                loadProducts();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });
}

function editProduct(productId) {
    // Implementation of edit product logic
    
}

function deleteProduct(productId) {
    // Confirmation and deletion logic
}

// User Management Functions
async function loadUsers() {
    try {
        const response = await fetch('http://localhost:5000/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsers(users) {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        usersList.appendChild(row);
    });
}

function openAddUserModal() {
    const modal = document.getElementById('user-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add New User</h2>
            <form id="add-user-form">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <select name="role" required>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                </select>
                <div class="modal-actions">
                    <button type="submit">Add User</button>
                    <button type="button" onclick="closeModal('user-modal')">Cancel</button>
                </div>
            </form>
        </div>
    `;
    modal.style.display = 'block';

    const form = document.getElementById('add-user-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const userData = Object.fromEntries(formData);

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                closeModal('user-modal');
                loadUsers();
                showNotification('User added successfully');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('An error occurred while adding user');
        }
    });
}

function editUser(userId) {
    // Fetch user details and open edit modal
    fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
    .then(response => response.json())
    .then(user => {
        const modal = document.getElementById('user-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Edit User</h2>
                <form id="edit-user-form">
                    <input type="hidden" name="id" value="${user.id}">
                    <input type="text" name="username" value="${user.username}" required>
                    <select name="role" required>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                        <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Manager</option>
                        <option value="employee" ${user.role === 'employee' ? 'selected' : ''}>Employee</option>
                    </select>
                    <input type="password" name="password" placeholder="New Password (optional)">
                    <div class="modal-actions">
                        <button type="submit">Update User</button>
                        <button type="button" onclick="closeModal('user-modal')">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        modal.style.display = 'block';

        const form = document.getElementById('edit-user-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const userData = Object.fromEntries(formData);

            try {
                const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    closeModal('user-modal');
                    loadUsers();
                    showNotification('User updated successfully');
                } else {
                    const error = await response.json();
                    alert(error.message || 'Failed to update user');
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
    });
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (response.ok) {
                loadUsers();
                showNotification('User deleted successfully');
            } else {
                return response.json().then(error => {
                    throw new Error(error.message || 'Failed to delete user');
                });
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert(error.message);
        });
    }
}

// Transaction Logs Functions
async function loadTransactionLogs() {
    try {
        const response = await fetch('http://localhost:5000/api/transactions', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const transactions = await response.json();
        renderTransactions(transactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

function renderTransactions(transactions) {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleString()}</td>
            <td>${transaction.action}</td>
            <td>${transaction.user}</td>
            <td>${transaction.details}</td>
        `;
        transactionsList.appendChild(row);
    });
}

// Inventory Management Functions
async function loadInventory() {
    try {
        const response = await fetch('http://localhost:5000/api/inventory', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        const inventory = await response.json();
        renderInventory(inventory);
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

function renderInventory(inventory) {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    
    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.currentStock}</td>
            <td>${item.minimumThreshold}</td>
            <td>
                <span class="status ${getStockStatus(item.currentStock, item.minimumThreshold)}">
                    ${getStockStatusText(item.currentStock, item.minimumThreshold)}
                </span>
            </td>
        `;
        inventoryList.appendChild(row);
    });
}

function getStockStatus(currentStock, minimumThreshold) {
    if (currentStock === 0) return 'out-of-stock';
    if (currentStock <= minimumThreshold) return 'low-stock';
    return 'in-stock';
}

function getStockStatusText(currentStock, minimumThreshold) {
    if (currentStock === 0) return 'Out of Stock';
    if (currentStock <= minimumThreshold) return 'Low Stock';
    return 'In Stock';
}

// Utility Functions
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }, 10);
}

function handleLogout() {
    // Clear authentication token
    localStorage.removeItem('authToken');
    
    // Redirect to login page
    window.location.href = '../index.html';
}

// Error Handling Interceptor
function setupErrorInterceptor() {
    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(response => {
            if (response.status === 401) {
                // Unauthorized - token expired or invalid
                handleLogout();
            }
            return response;
        }).catch(error => {
            console.error('Fetch error:', error);
            showNotification('Network error. Please try again.');
            throw error;
        });
    };
}

// Initialize error interceptor
setupErrorInterceptor();