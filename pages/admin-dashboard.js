document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mainContent = document.getElementById('main-content');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    });

    // Menu Item Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = {
        'dashboard': document.getElementById('dashboard-section'),
        'products': document.getElementById('products-section'),
        'users': document.getElementById('users-section'),
        'logs': document.getElementById('logs-section')
    };

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');

            // Hide all sections
            Object.values(sections).forEach(section => {
                section.classList.remove('active-section');
                section.classList.add('hidden-section');
            });

            // Show selected section
            const sectionId = item.dataset.section;
            sections[sectionId].classList.remove('hidden-section');
            sections[sectionId].classList.add('active-section');
        });
    });

    // Product Management
    const addProductBtn = document.getElementById('add-product-btn');
    const productTableBody = document.getElementById('product-table-body');

    addProductBtn.addEventListener('click', () => {
        // Open add product modal
        openAddProductModal();
    });

    function openAddProductModal() {
        const modal = document.getElementById('add-product-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Add New Product</h2>
                <form id="add-product-form">
                    <input type="text" name="productName" placeholder="Product Name" required>
                    <input type="number" name="productPrice" placeholder="Price" required>
                    <input type="number" name="productStock" placeholder="Stock Quantity" required>
                    <button type="submit" class="btn btn-primary">Add Product</button>
                </form>
            </div>
        `;
        modal.style.display = 'block';

        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        const addProductForm = modal.querySelector('#add-product-form');
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    function handleAddProduct(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const productData = {
            name: formData.get('productName'),
            price: parseFloat(formData.get('productPrice')),
            stock: parseInt(formData.get('productStock'))
        };

        // TODO: Send product data to backend
        console.log('New Product:', productData);
        addProductToTable(productData);
        
        // Close modal
        document.getElementById('add-product-modal').style.display = 'none';
    }

    function addProductToTable(product) {
        const row = productTableBody.insertRow();
        row.innerHTML = `
            <td>${generateUniqueId()}</td>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-edit">Edit</button>
                <button class="btn btn-delete">Delete</button>
            </td>
        `;
    }

    // User Management
    const addUserBtn = document.getElementById('add-user-btn');
    const userTableBody = document.getElementById('user-table-body');

    addUserBtn.addEventListener('click', () => {
        openAddUserModal();
    });

    function openAddUserModal() {
        const modal = document.getElementById('add-user-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Add New User</h2>
                <form id="add-user-form">
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <select name="role" required>
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="cashier">Cashier</option>
                    </select>
                    <button type="submit" class="btn btn-primary">Add User</button>
                </form>
            </div>
        `;
        modal.style.display = 'block';

        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        const addUserForm = modal.querySelector('#add-user-form');
        addUserForm.addEventListener('submit', handleAddUser);
    }

    function handleAddUser(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            role: formData.get('role')
        };

        // TODO: Send user data to backend
        console.log('New User:', userData);
        addUserToTable(userData);
        
        // Close modal
        document.getElementById('add-user-modal').style.display = 'none';
    }

    function addUserToTable(user) {
        const row = userTableBody.insertRow();
        row.innerHTML = `
            <td>${generateUniqueId()}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
            <td>${new Date().toLocaleString()}</td>
            <td>
                <button class="btn btn-edit">Edit</button>
                <button class="btn btn-delete">Delete</button>
            </td>
        `;
    }

    // Transaction Logs
    const logsTableBody = document.getElementById('logs-table-body');

    function addTransactionLog(user, action, details) {
        const row = logsTableBody.insertRow(0); // Insert at the top
        row.innerHTML = `
            <td>${new Date().toLocaleString()}</td>
            <td>${user}</td>
            <td>${action}</td>
            <td>${details}</td>
        `;
    }

    // Utility Functions
    function generateUniqueId() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Export Functions
    function exportToPDF() {
        // TODO: Implement PDF export using jsPDF
        console.log('Exporting to PDF...');
    }

    function exportToExcel() {
        // TODO: Implement Excel export using XLSX
        console.log('Exporting to Excel...');
    }

    // Logout Functionality
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
        // TODO: Implement proper logout logic
        // Clear authentication token
        localStorage.removeItem('authToken');
        // Redirect to login page
        window.location.href = '/login.html';
    });

    // Initial Data Loading (Simulated)
    function loadInitialData() {
        // Simulate loading dashboard stats
        document.getElementById('total-products').textContent = '150';
        document.getElementById('total-users').textContent = '10';
        document.getElementById('recent-transactions').textContent = '45';

        // Simulated initial product and user data
        const initialProducts = [
            { name: 'Product A', price: 10.99, stock: 100 },
            { name: 'Product B', price: 15.50, stock: 75 }
        ];

        const initialUsers = [
            { username: 'admin1', role: 'admin' },
            { username: 'manager1', role: 'manager' }
        ];

        initialProducts.forEach(addProductToTable);
        initialUsers.forEach(addUserToTable);

        // Add some initial logs
        addTransactionLog('System', 'Startup', 'Dashboard initialized');
    }

    // Initialize the dashboard
    loadInitialData();

    // Real-time updates (simulated)
    function setupRealTimeUpdates() {
        // Simulate periodic updates (replace with actual WebSocket or polling)
        setInterval(() => {
            // Example: Update dashboard stats or logs
            addTransactionLog('System', 'Background Check', 'System health check');
        }, 60000); // Every minute
    }

    setupRealTimeUpdates();
});

// Error Handling Utility
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
    // TODO: Implement proper error reporting mechanism
});