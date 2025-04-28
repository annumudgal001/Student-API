// public/js/script.js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});
// public/js/script.js
document.getElementById('profile_pic')?.addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.className = 'student-photo';
        img.style.marginTop = '10px';
        const existingPreview = document.querySelector('.photo-preview');
        if (existingPreview) existingPreview.remove();
        img.className = 'photo-preview';
        this.parentElement.appendChild(img);
    };
    reader.readAsDataURL(e.target.files[0]);
});