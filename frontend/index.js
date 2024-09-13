import { backend } from 'declarations/backend';

async function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    const categories = await backend.getCategories();
    
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        `;
        categoriesContainer.appendChild(categoryElement);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize categories if they don't exist
    await backend.initializeCategories();
    await renderCategories();
});