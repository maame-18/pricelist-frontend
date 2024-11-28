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

    // Initial Data Loads
    loadUserProfile();
    loadPricelist();
    loadTransactions();

    // Search and Filter
    setupPricelistSearch();

    // Profile Update
    setupProfileUpdate();
});

function loadUserProfile() {
    fetch('http://localhost:5000/api/user/profile', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById('profile-name').textContent = user.name;
        document.getElementById('profile-role').textContent = user.role;
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email || '';
    })
    .catch(error => {
        console.error('Error loading profile:', error);
        showNotification('Failed to load profile');
    });
}

function loadPricelist() {
    fetch('http://localhost:5000/api/products', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    })
    .then(response => response.json())
    .then(products => {
        const pricelistBody = document.getElementById('pricelist-body');
        const categoryFilter = document.getElementById('category-filter');
        
        // Clear existing content
        pricelistBody.innerHTML = '';
        categoryFilter.innerHTML = '<option value="">All Categories</option>';

        // Track unique categories
        const categories = new Set();

        products.forEach(product => {
            // Add product to table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
            `;
            pricelistBody.appendChild(row);

            // Collect unique categories
            categories.add(product.category);
        });

        // Populate category filter
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error loading pricelist:', error);
        showNotification('Failed to load product list');
    });
}

// function setupPricelistSearch() {
//     const searchInput = document.getElementById('search-input');
//     const categoryFilter = document.getElementById('category