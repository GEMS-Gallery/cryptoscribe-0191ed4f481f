import { backend } from 'declarations/backend';

async function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    const categorySelect = document.getElementById('categorySelect');
    const categories = await backend.getCategories();
    
    categoriesContainer.innerHTML = '';
    categorySelect.innerHTML = '';
    
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.innerHTML = `
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <div class="posts" id="posts-${category.name}"></div>
        `;
        categoriesContainer.appendChild(categoryElement);

        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);

        renderPosts(category.name);
    });
}

async function renderPosts(categoryName) {
    const postsContainer = document.getElementById(`posts-${categoryName}`);
    const posts = await backend.getPosts(categoryName);
    
    postsContainer.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h4>${post.title}</h4>
            <p>${post.content}</p>
            <small>By ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</small>
        `;
        postsContainer.appendChild(postElement);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await backend.initializeCategories();
    await renderCategories();

    const newPostIcon = document.getElementById('newPostIcon');
    const newPostForm = document.getElementById('newPostForm');
    const submitPostButton = document.getElementById('submitPost');

    newPostIcon.addEventListener('click', () => {
        newPostForm.style.display = newPostForm.style.display === 'none' ? 'block' : 'none';
    });

    submitPostButton.addEventListener('click', async () => {
        const categoryName = document.getElementById('categorySelect').value;
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const author = document.getElementById('postAuthor').value;

        await backend.addPost(categoryName, title, content, author);
        await renderPosts(categoryName);

        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postAuthor').value = '';
    });
});