import { backend } from 'declarations/backend';
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from 'declarations/backend';

let currentView = 'list';
let authClient;
let identity = null;
let agent;
let authenticatedActor;

async function initAuth() {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        await handleAuthenticated();
    } else {
        await loadCategories();
    }
}

async function login() {
    authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: handleAuthenticated,
    });
}

async function logout() {
    await authClient.logout();
    identity = null;
    agent = null;
    authenticatedActor = null;
    updateLoginStatus();
    hideNewPostForm();
    await loadCategories();
}

async function handleAuthenticated() {
    identity = await authClient.getIdentity();
    agent = new HttpAgent({ identity });
    await agent.fetchRootKey();
    authenticatedActor = createActor(process.env.BACKEND_CANISTER_ID, {
        agent,
    });
    updateLoginStatus();
    showNewPostForm();
    const principal = await authenticatedActor.whoami();
    console.log("Logged in with principal:", principal.toText());
    await initializeCategories();
    await loadCategories();
}

function updateLoginStatus() {
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const userInfo = document.getElementById('userInfo');
    const newPostIcon = document.getElementById('newPostIcon');

    if (identity) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        userInfo.textContent = `Logged in as: ${identity.getPrincipal().toText().slice(0, 5)}...`;
        newPostIcon.style.display = 'inline-block';
    } else {
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        userInfo.textContent = '';
        newPostIcon.style.display = 'none';
    }
}

function showNewPostForm() {
    document.getElementById('newPostForm').style.display = 'block';
}

function hideNewPostForm() {
    document.getElementById('newPostForm').style.display = 'none';
}

async function initializeCategories() {
    try {
        await (authenticatedActor || backend).initializeCategories();
    } catch (error) {
        console.error("Error initializing categories:", error);
    }
}

async function loadCategories() {
    try {
        await renderCategories();
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

async function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    const categorySelect = document.getElementById('categorySelect');
    let categories;
    try {
        categories = await (authenticatedActor || backend).getCategories();
    } catch (error) {
        console.error("Error fetching categories:", error);
        categoriesContainer.innerHTML = '<p>Error loading categories. Please try again later.</p>';
        return;
    }
    
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
    try {
        const postsContainer = document.getElementById(`posts-${categoryName}`);
        const posts = await (authenticatedActor || backend).getPosts(categoryName);
        
        postsContainer.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h4>${post.title}</h4>
                <p>${post.content}</p>
                <small>By ${post.author.toText().slice(0, 5)}... on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</small>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error(`Error rendering posts for category ${categoryName}:`, error);
    }
}

function setView(view) {
    const container = document.querySelector('.container');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    
    currentView = view;
    if (view === 'grid') {
        container.classList.add('grid-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        container.classList.remove('grid-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }
    localStorage.setItem('currentView', view);
}

document.addEventListener('DOMContentLoaded', async () => {
    await initAuth();
    
    const savedView = localStorage.getItem('currentView');
    if (savedView) {
        setView(savedView);
    } else {
        setView('list');
    }

    const newPostIcon = document.getElementById('newPostIcon');
    const newPostForm = document.getElementById('newPostForm');
    const submitPostButton = document.getElementById('submitPost');
    const listViewBtn = document.getElementById('listViewBtn');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');

    newPostIcon.addEventListener('click', () => {
        if (identity) {
            newPostForm.style.display = newPostForm.style.display === 'none' ? 'block' : 'none';
        } else {
            alert('Please login to create a new post.');
        }
    });

    submitPostButton.addEventListener('click', async () => {
        if (!identity) {
            alert('Please login to create a new post.');
            return;
        }
        const categoryName = document.getElementById('categorySelect').value;
        const title = document.getElementById('postTitle').value;
        const content = document.getElementById('postContent').value;
        const errorMessage = document.getElementById('errorMessage');

        try {
            const result = await authenticatedActor.addPost(categoryName, title, content);
            if ('ok' in result) {
                await renderPosts(categoryName);
                document.getElementById('postTitle').value = '';
                document.getElementById('postContent').value = '';
                errorMessage.textContent = '';
            } else {
                errorMessage.textContent = `Error: ${result.err}`;
            }
        } catch (error) {
            console.error("Error adding post:", error);
            errorMessage.textContent = "Failed to add post. Please try again.";
        }
    });

    listViewBtn.addEventListener('click', () => setView('list'));
    gridViewBtn.addEventListener('click', () => setView('grid'));
    loginButton.addEventListener('click', login);
    logoutButton.addEventListener('click', logout);
});