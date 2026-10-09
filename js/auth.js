// js/auth.js
import { supabase } from './supabase.js';

const authForm = document.getElementById('auth-form');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const submitBtn = document.getElementById('submit-btn');
const toggleAuth = document.getElementById('toggle-auth');
const toggleMsg = document.getElementById('toggle-msg');
const nameGroup = document.getElementById('name-group');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authError = document.getElementById('auth-error');

let isLogin = true;

// Toggle between Login and Signup
toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    authError.textContent = '';
    
    if (isLogin) {
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Sign in to access emergency features.';
        submitBtn.textContent = 'Sign In';
        nameGroup.style.display = 'none';
        fullNameInput.required = false;
        toggleMsg.textContent = "Don't have an account?";
        toggleAuth.textContent = 'Sign Up';
    } else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Join the StormShield network.';
        submitBtn.textContent = 'Sign Up';
        nameGroup.style.display = 'block';
        fullNameInput.required = true;
        toggleMsg.textContent = 'Already have an account?';
        toggleAuth.textContent = 'Sign In';
    }
});

// Handle Form Submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.textContent = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    const email = emailInput.value;
    const password = passwordInput.value;
    const fullName = fullNameInput.value;

    try {
        if (isLogin) {
            // Login
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } else {
            // Sign Up
            const { data, error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: { data: { full_name: fullName } }
            });
            if (error) throw error;

            alert('Account created! You can now log in.');
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        authError.textContent = error.message;
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isLogin ? 'Sign In' : 'Sign Up';
    }
});

// Check if user is already logged in
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.href = 'dashboard.html';
    }
}
checkSession();