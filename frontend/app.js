document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const submitBtn = document.getElementById('submitBtn');
    const alertBox = document.getElementById('alert-box');
    
    // Gateway endpoint
    const API_URL = 'http://localhost:8080/api/auth/register';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Setup UI for loading
        setLoading(true);
        hideAlert();

        // Gather data
        const payload = {
            username: form.username.value.trim(),
            password: form.password.value.trim(),
            fullName: form.fullName.value.trim(),
            email: form.email.value.trim(),
            address: form.address.value.trim()
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok || response.status === 201) {
                showAlert('success', `Đăng ký thành công! Chào mừng ${data.fullName}`);
                form.reset();
            } else {
                // Determine error message
                let errorMsg = 'Có lỗi xảy ra, vui lòng thử lại!';
                if (data.message) {
                    errorMsg = data.message;
                } else if (data.messages) {
                    // validation errors map
                    errorMsg = Object.values(data.messages).join(' | ');
                }
                showAlert('error', errorMsg);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showAlert('error', 'Lỗi kết nối. Hãy chắc chắn API Gateway (8080) và UserService (8085) đang chạy.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    }

    function showAlert(type, message) {
        alertBox.className = `alert ${type}`;
        alertBox.textContent = message;
        
        // Add subtle pop animation
        alertBox.style.transform = 'scale(0.95)';
        setTimeout(() => {
            alertBox.style.transform = 'scale(1)';
        }, 50);
    }

    function hideAlert() {
        alertBox.className = 'alert hidden';
    }
});
