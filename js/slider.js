/*=============== PROJECT IMAGE SLIDER ===============*/
class ProjectSlider {
  constructor(sliderElement) {
    this.slider = sliderElement;
    this.images = this.slider.querySelectorAll('.projects__slider-img');
    this.dots = this.slider.querySelectorAll('.projects__slider-dot');
    this.prevBtn = this.slider.querySelector('.projects__slider-prev');
    this.nextBtn = this.slider.querySelector('.projects__slider-next');
    this.currentSlide = 0;
    this.totalSlides = this.images.length;
    
    this.init();
  }

  init() {
    // Event listeners for navigation buttons
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Event listeners for dots
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Keyboard navigation
    this.slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    this.slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });

    // Auto-play (optional - uncomment to enable)
    // this.startAutoPlay();
  }

  goToSlide(slideIndex) {
    // Remove active class from current slide and dot
    this.images[this.currentSlide].classList.remove('active');
    this.dots[this.currentSlide].classList.remove('active');

    // Update current slide
    this.currentSlide = slideIndex;

    // Add active class to new slide and dot
    this.images[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide].classList.add('active');
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(nextIndex);
  }

  prevSlide() {
    const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.goToSlide(prevIndex);
  }

  handleSwipe(touchStartX, touchEndX) {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next slide
        this.nextSlide();
      } else {
        // Swiped right - prev slide
        this.prevSlide();
      }
    }
  }

  startAutoPlay(interval = 5000) {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, interval);

    // Pause on hover
    this.slider.addEventListener('mouseenter', () => {
      clearInterval(this.autoPlayInterval);
    });

    // Resume on mouse leave
    this.slider.addEventListener('mouseleave', () => {
      this.startAutoPlay(interval);
    });
  }
}

// Initialize all sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.projects__slider');
  sliders.forEach(slider => new ProjectSlider(slider));
});
